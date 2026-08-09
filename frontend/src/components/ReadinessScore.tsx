import React from 'react'

interface ReadinessScoreProps {
  score: number
  label: string
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score, label }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 283} 283`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <p className="text-2xl font-bold">{score}%</p>
          </div>
        </div>
      </div>
      <p className="font-semibold text-green-600">✓ {label}</p>
    </div>
  )
}
