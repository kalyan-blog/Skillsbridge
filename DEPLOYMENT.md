# SkillBridge AI - Deployment Guide

This guide explains how to deploy SkillBridge AI to production on Vercel (frontend), Render (backend), and Supabase (database).

## Prerequisites

- GitHub account (for connecting repositories)
- Vercel account (vercel.com)
- Render account (render.com)
- Supabase account (supabase.com)
- Google Cloud account (for Gemini API key)

## Step 1: Database Setup (Supabase)

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose your organization
4. Project name: `skillbridge-ai`
5. Database password: Create a strong password
6. Region: Choose closest to your users
7. Click "Create new project"

### Execute Schema

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy contents of `database/schema.sql`
4. Paste into the editor and run
5. Copy contents of `database/seed.sql`
6. Paste and run

### Get Credentials

1. Go to Settings > API
2. Copy `Project URL` → `SUPABASE_URL`
3. Copy `anon public` key → `SUPABASE_KEY`
4. Copy `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

Save these - you'll need them for backend deployment.

## Step 2: Backend Deployment (Render)

### Prepare Repository

1. Create GitHub repo: `skillbridge-ai`
2. Push code:
   ```bash
   cd skillbridge
   git remote add origin https://github.com/YOUR_USERNAME/skillbridge-ai.git
   git branch -M main
   git push -u origin main
   ```

### Create Render Service

1. Go to https://render.com
2. Click "New +" > "Web Service"
3. Connect GitHub account and select your repo
4. Configure:
   - **Name**: `skillbridge-backend`
   - **Environment**: `Python 3.9`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0`
   - **Instance Type**: Free (or Starter for production)

### Add Environment Variables

In Render dashboard, go to Environment:

```
SECRET_KEY=generate-a-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
DEBUG=False
ENVIRONMENT=production
```

Generate a random SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and add to Render environment

### Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://skillbridge-backend.onrender.com`

**Note**: Free tier sleeps after 15 minutes of inactivity. Use Starter plan ($7/month) for production.

## Step 3: Frontend Deployment (Vercel)

### Prepare Frontend

1. Update `frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://skillbridge-backend.onrender.com
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Push to GitHub (same repo as backend)

### Create Vercel Deployment

1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Add Environment Variables

1. Go to Settings > Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL=https://skillbridge-backend.onrender.com
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Deploy

1. Click "Deploy"
2. Wait for deployment
3. Your frontend URL will be: `https://skillbridge-ai.vercel.app`

## Step 4: Connect Everything

### Update CORS in Backend

If your frontend and backend domains are different, update `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skillbridge-ai.vercel.app",
        "http://localhost:5173",  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Test Connection

1. Go to your frontend URL
2. Try to sign up or login
3. Check browser Network tab for API calls
4. Verify data flows to/from backend

## Monitoring & Debugging

### Render Logs

1. Go to your Render service
2. Click "Logs" tab
3. View real-time application logs

### Vercel Analytics

1. Go to your Vercel project
2. Check Analytics tab for performance metrics
3. View errors in Error Tracking

### Supabase Logs

1. Go to Supabase dashboard
2. Check Database > Query Performance
3. View API activity in Logs

## Scaling for Production

### Backend (Render)

- **Free Tier**: Good for testing, sleeps after inactivity
- **Starter Tier** ($7/month): Always running, 512MB RAM
- **Standard Tier** ($25/month+): Better for load

### Frontend (Vercel)

- **Free**: Sufficient for most projects
- **Pro** ($20/month): More analytics and support

### Database (Supabase)

- **Free Tier**: Good for up to 500MB
- **Pro** ($25/month): Up to 8GB and better support

## Custom Domain

### Add Domain to Vercel

1. In Vercel project settings, go to Domains
2. Add your domain (e.g., skillbridge.ai)
3. Update DNS records with Vercel's provided values
4. Wait for DNS propagation (can take 24-48 hours)

### Add Domain to Render (Backend)

1. Similar process in Render dashboard
2. Create custom domain for backend
3. Update frontend env vars with new URL

## Security Checklist

- [ ] Change `SECRET_KEY` to a random value
- [ ] Set `DEBUG=False` in production
- [ ] Use HTTPS for all connections
- [ ] Enable 2FA on all accounts
- [ ] Rotate API keys regularly
- [ ] Monitor logs for suspicious activity
- [ ] Set up rate limiting on API
- [ ] Use environment variables, never commit secrets
- [ ] Enable CORS properly (not `*`)
- [ ] Update dependencies regularly

## Continuous Deployment

Both Vercel and Render support automatic deployments:

1. Push to main branch
2. GitHub webhook triggers build
3. Automatic deployment to production
4. Takes 2-5 minutes typically

To disable, go to Settings > Deployments and toggle Auto-Deploy.

## Troubleshooting

### Backend Won't Start

- Check Render logs for error messages
- Verify all environment variables are set
- Ensure `requirements.txt` has all dependencies
- Test locally: `python -m uvicorn app.main:app --reload`

### Frontend Not Connecting to Backend

- Check browser console (F12 > Console tab)
- Verify `VITE_API_BASE_URL` is correct
- Check CORS is enabled in backend
- Make sure backend is running

### Database Connection Issues

- Verify `SUPABASE_URL` and keys are correct
- Test connection string in `psql` or db tool
- Check IP whitelist in Supabase (should be open)
- Verify schema was created successfully

### Slow Performance

- Check Render instance type (may need upgrade)
- Monitor Supabase connection pool
- Enable caching in frontend
- Use CDN for static assets

## Cost Estimation (Monthly)

- **Render Backend**: $7-25 (Starter+ recommended)
- **Vercel Frontend**: $0 (free tier usually sufficient)
- **Supabase Database**: $0-25 (free tier good for MVP)
- **Domain**: $12-15 (registrar dependent)

**Minimum for MVP**: ~$20-30/month

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Vite Docs](https://vitejs.dev)

---

**Questions?** Check the main README.md or create an issue on GitHub.
