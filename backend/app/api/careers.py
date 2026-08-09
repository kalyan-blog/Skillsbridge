from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db, CareerRole, RoleSkill, Skill

router = APIRouter()


@router.get("/")
async def get_all_career_roles(db: Session = Depends(get_db)):
    """Get all supported career roles"""
    roles = db.query(CareerRole).all()
    
    result = []
    for role in roles:
        result.append({
            "id": str(role.id),
            "name": role.name,
            "description": role.description,
            "difficulty": role.difficulty,
            "average_salary": role.average_salary,
            "market_demand": role.market_demand
        })
    
    return {"careers": result}


@router.get("/{role_id}")
async def get_career_role(role_id: int, db: Session = Depends(get_db)):
    """Get specific career role"""
    role = db.query(CareerRole).filter(CareerRole.id == role_id).first()
    
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")
    
    return {
        "id": str(role.id),
        "name": role.name,
        "description": role.description,
        "difficulty": role.difficulty,
        "average_salary": role.average_salary,
        "market_demand": role.market_demand
    }


@router.get("/{role_id}/skills")
async def get_role_skills(role_id: int, db: Session = Depends(get_db)):
    """Get skills required for a career role"""
    role = db.query(CareerRole).filter(CareerRole.id == role_id).first()
    
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")
    
    role_skills = db.query(RoleSkill).filter(RoleSkill.role_id == role_id).all()
    
    skills = []
    for rs in role_skills:
        skill = db.query(Skill).filter(Skill.id == rs.skill_id).first()
        if skill:
            skills.append({
                "id": str(skill.id),
                "name": skill.name,
                "category": skill.category,
                "importance": rs.importance,
                "required_level": rs.required_level,
                "description": skill.description
            })
    
    return {
        "role_id": str(role.id),
        "role_name": role.name,
        "skills": skills
    }
