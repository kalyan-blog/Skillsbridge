import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Progress() {
  // Mock data
  const readinessHistory = [
    { date: 'Jan 1', score: 45 },
    { date: 'Jan 8', score: 48 },
    { date: 'Jan 15', score: 52 },
    { date: 'Jan 22', score: 58 },
    { date: 'Jan 29', score: 62 },
    { date: 'Feb 5', score: 68 },
    { date: 'Feb 12', score: 72 },
    { date: 'Feb 19', score: 76 },
    { date: 'Feb 26', score: 78 },
  ]

  const skillProgress = [
    { skill: 'Python', before: 80, current: 90 },
    { skill: 'SQL', before: 70, current: 82 },
    { skill: 'Statistics', before: 20, current: 45 },
    { skill: 'Pandas', before: 60, current: 85 },
    { skill: 'Git', before: 50, current: 75 },
  ]

  const milestones = [
    { date: 'Feb 20', milestone: 'Completed Python Basics Course', completed: true },
    { date: 'Feb 15', milestone: 'Scored 85% on Statistics Quiz', completed: true },
    { date: 'Feb 10', milestone: 'First Pandas Mini-Project', completed: true },
    { date: 'Feb 5', milestone: 'Started Machine Learning Course', completed: true },
    { date: 'Feb 1', milestone: 'Joined SkillBridge AI', completed: true },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">✅ Your Progress</h1>
            <p className="text-slate-600">
              Track your learning journey and celebrate your achievements
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-slate-600 text-sm">Readiness Improvement</p>
              <p className="text-3xl font-bold mt-2">+33%</p>
              <p className="text-xs text-green-600 mt-1">↑ From 45% to 78%</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Study Streak</p>
              <p className="text-3xl font-bold mt-2">27 days</p>
              <p className="text-xs text-green-600 mt-1">🔥 Keep it up!</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Hours Studied</p>
              <p className="text-3xl font-bold mt-2">156 hrs</p>
              <p className="text-xs text-slate-600 mt-1">This month: 42 hrs</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Courses Completed</p>
              <p className="text-3xl font-bold mt-2">3</p>
              <p className="text-xs text-slate-600 mt-1">2 in progress</p>
            </div>
          </div>

          {/* Readiness Score Trend */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">📊 Readiness Score Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={readinessHistory}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Improvement */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">🚀 Skill Improvements</h2>
            <div className="space-y-6">
              {skillProgress.map((skill, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{skill.skill}</h4>
                    <div className="text-sm">
                      <span className="text-slate-600">{skill.before}%</span>
                      <span className="text-slate-400 mx-2">→</span>
                      <span className="font-bold text-green-600">{skill.current}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400"
                        style={{ width: `${skill.before}%` }}
                      />
                    </div>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${skill.current}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    +{skill.current - skill.before} points improvement
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="card">
            <h2 className="font-bold text-lg mb-6">🏆 Milestones & Achievements</h2>
            <div className="space-y-4">
              {milestones.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                  <div className="flex-shrink-0 mt-1">
                    {item.completed ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-lg">✓</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-lg">○</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.milestone}</p>
                    <p className="text-sm text-slate-600">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className="card-gradient mt-8 p-8 text-center rounded-2xl border-2 border-blue-300">
            <h2 className="text-2xl font-bold mb-2">🎉 Great Progress!</h2>
            <p className="text-slate-700 mb-6">
              You've improved your readiness score by 33%! Keep up the momentum and you'll reach your goal soon.
            </p>
            <button className="btn-primary">
              Continue Your Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
