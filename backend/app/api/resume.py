from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_service import resume_parser
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and process resume"""
    if file.size > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large")

    content = await file.read()
    resume_text = await resume_parser.parse_resume(content, file.filename)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Invalid resume format")

    return {
        "resume_id": "resume-1",
        "filename": file.filename,
        "text_extracted": len(resume_text) > 0,
        "message": "Resume uploaded successfully"
    }

@router.post("/{resume_id}/analyze")
async def analyze_resume(resume_id: str):
    """Analyze resume and extract skills"""
    # Mock implementation - in production would fetch from DB
    skills = await ai_service.extract_skills_from_resume("Sample resume text")
    
    return {
        "resume_id": resume_id,
        "skills": skills.get("skills", []),
        "experience": skills.get("experience_years", 0),
        "education": skills.get("education", []),
        "certifications": skills.get("certifications", []),
        "projects": skills.get("projects", [])
    }
