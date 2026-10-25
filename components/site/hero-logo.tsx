'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-motion'
import { createLiquid } from '@/lib/liquid-gl'
import { loaderDone } from './loader'

const SRC = 'images/hero-mark.svg'
const ASPECT = 123.3 / 133.3
const COLOR = '#edeae4'

const maskStyle = {
  maskImage: `url(${SRC})`,
  WebkitMaskImage: `url(${SRC})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
} as const

// Paint the mark into an offscreen canvas in the paper colour so the liquid
// shader can ripple it like the photos.
function paintMark(): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const w = 640
      const h = Math.round(w / ASPECT)
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) return reject(new Error('no 2d context'))
      ctx.drawImage(img, 0, 0, w, h)
      ctx.globalCompositeOperation = 'source-in'
      ctx.fillStyle = COLOR
      ctx.fillRect(0, 0, w, h)
      resolve(c)
    }
    img.onerror = reject
    img.src = SRC
  })
}

function whenLoaderDone(fn: () => void) {
  if (loaderDone()) {
    fn()
    return () => {}
  }
  window.addEventListener('dorayama:loaded', fn, { once: true })
  return () => window.removeEventListener('dorayama:loaded', fn)
}

// Centre mark over the opening video. It ripples in (same shader as the
// photos) after the loader; its position on scroll is driven by the parent.
export function HeroLogo() {
  const holderRef = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setFallback(true)
      return whenLoaderDone(() => setShown(true))
    }
    const holder = holderRef.current
    if (!holder) return
    let liquid: ReturnType<typeof createLiquid> = null
    let canvas: HTMLCanvasElement | null = null
    let timer = 0
    let cancelled = false
    let unlisten = () => {}

    paintMark()
      .then((mark) => {
        if (cancelled) return
        canvas = document.createElement('canvas')
        canvas.setAttribute('aria-hidden', 'true')
        canvas.className = 'absolute inset-0 h-full w-full'
        holder.appendChild(canvas)
        liquid = createLiquid(canvas, mark, { revealStart: null }, () => setFallback(true), { wipe: false })
        if (!liquid) {
          canvas.remove()
          setFallback(true)
          return
        }
        unlisten = whenLoaderDone(() => {
          timer = window.setTimeout(() => liquid?.start(), 900)
        })
      })
      .catch(() => setFallback(true))

    return () => {
      cancelled = true
      unlisten()
      clearTimeout(timer)
      liquid?.destroy()
      canvas?.remove()
    }
  }, [reduced])

  useEffect(() => {
    if (!fallback) return
    return whenLoaderDone(() => setShown(true))
  }, [fallback])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        ref={holderRef}
        role="img"
        aria-label="どら山"
        className="relative aspect-[123.3/133.3] w-[176px] md:w-[224px]"
      >
        {fallback && (
          <span
            className="absolute inset-0 bg-paper transition-opacity duration-[1600ms]"
            style={{ ...maskStyle, opacity: shown ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  )
}
