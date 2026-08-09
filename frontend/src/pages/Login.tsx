import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'
import { AlertCircle } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Demo mode
  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123',
    })
    setError('')
    setLoading(true)
    try {
      await login('demo@example.com', 'demo123')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to continue to SkillBridge AI</p>
        </div>

        {/* Login Form */}
        <div className="card mb-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Login Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Mode */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center mb-6">
          <p className="text-sm text-slate-700 mb-3">Want to see it in action?</p>
          <button
            onClick={handleDemoLogin}
            className="w-full px-4 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
          >
            Try Demo Mode
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-600 hover:text-violet-700 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
