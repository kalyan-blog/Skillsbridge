import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Zap, TrendingUp } from 'lucide-react'

export default function CareerExplorer() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const careers = [
    {
      id: 'data-scientist',
      name: 'Data Scientist',
      icon: '📊',
      description: 'Analyze complex datasets and build predictive models',
      topSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$120,000',
      demandLevel: 'Very High',
    },
    {
      id: 'ml-engineer',
      name: 'Machine Learning Engineer',
      icon: '🤖',
      description: 'Build and deploy machine learning models at scale',
      topSkills: ['Python', 'TensorFlow', 'Kubernetes', 'SQL'],
      difficulty: 'Very Hard',
      difficultyColor: 'red',
      avgSalary: '$150,000',
      demandLevel: 'Very High',
    },
    {
      id: 'full-stack',
      name: 'Full Stack Developer',
      icon: '💻',
      description: 'Build complete web applications frontend and backend',
      topSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$110,000',
      demandLevel: 'High',
    },
    {
      id: 'frontend',
      name: 'Frontend Developer',
      icon: '🎨',
      description: 'Build user interfaces for web applications',
      topSkills: ['JavaScript', 'React', 'CSS', 'HTML'],
      difficulty: 'Medium',
      difficultyColor: 'yellow',
      avgSalary: '$95,000',
      demandLevel: 'High',
    },
    {
      id: 'backend',
      name: 'Backend Developer',
      icon: '⚙️',
      description: 'Build server-side applications and APIs',
      topSkills: ['Python', 'Node.js', 'SQL', 'Docker'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$105,000',
      demandLevel: 'High',
    },
    {
      id: 'cloud-engineer',
      name: 'Cloud Engineer',
      icon: '☁️',
      description: 'Design and manage cloud infrastructure',
      topSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$125,000',
      demandLevel: 'Very High',
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst',
      icon: '📈',
      description: 'Analyze business data and create insights',
      topSkills: ['SQL', 'Excel', 'Tableau', 'Statistics'],
      difficulty: 'Medium',
      difficultyColor: 'yellow',
      avgSalary: '$75,000',
      demandLevel: 'High',
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity Analyst',
      icon: '🔒',
      description: 'Protect systems from security threats',
      topSkills: ['Linux', 'Networking', 'Security Tools', 'Python'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$95,000',
      demandLevel: 'Very High',
    },
    {
      id: 'ai-engineer',
      name: 'AI Engineer',
      icon: '🧠',
      description: 'Develop advanced AI systems and solutions',
      topSkills: ['Python', 'AI/ML', 'Deep Learning', 'NLP'],
      difficulty: 'Very Hard',
      difficultyColor: 'red',
      avgSalary: '$160,000',
      demandLevel: 'Very High',
    },
    {
      id: 'devops',
      name: 'DevOps Engineer',
      icon: '🔧',
      description: 'Manage infrastructure and deployment pipelines',
      topSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
      difficulty: 'Hard',
      difficultyColor: 'red',
      avgSalary: '$130,000',
      demandLevel: 'High',
    },
  ]

  const selectedCareer = careers.find((c) => c.id === selectedRole)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🌍 Career Explorer</h1>
            <p className="text-slate-600">
              Discover different career paths and see what's required for each role
            </p>
          </div>

          {/* Career Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {careers.map((career) => (
              <button
                key={career.id}
                onClick={() => setSelectedRole(career.id)}
                className={`card cursor-pointer border-2 transition-all transform hover:scale-105 ${
                  selectedRole === career.id
                    ? 'border-violet-500 shadow-lg'
                    : 'border-slate-200 hover:border-violet-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{career.icon}</div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    career.difficultyColor === 'red'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {career.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{career.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{career.description}</p>
                <div className="flex flex-wrap gap-1">
                  {career.topSkills.slice(0, 2).map((skill, i) => (
                    <span key={i} className="bg-violet-100 text-violet-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {career.topSkills.length > 2 && (
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                      +{career.topSkills.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          {selectedCareer && (
            <div className="card-gradient p-8 rounded-2xl border-2 border-blue-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-5xl">{selectedCareer.icon}</span>
                    <h2 className="text-3xl font-bold">{selectedCareer.name}</h2>
                  </div>
                  <p className="text-slate-700">{selectedCareer.description}</p>
                </div>
                <button className="px-6 py-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors">
                  Analyze for This Role
                </button>
              </div>

              {/* Career Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Average Salary</p>
                  <p className="text-2xl font-bold text-green-600">{selectedCareer.avgSalary}</p>
                </div>
                <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Market Demand</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCareer.demandLevel}</p>
                </div>
                <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Learning Time</p>
                  <p className="text-2xl font-bold text-orange-600">12-24 weeks</p>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="font-bold text-lg mb-4">✨ Core Required Skills</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedCareer.topSkills.map((skill, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur rounded-lg p-4">
                      <p className="font-semibold mb-2">{skill}</p>
                      <p className="text-xs text-slate-600 mb-3">Advanced Level Required</p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          {!selectedRole && (
            <div className="card text-center p-12">
              <p className="text-slate-600 text-lg">
                Click on any career above to see detailed requirements and salary information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
