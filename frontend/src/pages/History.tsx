import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Trash2, Eye, ArrowLeftRight } from 'lucide-react'
import { analysisAPI } from '../services/api'

interface AnalysisRow {
  id: string
  date: string
  role: string
  readinessScore: number
  skillsMatched: number
  totalSkills: number
  status: string
}

export default function History() {
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([])
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analysisAPI.getHistory()
        const rows: AnalysisRow[] = res.data.map((h: any, idx: number, arr: any[]) => ({
          id: h.analysis_id,
          date: new Date(h.analyzed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          role: h.target_role,
          readinessScore: h.readiness_score,
          skillsMatched: Math.round(h.readiness_score / 8),
          totalSkills: 12,
          status: idx === 0 ? 'Latest' : idx === arr.length - 1 ? 'Initial' : 'Previous',
        }))
        setAnalyses(rows)
      } catch (err) {
        setAnalyses([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleSelection = (id: string) => {
    setSelectedAnalyses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Latest':
        return 'bg-green-100 text-green-700'
      case 'Initial':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const highestScore = analyses.reduce((m, a) => Math.max(m, a.readinessScore), 0)
  const avgImprovement = analyses.length > 1
    ? ((analyses[0].readinessScore - analyses[analyses.length - 1].readinessScore) / Math.max(1, analyses.length - 1))
    : 0

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">📚 Analysis History</h1>
            <p className="text-slate-600">
              View all your previous skill gap analyses and track your progress over time
            </p>
          </div>

          {loading ? (
            <div className="card text-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="card text-center p-12">
              <p className="text-4xl mb-4">📊</p>
              <h2 className="text-xl font-bold mb-2">No Analyses Yet</h2>
              <p className="text-slate-600 mb-6">Run your first skill analysis to start tracking your progress.</p>
              <a href="/skill-analysis" className="inline-block btn-primary">Start Analysis</a>
            </div>
          ) : (
            <>
              {/* Action Bar */}
              {selectedAnalyses.length > 0 && (
                <div className="card mb-6 flex items-center justify-between">
                  <p className="font-semibold">
                    {selectedAnalyses.length} analysis{selectedAnalyses.length > 1 ? 'es' : ''} selected
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-medium">
                      <ArrowLeftRight className="w-4 h-4" />
                      Compare
                    </button>
                    <button className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Analysis List */}
              <div className="space-y-3">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="card flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedAnalyses.includes(analysis.id)}
                      onChange={() => toggleSelection(analysis.id)}
                      className="mt-4 w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{analysis.role}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(analysis.status)}`}>
                          {analysis.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{analysis.date}</p>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Readiness Score</p>
                          <p className="text-2xl font-bold text-violet-600">{analysis.readinessScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Skills Matched</p>
                          <p className="text-2xl font-bold">
                            {analysis.skillsMatched}/{analysis.totalSkills}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Progress</p>
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-400 to-violet-600"
                                style={{ width: `${analysis.readinessScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="card">
                  <p className="text-slate-600 text-sm">Total Analyses</p>
                  <p className="text-3xl font-bold mt-2">{analyses.length}</p>
                </div>
                <div className="card">
                  <p className="text-slate-600 text-sm">Highest Score</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">{highestScore}%</p>
                </div>
                <div className="card">
                  <p className="text-slate-600 text-sm">Average Improvement</p>
                  <p className="text-3xl font-bold mt-2 text-blue-600">
                    {avgImprovement >= 0 ? '+' : ''}{avgImprovement.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="card-gradient mt-8 p-6 rounded-xl border border-blue-200">
                <p className="font-semibold mb-2">💡 Pro Tip</p>
                <p className="text-slate-700">
                  Run a new analysis every 2-3 weeks to track your progress and adjust your learning strategy based on your improvements.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
