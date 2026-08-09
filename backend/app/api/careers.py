from fastapi import APIRouter

router = APIRouter()

# Sample career data
CAREER_ROLES = [
    {
        "id": "data-scientist",
        "name": "Data Scientist",
        "description": "Analyze complex datasets and build predictive models",
        "average_readiness_threshold": 75,
        "top_skills": ["Python", "SQL", "Machine Learning", "Statistics"],
        "difficulty": "Hard"
    },
    {
        "id": "data-analyst",
        "name": "Data Analyst",
        "description": "Analyze business data and create insights",
        "average_readiness_threshold": 65,
        "top_skills": ["SQL", "Excel", "Tableau", "Statistics"],
        "difficulty": "Medium"
    },
    {
        "id": "full-stack-dev",
        "name": "Full Stack Developer",
        "description": "Build complete web applications",
        "average_readiness_threshold": 70,
        "top_skills": ["JavaScript", "React", "Node.js", "SQL"],
        "difficulty": "Hard"
    },
    {
        "id": "frontend-dev",
        "name": "Frontend Developer",
        "description": "Build user interfaces for web applications",
        "average_readiness_threshold": 65,
        "top_skills": ["JavaScript", "React", "CSS", "HTML"],
        "difficulty": "Medium"
    },
    {
        "id": "backend-dev",
        "name": "Backend Developer",
        "description": "Build server-side applications and APIs",
        "average_readiness_threshold": 70,
        "top_skills": ["Python", "Node.js", "SQL", "Docker"],
        "difficulty": "Hard"
    },
    {
        "id": "ml-engineer",
        "name": "Machine Learning Engineer",
        "description": "Build and deploy machine learning models",
        "average_readiness_threshold": 80,
        "top_skills": ["Python", "TensorFlow", "Deep Learning", "SQL"],
        "difficulty": "Very Hard"
    },
    {
        "id": "ai-engineer",
        "name": "AI Engineer",
        "description": "Develop AI systems and solutions",
        "average_readiness_threshold": 85,
        "top_skills": ["Python", "AI/ML", "Deep Learning", "NLP"],
        "difficulty": "Very Hard"
    },
    {
        "id": "cloud-engineer",
        "name": "Cloud Engineer",
        "description": "Design and manage cloud infrastructure",
        "average_readiness_threshold": 75,
        "top_skills": ["AWS", "Docker", "Kubernetes", "Linux"],
        "difficulty": "Hard"
    },
    {
        "id": "cybersecurity",
        "name": "Cybersecurity Analyst",
        "description": "Protect systems from security threats",
        "average_readiness_threshold": 75,
        "top_skills": ["Linux", "Networking", "Security Tools", "Python"],
        "difficulty": "Hard"
    },
    {
        "id": "software-engineer",
        "name": "Software Engineer",
        "description": "Design and build software systems",
        "average_readiness_threshold": 70,
        "top_skills": ["Python", "System Design", "Algorithms", "Database"],
        "difficulty": "Hard"
    },
]

@router.get("/")
async def get_all_career_roles():
    """Get all supported career roles"""
    return {"careers": CAREER_ROLES}

@router.get("/{role_id}")
async def get_career_role(role_id: str):
    """Get specific career role"""
    for role in CAREER_ROLES:
        if role["id"] == role_id:
            return role
    return {"error": "Career role not found"}

@router.get("/{role_id}/skills")
async def get_role_skills(role_id: str):
    """Get skills required for a career role"""
    # Mock implementation
    return {
        "role_id": role_id,
        "skills": [
            {"id": "skill-1", "name": "Python", "importance": 5, "level": 3},
            {"id": "skill-2", "name": "SQL", "importance": 4, "level": 3},
            {"id": "skill-3", "name": "Statistics", "importance": 4, "level": 3},
        ]
    }
