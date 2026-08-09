import google.generativeai as genai
from app.config import settings
import json
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered skill extraction and analysis"""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = "gemini-pro"

    async def extract_skills_from_resume(self, resume_text: str) -> Dict[str, Any]:
        """Extract skills from resume text using AI"""
        try:
            prompt = f"""
Analyze this resume and extract all skills mentioned. Return a JSON object with this structure:
{{
  "skills": [
    {{"name": "Python", "confidence": 0.95, "estimated_level": 3, "category": "Programming Language"}},
    ...
  ],
  "experience_years": 5,
  "education": ["B.S. Computer Science"],
  "certifications": ["AWS Solutions Architect"],
  "projects": ["Built recommendation system using TensorFlow"]
}}

Resume:
{resume_text}

Return ONLY valid JSON, no other text.
"""

            model = genai.GenerativeModel(self.model)
            response = model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3]  # Remove markdown code blocks
            
            result = json.loads(response_text)
            return result
        except Exception as e:
            logger.error(f"Error extracting skills: {e}")
            # Return empty result on error
            return {
                "skills": [],
                "experience_years": 0,
                "education": [],
                "certifications": [],
                "projects": []
            }

    async def generate_learning_roadmap(
        self,
        current_skills: List[Dict[str, Any]],
        missing_skills: List[Dict[str, Any]],
        target_role: str,
        weekly_hours: int,
        experience_level: str
    ) -> Dict[str, Any]:
        """Generate personalized learning roadmap"""
        try:
            skills_str = ", ".join([s["name"] for s in current_skills])
            missing_str = ", ".join([s["name"] for s in missing_skills])

            prompt = f"""
Create a personalized learning roadmap for someone who wants to become a {target_role}.

Current Skills: {skills_str}
Missing Skills: {missing_str}
Experience Level: {experience_level}
Weekly Study Hours: {weekly_hours}

Return a JSON object with this structure:
{{
  "roadmap": [
    {{
      "phase": 1,
      "skill": "Python Fundamentals",
      "duration_weeks": 2,
      "why_important": "Foundation for data work",
      "learning_objectives": ["Learn syntax", "Practice loops"],
      "practice_tasks": ["Complete 10 coding challenges"],
      "project": "Build a CLI calculator"
    }}
  ],
  "estimated_total_weeks": 12,
  "reasoning": "This roadmap prioritizes critical skills needed for the role"
}}

Return ONLY valid JSON, no other text.
"""

            model = genai.GenerativeModel(self.model)
            response = model.generate_content(prompt)
            
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3]
            
            result = json.loads(response_text)
            return result
        except Exception as e:
            logger.error(f"Error generating roadmap: {e}")
            return {
                "roadmap": [],
                "estimated_total_weeks": 0,
                "reasoning": "Unable to generate roadmap"
            }

    async def analyze_what_if_scenario(
        self,
        current_readiness: int,
        target_skills: List[str]
    ) -> Dict[str, Any]:
        """Analyze 'What If' scenario for skill acquisition"""
        try:
            target_skills_str = ", ".join(target_skills)
            
            prompt = f"""
If someone currently has a readiness score of {current_readiness}% and learns these skills: {target_skills_str}

Calculate the estimated readiness improvement and new score.

Return JSON:
{{
  "current_readiness": {current_readiness},
  "new_readiness": 85,
  "improvement": 10,
  "reasoning": "These skills are highly valued...",
  "time_estimate_weeks": 8
}}

Return ONLY valid JSON.
"""

            model = genai.GenerativeModel(self.model)
            response = model.generate_content(prompt)
            
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3]
            
            result = json.loads(response_text)
            return result
        except Exception as e:
            logger.error(f"Error analyzing what-if: {e}")
            return {
                "current_readiness": current_readiness,
                "new_readiness": current_readiness + 5,
                "improvement": 5,
                "reasoning": "Estimated improvement",
                "time_estimate_weeks": 4
            }

# Global service instance
ai_service = AIService()
