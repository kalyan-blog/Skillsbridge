from typing import Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import (
    Skill,
    CareerRole,
    Roadmap,
    RoadmapItem,
    Progress,
    AnalysisHistory,
)
from .ai_service import ai_service
from .analysis_service import build_user_skills, build_role_skills, get_role_by_name
from .skill_engine import SkillGapEngine


def generate_roadmap(
    db: Session,
    user_id: int,
    target_role: str,
    weekly_hours: int = 10,
    experience_level: str = "intermediate",
) -> Dict:
    """Generate and persist a learning roadmap for the user."""
    role = get_role_by_name(db, target_role)
    if not role:
        role = db.query(CareerRole).first()
    if not role:
        raise ValueError("No career roles available. Run seed data first.")

    user_skills = build_user_skills(db, user_id)
    role_skills = build_role_skills(db, role.id)

    readiness, strong_skills, gaps = SkillGapEngine.calculate_readiness_score(
        user_skills, role_skills
    )

    missing_skills = [
        {"name": g["skill_name"], "priority": g["priority"], "gap_percentage": g["gap_percentage"]}
        for g in gaps
    ]

    # Ask AI to generate content; fall back to the deterministic engine
    ai_result = None
    try:
        ai_result = ai_service.generate_learning_roadmap(
            current_skills=user_skills,
            missing_skills=missing_skills,
            target_role=role.name,
            weekly_hours=weekly_hours,
            experience_level=experience_level,
        )
    except Exception:
        ai_result = None

    ai_items = (ai_result or {}).get("roadmap", [])
    estimated_total_weeks = (ai_result or {}).get("estimated_total_weeks", 0)

    # Remove any existing roadmap so we keep the latest one
    existing = (
        db.query(Roadmap)
        .filter(Roadmap.user_id == user_id)
        .order_by(Roadmap.created_at.desc())
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()

    if not estimated_total_weeks and gaps:
        estimated_total_weeks = SkillGapEngine.estimate_learning_time(gaps, weekly_hours)["weeks"]

    roadmap = Roadmap(
        user_id=user_id,
        target_role_id=role.id,
        readiness_score=readiness,
        estimated_duration=round(estimated_total_weeks),
    )
    db.add(roadmap)
    db.flush()

    items = []
    if ai_items:
        for idx, item in enumerate(ai_items):
            skill_name = item.get("skill", "Skill")
            skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
            if not skill:
                # Match by name in role skills if present
                skill = db.query(Skill).filter(Skill.name.ilike(skill_name.split()[0])).first()
            if not skill:
                skill = _get_or_create_skill(db, skill_name)

            gap = next((g for g in gaps if g["skill_name"].lower() == skill.name.lower()), None)
            roadmap_item = RoadmapItem(
                roadmap_id=roadmap.id,
                skill_id=skill.id,
                title=skill_name,
                description=item.get("why_important", ""),
                duration=item.get("duration_weeks", 2),
                priority=(gap["priority"] if gap else "Medium"),
                status="not_started",
                order_index=idx,
            )
            db.add(roadmap_item)
            db.flush()

            db.add(
                Progress(
                    user_id=user_id,
                    roadmap_item_id=roadmap_item.id,
                    progress_percentage=0,
                )
            )
            items.append(roadmap_item)
    else:
        # Deterministic roadmap from skill gaps
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        sorted_gaps = sorted(
            gaps,
            key=lambda g: (
                priority_order.get(g["priority"], 4),
                -g["gap_percentage"],
            ),
        )
        for idx, gap in enumerate(sorted_gaps):
            skill = db.query(Skill).filter(Skill.id == int(gap["skill_id"])).first()
            if not skill:
                continue
            duration = max(1, round(gap["gap_percentage"] / 20))
            roadmap_item = RoadmapItem(
                roadmap_id=roadmap.id,
                skill_id=skill.id,
                title=skill.name,
                description=f"Close the {gap['gap_percentage']}% gap in {skill.name} "
                            f"(current level {gap['current_level']} → required {gap['required_level']}).",
                duration=duration,
                priority=gap["priority"].capitalize(),
                status="not_started",
                order_index=idx,
            )
            db.add(roadmap_item)
            db.flush()
            db.add(
                Progress(
                    user_id=user_id,
                    roadmap_item_id=roadmap_item.id,
                    progress_percentage=0,
                )
            )
            items.append(roadmap_item)

    db.commit()
    db.refresh(roadmap)
    return serialize_roadmap(db, roadmap, role, readiness)


def _get_or_create_skill(db: Session, name: str) -> Skill:
    skill = db.query(Skill).filter(Skill.name.ilike(name)).first()
    if skill:
        return skill
    skill = Skill(name=name, category="Other", description="Skill detected from roadmap", difficulty=2)
    db.add(skill)
    db.flush()
    return skill


def get_user_roadmap(db: Session, user_id: int) -> Optional[Dict]:
    roadmap = (
        db.query(Roadmap)
        .filter(Roadmap.user_id == user_id)
        .order_by(Roadmap.created_at.desc())
        .first()
    )
    if not roadmap:
        return None
    role = db.query(CareerRole).filter(CareerRole.id == roadmap.target_role_id).first()
    return serialize_roadmap(db, roadmap, role, roadmap.readiness_score)


def get_roadmap_by_id(db: Session, user_id: int, roadmap_id: int) -> Optional[Dict]:
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id, Roadmap.user_id == user_id
    ).first()
    if not roadmap:
        return None
    role = db.query(CareerRole).filter(CareerRole.id == roadmap.target_role_id).first()
    return serialize_roadmap(db, roadmap, role, roadmap.readiness_score)


def update_item_status(
    db: Session,
    user_id: int,
    roadmap_id: int,
    item_id: int,
    status: str,
) -> Dict:
    """Update roadmap item status and sync progress."""
    if status not in ("not_started", "in_progress", "completed"):
        raise ValueError("Invalid status")

    item = (
        db.query(RoadmapItem)
        .join(Roadmap, RoadmapItem.roadmap_id == Roadmap.id)
        .filter(
            Roadmap.id == roadmap_id,
            Roadmap.user_id == user_id,
            RoadmapItem.id == item_id,
        )
        .first()
    )
    if not item:
        raise ValueError("Roadmap item not found")

    item.status = status
    percentage = {"not_started": 0, "in_progress": 50, "completed": 100}[status]

    progress = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.roadmap_item_id == item.id,
    ).first()
    if progress:
        progress.progress_percentage = percentage
    else:
        progress = Progress(
            user_id=user_id,
            roadmap_item_id=item.id,
            progress_percentage=percentage,
        )
        db.add(progress)

    db.commit()

    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    role = db.query(CareerRole).filter(CareerRole.id == roadmap.target_role_id).first()
    return serialize_roadmap(db, roadmap, role, roadmap.readiness_score)


def serialize_roadmap(
    db: Session,
    roadmap: Roadmap,
    role: Optional[CareerRole],
    readiness: int,
) -> Dict:
    items = (
        db.query(RoadmapItem)
        .filter(RoadmapItem.roadmap_id == roadmap.id)
        .order_by(RoadmapItem.order_index)
        .all()
    )

    item_responses = []
    completed = 0
    in_progress = 0
    not_started = 0
    for item in items:
        progress = db.query(Progress).filter(
            Progress.roadmap_item_id == item.id,
            Progress.user_id == roadmap.user_id,
        ).first()
        skill = db.query(Skill).filter(Skill.id == item.skill_id).first()
        item_responses.append({
            "id": str(item.id),
            "skill_id": str(item.skill_id),
            "skill_name": skill.name if skill else item.title,
            "title": item.title,
            "description": item.description,
            "duration": item.duration,
            "priority": item.priority,
            "status": item.status,
            "order_index": item.order_index,
            "progress_percentage": progress.progress_percentage if progress else 0,
        })
        if item.status == "completed":
            completed += 1
        elif item.status == "in_progress":
            in_progress += 1
        else:
            not_started += 1

    total = len(items)
    completion = round((completed / total) * 100) if total else 0

    return {
        "roadmap_id": str(roadmap.id),
        "target_role": role.name if role else "Career",
        "readiness_score": readiness,
        "estimated_duration": roadmap.estimated_duration,
        "total_items": total,
        "completed_items": completed,
        "in_progress_items": in_progress,
        "not_started_items": not_started,
        "completion_percentage": completion,
        "items": item_responses,
        "created_at": roadmap.created_at,
    }
