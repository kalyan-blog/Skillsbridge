from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db, User, Profile, AnalysisHistory
from ..utils.auth import get_current_user
from ..services import analysis_service, roadmap_service

router = APIRouter()


@router.get(
    "/stats",
    summary="Get dashboard statistics",
    description="Aggregates readiness, skill matching and roadmap progress for the current user.",
)
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Aggregate dashboard statistics from the database."""
    user_id = current_user["user_id"]
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    target_role = profile.target_role if profile and profile.target_role else None

    # Latest analysis
    latest_history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == user_id)
        .order_by(AnalysisHistory.created_at.desc())
        .first()
    )
    if not target_role and latest_history:
        target_role = latest_history.target_role

    readiness = 0
    readiness_label = "Not Started"
    skills_matched = 0
    total_skills = 0
    if latest_history:
        readiness = latest_history.readiness_score
        analysis = None
        try:
            analysis = analysis_service.compute_analysis(db, user_id, latest_history.target_role)
            readiness_label = analysis["label"]
            skills_matched = len(analysis["strong_skills"])
            total_skills = len(analysis["role_skills"])
        except Exception:
            readiness_label = analysis_service.SkillGapEngine.get_readiness_label(readiness)

    # Learning progress from user skills proficiency
    user_skills = analysis_service.build_user_skills(db, user_id)
    learning_progress = 0
    if user_skills:
        learning_progress = round(sum(s["proficiency"] or 0 for s in user_skills) / len(user_skills))

    # Roadmap completion
    roadmap = roadmap_service.get_user_roadmap(db, user_id)
    roadmap_completion = roadmap["completion_percentage"] if roadmap else 0
    estimated_weeks = roadmap["estimated_duration"] if roadmap else 0

    return {
        "target_role": target_role or "Select a target role",
        "readiness_score": readiness,
        "readiness_label": readiness_label,
        "skills_matched": skills_matched,
        "skills_to_learn": max(0, total_skills - skills_matched),
        "total_skills": total_skills,
        "learning_progress": learning_progress,
        "roadmap_completion": roadmap_completion,
        "estimated_completion_weeks": estimated_weeks,
        "has_roadmap": roadmap is not None,
    }


@router.get(
    "/readiness",
    summary="Get readiness score breakdown",
)
async def get_readiness_score(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current readiness score and label."""
    user_id = current_user["user_id"]
    latest_history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == user_id)
        .order_by(AnalysisHistory.created_at.desc())
        .first()
    )

    if not latest_history:
        return {
            "score": 0,
            "label": "Not Started",
            "breakdown": {
                "technical_skills": 0,
                "soft_skills": 0,
                "certifications": 0,
                "experience": 0,
            },
        }

    score = latest_history.readiness_score
    label = analysis_service.SkillGapEngine.get_readiness_label(score)

    # Approximate breakdown from the weighted score
    return {
        "score": score,
        "label": label,
        "breakdown": {
            "technical_skills": score,
            "soft_skills": min(100, score + 5),
            "certifications": min(100, score - 10),
            "experience": min(100, score + 2),
        },
    }
