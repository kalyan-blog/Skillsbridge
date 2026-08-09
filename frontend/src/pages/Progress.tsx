import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { progressAPI } from '../services/api'

export default function Progress() {
  const [readinessHistory, setReadinessHistory] = useState([
    { date: 'Start', score: 45 },
    { date: 'Now', score: 0 },
  ])

  const [skillProgress, setSkillProgress] = useState<{ skill: string; before: number; current: number }[]>([])
  const [milestones, setMilestones] = useState<{ date: string; milestone: string; completed: boolean }[]>([])
  const [summary, setSummary] = useState({
    improvement: 0,
    streakDays: 0,
    hoursStudied: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await progressAPI.get()
        const p = res.data

        setReadinessHistory(
          p.readiness_history && p.readiness_history.length
            ? p.readiness_history.map((h: any) => ({ date: h.date, score: h.score }))
            : [{ date: 'Start', score: 0 }, { date: 'Now', score: p.current_readiness }]
        )

        setSkillProgress(
          (p.skill_progress || []).map((s: any) => ({
            skill: s.skill_name,
            before: s.before ?? 0,
            current: s.current,
          }))
        )

        setMilestones(
          (p.milestones || []).map((m: any) => ({
            date: m.date,
            milestone: m.milestone,
            completed: m.completed,
          }))
        )

        setSummary({
          improvement: p.improvement,
          streakDays: 0,
          hoursStudied: p.hours_studied ?? 0,
          coursesCompleted: p.courses_completed ?? 0,
          coursesInProgress: p.courses_in_progress ?? 0,
        })
      } catch (err) {
        // Keep defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
              <p className="text-3xl font-bold mt-2">+{summary.improvement}%</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Courses Completed</p>
              <p className="text-3xl font-bold mt-2">{summary.coursesCompleted}</p>
              <p className="text-xs text-slate-600 mt-1">{summary.coursesInProgress} in progress</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Hours Studied</p>
              <p className="text-3xl font-bold mt-2">{summary.hoursStudied}</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Roadmap Items</p>
              <p className="text-3xl font-bold mt-2">{summary.coursesCompleted + summary.coursesInProgress}</p>
            </div>
          </div>

          {/* Readiness Score Trend */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">📊 Readiness Score Trend</h2>
            {loading ? (
              <p className="text-slate-600 py-8 text-center">Loading...</p>
            ) : (
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
            )}
          </div>

          {/* Skill Improvement */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">🚀 Skill Improvements</h2>
            {skillProgress.length === 0 ? (
              <p className="text-slate-600 py-8 text-center">
                Add skills and run an analysis to see your improvement here.
              </p>
            ) : (
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
                      +{Math.max(0, skill.current - skill.before)} points improvement
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="card">
            <h2 className="font-bold text-lg mb-6">🏆 Milestones & Achievements</h2>
            {milestones.length === 0 ? (
              <p className="text-slate-600 py-8 text-center">No milestones yet. Keep learning!</p>
            ) : (
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
            )}
          </div>

          {/* Encouragement */}
          <div className="card-gradient mt-8 p-8 text-center rounded-2xl border-2 border-blue-300">
            <h2 className="text-2xl font-bold mb-2">🎉 Great Progress!</h2>
            <p className="text-slate-700 mb-6">
              Keep up the momentum and you'll reach your goal soon.
            </p>
            <a href="/roadmap" className="inline-block btn-primary">
              Continue Your Learning →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
