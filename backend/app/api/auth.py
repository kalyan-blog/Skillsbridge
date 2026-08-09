from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Mock user storage (replace with database)
USERS_DB = {
    "demo@example.com": {
        "id": "demo-user-1",
        "email": "demo@example.com",
        "password_hash": "$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUe",  # demo123
        "full_name": "Demo User",
        "education": "B.S. Computer Science",
        "experience_level": "intermediate",
        "target_role": "Data Scientist",
        "weekly_study_hours": 10,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
}

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """Register a new user"""
    if user_data.email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # In production, use proper password hashing
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"])
    
    new_user = {
        "id": f"user-{len(USERS_DB)}",
        "email": user_data.email,
        "password_hash": pwd_context.hash(user_data.password),
        "full_name": user_data.full_name,
        "education": None,
        "experience_level": None,
        "target_role": None,
        "weekly_study_hours": None,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    USERS_DB[user_data.email] = new_user

    access_token = create_access_token(
        data={"sub": user_data.email},
        expires_delta=timedelta(days=7)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """Login user"""
    if user_data.email not in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    user = USERS_DB[user_data.email]

    # In production, verify password hash properly
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"])
    
    if not pwd_context.verify(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={"sub": user_data.email},
        expires_delta=timedelta(days=7)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user)
    )

@router.post("/logout")
async def logout():
    """Logout user"""
    return {"message": "Logged out successfully"}
