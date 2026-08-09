from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.roadmap import (
    RoadmapGenerateRequest,
    RoadmapResponse,
    RoadmapItemUpdate,
)
from ..utils.auth import get_current_user
from ..services import roadmap_service

router = APIRouter()


@router.post(
    "/generate",
    response_model=RoadmapResponse,
    summary="Generate a personalized learning roadmap",
    description="Generates (optionally with AI) and persists a learning roadmap for the current user.",
)
async def generate_roadmap(
    data: RoadmapGenerateRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a learning roadmap for the current user."""
    try:
        return roadmap_service.generate_roadmap(
            db,
            current_user["user_id"],
            data.target_role,
            data.weekly_hours or 10,
            data.experience_level or "intermediate",
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/",
    response_model=RoadmapResponse,
    summary="Get the current roadmap",
)
async def get_roadmap(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the latest roadmap for the current user."""
    roadmap = roadmap_service.get_user_roadmap(db, current_user["user_id"])
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")
    return roadmap


@router.get(
    "/{roadmap_id}",
    response_model=RoadmapResponse,
    summary="Get a specific roadmap",
)
async def get_roadmap_by_id(
    roadmap_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific roadmap by id."""
    roadmap = roadmap_service.get_roadmap_by_id(db, current_user["user_id"], roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.patch(
    "/{roadmap_id}/items/{item_id}",
    response_model=RoadmapResponse,
    summary="Update a roadmap item status",
)
async def update_roadmap_item(
    roadmap_id: int,
    item_id: int,
    data: RoadmapItemUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the status of a roadmap item and sync progress."""
    try:
        return roadmap_service.update_item_status(
            db,
            current_user["user_id"],
            roadmap_id,
            item_id,
            data.status,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch(
    "/{roadmap_id}/progress",
    response_model=RoadmapResponse,
    summary="Update roadmap progress",
    description="Alias for updating an item's status (body: {item_id, status}).",
)
async def update_roadmap_progress(
    roadmap_id: int,
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update progress for a roadmap item via {item_id, status}."""
    item_id = data.get("item_id")
    status = data.get("status")
    if not item_id or not status:
        raise HTTPException(status_code=400, detail="Provide item_id and status")
    try:
        return roadmap_service.update_item_status(
            db,
            current_user["user_id"],
            roadmap_id,
            int(item_id),
            status,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
