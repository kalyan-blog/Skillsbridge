from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db, User, AnalysisHistory, Profile
from ..schemas import ProgressResponse, SkillProgressItem, Milestone
from ..utils.auth import get_current_user
from ..services import analysis_service, roadmap_service

router = APIRouter()


@router.get(
    "/",
    response_model=ProgressResponse,
    summary="Get overall learning progress",
    description="Returns readiness history, skill improvements and milestones for the current user.",
)
async def get_progress(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Aggregate progress data for the current user."""
    user_id = current_user["user_id"]

    history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == user_id)
        .order_by(AnalysisHistory.created_at.asc())
        .all()
    )

    readiness_history = [
        {
            "date": h.created_at.strftime("%b %d"),
            "score": h.readiness_score,
            "target_role": h.target_role,
        }
        for h in history
    ]

    current_readiness = history[-1].readiness_score if history else 0
    first_readiness = history[0].readiness_score if history else current_readiness
    improvement = max(0, current_readiness - first_readiness)

    # Skill improvements (current level compared to a baseline estimate)
    user_skills = analysis_service.build_user_skills(db, user_id)
    skill_progress = []
    for s in user_skills:
        skill_progress.append(
            SkillProgressItem(
                skill_name=s["name"],
                before=max(0, int((s["level"] or 0) * 20)),
                current=s["proficiency"] or 0,
            )
        )

    # Milestones derived from the latest roadmap
    milestones = []
    roadmap = roadmap_service.get_user_roadmap(db, user_id)
    if roadmap:
        for item in roadmap["items"]:
            if item["status"] == "completed":
                milestones.append(
                    Milestone(
                        date="Roadmap",
                        milestone=f"Completed {item['skill_name']}",
                        completed=True,
                    )
                )
            elif item["status"] == "in_progress":
                milestones.append(
                    Milestone(
                        date="Roadmap",
                        milestone=f"In progress: {item['skill_name']}",
                        completed=False,
                    )
                )
    if not milestones:
        milestones.append(
            Milestone(
                date="Today",
                milestone="Joined SkillBridge AI",
                completed=True,
            )
        )

    roadmap_completion = roadmap["completion_percentage"] if roadmap else 0
    completed_items = roadmap["completed_items"] if roadmap else 0

    return ProgressResponse(
        readiness_history=readiness_history,
        skill_progress=skill_progress,
        milestones=milestones,
        current_readiness=current_readiness,
        improvement=improvement,
        courses_completed=completed_items,
        courses_in_progress=roadmap["in_progress_items"] if roadmap else 0,
        hours_studied=round(roadmap["estimated_duration"] * 10) if roadmap else None,
    )
