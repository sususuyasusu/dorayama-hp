'use client'

import { useEffect, useState } from 'react'
import { loaderDone } from './loader'

// Centre mark over the opening video; it surfaces once the loader has lifted.
export function HeroLogo() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const show = () => window.setTimeout(() => setShown(true), 1200)
    if (loaderDone()) {
      const id = show()
      return () => clearTimeout(id)
    }
    let id = 0
    const onLoaded = () => {
      id = show()
    }
    window.addEventListener('dorayama:loaded', onLoaded, { once: true })
    return () => {
      window.removeEventListener('dorayama:loaded', onLoaded)
      clearTimeout(id)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        opacity: shown ? 1 : 0,
        filter: shown ? 'blur(0)' : 'blur(6px)',
        transition: 'opacity 1.6s cubic-bezier(0.43, 0.05, 0.17, 1), filter 1.6s cubic-bezier(0.43, 0.05, 0.17, 1)',
      }}
    >
      {/* hero mark (aikon.svg) drawn in the paper colour over the video */}
      <span
        role="img"
        aria-label="どら山"
        className="block aspect-[123.3/133.3] w-[88px] bg-paper md:w-[112px]"
        style={{
          maskImage: 'url(images/hero-mark.svg)',
          WebkitMaskImage: 'url(images/hero-mark.svg)',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  )
}
