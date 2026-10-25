'use client'

import { type ReactNode, useEffect, useRef } from 'react'

// Publishes how far the opening section has been scrolled as the CSS variable
// --p (0 at the top, 1 when the pinned video has fully scrolled away), so the
// logo, vertical copy and video fade can all be driven from plain CSS.
export function IntroProgress({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0
      el.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={ref} id="intro" aria-labelledby="intro-heading" className={className} style={{ ['--p' as string]: 0 }}>
      {children}
    </section>
  )
}
