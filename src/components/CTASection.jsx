import { useRef, useEffect, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useScroll'

export const CTASection = () => {
  const { ref, isIntersecting } = useIntersectionObserver()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isIntersecting) {
      setVisible(true)
    }
  }, [isIntersecting])

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      aria-labelledby="cta-title"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-amber-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23fbbf24%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-500/10 to-transparent blur-3xl opacity-50 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-amber-500/5 to-transparent blur-3xl opacity-30 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div
          className={`glass rounded-3xl p-12 md:p-16 max-w-3xl mx-auto border-amber-500/20 transition-all duration-700 ${
            visible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            Ready to build something amazing?
          </div>

          <h2
            id="cta-title"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6"
          >
            Start Building Today
          </h2>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers creating the future of 3D web.
            Free tier includes all core features — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/30">
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all border border-white/20">
              Schedule Demo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span>Trusted by innovative teams at</span>
            <div className="flex items-center gap-3">
              {['Acme Corp', 'TechStart', 'DesignHub', 'InnovateLab', 'FutureTech'].map((company) => (
                <span key={company} className="px-3 py-1 rounded-full bg-white/5 text-amber-400 font-medium text-xs">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}