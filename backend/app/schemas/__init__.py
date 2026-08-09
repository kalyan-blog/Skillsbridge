from .user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
)
from .profile import ProfileBase, ProfileUpdate, ProfileResponse
# Backwards-compatible alias used by the users API
UserUpdate = ProfileUpdate
from .skill import (
    SkillBase,
    SkillCreate,
    SkillResponse,
    UserSkillLevel,
    UserSkillResponse,
)
from .career import CareerRoleResponse, CareerRoleDetail, CareerSkill
from .analysis import (
    SkillGapResponse,
    AnalysisCreate,
    AnalysisResponse,
    AnalysisHistoryItem,
    WhatIfRequest,
    WhatIfResponse,
)
from .roadmap import (
    RoadmapGenerateRequest,
    RoadmapItemResponse,
    RoadmapResponse,
    RoadmapItemUpdate,
)
from .progress import SkillProgressItem, Milestone, ProgressResponse

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "TokenResponse",
    "ProfileBase",
    "ProfileUpdate",
    "ProfileResponse",
    "UserUpdate",
    "SkillBase",
    "SkillCreate",
    "SkillResponse",
    "UserSkillLevel",
    "UserSkillResponse",
    "CareerRoleResponse",
    "CareerRoleDetail",
    "CareerSkill",
    "SkillGapResponse",
    "AnalysisCreate",
    "AnalysisResponse",
    "AnalysisHistoryItem",
    "WhatIfRequest",
    "WhatIfResponse",
    "RoadmapGenerateRequest",
    "RoadmapItemResponse",
    "RoadmapResponse",
    "RoadmapItemUpdate",
    "SkillProgressItem",
    "Milestone",
    "ProgressResponse",
]
