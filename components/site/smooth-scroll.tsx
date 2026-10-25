'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Inertia scrolling: the page eases toward the wheel/trackpad target and
// glides to a stop, like the reference site. Touch keeps the native momentum.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      anchors: { offset: 0 },
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
  return null
}
