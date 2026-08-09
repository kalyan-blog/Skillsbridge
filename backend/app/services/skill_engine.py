from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class SkillGapEngine:
    """Deterministic skill gap analysis engine"""

    @staticmethod
    def calculate_gap(current_level: int, required_level: int) -> int:
        """Calculate skill gap percentage"""
        if required_level == 0:
            return 0
        gap = max(0, required_level - current_level)
        return int((gap / required_level) * 100)

    @staticmethod
    def get_priority(
        gap_percentage: int,
        importance: int,
        current_level: int,
        required_level: int
    ) -> str:
        """Determine skill priority based on gap and importance"""
        # Critical: High importance AND large gap
        if importance >= 4 and gap_percentage >= 60:
            return "critical"
        # High: Medium-high importance AND moderate gap
        elif importance >= 3 and gap_percentage >= 40:
            return "high"
        # Medium: Any importance AND small-moderate gap
        elif gap_percentage >= 20:
            return "medium"
        # Low: Small gap
        else:
            return "low"

    @staticmethod
    def calculate_readiness_score(
        user_skills: List[Dict],
        role_required_skills: List[Dict]
    ) -> Tuple[int, List[Dict], List[Dict]]:
        """Calculate overall readiness score and identify gaps"""

        # Create map of user skills
        user_skill_map = {skill["name"].lower(): skill for skill in user_skills}

        strong_skills = []
        gaps = []
        total_weighted_required = 0
        total_weighted_achieved = 0

        for required_skill in role_required_skills:
            skill_name = required_skill["name"].lower()
            importance = required_skill.get("importance", 3)  # 1-5 scale
            required_level = required_skill.get("level", 3)  # 0-4 scale

            total_weighted_required += importance

            user_skill = user_skill_map.get(skill_name)
            
            if user_skill:
                current_level = user_skill.get("level", 0)
                gap_percentage = SkillGapEngine.calculate_gap(current_level, required_level)

                if gap_percentage <= 10:
                    # Skill is strong
                    strong_skills.append({
                        "id": required_skill.get("id"),
                        "name": required_skill["name"],
                        "current_level": current_level,
                        "required_level": required_level,
                        "proficiency": int((current_level / 4) * 100)
                    })
                    total_weighted_achieved += importance
                else:
                    # Skill is weak but present
                    total_weighted_achieved += (importance * (1 - gap_percentage / 100))

                if gap_percentage > 0:
                    gap_data = {
                        "skill_id": required_skill.get("id"),
                        "skill_name": required_skill["name"],
                        "current_level": current_level,
                        "required_level": required_level,
                        "gap_percentage": gap_percentage,
                        "priority": SkillGapEngine.get_priority(
                            gap_percentage, importance, current_level, required_level
                        )
                    }
                    gaps.append(gap_data)
            else:
                # Skill is completely missing
                gap_data = {
                    "skill_id": required_skill.get("id"),
                    "skill_name": required_skill["name"],
                    "current_level": 0,
                    "required_level": required_level,
                    "gap_percentage": 100,
                    "priority": SkillGapEngine.get_priority(
                        100, importance, 0, required_level
                    )
                }
                gaps.append(gap_data)

        # Calculate readiness score
        if total_weighted_required > 0:
            readiness_score = int((total_weighted_achieved / total_weighted_required) * 100)
        else:
            readiness_score = 0

        readiness_score = min(100, max(0, readiness_score))

        # Sort gaps by priority
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        gaps.sort(key=lambda x: (
            priority_order.get(x["priority"], 4),
            -x["gap_percentage"]
        ))

        return readiness_score, strong_skills, gaps

    @staticmethod
    def get_readiness_label(score: int) -> str:
        """Get human-readable readiness label"""
        if score >= 90:
            return "Highly Ready"
        elif score >= 75:
            return "Job Ready"
        elif score >= 60:
            return "Intermediate"
        elif score >= 40:
            return "Developing"
        else:
            return "Beginner"

    @staticmethod
    def estimate_learning_time(
        gaps: List[Dict],
        weekly_hours: int = 10
    ) -> Dict:
        """Estimate total learning time to achieve readiness"""

        # Hours per skill to reach intermediate level
        hours_per_skill = {
            "critical": 60,  # 15 weeks @ 4 hrs/week
            "high": 40,      # 10 weeks @ 4 hrs/week
            "medium": 20,    # 5 weeks @ 4 hrs/week
            "low": 10        # 2.5 weeks @ 4 hrs/week
        }

        total_hours = sum(hours_per_skill.get(gap["priority"], 20) for gap in gaps)

        if weekly_hours > 0:
            weeks = total_hours / weekly_hours
        else:
            weeks = 0

        return {
            "total_hours": total_hours,
            "weeks": round(weeks, 1),
            "months": round(weeks / 4, 1)
        }
