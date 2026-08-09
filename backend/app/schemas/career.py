from pydantic import BaseModel
from typing import Optional, List


class CareerSkill(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    importance: int
    required_level: int


class CareerRoleResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    difficulty: Optional[int] = None
    average_salary: Optional[int] = None
    market_demand: Optional[str] = None


class CareerRoleDetail(CareerRoleResponse):
    skills: List[CareerSkill] = []
