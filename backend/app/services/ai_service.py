import json
import logging
from typing import Dict, List, Any

from ..config import settings

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered skill extraction and analysis.

    Uses Gemini API or OpenAI API when a key is configured.
    Falls back to deterministic logic when no API key is available so the
    application remains fully functional (e.g. demo mode).
    """

    def __init__(self):
        self.provider = None
        if settings.GEMINI_API_KEY:
            self.provider = "gemini"
        elif settings.OPENAI_API_KEY:
            self.provider = "openai"

    def _generate_with_ai(self, prompt: str) -> str:
        """Call the configured AI provider and return raw text."""
        if self.provider == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            return response.text or ""
        elif self.provider == "openai":
            import openai
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a career and skills analysis assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.4,
            )
            return response.choices[0].message.content or ""
        return ""

    @staticmethod
    def _parse_json_response(response_text: str) -> Any:
        """Extract JSON from an LLM response, tolerating code fences."""
        if not response_text:
            return None
        text = response_text.strip()
        if text.startswith("```"):
            text = text.strip("`")
            if text.startswith("json"):
                text = text[4:]
            elif text.startswith("JSON"):
                text = text[4:]
            text = text.strip()
        # Find the first { ... } block
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end > start:
                try:
                    return json.loads(text[start:end + 1])
                except json.JSONDecodeError:
                    return None
        return None

    def extract_skills_from_resume(self, resume_text: str) -> Dict[str, Any]:
        """Extract skills from resume text using AI (fallback: deterministic keywords)."""
        try:
            if self.provider:
                prompt = f"""
Analyze this resume and extract all skills mentioned. Return a JSON object with this structure:
{{
  "skills": [
    {{"name": "Python", "confidence": 0.95, "estimated_level": 3, "category": "Programming Language"}}
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
                response_text = self._generate_with_ai(prompt)
                result = self._parse_json_response(response_text)
                if isinstance(result, dict) and "skills" in result:
                    return result
            return self._fallback_extract_skills(resume_text)
        except Exception as e:
            logger.error(f"Error extracting skills with AI: {e}")
            return self._fallback_extract_skills(resume_text)

    @staticmethod
    def _fallback_extract_skills(resume_text: str) -> Dict[str, Any]:
        """Deterministic skill extraction when AI is unavailable."""
        from ..utils.skill_matching import MATCHING_KEYWORDS

        text = (resume_text or "").lower()
        skills = []
        seen = set()
        for skill_name, keywords in MATCHING_KEYWORDS.items():
            if any(kw in text for kw in keywords):
                if skill_name not in seen:
                    seen.add(skill_name)
                    skills.append({
                        "name": skill_name,
                        "confidence": 0.7,
                        "estimated_level": 2,
                        "category": "Detected",
                    })
        return {
            "skills": skills,
            "experience_years": 0,
            "education": [],
            "certifications": [],
            "projects": [],
        }

    def generate_learning_roadmap(
        self,
        current_skills: List[Dict[str, Any]],
        missing_skills: List[Dict[str, Any]],
        target_role: str,
        weekly_hours: int,
        experience_level: str
    ) -> Dict[str, Any]:
        """Generate personalized learning roadmap (fallback: deterministic)."""
        try:
            if self.provider:
                skills_str = ", ".join([s.get("name", "") for s in current_skills])
                missing_str = ", ".join([s.get("name", "") for s in missing_skills])

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
                response_text = self._generate_with_ai(prompt)
                result = self._parse_json_response(response_text)
                if isinstance(result, dict) and result.get("roadmap"):
                    return result
            return self._fallback_roadmap(current_skills, missing_skills)
        except Exception as e:
            logger.error(f"Error generating roadmap with AI: {e}")
            return self._fallback_roadmap(current_skills, missing_skills)

    @staticmethod
    def _fallback_roadmap(
        current_skills: List[Dict[str, Any]],
        missing_skills: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Deterministic roadmap generation when AI is unavailable."""
        # Sort missing skills: critical first, then by gap size
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        sorted_missing = sorted(
            missing_skills,
            key=lambda s: (
                priority_order.get(s.get("priority", "low"), 4),
                -s.get("gap_percentage", 100),
            ),
        )

        roadmap = []
        total_weeks = 0
        for i, skill in enumerate(sorted_missing):
            name = skill.get("name", "Skill")
            duration = max(1, round(skill.get("gap_percentage", 50) / 20))
            total_weeks += duration
            roadmap.append({
                "phase": i + 1,
                "skill": name,
                "duration_weeks": duration,
                "why_important": f"Required for your target role ({skill.get('priority', 'medium').upper()} priority).",
                "learning_objectives": [
                    f"Learn the fundamentals of {name}",
                    f"Practice hands-on exercises with {name}",
                    "Complete a small project using this skill",
                ],
                "practice_tasks": [
                    f"Complete an online course covering {name}",
                    f"Build 2-3 projects using {name}",
                    "Get feedback from a mentor or community",
                ],
                "project": f"Build a project that applies {name}",
            })

        return {
            "roadmap": roadmap,
            "estimated_total_weeks": total_weeks,
            "reasoning": "Roadmap generated by SkillBridge AI skill engine.",
        }


# Global service instance
ai_service = AIService()
