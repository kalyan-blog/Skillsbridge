import React from 'react'

interface SkillCardProps {
  name: string
  level: number
  importance?: number
}

export const SkillCard: React.FC<SkillCardProps> = ({ name, level }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{name}</h4>
        <span className="text-sm font-bold text-violet-600">{level}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-violet-600"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  )
}
