import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { ReadinessScore } from '../components/ReadinessScore'
import { SkillsChart } from '../components/SkillsChart'
import { SkillCard } from '../components/SkillCard'
import { Link } from 'react-router-dom'
import { TrendingUp, Zap, Target, Award } from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock data - in production, fetch from API
  const dashboardData = {
    firstName: 'Alex',
    targetRole: 'Data Scientist',
    readinessScore: 78,
    readinessLabel: 'Job Ready',
    totalSkills: 18,
    matchedSkills: 12,
    learningProgress: 64,
    estimatedWeeks: 12,
  }

  const strongSkills = [
    { name: 'Python', level: 90, icon: '🐍' },
    { name: 'SQL', level: 82, icon: '💾' },
    { name: 'Pandas', level: 85, icon: '📊' },
    { name: 'Git', level: 75, icon: '🔧' },
  ]

  const skillsToImprove = [
    { name: 'Machine Learning', level: 40, priority: 'critical' },
    { name: 'Statistics', level: 45, priority: 'critical' },
    { name: 'Power BI', level: 25, priority: 'high' },
    { name: 'Deep Learning', level: 20, priority: 'high' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴'
      case 'high':
        return '🟠'
      case 'medium':
        return '🟡'
      default:
        return '🟢'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - would import actual Sidebar component */}
      <div className="hidden md:block w-64 bg-white border-r border-slate-200 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary text-white font-bold">
              SB
            </div>
            <p className="text-sm font-semibold mt-2">SkillBridge</p>
          </div>

          <nav className="space-y-3">
            <Link to="/dashboard" className="block px-4 py-2 rounded-lg bg-violet-100 text-violet-700 font-medium">
              Dashboard
            </Link>
            <Link to="/skill-gaps" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
              Skill Gaps
            </Link>
            <Link to="/roadmap" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
              Learning Roadmap
            </Link>
            <Link to="/career-explorer" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
              Career Explorer
            </Link>
            <Link to="/progress" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
              Progress
            </Link>
            <Link to="/profile" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
              Profile
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Good morning, {dashboardData.firstName} 👋
            </h1>
            <p className="text-slate-600">
              Track your progress toward becoming a {dashboardData.targetRole}
            </p>
          </div>

          {/* Main Stats Card */}
          <div className="card-gradient mb-8 p-8 rounded-2xl border-2 border-blue-300">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Target Role</p>
                <p className="text-2xl font-bold text-slate-900">{dashboardData.targetRole}</p>
              </div>

              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Current Readiness</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {dashboardData.readinessScore}%
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {dashboardData.readinessLabel}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Estimated Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {dashboardData.estimatedWeeks} weeks
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Overall Progress</p>
              <div className="w-full h-4 bg-white rounded-full overflow-hidden border-2 border-blue-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-500"
                  style={{ width: `${dashboardData.readinessScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Target,
                label: 'Skills Matched',
                value: dashboardData.matchedSkills,
                total: dashboardData.totalSkills,
              },
              {
                icon: TrendingUp,
                label: 'Learning Progress',
                value: dashboardData.learningProgress,
                total: 100,
              },
              { icon: Award, label: 'Certifications', value: 2, total: 5 },
              { icon: Zap, label: 'Streak Days', value: 12, total: 365 },
            ].map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <div key={i} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">of {stat.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-primary/10">
                      <StatIcon className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main Charts Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Strong Skills */}
            <div className="lg:col-span-2 card">
              <h2 className="font-bold text-lg mb-6">Your Strong Skills</h2>
              <div className="space-y-4">
                {strongSkills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium flex items-center gap-2">
                        <span>{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="font-bold text-violet-600">{skill.level}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Readiness Gauge */}
            <div className="card flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(dashboardData.readinessScore / 100) * 283} 283`}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{dashboardData.readinessScore}%</p>
                    <p className="text-xs text-slate-500">Ready</p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-green-600">
                ✓ {dashboardData.readinessLabel}
              </p>
            </div>
          </div>

          {/* Skills to Improve */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">Priority Skills to Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {skillsToImprove.map((skill, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-slate-200 hover:border-violet-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getPriorityIcon(skill.priority)}</span>
                        <h3 className="font-semibold">{skill.name}</h3>
                      </div>
                      <p className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(skill.priority)}`}>
                        {skill.priority.charAt(0).toUpperCase() + skill.priority.slice(1)} Priority
                      </p>
                    </div>
                    <span className="font-bold text-slate-600">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/roadmap" className="card hover:shadow-lg transition-shadow cursor-pointer block p-6">
              <h3 className="font-bold text-lg mb-2">📚 View Your Roadmap</h3>
              <p className="text-slate-600 text-sm mb-4">
                See your personalized learning path with phases and milestones
              </p>
              <span className="text-violet-600 font-semibold">Start Learning →</span>
            </Link>

            <Link to="/skill-gaps" className="card hover:shadow-lg transition-shadow cursor-pointer block p-6">
              <h3 className="font-bold text-lg mb-2">📊 Detailed Analysis</h3>
              <p className="text-slate-600 text-sm mb-4">
                View comprehensive skill gap breakdown with recommendations
              </p>
              <span className="text-violet-600 font-semibold">View Details →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
