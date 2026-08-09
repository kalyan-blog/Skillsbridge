from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.api import auth, users, resume, analysis, careers, roadmap, dashboard

app = FastAPI(
    title="SkillBridge AI API",
    description="AI-powered skill gap analysis and career roadmap platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app", "*.render.com"]
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "SkillBridge AI API is running"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(careers.router, prefix="/api/careers", tags=["careers"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["roadmap"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
