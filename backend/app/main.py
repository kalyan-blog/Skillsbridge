from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

from .database import init_db, SessionLocal
from .utils import initialize_database
from .api import auth, users, resume, analysis, careers, roadmap, dashboard, progress

app = FastAPI(
    title="SkillBridge AI API",
    description=(
        "AI-powered skill gap analysis and personalized career roadmap platform. "
        "Built with FastAPI + SQLAlchemy + SQLite."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Initialize database, create tables and seed data on startup."""
    init_db()

    db = SessionLocal()
    try:
        initialize_database(db)
        print("✓ Database initialized successfully (backend/data/skillbridge.db)")
    finally:
        db.close()


@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "SkillBridge AI API is running"}


# Authentication
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# Users
app.include_router(users.router, prefix="/api/users", tags=["Users"])
# Resume
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
# Analysis
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
# Careers
app.include_router(careers.router, prefix="/api/careers", tags=["Careers"])
# Roadmap
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
# Dashboard
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
# Progress
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
