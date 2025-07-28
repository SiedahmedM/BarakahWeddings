import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-2xl' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl' }
  }

  const { icon, text } = sizeClasses[size]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${icon} relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="url(#emeraldGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Islamic Arch/Dome Shape */}
          <path
            d="M50 15 C35 15, 25 25, 25 40 C25 50, 30 55, 35 55 L65 55 C70 55, 75 50, 75 40 C75 25, 65 15, 50 15 Z"
            fill="url(#goldGradient)"
            className="drop-shadow-sm"
          />
          
          {/* Decorative Top Point */}
          <path
            d="M50 10 L47 18 L53 18 Z"
            fill="url(#goldGradient)"
          />
          
          {/* Interlocked Wedding Rings */}
          <g transform="translate(50, 70)">
            {/* Left Ring */}
            <circle
              cx="-8"
              cy="0"
              r="10"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
            />
            {/* Right Ring */}
            <circle
              cx="8"
              cy="0"
              r="10"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
            />
            {/* Ring Details */}
            <circle
              cx="-8"
              cy="0"
              r="7"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <circle
              cx="8"
              cy="0"
              r="7"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
          </g>

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${text} font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent leading-tight`}>
            MUSLIM WEDDING
          </h1>
          <h2 className={`${text === 'text-4xl' ? 'text-2xl' : text === 'text-3xl' ? 'text-xl' : text === 'text-2xl' ? 'text-lg' : 'text-base'} font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent leading-tight -mt-1`}>
            HUB
          </h2>
        </div>
      )}
    </div>
  )
}