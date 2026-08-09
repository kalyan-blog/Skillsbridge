from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SkillProgressItem(BaseModel):
    skill_name: str
    before: Optional[int] = None
    current: int


class Milestone(BaseModel):
    date: str
    milestone: str
    completed: bool = True


class ProgressResponse(BaseModel):
    readiness_history: List[dict]
    skill_progress: List[SkillProgressItem]
    milestones: List[Milestone]
    current_readiness: int
    improvement: int
    hours_studied: Optional[int] = None
    courses_completed: Optional[int] = None
    courses_in_progress: Optional[int] = None
