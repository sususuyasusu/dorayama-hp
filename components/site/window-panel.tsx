'use client'

import { type ReactNode, useEffect, useRef } from 'react'

// A screen-tall "window" that scrolls with the page while its contents stay
// put on screen: the stage inside is counter-shifted by the window's offset,
// so the photo and text look fixed and only the cut-out edge moves.
// (position: fixed is avoided on purpose: ancestor effects and mobile Safari
// do not clip it reliably.)
export function WindowPanel({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    const stage = stageRef.current
    if (!panel || !stage) return
    const place = () => {
      const top = panel.getBoundingClientRect().top
      // only move while the window overlaps the screen
      if (top > window.innerHeight || top < -panel.offsetHeight) return
      stage.style.transform = `translate3d(0, ${(-top).toFixed(1)}px, 0)`
    }
    // every frame (smooth inertia scrolling) and on every native scroll event
    let raf = 0
    const loop = () => {
      place()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    place()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [])

  return (
    <div ref={panelRef} className="relative h-svh overflow-hidden">
      <div ref={stageRef} className="absolute inset-x-0 top-0 h-svh will-change-transform">
        {children}
      </div>
    </div>
  )
}
