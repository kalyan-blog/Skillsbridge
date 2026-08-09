import React, { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Save, X } from 'lucide-react'
import { userAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Alex Johnson',
    email: 'alex@example.com',
    education: 'B.S. Computer Science',
    experience: 'Intermediate',
    targetRole: 'Data Scientist',
    weeklyHours: 10,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userAPI.getProfile()
        const p = res.data
        setFormData({
          fullName: p.full_name || user?.full_name || 'Alex Johnson',
          email: p.email || user?.email || '',
          education: p.education || '',
          experience: p.experience_level || 'Intermediate',
          targetRole: p.target_role || 'Data Scientist',
          weeklyHours: p.weekly_study_hours || 10,
        })
      } catch (err) {
        // Keep defaults
      }
    }
    load()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await userAPI.updateProfile({
        full_name: formData.fullName,
        education: formData.education || null,
        experience_level: formData.experience,
        target_role: formData.targetRole,
        weekly_study_hours: Number(formData.weeklyHours),
      })
      setSaved(true)
      setIsEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      // Keep editing state so user can retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👤 Your Profile</h1>
              <p className="text-slate-600">Manage your account and learning preferences</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isEditing
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'btn-primary'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {saved && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="font-semibold text-green-900">✓ Profile saved successfully</p>
            </div>
          )}

          {/* Profile Card */}
          <div className="card mb-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                {(formData.fullName || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.fullName}</h2>
                <p className="text-slate-600">{formData.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., B.S. Computer Science"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Career Role
                </label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                >
                  <option>Data Scientist</option>
                  <option>Data Analyst</option>
                  <option>Machine Learning Engineer</option>
                  <option>AI Engineer</option>
                  <option>Software Engineer</option>
                  <option>Full Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Cloud Engineer</option>
                  <option>Cybersecurity Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weekly Study Hours
                </label>
                <select
                  name="weeklyHours"
                  value={formData.weeklyHours}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                >
                  <option value="5">5 hours</option>
                  <option value="10">10 hours</option>
                  <option value="15">15 hours</option>
                  <option value="20">20 hours</option>
                  <option value="25">25+ hours</option>
                </select>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center gap-2 flex-1"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-2 border-red-200 bg-red-50">
            <h3 className="font-bold text-lg text-red-900 mb-4">⚠️ Danger Zone</h3>
            <button className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition-colors">
              Delete Account
            </button>
            <p className="text-sm text-red-700 mt-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
