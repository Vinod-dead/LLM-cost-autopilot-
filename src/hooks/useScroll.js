import { useState, useEffect, useCallback } from 'react'

export function useScroll(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useCallback((node: Element | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsIntersecting(true)
            setHasAnimated(true)
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
      )
      observer.observe(node)
      return () => observer.disconnect()
    }
  }, [hasAnimated, options])

  return { ref: elementRef, isIntersecting, hasAnimated }
}

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}