import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Compass, ArrowRight, Upload } from 'lucide-react'

const Onboarding = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to SkillBridge AI! 🎯</h1>
          <p className="text-xl text-slate-600">Let's get you started with your career analysis</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/skill-analysis')}
            className="card text-left p-8 hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-violet-100 to-pink-100 mb-4">
              <Upload className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Upload Your Resume</h3>
            <p className="text-slate-600 text-sm mb-4">
              We'll extract your skills and compare them against your dream role instantly.
            </p>
            <span className="inline-flex items-center gap-1 text-violet-600 font-medium text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => navigate('/career-explorer')}
            className="card text-left p-8 hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
              <Compass className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Explore Career Paths</h3>
            <p className="text-slate-600 text-sm mb-4">
              Browse supported tech roles and see what skills you need for each one.
            </p>
            <span className="inline-flex items-center gap-1 text-violet-600 font-medium text-sm">
              Explore Roles <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 hover:text-violet-600 font-medium text-sm"
          >
            Skip for now → Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
