import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Bell, Lock, Eye, Save } from 'lucide-react'

type SettingsState = {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  learningReminders: boolean
  darkMode: boolean
  twoFactor: boolean
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    learningReminders: true,
    darkMode: false,
    twoFactor: false,
  })

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
            <p className="text-slate-600">Customize your SkillBridge experience</p>
          </div>

          {/* Notifications */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-600">Get updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-600">Receive browser notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-slate-600">Get a weekly summary of your progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={() => handleToggle('weeklyDigest')}
                  className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Learning Reminders</p>
                  <p className="text-sm text-slate-600">Daily reminders to keep your streak alive</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.learningReminders}
                  onChange={() => handleToggle('learningReminders')}
                  className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Add extra security to your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                  className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-medium transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Appearance
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-600">Use dark theme for SkillBridge</p>
              </div>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
                className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Data */}
          <div className="card mb-8">
            <h2 className="font-bold text-lg mb-6">📊 Data & Privacy</h2>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg border border-slate-300 text-left hover:bg-slate-50 font-medium transition-colors">
                Download My Data
              </button>
              <button className="w-full px-4 py-3 rounded-lg border border-slate-300 text-left hover:bg-slate-50 font-medium transition-colors">
                View Privacy Policy
              </button>
              <button className="w-full px-4 py-3 rounded-lg border border-slate-300 text-left hover:bg-slate-50 font-medium transition-colors">
                Terms of Service
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button className="btn-secondary">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
