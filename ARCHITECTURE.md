# SkillBridge AI - Architecture & Design

Comprehensive documentation of the SkillBridge AI system architecture, components, and design decisions.

## System Overview

SkillBridge AI is a full-stack AI-powered skill gap analyzer that helps students and professionals identify skill gaps against target career roles and generates personalized learning roadmaps.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                      │
│              Vercel Deployment (skillbridge-ai.vercel.app)        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Landing    │  │  Dashboard   │  │  SkillGaps   │            │
│  │              │  │              │  │              │            │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │            │
│  │ │ signup   │ │  │ │ readiness│ │  │ │ Recharts │ │            │
│  │ │ login    │ │  │ │ stats    │ │  │ │ Visualize│ │            │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Roadmap     │  │Career Explorer│ │  Progress    │            │
│  │              │  │               │  │              │            │
│  │ ┌──────────┐ │  │ ┌──────────┐  │  │ ┌──────────┐ │            │
│  │ │ phases   │ │  │ │ 10 roles │  │  │ │ Timeline │ │            │
│  │ │ timeline │ │  │ │ details  │  │  │ │ progress │ │            │
│  │ └──────────┘ │  │ └──────────┘  │  │ └──────────┘ │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│                  Authentication Context + API Service             │
│              (JWT Tokens, Axios Interceptors, State Mgmt)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
                    API Layer (FastAPI)
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI/Python)                       │
│            Render Deployment (skillbridge-backend.render.com)     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Route Handlers (API Endpoints)              │    │
│  │  • /api/auth/* - Registration, login, token validation  │    │
│  │  • /api/users/* - Profile, preferences                  │    │
│  │  • /api/resume/* - Parse resume, extract skills        │    │
│  │  • /api/analysis/* - Run skill gap analysis            │    │
│  │  • /api/careers/* - Get career role data               │    │
│  │  • /api/roadmap/* - Generate learning roadmap          │    │
│  │  • /api/dashboard/* - Aggregate user stats             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                              ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Services Layer (Business Logic)               │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │      Skill Engine (Deterministic Analysis)      │   │    │
│  │  │  • calculate_gap() - Gap percentage            │   │    │
│  │  │  • get_priority() - Skill priority scoring     │   │    │
│  │  │  • calculate_readiness_score() - Overall score │   │    │
│  │  │  • estimate_learning_time() - Time estimates   │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │     AI Service (Gemini Integration)             │   │    │
│  │  │  • extract_skills_from_resume() - Resume parse │   │    │
│  │  │  • generate_learning_roadmap() - AI roadmap    │   │    │
│  │  │  • analyze_what_if() - Scenario planning       │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │    Resume Service (File Parsing)                │   │    │
│  │  │  • extract_text_from_pdf() - PyPDF2            │   │    │
│  │  │  • extract_text_from_docx() - python-docx      │   │    │
│  │  │  • extract_text_from_txt() - Plain text        │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                              ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Database Models & Schemas (SQLAlchemy)        │    │
│  │  • User, Skill, CareerRole, LearningRoadmap, etc.      │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                Database (Supabase PostgreSQL)                     │
│                   Database Layer                                  │
│                                                                   │
│  users │ skills │ career_roles │ user_skills │ skill_gaps       │
│  role_skills │ learning_roadmaps │ roadmap_items                │
│  progress │ resumes │ skill_assessments │ analysis_history       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            External Services (Third-Party APIs)                   │
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐          │
│  │   Google Gemini      │      │   Supabase Auth      │          │
│  │ (AI Skill Analysis)  │      │  (Optional - JWT)    │          │
│  └──────────────────────┘      └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Forms**: React Hook Form
- **State Management**: React Context API
- **HTTP Client**: Axios

### Folder Structure

```
frontend/
├── src/
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # React DOM render
│   ├── index.css               # Global styles
│   ├── pages/
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── Login.tsx           # Authentication
│   │   ├── Signup.tsx          # Registration
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── SkillAnalysis.tsx   # Resume upload & analysis
│   │   ├── SkillGaps.tsx       # Gap analysis charts
│   │   ├── Roadmap.tsx         # Learning roadmap
│   │   ├── CareerExplorer.tsx  # Browse career roles
│   │   ├── Progress.tsx        # Learning progress
│   │   ├── History.tsx         # Analysis history
│   │   ├── Profile.tsx         # User profile
│   │   └── Settings.tsx        # User settings
│   ├── components/
│   │   ├── Logo.tsx            # Logo SVG
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── ProtectedRoute.tsx  # Auth guard
│   │   ├── ReadinessScore.tsx  # Circular gauge
│   │   ├── SkillCard.tsx       # Reusable skill card
│   │   └── SkillsChart.tsx     # Chart component
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── services/
│   │   └── api.ts              # Axios API client
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind theme
├── postcss.config.js           # PostCSS plugins
└── tsconfig.json               # TypeScript config
```

### Key Components

#### AuthContext (State Management)

Manages global authentication state using React Context:

```typescript
// User is logged in → token stored in localStorage
// JWT interceptor auto-adds token to all API requests
// 401 response → redirects to /login
// useAuth hook → available everywhere
```

#### API Service (Axios)

Centralized API client with:
- Base URL configuration
- JWT token interceptor
- Consistent error handling
- Organized endpoint groups

#### ProtectedRoute Component

Guards authenticated pages:
```
User visits /dashboard
  ↓
Is user logged in? (check localStorage + token)
  ├─ Yes → Render page
  └─ No → Redirect to /login
```

## Backend Architecture

### Technology Stack

- **Framework**: FastAPI (Python 3.9+)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Authentication**: JWT (PyJWT)
- **AI**: Google Generative AI (Gemini)
- **Resume Parsing**: PyPDF2, python-docx
- **Database**: PostgreSQL (Supabase)

### API Routes

#### Authentication (`/api/auth`)
```
POST /register      - Create new account
POST /login         - Get JWT token
POST /logout        - Invalidate session
POST /refresh       - Refresh JWT token
```

#### Users (`/api/users`)
```
GET  /profile       - Get current user
PUT  /profile       - Update user info
POST /skills        - Add user skill
GET  /skills        - List user skills
DELETE /skills/:id  - Remove skill
```

#### Resume (`/api/resume`)
```
POST /upload        - Upload resume file
POST /extract       - Extract skills from resume
GET  /analysis      - Get resume analysis
```

#### Analysis (`/api/analysis`)
```
POST /create        - Create new analysis
GET  /:id           - Get analysis result
POST /compare       - Compare two analyses
DELETE /:id         - Delete analysis
```

#### Careers (`/api/careers`)
```
GET  /              - List all career roles
GET  /:id           - Get role details
GET  /:id/skills    - Get required skills
POST /filter        - Filter by criteria
```

#### Roadmap (`/api/roadmap`)
```
POST /generate      - Create roadmap
GET  /:id           - Get roadmap details
PUT  /:id           - Update roadmap
POST /:id/items     - Add roadmap item
POST /:id/progress  - Update progress
```

#### Dashboard (`/api/dashboard`)
```
GET  /stats         - User statistics
GET  /insights      - Learning insights
GET  /recommendations - Next steps
```

### Services Layer

#### 1. Skill Engine (Deterministic)

Pure Python algorithms for skill gap analysis:

```python
# Core Algorithm
gap_percentage = (required_level - current_level) / required_level * 100

# Priority Scoring
priority = critical if gap > 50% else (high if gap > 30% else medium)

# Readiness Calculation
readiness = sum(matched_skills * importance) / sum(total_skills * importance) * 100

# Learning Time Estimation
hours = gap_percentage * 10 / weekly_hours
```

**Advantages**:
- No external API dependencies
- Instant calculations
- Deterministic results
- Testable and transparent

#### 2. AI Service (Gemini)

Google Generative AI for intelligent analysis:

**Resume Extraction**:
```
User uploads resume
  ↓
Extract text (PDF/DOCX/TXT)
  ↓
Send to Gemini with prompt
  ↓
Parse JSON response
  ↓
Extract: skills, experience, education, certifications, projects
```

**Roadmap Generation**:
```
User selected target role + skills
  ↓
Send to Gemini with context
  ↓
Generate: phases, objectives, tasks, projects
  ↓
Return structured roadmap
```

#### 3. Resume Service

Parses multiple file formats:

```
PDF  → PyPDF2.extract_text()
DOCX → python-docx.Document().paragraphs
TXT  → open().read()
      ↓
Return combined text
```

### Database Schema (14 Tables)

#### Core Tables

**users**
- id (PK), email (UNIQUE), password_hash
- first_name, last_name, education
- experience_level, target_role_id (FK)
- weekly_study_hours, profile_picture_url
- created_at, updated_at, last_login

**skills**
- id (PK), name (UNIQUE), category, description
- difficulty_level, learning_hours_estimate

**career_roles**
- id (PK), name (UNIQUE), description
- average_salary, market_demand
- average_readiness_threshold

#### Relationship Tables

**role_skills** (M-to-M mapping)
- role_id (FK), skill_id (FK)
- importance, required_level, priority

**user_skills** (M-to-M mapping)
- user_id (FK), skill_id (FK)
- proficiency_level, current_level
- source (resume, manual, assessment)
- verified, verified_date

#### Analysis Tables

**learning_roadmaps**
- id (PK), user_id (FK), target_role_id (FK)
- readiness_score, estimated_total_weeks
- status, generated_at

**roadmap_items**
- id (PK), roadmap_id (FK), skill_id (FK)
- learning_objectives (array), practice_tasks (array)
- project_idea, status, completion_percentage

**skill_gaps**
- id (PK), user_id (FK), skill_id (FK)
- current_level, required_level, gap_percentage
- priority, estimated_learning_weeks

**progress**
- id (PK), user_id (FK), roadmap_item_id (FK)
- status (not_started, in_progress, completed)
- completion_percentage, completed_at

#### Supporting Tables

**resumes**
- id (PK), user_id (FK), file_url, extracted_text
- uploaded_at, expiration_date

**skill_assessments**
- id (PK), user_id (FK), skill_id (FK)
- assessment_score, assessment_date

**analysis_history**
- id (PK), user_id (FK), analysis_type
- input_data (JSON), results (JSON), created_at

## Authentication Flow

### Registration
```
User enters email + password
  ↓
Hash password (bcrypt)
  ↓
Create user in database
  ↓
Return: user_id, email
  ↓
User auto-logs in OR redirects to login
```

### Login
```
User enters email + password
  ↓
Lookup user in database
  ↓
Compare hash(password) == stored_hash?
  ├─ Match → Generate JWT token
  │          Return: access_token, token_type, user
  │          Store token in localStorage
  │          Redirect to dashboard
  └─ No Match → Return 401 Unauthorized
```

### Protected Requests
```
Frontend makes API call
  ↓
Axios interceptor adds header:
  Authorization: Bearer <JWT_TOKEN>
  ↓
Backend receives request
  ↓
Verify JWT signature & expiration
  ├─ Valid → Process request
  └─ Invalid/Expired → Return 401, frontend redirects to login
```

## Skill Gap Analysis Algorithm

### Phase 1: Data Collection
```
Resume → Extract text
   ↓
AI Service → Parse skills, experience, education
   ↓
User manual input → Enter missing skills
   ↓
Skill Database → Get proficiency levels
```

### Phase 2: Gap Calculation
```
Target Role Skills (from career_roles → role_skills)
User's Skills (from user_skills)
   ↓
For each role skill:
  current_level = user_skills.proficiency_level OR 0
  required_level = role_skills.required_level
  gap % = (required - current) / required * 100
```

### Phase 3: Priority Scoring
```
For each gap:
  IF gap% > 50% → CRITICAL (red badge)
  ELSE IF gap% > 30% → HIGH (orange)
  ELSE IF gap% > 10% → MEDIUM (yellow)
  ELSE → LOW (green)
  
  Also consider:
  - skill.importance (weight in role)
  - user.experience_level (learning curve)
  - skill.learning_hours_estimate (time to learn)
```

### Phase 4: Readiness Score
```
matched_skills = count(user_skills where in role_skills)
total_skills = count(role_skills)

weighted_achieved = SUM(user_skill.level * role_skill.importance)
weighted_required = SUM(required_level * importance)

readiness_score = (weighted_achieved / weighted_required) * 100

Labels:
  90-100% → "Highly Ready" 🟢
  75-89%  → "Job Ready" 🟢
  60-74%  → "Intermediate" 🟡
  40-59%  → "Developing" 🟠
  0-39%   → "Beginner" 🔴
```

### Phase 5: Roadmap Generation
```
Prioritized gaps (sorted by priority)
   ↓
Group by skill category
   ↓
Create phases (1-5 weeks per phase typically)
   ↓
For each phase:
  - Learning objectives (from AI or templates)
  - Practice tasks (resources, exercises)
  - Capstone project (hands-on application)
   ↓
Generate timeline (estimated_weeks * weekly_hours)
```

## Design Patterns Used

### 1. Service Layer Pattern
Business logic separated from API routes:
```
Route Handler → Service → Database
```

### 2. Repository Pattern (SQLAlchemy)
ORM abstracts database operations:
```
Models.skill.query.filter()
```

### 3. Dependency Injection
FastAPI dependencies for middleware:
```
@app.get("/protected")
def protected(current_user = Depends(get_current_user)):
```

### 4. DTO (Data Transfer Object)
Pydantic schemas for request/response validation:
```python
class SkillResponse(BaseModel):
    id: int
    name: str
    level: float
```

### 5. Adapter Pattern
Resume service adapts multiple formats to unified output.

## Security Architecture

### Frontend Security
- JWT tokens stored in localStorage (XSS vulnerable - could use httpOnly cookies)
- Axios interceptor adds token to requests
- ProtectedRoute checks authentication before rendering
- HTTPS enforced in production

### Backend Security
- Password hashed with bcrypt
- JWT token validation on every request
- CORS configured to allow only frontend domain
- SQL injection prevented by SQLAlchemy ORM
- Rate limiting on auth endpoints (TODO)
- Input validation with Pydantic

### Database Security
- Passwords never stored in plaintext
- Supabase handles encryption at rest
- Row-level security policies (TODO)
- Audit logging for sensitive operations (TODO)

## Performance Optimizations

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Recharts handles large datasets efficiently
- Tailwind CSS + PostCSS (minimal bundle)
- Vite provides fast HMR during development

### Backend
- Database indexes on frequently queried fields
- Connection pooling with SQLAlchemy
- Caching with Redis (TODO)
- Pagination for large result sets (TODO)
- Async operations with FastAPI

### Database
- Composite indexes on (user_id, role_id, skill_id)
- Foreign key relationships for referential integrity
- Partitioning large tables (TODO)

## Testing Strategy

### Frontend Tests (TODO)
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress
- Visual regression tests

### Backend Tests (TODO)
- Unit tests with pytest
- Integration tests for API routes
- Database migration tests
- Load testing with locust

## Deployment Strategy

### Development
```
Local frontend: http://localhost:5173
Local backend: http://localhost:8000
Local database: PostgreSQL in Docker (or Supabase dev)
```

### Staging
```
Frontend: Vercel Preview Deployment
Backend: Render Preview Deployment
Database: Supabase Staging
```

### Production
```
Frontend: Vercel Production (skillbridge-ai.vercel.app)
Backend: Render Production (skillbridge-backend.onrender.com)
Database: Supabase Production
DNS: Custom domain (skillbridge.ai)
```

### CI/CD Pipeline (TODO)
```
GitHub Push
  ↓
GitHub Actions
  ↓
├─ Run linter
├─ Run tests
├─ Build frontend
├─ Build backend
├─ Deploy to staging
├─ Run E2E tests
└─ Deploy to production (on main branch)
```

## Monitoring & Observability

### Logging
- Backend: Python logging to stdout (Render captures)
- Frontend: Browser console + Sentry (TODO)
- Database: Supabase logs

### Metrics (TODO)
- Request latency
- Error rates
- User session duration
- API endpoint usage

### Alerts (TODO)
- Backend downtime
- Error spike detection
- Database connection issues
- API rate limit exceeded

## Future Enhancements

### Short Term
- [ ] Complete resume upload UI
- [ ] Onboarding wizard (5-step flow)
- [ ] Demo mode with pre-loaded data
- [ ] Email notifications

### Medium Term
- [ ] Mobile app (React Native)
- [ ] Video course recommendations
- [ ] Interview preparation
- [ ] Job matching engine
- [ ] Peer learning groups

### Long Term
- [ ] ML-based personalization
- [ ] Blockchain certificates
- [ ] Career marketplace
- [ ] Company partnerships
- [ ] API for third-party integrations

---

**For deployment instructions, see DEPLOYMENT.md**
**For API documentation, see README.md**
