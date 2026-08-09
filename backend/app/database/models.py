from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# ============================================================================
# USER MODELS
# ============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    analysis_history = relationship("AnalysisHistory", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    education = Column(String(255), nullable=True)
    experience_level = Column(String(50), nullable=True)  # e.g., "beginner", "intermediate", "advanced"
    target_role = Column(String(255), nullable=True)
    weekly_study_hours = Column(Integer, default=10, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")


# ============================================================================
# SKILL MODELS
# ============================================================================

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)  # e.g., "Programming", "Data", "Cloud", "DevOps"
    description = Column(Text, nullable=True)
    difficulty = Column(Integer, default=1, nullable=False)  # 1-5 scale

    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")
    role_skills = relationship("RoleSkill", back_populates="skill", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="skill", cascade="all, delete-orphan")
    roadmap_items = relationship("RoadmapItem", back_populates="skill", cascade="all, delete-orphan")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency = Column(Integer, default=0, nullable=False)  # 0-100 scale
    current_level = Column(Integer, default=0, nullable=False)  # 0-4 scale
    source = Column(String(50), default="manual", nullable=False)  # manual, resume, ai, assessment
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")


# ============================================================================
# CAREER MODELS
# ============================================================================

class CareerRole(Base):
    __tablename__ = "career_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Integer, default=2, nullable=False)  # 1-5 scale
    average_salary = Column(Integer, nullable=True)
    market_demand = Column(String(50), nullable=True)  # "High", "Medium", "Low"

    # Relationships
    role_skills = relationship("RoleSkill", back_populates="role", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="target_role")


class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("career_roles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(Integer, default=2, nullable=False)  # 1-5 scale
    required_level = Column(Integer, default=2, nullable=False)  # 0-4 scale: 0=Beginner, 1=Basic, 2=Intermediate, 3=Advanced, 4=Expert

    # Relationships
    role = relationship("CareerRole", back_populates="role_skills")
    skill = relationship("Skill", back_populates="role_skills")


# ============================================================================
# ANALYSIS MODELS
# ============================================================================

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    current_level = Column(Integer, default=0, nullable=False)  # 0-4
    required_level = Column(Integer, default=2, nullable=False)  # 0-4
    gap_percentage = Column(Float, default=0, nullable=False)  # 0-100
    priority = Column(String(50), default="Medium", nullable=False)  # Critical, High, Medium, Low
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="skill_gaps")
    skill = relationship("Skill", back_populates="skill_gaps")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    extracted_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="resumes")


# ============================================================================
# ROADMAP MODELS
# ============================================================================

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role_id = Column(Integer, ForeignKey("career_roles.id"), nullable=False, index=True)
    readiness_score = Column(Integer, default=0, nullable=False)  # 0-100
    estimated_duration = Column(Integer, nullable=True)  # weeks
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="roadmaps")
    target_role = relationship("CareerRole", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=True)  # weeks
    priority = Column(String(50), default="Medium", nullable=False)  # Critical, High, Medium, Low
    status = Column(String(50), default="not_started", nullable=False)  # not_started, in_progress, completed
    order_index = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    roadmap = relationship("Roadmap", back_populates="items")
    skill = relationship("Skill", back_populates="roadmap_items")
    progress = relationship("Progress", back_populates="roadmap_item", uselist=False, cascade="all, delete-orphan")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    roadmap_item_id = Column(Integer, ForeignKey("roadmap_items.id", ondelete="CASCADE"), nullable=False, index=True)
    progress_percentage = Column(Integer, default=0, nullable=False)  # 0-100
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="progress")
    roadmap_item = relationship("RoadmapItem", back_populates="progress")


# ============================================================================
# ANALYSIS HISTORY
# ============================================================================

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role = Column(String(255), nullable=False)
    readiness_score = Column(Integer, default=0, nullable=False)
    analysis_data = Column(JSON, nullable=True)  # Store JSON analysis results
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="analysis_history")
