from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SkillGapResponse(BaseModel):
    skill_id: Optional[str] = None
    skill_name: str
    current_level: int
    required_level: int
    gap_percentage: int
    priority: str


class AnalysisCreate(BaseModel):
    target_role: str
    user_skills: Optional[List[dict]] = None
    role_skills: Optional[List[dict]] = None


class AnalysisResponse(BaseModel):
    analysis_id: str
    target_role: str
    readiness_score: int
    readiness_label: str
    strong_skills: List[dict]
    missing_skills: List[SkillGapResponse]
    total_skills: int
    matched_skills: int
    estimated_learning_time: Optional[dict] = None
    analyzed_at: datetime


class AnalysisHistoryItem(BaseModel):
    analysis_id: str
    target_role: str
    readiness_score: int
    analyzed_at: datetime


class WhatIfRequest(BaseModel):
    target_role: str
    skills: List[str]


class WhatIfResponse(BaseModel):
    current_readiness: int
    projected_readiness: int
    improvement: int
    skills_learned: List[str]
    new_strong_skills: List[str]
    time_estimate_weeks: float
