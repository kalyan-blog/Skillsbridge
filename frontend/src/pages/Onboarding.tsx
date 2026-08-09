import React from 'react'

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to SkillBridge AI! 🎯</h1>
          <p className="text-xl text-slate-600">Let's get you started with your career analysis</p>
        </div>

        {/* TODO: Multi-step onboarding wizard */}
        <div className="card text-center p-12">
          <p className="text-slate-600">Onboarding wizard coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
