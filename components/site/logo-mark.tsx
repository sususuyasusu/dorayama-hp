'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function LogoMark({ className, size = 80 }: { className?: string; size?: number }) {
  const ref = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) {
    return (
      <span
        role="img"
        aria-label="どら山 ロゴ"
        className={cn('font-mincho inline-block text-paper', className)}
        style={{ fontSize: size * 0.28 }}
      >
        どら山
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="images/logo-mark.png"
      alt="どら山 ロゴ"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={cn('h-auto', className)}
      style={{ width: size, filter: 'brightness(0) invert(0.93) sepia(0.08)' }}
    />
  )
}
