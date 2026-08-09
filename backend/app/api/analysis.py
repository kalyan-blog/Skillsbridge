from fastapi import APIRouter
from app.services.skill_engine import SkillGapEngine

router = APIRouter()

@router.post("/")
async def create_analysis(data: dict):
    """Create skill gap analysis"""
    user_skills = data.get("user_skills", [])
    role_required_skills = data.get("role_skills", [])

    readiness_score, strong_skills, gaps = SkillGapEngine.calculate_readiness_score(
        user_skills, role_required_skills
    )

    return {
        "analysis_id": "analysis-1",
        "readiness_score": readiness_score,
        "readiness_label": SkillGapEngine.get_readiness_label(readiness_score),
        "strong_skills": strong_skills,
        "missing_skills": gaps,
        "total_skills": len(role_required_skills),
        "matched_skills": len(strong_skills)
    }

@router.get("/latest")
async def get_latest_analysis():
    """Get latest analysis for user"""
    return {
        "analysis_id": "analysis-1",
        "readiness_score": 78,
        "target_role": "Data Scientist",
        "analyzed_at": "2024-01-15T10:30:00"
    }

@router.get("/history")
async def get_analysis_history():
    """Get analysis history"""
    return {
        "history": [
            {
                "analysis_id": "analysis-1",
                "target_role": "Data Scientist",
                "readiness_score": 78,
                "analyzed_at": "2024-01-15T10:30:00"
            }
        ]
    }

@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get specific analysis"""
    return {
        "analysis_id": analysis_id,
        "readiness_score": 78,
        "target_role": "Data Scientist"
    }
