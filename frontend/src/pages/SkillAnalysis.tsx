import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Upload, AlertCircle } from 'lucide-react'

export default function SkillAnalysis() {
  const [step, setStep] = useState<'upload' | 'select-role' | 'results'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedRole, setSelectedRole] = useState('data-scientist')

  const careerRoles = [
    { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
    { id: 'ml-engineer', name: 'Machine Learning Engineer', icon: '🤖' },
    { id: 'full-stack', name: 'Full Stack Developer', icon: '💻' },
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
    { id: 'cloud', name: 'Cloud Engineer', icon: '☁️' },
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAnalyze = () => {
    if (file) {
      setStep('select-role')
    }
  }

  const handleContinue = () => {
    setStep('results')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🎯 Skill Analysis</h1>
            <p className="text-slate-600">Upload your resume or manually enter your skills</p>
          </div>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="card">
              <h2 className="font-bold text-lg mb-6">Step 1: Upload Your Resume</h2>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="font-semibold mb-2">Drag and drop your resume here</p>
                <p className="text-sm text-slate-600 mb-4">or</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium cursor-pointer">
                    Choose File
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-4">PDF, DOCX, or TXT (up to 5MB)</p>
              </div>

              {file && (
                <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">✓ File Selected</p>
                  <p className="text-sm text-green-700">{file.name}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!file}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  Continue
                </button>
                <button className="btn-secondary flex-1">
                  Enter Skills Manually
                </button>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Try Demo Mode</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Skip upload and explore the full analysis with sample data
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Role */}
          {step === 'select-role' && (
            <div className="card">
              <h2 className="font-bold text-lg mb-6">Step 2: Select Your Target Career Role</h2>

              <div className="space-y-3 mb-6">
                {careerRoles.map((role) => (
                  <label
                    key={role.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedRole === role.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="mr-3 cursor-pointer"
                    />
                    <span className="text-2xl mr-3">{role.icon}</span>
                    <span className="font-semibold">{role.name}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleContinue}
                className="w-full btn-primary"
              >
                Analyze My Skills
              </button>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && (
            <div className="card">
              <h2 className="font-bold text-lg mb-6">✨ Your Analysis Results</h2>

              <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200">
                <p className="text-slate-600 text-sm mb-2">Target Role</p>
                <p className="text-3xl font-bold mb-4">Data Scientist</p>

                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your Readiness Score</p>
                    <p className="text-5xl font-bold text-violet-600">78%</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-400 to-pink-500 w-4/5" />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 text-right">Job Ready</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <p className="font-semibold text-green-900 mb-3">✓ Skills You Have</p>
                  <div className="space-y-2">
                    <div className="text-sm text-green-700">• Python (90%)</div>
                    <div className="text-sm text-green-700">• SQL (82%)</div>
                    <div className="text-sm text-green-700">• Pandas (85%)</div>
                    <div className="text-sm text-green-700">• Git (75%)</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <p className="font-semibold text-orange-900 mb-3">⚠️ Skills to Learn</p>
                  <div className="space-y-2">
                    <div className="text-sm text-orange-700">• Machine Learning (40%)</div>
                    <div className="text-sm text-orange-700">• Statistics (45%)</div>
                    <div className="text-sm text-orange-700">• Power BI (25%)</div>
                    <div className="text-sm text-orange-700">• Deep Learning (20%)</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Total Skills</p>
                  <p className="text-3xl font-bold mt-2">18</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Matched</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">12</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Missing</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">6</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-primary flex-1">
                  View Full Analysis
                </button>
                <button className="btn-secondary flex-1">
                  Generate Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
