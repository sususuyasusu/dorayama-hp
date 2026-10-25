'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '@/hooks/use-motion'
import { cn } from '@/lib/utils'

type CrossfadeImageProps = {
  images: string[]
  alt: string
  className?: string
  interval?: number
}

export function CrossfadeImage({ images, alt, className, interval = 2600 }: CrossfadeImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [failed, setFailed] = useState<Record<number, boolean>>({})
  const reduced = useReducedMotion()
  const inView = useInView(ref, { threshold: 0.3, once: false })
  const revealed = useInView(ref, { threshold: 0.12 })
  const playing = inView && (hovered || !reduced)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      hovered ? interval * 0.5 : interval,
    )
    return () => window.clearInterval(id)
  }, [playing, hovered, interval, images.length])

  useEffect(() => {
    const imgs = ref.current?.querySelectorAll('img')
    imgs?.forEach((img, i) => {
      if (img.complete && img.naturalWidth === 0) setFailed((f) => ({ ...f, [i]: true }))
    })
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'img-frame relative overflow-hidden transition-opacity duration-[1800ms]',
        revealed ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ''}
          aria-hidden={i === 0 ? undefined : true}
          loading="lazy"
          decoding="async"
          onError={() => setFailed((f) => ({ ...f, [i]: true }))}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out',
            i === index ? 'opacity-100' : 'opacity-0',
            failed[i] && 'hidden',
          )}
        />
      ))}
      <div aria-hidden="true" className="absolute bottom-4 right-4 flex gap-1.5">
        {images.map((src, i) => (
          <span
            key={src}
            className={cn(
              'size-1 rounded-full transition-colors duration-700',
              i === index ? 'bg-copper' : 'bg-paper/25',
            )}
          />
        ))}
      </div>
    </div>
  )
}
