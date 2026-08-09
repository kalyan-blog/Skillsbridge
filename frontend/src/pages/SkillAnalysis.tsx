import React, { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Upload, AlertCircle, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, analysisAPI, careerAPI, roadmapAPI, userAPI } from '../services/api'

const roleIcons: Record<string, string> = {
  'Data Scientist': '📊',
  'Machine Learning Engineer': '🤖',
  'AI Engineer': '🧠',
  'Full Stack Developer': '💻',
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Cloud Engineer': '☁️',
  'Data Analyst': '📈',
  'Cybersecurity Analyst': '🔒',
  'DevOps Engineer': '🔧',
  'Software Engineer': '🖥️',
}

export default function SkillAnalysis() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'upload' | 'select-role' | 'results'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [careers, setCareers] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [detectedSkills, setDetectedSkills] = useState<string[]>([])

  const [analysis, setAnalysis] = useState<any>(null)

  // What-If state
  const [whatIfInput, setWhatIfInput] = useState('')
  const [whatIfResult, setWhatIfResult] = useState<any>(null)
  const [whatIfBusy, setWhatIfBusy] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await careerAPI.getAllRoles()
        setCareers(res.data.careers || [])
        if (res.data.careers?.length) setSelectedRole(String(res.data.careers[0].id))
      } catch (err) {
        setCareers([])
      }
    }
    load()
  }, [])

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

  const handleAnalyze = async () => {
    setError('')
    setBusy(true)
    setStep('select-role')
    if (!file) {
      setBusy(false)
      return
    }
    try {
      await resumeAPI.upload(file)
      const analyzeRes = await resumeAPI.analyze()
      const skills = (analyzeRes.data.skills || []).map((s: any) =>
        typeof s === 'string' ? s : s.name
      )
      setDetectedSkills(skills)
      for (const name of skills.slice(0, 6)) {
        try {
          await userAPI.addSkill(name, 2, 60)
        } catch {
          // ignore per-skill errors
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process resume. You can still select a role.')
    } finally {
      setBusy(false)
    }
  }

  const handleContinue = async () => {
    setError('')
    setBusy(true)
    setWhatIfResult(null)
    try {
      const role = careers.find((c) => String(c.id) === selectedRole)
      const targetRole = role?.name || 'Data Scientist'
      const res = await analysisAPI.create(targetRole)
      setAnalysis(res.data)
      setStep('results')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleGenerateRoadmap = async () => {
    setBusy(true)
    try {
      const role = careers.find((c) => String(c.id) === selectedRole)
      await roadmapAPI.generate({
        target_role: role?.name || analysis?.target_role || 'Data Scientist',
        weekly_hours: 10,
        experience_level: 'intermediate',
      })
      navigate('/roadmap')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate roadmap.')
    } finally {
      setBusy(false)
    }
  }

  const handleWhatIf = async () => {
    const skills = whatIfInput.split(',').map((s) => s.trim()).filter(Boolean)
    if (!skills.length) return
    setWhatIfBusy(true)
    try {
      const role = careers.find((c) => String(c.id) === selectedRole)
      const res = await analysisAPI.whatIf(role?.name || analysis?.target_role || 'Data Scientist', skills)
      setWhatIfResult(res.data)
    } catch (err) {
      setWhatIfResult(null)
    } finally {
      setWhatIfBusy(false)
    }
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

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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

              {detectedSkills.length > 0 && (
                <div className="mt-6 p-4 rounded-lg bg-violet-50 border border-violet-200">
                  <p className="font-semibold text-violet-900 mb-2">✨ Skills Detected</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedSkills.map((s, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-violet-700 border border-violet-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={busy}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {busy ? 'Analyzing...' : 'Continue'}
                </button>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Try Demo Mode</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Log in with demo@example.com / demo123 to explore the full analysis with sample data.
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
                {careers.map((role) => (
                  <label
                    key={role.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedRole === String(role.id)
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={String(role.id)}
                      checked={selectedRole === String(role.id)}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="mr-3 cursor-pointer"
                    />
                    <span className="text-2xl mr-3">{roleIcons[role.name] || '📌'}</span>
                    <span className="font-semibold">{role.name}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleContinue}
                disabled={busy}
                className="w-full btn-primary disabled:opacity-50"
              >
                {busy ? 'Analyzing...' : 'Analyze My Skills'}
              </button>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && analysis && (
            <div className="card">
              <h2 className="font-bold text-lg mb-6">✨ Your Analysis Results</h2>

              <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200">
                <p className="text-slate-600 text-sm mb-2">Target Role</p>
                <p className="text-3xl font-bold mb-4">{analysis.target_role}</p>

                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your Readiness Score</p>
                    <p className="text-5xl font-bold text-violet-600">{analysis.readiness_score}%</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-pink-500"
                        style={{ width: `${analysis.readiness_score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 text-right">{analysis.readiness_label}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <p className="font-semibold text-green-900 mb-3">✓ Skills You Have</p>
                  <div className="space-y-2">
                    {analysis.strong_skills.length ? (
                      analysis.strong_skills.map((s: any, i: number) => (
                        <div key={i} className="text-sm text-green-700">
                          • {s.name} ({s.proficiency ?? s.current_level * 25}%)
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-green-700">No skills matched yet.</div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <p className="font-semibold text-orange-900 mb-3">⚠️ Skills to Learn</p>
                  <div className="space-y-2">
                    {analysis.missing_skills.slice(0, 6).map((g: any, i: number) => (
                      <div key={i} className="text-sm text-orange-700">
                        • {g.skill_name} ({100 - g.gap_percentage}%)
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Total Skills</p>
                  <p className="text-3xl font-bold mt-2">{analysis.total_skills}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Matched</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">{analysis.matched_skills}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-100">
                  <p className="text-slate-600 text-sm">Missing</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">{analysis.missing_skills.length}</p>
                </div>
              </div>

              {/* What If Feature */}
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 mb-8">
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  What If?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  See your projected readiness if you learn a few more skills.
                </p>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={whatIfInput}
                    onChange={(e) => setWhatIfInput(e.target.value)}
                    placeholder="e.g., Machine Learning, Statistics, Power BI"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleWhatIf}
                    disabled={whatIfBusy}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {whatIfBusy ? '...' : 'Project'}
                  </button>
                </div>

                {whatIfResult && (
                  <div className="grid md:grid-cols-3 gap-4 p-4 rounded-lg bg-white border border-blue-200">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Current Readiness</p>
                      <p className="text-2xl font-bold mt-1 text-slate-700">{whatIfResult.current_readiness}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Projected Readiness</p>
                      <p className="text-2xl font-bold mt-1 text-blue-600">{whatIfResult.projected_readiness}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Improvement</p>
                      <p className="text-2xl font-bold mt-1 text-green-600">+{whatIfResult.improvement}%</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => navigate('/skill-gaps')} className="btn-secondary flex-1">
                  View Full Analysis
                </button>
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={busy}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {busy ? 'Generating...' : 'Generate Roadmap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
