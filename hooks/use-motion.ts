'use client'

import { type RefObject, useEffect, useState, useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.15, once = true, rootMargin = '0px' } = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, once, rootMargin])

  return inView
}
