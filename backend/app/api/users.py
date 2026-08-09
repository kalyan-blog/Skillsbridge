from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from ..database import get_db, User, Profile, UserSkill, Skill
from ..schemas import UserResponse, UserUpdate, UserSkillLevel, UserSkillResponse
from ..utils.auth import get_current_user

router = APIRouter()


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated user's profile."""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=profile.full_name if profile else "",
        education=profile.education if profile else None,
        experience_level=profile.experience_level if profile else None,
        target_role=profile.target_role if profile else None,
        weekly_study_hours=profile.weekly_study_hours if profile else None,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update user profile",
)
async def update_profile(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated user's profile."""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    if data.full_name is not None:
        profile.full_name = data.full_name
    if data.education is not None:
        profile.education = data.education
    if data.experience_level is not None:
        profile.experience_level = data.experience_level
    if data.target_role is not None:
        profile.target_role = data.target_role
    if data.weekly_study_hours is not None:
        profile.weekly_study_hours = data.weekly_study_hours

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=profile.full_name or "",
        education=profile.education,
        experience_level=profile.experience_level,
        target_role=profile.target_role,
        weekly_study_hours=profile.weekly_study_hours,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.get(
    "/me/skills",
    response_model=list[UserSkillResponse],
    summary="Get user skills",
)
async def get_user_skills(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all skills the current user has recorded."""
    user_skills = (
        db.query(UserSkill)
        .filter(UserSkill.user_id == current_user["user_id"])
        .all()
    )

    result = []
    for us in user_skills:
        skill = db.query(Skill).filter(Skill.id == us.skill_id).first()
        if skill:
            result.append({
                "id": str(us.id),
                "skill_id": str(skill.id),
                "skill_name": skill.name,
                "category": skill.category,
                "proficiency": us.proficiency,
                "current_level": us.current_level,
                "source": us.source,
                "updated_at": us.updated_at,
            })
    return result


@router.post(
    "/me/skills",
    response_model=UserSkillResponse,
    summary="Add or update a user skill",
)
async def add_user_skill(
    skill_data: UserSkillLevel,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add or update a skill for the current user (by skill_id or skill_name)."""
    skill = None
    if skill_data.skill_id:
        skill = db.query(Skill).filter(Skill.id == int(skill_data.skill_id)).first()
    if not skill and skill_data.skill_name:
        skill = (
            db.query(Skill)
            .filter(Skill.name.ilike(skill_data.skill_name.strip()))
            .first()
        )
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    proficiency = skill_data.proficiency
    if proficiency is None:
        proficiency = min(100, skill_data.current_level * 25)

    user_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user["user_id"],
            UserSkill.skill_id == skill.id,
        )
        .first()
    )

    if user_skill:
        user_skill.proficiency = proficiency
        user_skill.current_level = skill_data.current_level
    else:
        user_skill = UserSkill(
            user_id=current_user["user_id"],
            skill_id=skill.id,
            proficiency=proficiency,
            current_level=skill_data.current_level,
            source="manual",
        )
        db.add(user_skill)

    db.commit()
    db.refresh(user_skill)

    return {
        "id": str(user_skill.id),
        "skill_id": str(skill.id),
        "skill_name": skill.name,
        "category": skill.category,
        "proficiency": user_skill.proficiency,
        "current_level": user_skill.current_level,
        "source": user_skill.source,
        "updated_at": user_skill.updated_at,
    }


@router.delete(
    "/me/skills/{skill_id}",
    summary="Delete a user skill",
)
async def delete_user_skill(
    skill_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a skill from the current user's profile."""
    user_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user["user_id"],
            UserSkill.skill_id == skill_id,
        )
        .first()
    )
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(user_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}
