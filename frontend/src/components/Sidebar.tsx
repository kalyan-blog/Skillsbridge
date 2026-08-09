import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Skill Analysis', href: '/skill-analysis', icon: '🎯' },
    { label: 'Skill Gaps', href: '/skill-gaps', icon: '📈' },
    { label: 'Learning Roadmap', href: '/roadmap', icon: '🗺️' },
    { label: 'Career Explorer', href: '/career-explorer', icon: '🌍' },
    { label: 'Progress', href: '/progress', icon: '✅' },
    { label: 'Analysis History', href: '/history', icon: '📚' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ]

  return (
    <div
      className={`fixed md:static left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
      style={{ width: '16rem' }}
    >
      <div className="h-full flex flex-col p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary text-white font-bold">
              SB
            </div>
            <span className="font-bold text-lg">SkillBridge</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
