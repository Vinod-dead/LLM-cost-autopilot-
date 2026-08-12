export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Changelog', href: '#changelog' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Contact', href: '#contact' },
    ],
    resources: [
      { label: 'Community', href: '#community' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Templates', href: '#templates' },
      { label: 'Learning', href: '#learning' },
      { label: 'Support', href: '#support' },
    ],
    legal: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Security', href: '#security' },
    ],
  }

  const socialLinks = [
    { href: '#', label: 'GitHub', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
    )},
    { href: '#', label: 'Twitter', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
    )},
    { href: '#', label: 'LinkedIn', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    )},
    { href: '#', label: 'Discord', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.675 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 00.031.057 19.9 19.9 0 005.992 4.765.078.078 0 00.084-.028c.464-.753.973-1.443 1.514-2.025a.077.077 0 00-.025-.127 13.107 13.107 0 01-1.872-2.47.077.077 0 01-.007-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873 2.47.077.077 0 00-.026.127c.54.582 1.049 1.272 1.513 2.025a.076.076 0 00.082.028 19.839 19.839 0 006.001-4.765.077.077 0 00.032-.054c.5-5.177-.882-10.078-3.548-13.711a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
    )},
  ]

  return (
    <footer className="bg-gray-950 border-t border-white/10 py-16 px-6" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
          <div className="md:col-span-2 lg:col-span-3">
            <a href="#" className="flex items-center gap-3 mb-6" aria-label="AURA Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">AURA</span>
            </a>
            <p className="text-gray-400 max-w-sm mb-6">
              Building the future of 3D web experiences with cutting-edge technology and intuitive tools.
            </p>
            <div className="flex gap-4" role="list" aria-label="Social links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500/50 transition-all"
                  aria-label={social.label}
                  role="listitem"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <nav aria-labelledby="product-heading">
            <h4 id="product-heading" className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="company-heading">
            <h4 id="company-heading" className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="resources-heading">
            <h4 id="resources-heading" className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="legal-heading">
            <h4 id="legal-heading" className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; {currentYear} AURA. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            {footerLinks.legal.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-amber-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}