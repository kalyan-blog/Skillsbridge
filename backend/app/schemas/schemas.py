from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: 'UserResponse'

# User Schemas
class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    education: Optional[str] = None
    experience_level: Optional[str] = None
    target_role: Optional[str] = None
    weekly_study_hours: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    education: Optional[str] = None
    experience_level: Optional[str] = None
    target_role: Optional[str] = None
    weekly_study_hours: Optional[int] = None

# Skill Schemas
class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: str

    class Config:
        from_attributes = True

class UserSkillLevel(BaseModel):
    skill_id: str
    current_level: int = Field(..., ge=0, le=4)  # 0-4 scale
    proficiency: Optional[int] = Field(None, ge=0, le=100)  # 0-100

# Career Schemas
class CareerRoleResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    average_readiness_threshold: int = Field(default=75)

    class Config:
        from_attributes = True

# Analysis Schemas
class SkillGapResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    current_level: int
    required_level: int
    gap_percentage: int
    priority: str  # 'critical', 'high', 'medium', 'low'

class SkillAnalysisResponse(BaseModel):
    id: str
    user_id: str
    target_role_id: str
    target_role_name: str
    readiness_score: int
    strong_skills: List[SkillResponse]
    missing_skills: List[SkillGapResponse]
    analyzed_at: datetime

    class Config:
        from_attributes = True

# Roadmap Schemas
class RoadmapItemResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    phase: int
    estimated_duration_weeks: int
    learning_objectives: List[str]
    practice_tasks: List[str]
    project_idea: str
    status: str  # 'not_started', 'in_progress', 'completed'

class LearningRoadmapResponse(BaseModel):
    id: str
    target_role_name: str
    readiness_score: int
    estimated_total_weeks: int
    items: List[RoadmapItemResponse]
    created_at: datetime

    class Config:
        from_attributes = True

# Resume Schemas
class ResumeAnalysisResult(BaseModel):
    skills: List[dict]
    experience: List[str]
    education: List[str]
    certifications: List[str]
    projects: List[str]

# Dashboard Schemas
class DashboardStats(BaseModel):
    target_role: Optional[str]
    readiness_score: int
    skills_count: int
    gaps_count: int
    learning_progress: int
    roadmap_completion: int
