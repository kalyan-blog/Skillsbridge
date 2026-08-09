import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const dimension = sizeMap[size]

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bridge structure */}
      <defs>
        <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Left pillar (Current Skills) */}
      <rect x="8" y="24" width="6" height="32" fill="#3b82f6" rx="2" />

      {/* Right pillar (Dream Career) */}
      <rect x="50" y="24" width="6" height="32" fill="#ec4899" rx="2" />

      {/* Bridge arch connecting both sides */}
      <path
        d="M 14 24 Q 32 8 56 24"
        stroke="url(#bridgeGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Bridge deck */}
      <rect x="14" y="22" width="42" height="4" fill="url(#bridgeGradient)" rx="2" />

      {/* Left platform circle */}
      <circle cx="11" cy="56" r="4" fill="#3b82f6" />
      <circle cx="11" cy="56" r="2" fill="white" />

      {/* Right platform circle */}
      <circle cx="53" cy="56" r="4" fill="#ec4899" />
      <circle cx="53" cy="56" r="2" fill="white" />

      {/* AI Spark element - two intersecting lightning bolts */}
      <g transform="translate(32, 14)">
        {/* First bolt */}
        <path
          d="M 0 -2 L 1 0 L 0 1 L 1 3 L -1 1 L 0 2 L -1 0 Z"
          fill="url(#sparkGradient)"
        />
        {/* Second bolt */}
        <path
          d="M -2 0 L 0 1 L -1 2 L 1 3 L 0 1 L 1 1 L 0 -1 Z"
          fill="url(#sparkGradient)"
          opacity="0.7"
        />
      </g>

      {/* Glowing effect around spark */}
      <circle cx="32" cy="14" r="6" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

export default Logo
