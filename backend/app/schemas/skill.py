from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: str
    difficulty: Optional[int] = None

    class Config:
        from_attributes = True


class UserSkillLevel(BaseModel):
    skill_id: Optional[str] = None
    skill_name: Optional[str] = None
    current_level: int = Field(..., ge=0, le=4)
    proficiency: Optional[int] = Field(None, ge=0, le=100)


class UserSkillResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    category: Optional[str] = None
    proficiency: int
    current_level: int
    source: str
    updated_at: Optional[datetime] = None
