from typing import List, Dict, Tuple, Optional
from sqlalchemy.orm import Session

from ..database import (
    User,
    Skill,
    UserSkill,
    CareerRole,
    RoleSkill,
    SkillGap,
    AnalysisHistory,
)
from .skill_engine import SkillGapEngine
import json


def build_user_skills(db: Session, user_id: int) -> List[Dict]:
    """Build the user skills structure consumed by the skill engine."""
    rows = (
        db.query(UserSkill, Skill)
        .join(Skill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id == user_id)
        .all()
    )
    return [
        {
            "id": skill.id,
            "name": skill.name,
            "level": us.current_level,
            "proficiency": us.proficiency,
        }
        for us, skill in rows
    ]


def build_role_skills(db: Session, role_id: int) -> List[Dict]:
    """Build the required skills structure consumed by the skill engine."""
    rows = (
        db.query(RoleSkill, Skill)
        .join(Skill, RoleSkill.skill_id == Skill.id)
        .filter(RoleSkill.role_id == role_id)
        .all()
    )
    return [
        {
            "id": skill.id,
            "name": skill.name,
            "importance": rs.importance,
            "level": rs.required_level,
        }
        for rs, skill in rows
    ]


def get_role_by_name(db: Session, name: str) -> Optional[CareerRole]:
    return db.query(CareerRole).filter(CareerRole.name.ilike(name.strip())).first()


def compute_analysis(
    db: Session,
    user_id: int,
    target_role: str,
) -> Dict:
    """Compute readiness analysis for a user against a target career role."""
    role = get_role_by_name(db, target_role)
    if not role:
        # Fall back to the first role if the target is unknown
        role = db.query(CareerRole).first()
    if not role:
        raise ValueError("No career roles available. Run seed data first.")

    user_skills = build_user_skills(db, user_id)
    role_skills = build_role_skills(db, role.id)

    readiness, strong_skills, gaps = SkillGapEngine.calculate_readiness_score(
        user_skills, role_skills
    )
    label = SkillGapEngine.get_readiness_label(readiness)

    return {
        "role": role,
        "user_skills": user_skills,
        "role_skills": role_skills,
        "readiness": readiness,
        "label": label,
        "strong_skills": strong_skills,
        "gaps": gaps,
    }


def save_analysis(
    db: Session,
    user_id: int,
    target_role: str,
    analysis: Dict,
) -> AnalysisHistory:
    """Persist skill gaps and analysis history, return the history record."""
    # Delete previous gap rows for this user (keep only the latest snapshot)
    db.query(SkillGap).filter(SkillGap.user_id == user_id).delete()
    db.flush()

    for gap in analysis["gaps"]:
        if not gap.get("skill_id"):
            continue
        db.add(
            SkillGap(
                user_id=user_id,
                skill_id=int(gap["skill_id"]),
                current_level=gap["current_level"],
                required_level=gap["required_level"],
                gap_percentage=float(gap["gap_percentage"]),
                priority=gap["priority"].capitalize(),
            )
        )

    history = AnalysisHistory(
        user_id=user_id,
        target_role=target_role,
        readiness_score=analysis["readiness"],
        analysis_data=json.dumps(
            {
                "strong_skills": analysis["strong_skills"],
                "gaps": analysis["gaps"],
                "label": analysis["label"],
            }
        ),
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


def serialize_analysis(history: AnalysisHistory, analysis: Dict) -> Dict:
    """Build the API response for an analysis."""
    total = len(analysis["role_skills"])
    matched = len(analysis["strong_skills"])
    learning_time = SkillGapEngine.estimate_learning_time(analysis["gaps"], 10)

    strong_skills = []
    for s in analysis["strong_skills"]:
        item = dict(s)
        if item.get("id") is not None:
            item["id"] = str(item["id"])
        strong_skills.append(item)

    missing_skills = []
    for g in analysis["gaps"]:
        item = dict(g)
        if item.get("skill_id") is not None:
            item["skill_id"] = str(item["skill_id"])
        missing_skills.append(item)

    return {
        "analysis_id": str(history.id),
        "target_role": history.target_role,
        "readiness_score": history.readiness_score,
        "readiness_label": analysis["label"],
        "strong_skills": strong_skills,
        "missing_skills": missing_skills,
        "total_skills": total,
        "matched_skills": matched,
        "estimated_learning_time": learning_time,
        "analyzed_at": history.created_at,
    }


def serialize_history_item(history: AnalysisHistory) -> Dict:
    return {
        "analysis_id": str(history.id),
        "target_role": history.target_role,
        "readiness_score": history.readiness_score,
        "analyzed_at": history.created_at,
    }
