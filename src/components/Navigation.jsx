import { useScroll } from '../hooks/useScroll'

export const Navigation = () => {
  const scrolled = useScroll(20)

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#about', label: 'About' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark py-4' : 'py-6'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="AURA Home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
            AURA
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8" role="menubar">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              role="menuitem"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="hidden sm:block px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}