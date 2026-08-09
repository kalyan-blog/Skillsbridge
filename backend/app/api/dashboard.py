from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return {
        "target_role": "Data Scientist",
        "readiness_score": 78,
        "skills_matched": 12,
        "skills_to_learn": 6,
        "learning_progress": 64,
        "roadmap_completion": 0,
        "estimated_completion_weeks": 12,
        "recent_activity": [
            {"date": "2024-01-15", "action": "Completed Python Module"},
            {"date": "2024-01-14", "action": "Started SQL Course"},
        ]
    }

@router.get("/readiness")
async def get_readiness_score():
    """Get readiness score"""
    return {
        "score": 78,
        "label": "Job Ready",
        "breakdown": {
            "technical_skills": 80,
            "soft_skills": 70,
            "certifications": 50,
            "experience": 80
        }
    }
