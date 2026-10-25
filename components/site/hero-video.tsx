'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-motion'
import { createLiquid } from '@/lib/liquid-gl'
import { loaderDone } from './loader'
import { cn } from '@/lib/utils'

type HeroVideoProps = {
  src: string
  poster: string
  label: string
  className?: string
}

// Full-bleed looping video. The frames are drawn through the same liquid
// shader as the photos, so the opening reveal ripples in like the images.
export function HeroVideo({ src, poster, label, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const revealState = useRef<{ revealStart: number | null }>({ revealStart: null })
  const [glActive, setGlActive] = useState(false)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const layer = layerRef.current
    if (!video || !layer || reduced || failed) return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.className = 'absolute inset-0 h-full w-full'
    layer.appendChild(canvas)
    const liquid = createLiquid(canvas, video, revealState.current, () => setFailed(true))
    if (!liquid) {
      canvas.remove()
      return
    }
    setGlActive(true)
    // begin the ripple reveal only once the opening loader lifts
    const begin = () => liquid.start()
    if (loaderDone()) begin()
    else window.addEventListener('dorayama:loaded', begin, { once: true })
    return () => {
      window.removeEventListener('dorayama:loaded', begin)
      liquid.destroy()
      canvas.remove()
      setGlActive(false)
    }
  }, [reduced, failed])

  return (
    <div ref={layerRef} className={cn('relative overflow-hidden', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
          glActive ? 'opacity-0' : 'opacity-100',
        )}
      />
    </div>
  )
}
