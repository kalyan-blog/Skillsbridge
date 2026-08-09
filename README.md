# SkillBridge AI 🚀

> AI-powered skill gap analysis and personalized career roadmap platform.

**Know where you are. See where you need to go. Build the skills to get there.**

## 🎯 Problem

Students and fresh graduates often apply for jobs without knowing whether their current skills match what's actually required. They struggle with:

- What skills do I already have?
- What am I missing?
- How strong am I in each skill?
- Which skills should I learn first?
- How does my resume compare to my target role?
- What should I study to become job-ready?
- How long might my learning journey take?

## 💡 Solution

SkillBridge AI analyzes your skills and resume against 50+ career roles and generates:

1. **Skill Gap Analysis** - See exactly which skills you have and which you need
2. **Readiness Score** - Get a clear percentage of how ready you are (0-100%)
3. **Personalized Roadmap** - Learn skills in the right order based on priority
4. **Progress Tracking** - Track your learning journey
5. **What-If Analysis** - See how your score changes if you learn specific skills

## ✨ Features

### For Job Seekers
- 📄 Upload resume (PDF, DOCX, TXT)
- 🤖 AI-powered skill extraction
- 🎯 50+ supported career roles
- 📊 Visual skill gap dashboard
- 🗺️ Personalized learning roadmap
- 📈 Progress tracking
- 🔄 Multiple analysis comparison
- ❓ "What-If" scenario analysis

### Technical Highlights
- ✅ Full-stack application (React + FastAPI)
- ✅ AI-powered analysis (Google Gemini API)
- ✅ Deterministic skill gap engine
- ✅ Beautiful modern UI
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Secure authentication
- ✅ Production-ready code

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hook Form** - Form management

### Backend
- **FastAPI** - Web framework
- **Python 3.9+** - Language
- **Pydantic** - Data validation
- **SQLAlchemy** - ORM
- **Google Gemini API** - AI model
- **JWT** - Authentication

### Database
- **Supabase PostgreSQL** - Relational database

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase Cloud

## 📋 Supported Career Roles

1. Data Scientist
2. Data Analyst
3. Machine Learning Engineer
4. AI Engineer
5. Full Stack Developer
6. Frontend Developer
7. Backend Developer
8. Software Engineer
9. Cloud Engineer
10. Cybersecurity Analyst

(More roles can be added easily)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Supabase account
- Google Gemini API key

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your values
python -m uvicorn app.main:app --reload
```

Backend runs on: `http://localhost:8000`

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Execute `database/schema.sql` in Supabase SQL editor
3. Execute `database/seed.sql` to populate sample data
4. Copy your Supabase URL and key to `.env` files

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `POST /api/users/me/skills` - Add user skills

### Resume
- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/{id}/analyze` - Analyze resume

### Analysis
- `POST /api/analysis` - Create new analysis
- `GET /api/analysis/latest` - Get latest analysis
- `GET /api/analysis/history` - Get all analyses
- `GET /api/analysis/{id}` - Get specific analysis

### Careers
- `GET /api/careers` - Get all career roles
- `GET /api/careers/{id}` - Get career details
- `GET /api/careers/{id}/skills` - Get required skills

### Roadmap
- `POST /api/roadmap/generate` - Generate roadmap
- `GET /api/roadmap` - Get current roadmap
- `PATCH /api/roadmap/items/{id}` - Update item status

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/readiness` - Readiness score

## 📖 Project Structure

```
skillbridge-ai/
├── frontend/                 # React Vite app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Context providers
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities
│   └── package.json
│
├── backend/                  # FastAPI app
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── database/       # DB connection
│   │   ├── config.py       # Configuration
│   │   └── main.py         # App entry point
│   └── requirements.txt
│
├── database/               # Database files
│   ├── schema.sql         # Table definitions
│   └── seed.sql           # Sample data
│
└── README.md
```

## 🔐 Security

- All environment variables stored in `.env` (never committed)
- JWT authentication with secure tokens
- Password hashing with bcrypt
- API request validation with Pydantic
- CORS properly configured
- Input sanitization
- Rate limiting ready

## 📊 Skill Gap Engine

The engine uses a deterministic algorithm:

```
Gap Score = (Required Level - Current Level) / Required Level × 100

Priority = Based on:
  - Gap percentage (0-100%)
  - Skill importance (1-5)
  - Role relevance
  
Readiness Score = Weighted Skills Match / Total Weighted Requirements × 100
```

## 🤖 AI Features

### Resume Analysis
Extracts using Google Gemini AI:
- Programming languages
- Frameworks and tools
- Years of experience
- Education and certifications
- Projects and accomplishments

### Roadmap Generation
AI creates personalized roadmaps based on:
- Current skill level
- Target role requirements
- Weekly available time
- Experience level
- Skill importance and priority

### What-If Analysis
Simulates career readiness if you learn specific skills

## 🎨 Design System

### Colors
- **Primary**: Violet (#7c3aed)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Pink (#ec4899)
- **Indigo**: #4f46e5

### Components
- Cards with hover effects
- Gradient buttons
- Progress indicators
- Skill badges
- Empty states
- Loading states
- Toast notifications

## 📱 Responsive Design

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1280px+)

## 🧪 Testing

Run backend tests:
```bash
cd backend
pytest
```

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Auto-deploys on push to main
```

### Backend (Render)
```bash
# Connect GitHub repo to Render
# Set environment variables
# Set start command: uvicorn app.main:app --host 0.0.0.0
# Auto-deploys on push to main
```

### Database (Supabase Cloud)
- Already deployed and managed
- Set connection string in backend .env

## 🔮 Future Improvements

- [ ] Integration with online courses (Udemy, Coursera)
- [ ] Skill assessment quizzes
- [ ] Real-time collaboration features
- [ ] Mobile app
- [ ] Slack/Discord integration
- [ ] Job recommendations
- [ ] Salary insights
- [ ] Mentor matching
- [ ] GitHub profile analysis
- [ ] More career roles (100+)
- [ ] Multi-language support
- [ ] Social features and communities

## 📄 License

MIT License - feel free to use this for your hackathon!

## 👥 Team

Built for the SkillBridge AI hackathon project

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with details
3. Join our community Discord

---

**Made with ❤️ by SkillBridge AI Team**

**Tagline**: *Bridge the gap between your skills and your dream career.*
