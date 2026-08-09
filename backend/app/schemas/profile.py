from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    education: Optional[str] = None
    experience_level: Optional[str] = None
    target_role: Optional[str] = None
    weekly_study_hours: Optional[int] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    education: Optional[str] = None
    experience_level: Optional[str] = None
    target_role: Optional[str] = None
    weekly_study_hours: Optional[int] = None


class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
