import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { analysisAPI } from '../services/api'

export default function SkillGaps() {
  const [skillGaps, setSkillGaps] = useState([
    { skill: 'Machine Learning', current: 2, required: 4, gap: 50 },
    { skill: 'Deep Learning', current: 1, required: 3, gap: 67 },
    { skill: 'Statistics', current: 2, required: 4, gap: 50 },
    { skill: 'Power BI', current: 1, required: 3, gap: 67 },
  ])

  const [radarData, setRadarData] = useState([
    { category: 'Python', current: 90, required: 100 },
    { category: 'SQL', current: 82, required: 100 },
    { category: 'Statistics', current: 45, required: 90 },
    { category: 'ML', current: 40, required: 85 },
    { category: 'Visualization', current: 50, required: 80 },
    { category: 'Git', current: 75, required: 85 },
  ])

  const [criticalGaps, setCriticalGaps] = useState([
    {
      skill: 'Machine Learning',
      current: 'Beginner',
      required: 'Advanced',
      priority: 'Critical',
      timeToLearn: '8 weeks',
    },
    {
      skill: 'Deep Learning',
      current: 'None',
      required: 'Intermediate',
      priority: 'High',
      timeToLearn: '12 weeks',
    },
    {
      skill: 'Statistical Analysis',
      current: 'Intermediate',
      required: 'Advanced',
      priority: 'High',
      timeToLearn: '6 weeks',
    },
  ])

  const [stats, setStats] = useState({ total: 18, matched: 12, gaps: 6 })

  const levelLabels: Record<number, string> = {
    0: 'None',
    1: 'Beginner',
    2: 'Basic',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analysisAPI.getLatest()
        const a = res.data

        setStats({
          total: a.total_skills,
          matched: a.matched_skills,
          gaps: a.missing_skills.length,
        })

        if (a.missing_skills?.length) {
          const barData = a.missing_skills.slice(0, 8).map((g: any) => ({
            skill: g.skill_name,
            current: g.current_level,
            required: g.required_level,
            gap: g.gap_percentage,
          }))
          setSkillGaps(barData)

          const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
          const sorted = [...a.missing_skills].sort(
            (x: any, y: any) => (priorityOrder[x.priority] ?? 4) - (priorityOrder[y.priority] ?? 4)
          )
          setCriticalGaps(
            sorted.slice(0, 5).map((g: any) => ({
              skill: g.skill_name,
              current: levelLabels[g.current_level] ?? String(g.current_level),
              required: levelLabels[g.required_level] ?? String(g.required_level),
              priority: g.priority.charAt(0).toUpperCase() + g.priority.slice(1),
              timeToLearn: `${Math.max(1, Math.round(g.gap_percentage / 12))} weeks`,
            }))
          )

          const radar: any[] = []
          const maxItems = 6
          const slice = [
            ...(a.missing_skills || []),
            ...(a.strong_skills || []),
          ].slice(0, maxItems)
          for (const item of slice as any[]) {
            const name = item.skill_name ?? item.name ?? 'Skill'
            const current = item.current_level ?? Math.round((item.proficiency ?? 0) / 25)
            const required = item.required_level ?? Math.round(((item.proficiency ?? 50) / 100) * 4)
            radar.push({
              category: name.length > 10 ? name.slice(0, 9) + '…' : name,
              current: Math.min(4, current) * 25,
              required: Math.min(4, required) * 25,
            })
          }
          if (radar.length) setRadarData(radar)
        }
      } catch (err) {
        // Keep demo fallback data
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
            <h1 className="text-4xl font-bold mb-2">📊 Skill Gap Analysis</h1>
            <p className="text-slate-600">
              Detailed breakdown of skills you have vs. skills needed for your target role
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <p className="text-slate-600 text-sm">Total Required Skills</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Skills Matched</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{stats.matched}</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Skill Gaps</p>
              <p className="text-3xl font-bold mt-1 text-orange-600">{stats.gaps}</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">Skills Comparison (Radar View)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Required" dataKey="required" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Critical Gaps Table */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">Critical Skill Gaps</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold">Skill</th>
                    <th className="text-left py-3 px-4 font-semibold">Current Level</th>
                    <th className="text-left py-3 px-4 font-semibold">Required Level</th>
                    <th className="text-left py-3 px-4 font-semibold">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold">Est. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalGaps.map((gap, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{gap.skill}</td>
                      <td className="py-3 px-4 text-slate-600">{gap.current}</td>
                      <td className="py-3 px-4 text-slate-600">{gap.required}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            gap.priority === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : gap.priority === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{gap.timeToLearn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gap Details Chart */}
          <div className="card">
            <h2 className="font-bold text-lg mb-6">Gap Analysis by Skill</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillGaps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
                <Bar dataKey="required" fill="#ec4899" name="Required Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
