import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pathlib import Path

# Create data directory if it doesn't exist
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# SQLite database URL
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATA_DIR}/skillbridge.db"

# Create engine with SQLite-specific configuration
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # Set to True for SQL debugging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Dependency for FastAPI
def get_db() -> Session:
    """
    Dependency function to get database session.
    Use this in FastAPI routes with Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)
