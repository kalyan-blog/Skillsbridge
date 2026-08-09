from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db, AnalysisHistory
from ..schemas.analysis import (
    AnalysisCreate,
    AnalysisResponse,
    AnalysisHistoryItem,
    WhatIfRequest,
    WhatIfResponse,
)
from ..utils.auth import get_current_user
from ..services import analysis_service
from ..services.skill_engine import SkillGapEngine
from ..services.ai_service import ai_service

router = APIRouter()


@router.post(
    "/create",
    response_model=AnalysisResponse,
    summary="Create a new skill gap analysis",
    description="Computes the readiness score, skill gaps and priority for a target role using the deterministic skill engine.",
)
async def create_analysis(
    data: AnalysisCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create and persist a skill gap analysis for the current user."""
    try:
        analysis = analysis_service.compute_analysis(
            db, current_user["user_id"], data.target_role
        )
        history = analysis_service.save_analysis(
            db, current_user["user_id"], analysis["role"].name, analysis
        )
        return analysis_service.serialize_analysis(history, analysis)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/latest",
    response_model=AnalysisResponse,
    summary="Get the latest analysis",
)
async def get_latest_analysis(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the most recent analysis for the current user."""
    history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user["user_id"])
        .order_by(AnalysisHistory.created_at.desc())
        .first()
    )
    if not history:
        raise HTTPException(status_code=404, detail="No analysis found. Create one first.")

    try:
        analysis = analysis_service.compute_analysis(
            db, current_user["user_id"], history.target_role
        )
        return analysis_service.serialize_analysis(history, analysis)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/history",
    response_model=list[AnalysisHistoryItem],
    summary="Get analysis history",
)
async def get_analysis_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all previous analyses for the current user."""
    history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user["user_id"])
        .order_by(AnalysisHistory.created_at.desc())
        .all()
    )
    return [analysis_service.serialize_history_item(h) for h in history]


@router.get(
    "/{analysis_id}",
    response_model=AnalysisResponse,
    summary="Get a specific analysis",
)
async def get_analysis(
    analysis_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific analysis by id (must belong to the current user)."""
    history = db.query(AnalysisHistory).filter(
        AnalysisHistory.id == analysis_id,
        AnalysisHistory.user_id == current_user["user_id"],
    ).first()
    if not history:
        raise HTTPException(status_code=404, detail="Analysis not found")

    try:
        analysis = analysis_service.compute_analysis(
            db, current_user["user_id"], history.target_role
        )
        return analysis_service.serialize_analysis(history, analysis)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/what-if",
    response_model=WhatIfResponse,
    summary="Project readiness with the 'What If?' feature",
    description="Deterministically projects the readiness score if the user learns the listed skills.",
)
async def what_if(
    data: WhatIfRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Project the readiness improvement if the user learns the given skills."""
    try:
        analysis = analysis_service.compute_analysis(
            db, current_user["user_id"], data.target_role
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    projected, new_strong = SkillGapEngine.project_readiness(
        analysis["user_skills"],
        analysis["role_skills"],
        data.skills,
    )

    # Estimate time (weeks) to learn the requested skills
    missing_names = [g["skill_name"].lower() for g in analysis["gaps"]]
    estimated_weeks = 0.0
    for skill_name in data.skills:
        if skill_name.lower() in missing_names:
            gap = next(g for g in analysis["gaps"] if g["skill_name"].lower() == skill_name.lower())
            duration = max(1, round(gap["gap_percentage"] / 20))
            estimated_weeks += duration

    return WhatIfResponse(
        current_readiness=analysis["readiness"],
        projected_readiness=projected,
        improvement=max(0, projected - analysis["readiness"]),
        skills_learned=data.skills,
        new_strong_skills=new_strong,
        time_estimate_weeks=estimated_weeks,
    )
