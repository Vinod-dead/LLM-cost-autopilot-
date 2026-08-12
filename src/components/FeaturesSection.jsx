import { useRef, useEffect, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useScroll'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Real-time 3D Rendering',
    description: 'WebGL-powered engine delivering 60fps performance across all devices with automatic LOD and frustum culling.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Physics & Particles',
    description: 'Built-in physics engine with rigid bodies, soft bodies, fluid simulation, and GPU-accelerated particle systems.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: 'Visual Node Editor',
    description: 'Create complex 3D scenes and logic without code using our intuitive node-based visual programming interface.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Collaborative Workspaces',
    description: 'Real-time multi-user editing with presence indicators, comments, and version control built for teams.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Cross-platform Export',
    description: 'Deploy to web, mobile, desktop, AR/VR with a single click. Native WebXR and WebGPU support included.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Enterprise Security',
    description: 'SOC2 compliant, SSO/SAML, role-based access control, audit logs, and on-premise deployment options.',
  },
]

export const FeaturesSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver()
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (isIntersecting) {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleFeatures(prev => new Set([...prev, index]))
        }, index * 100)
      })
    }
  }, [isIntersecting])

  return (
    <section
      ref={ref}
      id="features"
      className="relative py-24 md:py-32 px-6 bg-gray-900/50"
      aria-labelledby="features-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-amber-300 text-sm font-medium mb-4">Features</span>
          <h2 id="features-title" className="text-4xl md:text-5xl font-bold text-gradient mb-4">Everything You Need</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Powerful tools for building the next generation of 3D web experiences</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isVisible = visibleFeatures.has(index)
            return (
              <article
                key={index}
                className={`group glass p-8 rounded-2xl hover:border-amber-500/50 hover:bg-white/10 transition-all duration-500 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}