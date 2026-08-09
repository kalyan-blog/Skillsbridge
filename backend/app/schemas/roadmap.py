from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RoadmapGenerateRequest(BaseModel):
    target_role: str
    weekly_hours: Optional[int] = 10
    experience_level: Optional[str] = "intermediate"


class RoadmapItemResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    title: str
    description: Optional[str] = None
    duration: Optional[int] = None
    priority: str
    status: str
    order_index: int
    progress_percentage: int


class RoadmapResponse(BaseModel):
    roadmap_id: str
    target_role: str
    readiness_score: int
    estimated_duration: Optional[int] = None
    total_items: int
    completed_items: int
    in_progress_items: int
    not_started_items: int
    completion_percentage: int
    items: List[RoadmapItemResponse]
    created_at: datetime


class RoadmapItemUpdate(BaseModel):
    status: str  # not_started | in_progress | completed
