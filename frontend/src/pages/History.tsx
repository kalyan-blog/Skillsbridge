import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Trash2, Eye, Compare } from 'lucide-react'

export default function History() {
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([])

  const analyses = [
    {
      id: 'analysis-5',
      date: 'Feb 26, 2024',
      role: 'Data Scientist',
      readinessScore: 78,
      skillsMatched: 12,
      totalSkills: 18,
      status: 'Latest',
    },
    {
      id: 'analysis-4',
      date: 'Feb 19, 2024',
      role: 'Data Scientist',
      readinessScore: 72,
      skillsMatched: 11,
      totalSkills: 18,
      status: 'Previous',
    },
    {
      id: 'analysis-3',
      date: 'Feb 12, 2024',
      role: 'Machine Learning Engineer',
      readinessScore: 65,
      skillsMatched: 9,
      totalSkills: 22,
      status: 'Previous',
    },
    {
      id: 'analysis-2',
      date: 'Feb 5, 2024',
      role: 'Data Scientist',
      readinessScore: 60,
      skillsMatched: 8,
      totalSkills: 18,
      status: 'Previous',
    },
    {
      id: 'analysis-1',
      date: 'Jan 29, 2024',
      role: 'Full Stack Developer',
      readinessScore: 55,
      skillsMatched: 7,
      totalSkills: 18,
      status: 'Initial',
    },
  ]

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

          {/* Action Bar */}
          {selectedAnalyses.length > 0 && (
            <div className="card mb-6 flex items-center justify-between">
              <p className="font-semibold">
                {selectedAnalyses.length} analysis{selectedAnalyses.length > 1 ? 'es' : ''} selected
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-medium">
                  <Compare className="w-4 h-4" />
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
              <p className="text-3xl font-bold mt-2 text-green-600">78%</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Average Improvement</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">+4.6%</p>
            </div>
          </div>

          {/* Tips */}
          <div className="card-gradient mt-8 p-6 rounded-xl border border-blue-200">
            <p className="font-semibold mb-2">💡 Pro Tip</p>
            <p className="text-slate-700">
              Run a new analysis every 2-3 weeks to track your progress and adjust your learning strategy based on your improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
