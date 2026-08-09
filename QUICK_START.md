# SkillBridge AI - Quick Start Guide

Get SkillBridge AI running locally in 5 minutes for development or hackathon presentation.

## Prerequisites

- **Node.js** 16+ (https://nodejs.org)
- **Python** 3.9+ (https://python.org)
- **Git** (https://git-scm.com)
- **Git Bash or WSL** (Windows users - for shell commands)

Verify installation:
```bash
node --version
python --version
git --version
```

## Option 1: Quick Setup (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/skillbridge-ai.git
cd skillbridge
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### 3. Backend Setup (in new terminal)

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**

## Option 2: Demo Mode (No Backend Required)

The frontend works standalone with mock data:

```bash
cd frontend
npm install
npm run dev
```

Then:
1. Go to http://localhost:5173
2. Click "Demo Login" or signup with any credentials
3. Explore all pages with pre-loaded data

### Mock Credentials

```
Email: demo@example.com
Password: demo123
```

Or create your own account.

## Project Structure

```
skillbridge/
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/        # All page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API client
│   │   └── context/      # Auth state
│   └── package.json      # Dependencies
│
├── backend/              # FastAPI app
│   ├── app/
│   │   ├── api/         # Route handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Database models
│   │   └── main.py      # App entry point
│   └── requirements.txt  # Dependencies
│
├── database/             # SQL schemas
│   ├── schema.sql        # Table definitions
│   └── seed.sql          # Sample data
│
├── README.md             # Main documentation
├── ARCHITECTURE.md       # System design
├── DEPLOYMENT.md         # Production setup
└── .gitignore           # Git ignore rules
```

## Available Pages

After login, visit these pages:

| Page | URL | Feature |
|------|-----|---------|
| Dashboard | /dashboard | Readiness score, stats |
| Skill Gaps | /skill-gaps | Analysis charts |
| Learning Roadmap | /roadmap | 5-phase learning plan |
| Career Explorer | /career-explorer | 10 career paths |
| Progress | /progress | Learning milestones |
| Analysis History | /history | Past analyses |
| Skill Analysis | /skill-analysis | Resume upload |
| Profile | /profile | Edit account info |
| Settings | /settings | Preferences |

## Frontend Development

### Available Commands

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # TypeScript type checking
```

### Project Structure (Frontend)

- **pages/** - Page components (one per route)
- **components/** - Reusable components (Logo, Sidebar)
- **services/api.ts** - Axios client with JWT interceptors
- **context/AuthContext.tsx** - Global auth state
- **types/index.ts** - TypeScript interfaces
- **App.tsx** - Route definitions

### Styling

Using Tailwind CSS with custom theme:

```tsx
// Use predefined Tailwind classes
<div className="card">           {/* Styled card */}
<div className="btn-primary">    {/* Primary button */}
<div className="card-gradient">  {/* Gradient background */}
```

Tailwind config at: `frontend/tailwind.config.ts`

### Adding a New Page

1. Create file: `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Import Sidebar component
4. Build your page

Example:
```tsx
import { Sidebar } from '../components/Sidebar'

export default function NewPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Your content here */}
      </div>
    </div>
  )
}
```

## Backend Development

### Available Commands

```bash
python -m uvicorn app.main:app --reload   # Start dev server
python -m pytest                           # Run tests
python -m black app/                       # Format code
python -m flake8 app/                      # Lint code
```

### Project Structure (Backend)

- **app/main.py** - FastAPI app setup
- **app/api/** - Route handlers (one file per resource)
- **app/services/** - Business logic
  - `skill_engine.py` - Deterministic gap analysis
  - `ai_service.py` - Gemini AI integration
  - `resume_service.py` - Resume parsing
- **app/models/** - SQLAlchemy models (TODO)
- **app/schemas/** - Pydantic validation

### API Endpoints

All endpoints return JSON:

```bash
# Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

# Users
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/skills

# Analysis
POST   /api/analysis/create
GET    /api/analysis/{id}

# Careers
GET    /api/careers/
GET    /api/careers/{id}

# And more... (see README.md for full list)
```

Test endpoints with curl:
```bash
# Get all careers
curl http://localhost:8000/api/careers/

# Create analysis (requires token)
curl -X POST http://localhost:8000/api/analysis/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target_role_id": 1}'
```

Or use tools like:
- Postman (postman.com)
- Insomnia (insomnia.rest)
- Thunder Client (VS Code extension)

### Adding a New API Endpoint

1. Create route handler in `app/api/`:

```python
# app/api/example.py
from fastapi import APIRouter, Depends
from app.schemas import ExampleSchema

router = APIRouter(prefix="/api/example")

@router.get("/")
def get_example():
    return {"message": "Hello"}

@router.post("/")
def create_example(data: ExampleSchema):
    return {"created": data}
```

2. Include router in `app/main.py`:

```python
from app.api import example
app.include_router(example.router)
```

3. Test: `curl http://localhost:8000/api/example/`

## Database Setup (Supabase)

For local development with mock data, you don't need a real database. However, to connect to Supabase:

### Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Sign in
3. Create new project
4. Choose database password and region
5. Wait 2-3 minutes for setup

### Get Credentials

Go to **Settings > API**:
- Copy `Project URL` → `SUPABASE_URL`
- Copy `anon public` key → `SUPABASE_KEY`

### Create .env File

Create `backend/.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SECRET_KEY=your-secret-key-generate-one
GEMINI_API_KEY=your-gemini-key (optional)
```

**Note**: Never commit .env files! Use .env.example template.

### Load Schema

In Supabase dashboard, go to SQL Editor and run:
1. Copy contents of `database/schema.sql`
2. Paste and execute
3. Copy contents of `database/seed.sql`
4. Paste and execute

## Environment Variables

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

See: `frontend/.env.example`

### Backend (.env)

```
SECRET_KEY=generate-a-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
DEBUG=True
ENVIRONMENT=development
```

See: `backend/.env.example`

## Troubleshooting

### Frontend won't start

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start

```bash
# Ensure Python 3.9+
python --version

# Check virtual environment is active
# Should see (venv) in terminal prompt

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run again
python -m uvicorn app.main:app --reload
```

### Can't connect frontend to backend

1. Ensure backend is running on `http://localhost:8000`
2. Check `frontend/.env` has `VITE_API_BASE_URL=http://localhost:8000`
3. Open DevTools (F12) → Network tab
4. Try to login
5. See what URL the API request is going to
6. Should be `http://localhost:8000/api/...`

### CORS Error

Backend must allow frontend origin. Check `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev server
        "http://localhost:3000",  # Alternative
    ],
)
```

### Port Already in Use

Frontend default: 5173, Backend default: 8000

Change ports:
```bash
# Frontend (use different port)
npm run dev -- --port 5174

# Backend (use different port)
python -m uvicorn app.main:app --reload --port 8001
```

Then update `VITE_API_BASE_URL` in frontend .env.

## Git Workflow

### Push Your Changes

```bash
# See what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main
```

### Common Git Commands

```bash
git pull              # Get latest from GitHub
git log               # See commit history
git branch            # List branches
git checkout -b feat  # Create new branch
git merge feat        # Merge branch
```

## Hackathon Presentation Tips

### Demo Flow

1. **Landing Page** (30 sec)
   - Show hero section and features
   - Click "Get Started"

2. **Authentication** (30 sec)
   - Show login page
   - Use demo credentials or sign up

3. **Dashboard** (1 min)
   - Show readiness score
   - Highlight key stats
   - Explain mock data

4. **Skill Analysis** (1 min)
   - Show skill gaps with charts
   - Point out critical skills (red badges)
   - Show priority system

5. **Learning Roadmap** (1 min)
   - Expand different phases
   - Show learning objectives
   - Explain capstone projects

6. **Career Explorer** (30 sec)
   - Show 10 different roles
   - Click one to see requirements
   - Explain market demand

7. **Key Features** (1-2 min)
   - Explain AI skill extraction
   - Show progress tracking
   - Highlight personalization
   - Mention future roadmap

### Tips

- **Pre-test** before presenting (both frontend and backend running)
- **Use demo mode** if backend isn't available
- **Have laptop plugged in** (don't rely on battery)
- **Show mobile responsiveness** - many companies care
- **Explain the problem** - why SkillBridge AI is needed
- **Highlight AI integration** - judges love ML/AI
- **Mention scalability** - talk about 10K+ users
- **Be ready for questions** - know your architecture
- **Have GitHub link ready** - clean, well-documented repo
- **Prepare deployment link** - shows production-ready mindset

### Sample Pitch

```
"SkillBridge AI solves a critical problem: students and professionals 
spend 40% of their time learning wrong skills.

We analyze your resume with AI, compare against target careers, and 
generate personalized learning roadmaps that skip irrelevant content.

Our platform shows:
- Real-time readiness score for your target role
- Visualized skill gaps with priority levels
- AI-generated learning paths with capstone projects
- Progress tracking to stay motivated

We've built a full-stack application ready for 100K+ users with React, 
FastAPI, PostgreSQL, and Google AI.

Here's the demo..."
```

## Next Steps

1. ✅ Fork this repository
2. ✅ Clone locally and get running
3. ✅ Explore all the pages
4. ✅ Read ARCHITECTURE.md for design details
5. ✅ Read DEPLOYMENT.md for production setup
6. ✅ Add features (see TODO items in code)
7. ✅ Deploy to production
8. ✅ Share with friends/judges!

## Support

**Questions?**
- Check README.md for full API documentation
- See ARCHITECTURE.md for system design
- Review error messages in browser console or terminal
- Search existing GitHub issues

**Want to contribute?**
- Fork the repo
- Create feature branch: `git checkout -b feat/my-feature`
- Commit changes: `git commit -m "feat: add my feature"`
- Push: `git push origin feat/my-feature`
- Open Pull Request on GitHub

---

**Ready to build?** Start with `npm run dev` in the frontend folder! 🚀
