export interface User {
  id: string
  email: string
  full_name: string
  education: string
  experience_level: string
  target_role: string | null
  weekly_study_hours: number | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
  level?: number // 0-4: Beginner to Expert
  proficiency?: number // 0-100
  importance?: number
}

export interface CareerRole {
  id: string
  name: string
  description: string
  average_readiness_threshold: number
  created_at: string
  skills?: Skill[]
}

export interface SkillGap {
  id: string
  user_id: string
  skill_id: string
  skill: Skill
  current_level: number
  required_level: number
  gap_percentage: number
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface SkillAssessment {
  skill_id: string
  current_level: number
  proficiency: number
  source: 'resume' | 'manual' | 'assessment'
}

export interface SkillGapAnalysis {
  id: string
  user_id: string
  target_role_id: string
  readiness_score: number
  strong_skills: Skill[]
  missing_skills: SkillGap[]
  analyzed_at: string
}

export interface RoadmapItem {
  id: string
  roadmap_id: string
  skill_id: string
  skill: Skill
  phase: number
  estimated_duration_weeks: number
  learning_objectives: string[]
  practice_tasks: string[]
  project_idea: string
  status: 'not_started' | 'in_progress' | 'completed'
  position: number
}

export interface LearningRoadmap {
  id: string
  user_id: string
  target_role_id: string
  readiness_score: number
  estimated_total_weeks: number
  items: RoadmapItem[]
  created_at: string
  updated_at: string
}

export interface AnalysisHistory {
  id: string
  user_id: string
  target_role_id: string
  target_role: CareerRole
  readiness_score: number
  created_at: string
  skill_count: number
}

export interface ResumeAnalysisResult {
  skills: {
    name: string
    confidence: number
    estimated_level: number
    category: string
  }[]
  experience: string[]
  education: string[]
  certifications: string[]
  projects: string[]
}
