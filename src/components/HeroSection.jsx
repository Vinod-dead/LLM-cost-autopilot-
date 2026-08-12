import { useRef, useEffect, useState } from 'react'
import { HeroCanvas } from './HeroCanvas'
import { useIntersectionObserver, useReducedMotion } from '../hooks/useScroll'

export const HeroSection = () => {
  const reducedMotion = useReducedMotion()
  const [statsVisible, setStatsVisible] = useState(false)
  const { ref: heroRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => setStatsVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isIntersecting])

  const stats = [
    { value: '99.9%', label: 'Uptime Guarantee', icon: 'check', color: 'amber' },
    { value: '50ms', label: 'Global Latency', icon: 'zap', color: 'blue' },
    { value: '10K+', label: 'Active Projects', icon: 'users', color: 'green' },
    { value: '99%', label: 'Satisfaction', icon: 'heart', color: 'pink' },
  ]

  const icons = {
    check: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    zap: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    heart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  }

  const colorClasses = {
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400',
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/90" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-3xl opacity-50 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-amber-300">New v2.0 Released — Experience the Future of 3D Web</span>
        </div>

        <h1
          id="hero-title"
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <span className="block text-gradient">Build Extraordinary</span>
          <span className="block text-gradient-gold">Digital Experiences</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          A premium platform for creating stunning 3D web experiences with real-time rendering,
          physics simulations, and immersive interactions — all without writing complex code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/30">
            <span className="flex items-center gap-2">
              Start Free Trial
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all border border-white/20">
            Watch Demo
          </button>
        </div>

        {statsVisible && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '400ms' }} role="list" aria-label="Platform statistics">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-3" style={{ animationDelay: `${500 + index * 100}ms` }} role="listitem">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  {icons[stat.icon as keyof typeof icons]}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}