from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
from pathlib import Path

from ..database import get_db, Resume, UserSkill, Skill
from ..services.resume_service import parse_resume
from ..services.ai_service import ai_service
from ..utils.auth import get_current_user

router = APIRouter()

# Upload directory
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and process resume"""
    # Validate file size (5MB limit)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    
    # Validate file type
    valid_extensions = ['.pdf', '.docx', '.txt']
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in valid_extensions:
        raise HTTPException(status_code=400, detail="Invalid file format. Allowed: PDF, DOCX, TXT")
    
    try:
        # Parse resume to extract text
        extracted_text = await parse_resume(content, file.filename)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        
        # Save file to disk
        file_path = UPLOAD_DIR / f"{current_user['user_id']}_{file.filename}"
        with open(file_path, 'wb') as f:
            f.write(content)
        
        # Store in database
        resume = Resume(
            user_id=current_user["user_id"],
            filename=file.filename,
            file_path=str(file_path),
            extracted_text=extracted_text
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return {
            "resume_id": str(resume.id),
            "filename": file.filename,
            "text_extracted": len(extracted_text) > 0,
            "message": "Resume uploaded successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing resume: {str(e)}")


@router.post("/analyze")
async def analyze_resume(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze most recent resume and extract skills"""
    # Get most recent resume
    resume = db.query(Resume).filter(
        Resume.user_id == current_user["user_id"]
    ).order_by(Resume.uploaded_at.desc()).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    
    try:
        # Extract skills using AI service
        if resume.extracted_text:
            # This will call Gemini/OpenAI or fall back to deterministic detection
            skills_data = ai_service.extract_skills_from_resume(resume.extracted_text)
        else:
            skills_data = {"skills": []}
        
        # Add extracted skills to user's skills
        for skill_entry in skills_data.get("skills", []):
            # Support both {"name": ...} dicts and plain name strings
            skill_name = skill_entry.get("name") if isinstance(skill_entry, dict) else skill_entry
            if not skill_name:
                continue

            # Find skill in database
            skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
            if skill:
                # Check if user already has this skill
                existing = db.query(UserSkill).filter(
                    UserSkill.user_id == current_user["user_id"],
                    UserSkill.skill_id == skill.id
                ).first()
                
                if not existing:
                    # Add skill with intermediate level from resume
                    user_skill = UserSkill(
                        user_id=current_user["user_id"],
                        skill_id=skill.id,
                        proficiency=60,
                        current_level=2,
                        source="resume"
                    )
                    db.add(user_skill)
        
        db.commit()
        
        return {
            "resume_id": str(resume.id),
            "skills": skills_data.get("skills", []),
            "experience_years": skills_data.get("experience_years", 0),
            "education": skills_data.get("education", []),
            "certifications": skills_data.get("certifications", []),
            "projects": skills_data.get("projects", []),
            "message": "Resume analyzed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing resume: {str(e)}")
