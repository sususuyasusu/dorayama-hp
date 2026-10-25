'use client'

import { useEffect, useState } from 'react'

// Opening screen: washi-like paper, a thin progress line along the top and the
// logo fading in at the centre. When the page is ready the logo blurs away,
// then the paper dissolves to reveal the site.
const MIN_SHOW_MS = 2600
const LOGO_OUT_MS = 1000
const PAPER_OUT_MS = 2000

type Phase = 'loading' | 'logoOut' | 'paperOut' | 'done'

export function loaderDone() {
  return typeof window !== 'undefined' && (window as { __dorayamaLoaderDone?: boolean }).__dorayamaLoaderDone === true
}

export function Loader() {
  const [phase, setPhase] = useState<Phase>('loading')

  useEffect(() => {
    const root = document.documentElement
    // only the first page of a visit plays the opening; later pages skip it
    let seen = false
    try {
      seen = sessionStorage.getItem('dorayama-loader') === '1'
      sessionStorage.setItem('dorayama-loader', '1')
    } catch {}
    if (seen) {
      ;(window as { __dorayamaLoaderDone?: boolean }).__dorayamaLoaderDone = true
      window.dispatchEvent(new Event('dorayama:loaded'))
      setPhase('done')
      return
    }
    root.style.overflow = 'hidden'
    const t0 = performance.now()
    const timers: number[] = []
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - t0))
      timers.push(
        window.setTimeout(() => {
          setPhase('logoOut')
          timers.push(
            window.setTimeout(() => {
              setPhase('paperOut')
              root.style.overflow = ''
              ;(window as { __dorayamaLoaderDone?: boolean }).__dorayamaLoaderDone = true
              window.dispatchEvent(new Event('dorayama:loaded'))
              timers.push(window.setTimeout(() => setPhase('done'), PAPER_OUT_MS))
            }, LOGO_OUT_MS * 0.6),
          )
        }, wait),
      )
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    // never hold the page longer than this, even on a slow connection
    timers.push(window.setTimeout(finish, 6000))

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('load', finish)
      root.style.overflow = ''
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-[#ebe7df]"
      style={{
        backgroundImage: 'url(images/grain.png)',
        backgroundBlendMode: 'overlay',
        opacity: phase === 'paperOut' ? 0 : 1,
        pointerEvents: phase === 'paperOut' ? 'none' : 'auto',
        transition: `opacity ${PAPER_OUT_MS}ms cubic-bezier(0.43, 0.05, 0.17, 1)`,
      }}
    >
      <div
        className="loader-bar fixed left-0 top-0 h-[2px] w-screen origin-left bg-[#12301f]/50"
        style={{ display: phase === 'loading' ? undefined : 'none' }}
      />
      <div
        className="fixed left-1/2 top-1/2 w-[72px] -translate-x-1/2 -translate-y-1/2 sm:w-[96px]"
        style={{
          filter: phase === 'loading' ? 'blur(0)' : 'blur(5px)',
          opacity: phase === 'loading' ? 1 : 0,
          transition: `filter ${LOGO_OUT_MS}ms cubic-bezier(0.43, 0.05, 0.17, 1), opacity ${LOGO_OUT_MS}ms cubic-bezier(0.43, 0.05, 0.17, 1)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="images/logo-full.png" alt="" className="loader-logo h-auto w-full" />
      </div>
    </div>
  )
}
