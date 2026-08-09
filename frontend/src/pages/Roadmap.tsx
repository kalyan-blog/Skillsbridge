import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Clock, BookOpen, Code } from 'lucide-react'
import { roadmapAPI } from '../services/api'

interface Phase {
  id: string
  roadmapId: string
  phase: number
  skill: string
  duration: string
  status: string
  icon: string
  objectives: string[]
  tasks: string[]
  project: string
}

const icons = ['📊', '🤖', '🧠', '📈', '💼', '🐍', '💾', '🔧', '☁️', '⚙️']

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0)
  const [roadmapPhases, setRoadmapPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ totalWeeks: 15, completed: 2, remaining: 3, progress: 40, targetRole: 'Data Scientist' })

  const loadRoadmap = async () => {
    try {
      const res = await roadmapAPI.get()
      const rm = res.data
      const phases: Phase[] = rm.items.map((item: any, idx: number) => ({
        id: item.id,
        roadmapId: rm.roadmap_id,
        phase: idx + 1,
        skill: item.skill_name,
        duration: `${item.duration ?? 2} weeks`,
        status: item.status,
        icon: icons[idx % icons.length],
        objectives: [
          `Learn the fundamentals of ${item.skill_name}`,
          'Practice hands-on exercises',
          'Apply it in a real project',
        ],
        tasks: [
          `Complete an online course covering ${item.skill_name}`,
          `Build a project using ${item.skill_name}`,
          'Get feedback from the community',
        ],
        project: `Build a project that applies ${item.skill_name}`,
      }))
      setRoadmapPhases(phases)
      setSummary({
        totalWeeks: rm.estimated_duration ?? 15,
        completed: rm.completed_items,
        remaining: rm.not_started_items,
        progress: rm.completion_percentage,
        targetRole: rm.target_role,
      })
    } catch (err) {
      // Fall back to empty state
      setRoadmapPhases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmap()
  }, [])

  const updateStatus = async (phase: Phase, newStatus: string) => {
    try {
      await roadmapAPI.updateItem(phase.roadmapId, phase.id, newStatus)
      loadRoadmap()
    } catch (err) {
      // Ignore update errors in demo
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'in_progress':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">✓ Completed</span>
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">⏳ In Progress</span>
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">○ Not Started</span>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🗺️ Your Learning Roadmap</h1>
            <p className="text-slate-600">
              Personalized journey to becoming a {summary.targetRole}
            </p>
          </div>

          {loading ? (
            <div className="card text-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your roadmap...</p>
            </div>
          ) : roadmapPhases.length === 0 ? (
            <div className="card text-center p-12">
              <p className="text-4xl mb-4">🗺️</p>
              <h2 className="text-xl font-bold mb-2">No Roadmap Yet</h2>
              <p className="text-slate-600 mb-6">
                Run a skill analysis first, then generate your personalized learning roadmap.
              </p>
              <a href="/skill-analysis" className="inline-block btn-primary">Analyze My Skills</a>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="card">
                  <p className="text-slate-600 text-sm">Total Duration</p>
                  <p className="text-2xl font-bold mt-1">{summary.totalWeeks} weeks</p>
                </div>
                <div className="card">
                  <p className="text-slate-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">{summary.completed} items</p>
                </div>
                <div className="card">
                  <p className="text-slate-600 text-sm">Remaining</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">{summary.remaining} items</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="card mb-8">
                <p className="text-sm font-medium text-slate-700 mb-3">Overall Progress</p>
                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-600"
                    style={{ width: `${summary.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">{summary.progress}% complete</p>
              </div>

              {/* Roadmap Timeline */}
              <div className="space-y-4">
                {roadmapPhases.map((item, idx) => (
                  <div
                    key={idx}
                    className={`card border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(item.status)}`}
                    onClick={() => setExpandedPhase(expandedPhase === idx ? null : idx)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl mt-1">{item.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">Phase {item.phase}: {item.skill}</h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Duration: {item.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl">
                        {expandedPhase === idx ? '▼' : '▶'}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPhase === idx && (
                      <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Learning Objectives
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {item.objectives.map((obj, i) => (
                              <li key={i} className="text-sm text-slate-600">
                                • {obj}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Practice Tasks
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {item.tasks.map((task, i) => (
                              <li key={i} className="text-sm text-slate-600">
                                • {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-white border border-slate-200">
                          <p className="font-semibold text-sm mb-2">💡 Capstone Project</p>
                          <p className="text-sm text-slate-600">{item.project}</p>
                        </div>

                        {item.status === 'not_started' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(item, 'in_progress') }}
                            className="w-full py-2 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition-colors"
                          >
                            ▶ Start Phase
                          </button>
                        )}
                        {item.status === 'in_progress' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(item, 'completed') }}
                            className="w-full py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors"
                          >
                            ✓ Mark as Completed
                          </button>
                        )}
                        {item.status === 'completed' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(item, 'not_started') }}
                            className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                          >
                            ↺ Reset Phase
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="card-gradient mt-8 text-center p-8">
                <h2 className="text-2xl font-bold mb-3">Keep learning!</h2>
                <p className="text-slate-700 mb-6">
                  Track your progress and update each phase as you complete it
                </p>
                <a href="/progress" className="inline-block btn-primary">
                  View My Progress →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
