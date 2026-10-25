'use client'

import { useEffect, useState } from 'react'
import { LogoMark } from './logo-mark'
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
      <LogoMark size={128} />
    </div>
  )
}
