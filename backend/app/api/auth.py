from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db, User, Profile
from ..schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from ..utils.auth import hash_password, verify_password, create_access_token
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.flush()  # Get the ID

    # Create user profile
    profile = Profile(
        user_id=new_user.id,
        full_name=user_data.full_name
    )
    db.add(profile)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(days=7)
    )

    # Return response with user info
    user_response = UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        full_name=user_data.full_name,
        education=None,
        experience_level=None,
        target_role=None,
        weekly_study_hours=None,
        created_at=new_user.created_at,
        updated_at=new_user.updated_at
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Verify password
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=7)
    )

    # Get user profile
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    # Return response
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=profile.full_name if profile else "",
        education=profile.education if profile else None,
        experience_level=profile.experience_level if profile else None,
        target_role=profile.target_role if profile else None,
        weekly_study_hours=profile.weekly_study_hours if profile else None,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/logout")
async def logout():
    """Logout user"""
    return {"message": "Logged out successfully"}

