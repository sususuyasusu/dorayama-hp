'use client'

import { useEffect } from 'react'

// Photos and text themselves turn transparent toward the bottom edge of the
// screen, so the real (scrolling) background shows through instead of a fixed
// overlay. A gradient mask on <main> is re-anchored to the viewport on every
// frame; it eases off near the end of the page so the last lines stay legible.
export function ViewportFade() {
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    let raf = 0
    let last = ''

    const update = () => {
      raf = requestAnimationFrame(update)
      const vh = window.innerHeight
      const top = main.getBoundingClientRect().top
      const zone = vh * (window.innerWidth < 768 ? 0.2 : 0.16)
      // distance left to scroll; shrink the fade over the last half screen
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh)
      const strength = Math.min(Math.max(remaining / (vh * 0.5), 0), 1)
      const end = vh - top
      const start = end - zone * strength
      const key = `${Math.round(start)}|${Math.round(end)}`
      if (key === last) return
      last = key
      main.style.setProperty('--fade-start', `${start.toFixed(0)}px`)
      main.style.setProperty('--fade-end', `${end.toFixed(0)}px`)
    }
    raf = requestAnimationFrame(update)
    main.classList.add('viewport-fade')
    return () => {
      cancelAnimationFrame(raf)
      main.classList.remove('viewport-fade')
    }
  }, [])
  return null
}
