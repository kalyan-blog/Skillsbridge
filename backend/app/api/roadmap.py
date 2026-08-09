from fastapi import APIRouter
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/generate")
async def generate_roadmap(data: dict):
    """Generate personalized learning roadmap"""
    roadmap = await ai_service.generate_learning_roadmap(
        current_skills=data.get("current_skills", []),
        missing_skills=data.get("missing_skills", []),
        target_role=data.get("target_role", ""),
        weekly_hours=data.get("weekly_hours", 10),
        experience_level=data.get("experience_level", "intermediate")
    )

    return {
        "roadmap_id": "roadmap-1",
        "target_role": data.get("target_role"),
        "items": roadmap.get("roadmap", []),
        "estimated_total_weeks": roadmap.get("estimated_total_weeks", 12),
        "created_at": "2024-01-15T10:30:00"
    }

@router.get("/")
async def get_roadmap():
    """Get user's current roadmap"""
    return {
        "roadmap_id": "roadmap-1",
        "target_role": "Data Scientist",
        "items": [
            {
                "id": "item-1",
                "skill": "Python Fundamentals",
                "phase": 1,
                "status": "in_progress",
                "estimated_weeks": 2
            }
        ],
        "estimated_total_weeks": 12
    }

@router.patch("/items/{item_id}")
async def update_roadmap_item(item_id: str, status: str):
    """Update roadmap item status"""
    return {
        "item_id": item_id,
        "status": status,
        "updated_at": "2024-01-15T10:30:00"
    }
