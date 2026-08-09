import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { CheckCircle, Clock, BookOpen, Code } from 'lucide-react'

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0)

  // Mock roadmap data
  const roadmapPhases = [
    {
      phase: 1,
      skill: 'Statistics Fundamentals',
      duration: '2 weeks',
      status: 'completed',
      icon: '📊',
      objectives: [
        'Probability distributions',
        'Hypothesis testing',
        'Correlation & regression',
      ],
      tasks: [
        'Complete Khan Academy statistics course',
        'Solve 50 practice problems',
        'Mini-project: Analyze dataset',
      ],
      project: 'Statistical analysis of real-world dataset',
    },
    {
      phase: 2,
      skill: 'Machine Learning Basics',
      duration: '4 weeks',
      status: 'in_progress',
      icon: '🤖',
      objectives: [
        'Supervised learning',
        'Classification & regression',
        'Model evaluation',
      ],
      tasks: [
        'Take ML course on Coursera',
        'Implement algorithms from scratch',
        'Kaggle competition entry',
      ],
      project: 'Build predictive model for housing prices',
    },
    {
      phase: 3,
      skill: 'Deep Learning Introduction',
      duration: '3 weeks',
      status: 'not_started',
      icon: '🧠',
      objectives: [
        'Neural networks',
        'TensorFlow basics',
        'CNN & RNN',
      ],
      tasks: [
        'TensorFlow tutorials',
        'MNIST digit classification',
        'Image classification project',
      ],
      project: 'CNN for image recognition',
    },
    {
      phase: 4,
      skill: 'Data Visualization',
      duration: '2 weeks',
      status: 'not_started',
      icon: '📈',
      objectives: [
        'Matplotlib & Seaborn',
        'Interactive dashboards',
        'Data storytelling',
      ],
      tasks: [
        'Create 10 different chart types',
        'Build Power BI dashboard',
        'Present findings clearly',
      ],
      project: 'Build interactive business dashboard',
    },
    {
      phase: 5,
      skill: 'Portfolio Projects',
      duration: '4 weeks',
      status: 'not_started',
      icon: '💼',
      objectives: [
        'End-to-end projects',
        'GitHub documentation',
        'Professional presentation',
      ],
      tasks: [
        'Complete 3 capstone projects',
        'Write blog posts about learning',
        'Network on LinkedIn',
      ],
      project: 'Deploy 3 projects on GitHub',
    },
  ]

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
              Personalized 15-week journey to becoming a Data Scientist
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <p className="text-slate-600 text-sm">Total Duration</p>
              <p className="text-2xl font-bold mt-1">15 weeks</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-600">2 phases</p>
            </div>
            <div className="card">
              <p className="text-slate-600 text-sm">Remaining</p>
              <p className="text-2xl font-bold mt-1 text-orange-600">3 phases</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card mb-8">
            <p className="text-sm font-medium text-slate-700 mb-3">Overall Progress</p>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-blue-600 w-2/5" />
            </div>
            <p className="text-xs text-slate-600 mt-2">40% complete • 9 weeks remaining</p>
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

                    {item.status === 'completed' && (
                      <button className="w-full py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors">
                        ✓ Mark as Completed
                      </button>
                    )}
                    {item.status === 'in_progress' && (
                      <button className="w-full py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors">
                        ⏳ Continue Learning
                      </button>
                    )}
                    {item.status === 'not_started' && (
                      <button className="w-full py-2 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition-colors">
                        ▶ Start Phase
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="card-gradient mt-8 text-center p-8">
            <h2 className="text-2xl font-bold mb-3">Ready to start your journey?</h2>
            <p className="text-slate-700 mb-6">
              Begin with Phase 1: Statistics Fundamentals
            </p>
            <button className="btn-primary">
              Start Learning Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
