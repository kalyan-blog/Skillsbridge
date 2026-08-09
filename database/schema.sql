-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  education VARCHAR,
  experience_level VARCHAR,
  target_role VARCHAR,
  weekly_study_hours INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Career roles table
CREATE TABLE career_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  average_readiness_threshold INTEGER DEFAULT 75,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Role skills mapping (skills required for each role)
CREATE TABLE role_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES career_roles(id),
  skill_id UUID REFERENCES skills(id),
  importance INTEGER (1-5 scale),
  required_level INTEGER (0-4 scale),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, skill_id)
);

-- User skills (what skills a user has)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  proficiency INTEGER (0-100),
  current_level INTEGER (0-4),
  source VARCHAR ('resume', 'manual', 'assessment'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  filename VARCHAR,
  text_content TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Skill gaps table
CREATE TABLE skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  current_level INTEGER,
  required_level INTEGER,
  gap_percentage INTEGER,
  priority VARCHAR ('critical', 'high', 'medium', 'low'),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Skill gap analysis results
CREATE TABLE skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_role_id UUID REFERENCES career_roles(id),
  readiness_score INTEGER,
  analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Learning roadmaps
CREATE TABLE learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_role_id UUID REFERENCES career_roles(id),
  readiness_score INTEGER,
  estimated_total_weeks INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roadmap items (phases in the roadmap)
CREATE TABLE roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES learning_roadmaps(id),
  skill_id UUID REFERENCES skills(id),
  phase INTEGER,
  estimated_duration_weeks INTEGER,
  learning_objectives TEXT[],
  practice_tasks TEXT[],
  project_idea TEXT,
  status VARCHAR ('not_started', 'in_progress', 'completed'),
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress on roadmap items
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  roadmap_item_id UUID REFERENCES roadmap_items(id),
  status VARCHAR ('not_started', 'in_progress', 'completed'),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analysis history
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_role_id UUID REFERENCES career_roles(id),
  readiness_score INTEGER,
  skill_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_skill_gaps_user_id ON skill_gaps(user_id);
CREATE INDEX idx_learning_roadmaps_user_id ON learning_roadmaps(user_id);
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
