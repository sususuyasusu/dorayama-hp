'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '@/hooks/use-motion'
import { createLiquid, type Liquid } from '@/lib/liquid-gl'
import { cn } from '@/lib/utils'

type SmartImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Parallax strength, e.g. 0.08. 0 disables. */
  parallax?: number
  ripple?: boolean
  eager?: boolean
}

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = 0,
  ripple = true,
  eager = false,
}: SmartImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const liquidRef = useRef<Liquid | null>(null)
  const revealState = useRef<{ revealStart: number | null }>({ revealStart: null })
  const [failed, setFailed] = useState(false)
  const [glActive, setGlActive] = useState(false)
  const reduced = useReducedMotion()
  const visible = useInView(wrapRef, { threshold: 0.12 })
  // keep a WebGL context only while the image is near the viewport
  const near = useInView(wrapRef, { once: false, rootMargin: '60% 0px' })
  const useGl = ripple && !reduced && !failed
  const useParallax = parallax !== 0 && !reduced

  useEffect(() => {
    if (!useGl || !near) return
    const layer = layerRef.current
    if (!layer) return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.className = 'absolute inset-0 h-full w-full'
    layer.appendChild(canvas)
    const liquid = createLiquid(canvas, src, revealState.current, () => setFailed(true))
    if (!liquid) {
      canvas.remove()
      return
    }
    liquidRef.current = liquid
    setGlActive(true)
    return () => {
      liquid.destroy()
      liquidRef.current = null
      canvas.remove()
    }
  }, [useGl, near, src])

  useEffect(() => {
    if (visible && near) liquidRef.current?.start()
  }, [visible, near, glActive])

  useEffect(() => {
    if (!useParallax) return
    const wrap = wrapRef.current
    const layer = layerRef.current
    if (!wrap || !layer) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2
      layer.style.translate = `0 ${(-offset * parallax).toFixed(1)}px`
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
      layer.style.translate = ''
    }
  }, [useParallax, parallax])

  const showImg = !(useGl && glActive)

  return (
    <div
      ref={wrapRef}
      className={cn('relative overflow-hidden', !(useGl && glActive) && 'img-frame', className)}
    >
      <div ref={layerRef} className={cn('absolute inset-0', useParallax && 'scale-[1.18]')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-out',
            showImg && visible ? 'opacity-100' : 'opacity-0',
            failed && 'hidden',
            imgClassName,
          )}
        />
      </div>
    </div>
  )
}
