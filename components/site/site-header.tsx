'use client'

import { useEffect, useState } from 'react'
import { INSTAGRAM_URL, RESERVE_URL, SECTIONS } from '@/lib/site'
import { cn } from '@/lib/utils'
import { pillClass } from './pill-link'

export function SiteHeader() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? 'Intro'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        open ? 'text-[#12301f]' : 'text-paper',
      )}
    >
      {/* blurred bar background lives in its own layer so the fixed menu panel
          is never clipped by a backdrop-filter on the header itself */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-14 border-b backdrop-blur-md transition-[opacity,border-color] duration-500 md:h-16',
          open ? 'border-[#12301f]/10 opacity-0' : 'border-paper/[0.06] bg-ink/70 opacity-100',
        )}
      />
      <div className="relative z-10 flex h-14 items-center justify-between gap-6 px-4 md:h-16 md:px-10">
        <p className="flex items-center gap-3 text-[12px] tracking-[0.2em]" aria-live="polite">
          <span aria-hidden="true" className="size-1 rounded-full bg-copper" />
          <span key={activeLabel} className="animate-in fade-in duration-700">
            {activeLabel}
          </span>
        </p>

        <div className="hidden items-center gap-10 md:flex">
          <nav aria-label="メインナビゲーション">
            <ul className="flex items-center gap-8 text-[12px] tracking-[0.15em]">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={cn(
                      'transition-colors duration-500 hover:text-paper',
                      active === s.id ? 'text-paper' : 'text-mute',
                    )}
                  >
                    {s.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={RESERVE_URL} target="_blank" rel="noopener noreferrer" className={cn(pillClass, 'h-9 px-5')}>
            ご予約
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          className="relative flex size-10 items-center justify-center md:hidden"
        >
          {/* three thin lines cross-fade into a thin × */}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn('absolute size-5 transition-[opacity,visibility] duration-500', open ? 'invisible opacity-0' : 'opacity-100')}
          >
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn('absolute size-5 transition-[opacity,visibility] duration-500', open ? 'opacity-100' : 'invisible opacity-0')}
          >
            <path d="M15.5 4.5l-11 11M15.5 15.5l-11-11" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </button>
      </div>

      {/* full-screen washi panel that fades in and out (mobile) */}
      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 h-svh overflow-y-auto transition-[opacity,visibility] duration-500 ease-out md:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        style={{
          backgroundColor: '#ebe7df',
          backgroundImage: 'url(images/grain.png)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="px-5 pb-16 pt-[calc(3.5rem+16vh)] text-[#12301f]">
          <nav aria-label="モバイルナビゲーション">
            <ul className="flex flex-col gap-3">
              {SECTIONS.map((s, i) => (
                <li
                  key={s.id}
                  className="transition-[opacity,translate] duration-700 ease-out"
                  style={{
                    opacity: open ? 1 : 0,
                    translate: open ? '0 0' : '0 6px',
                    transitionDelay: open ? `${150 + i * 60}ms` : '0ms',
                  }}
                >
                  <a href={`#${s.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4">
                    <span className="text-[26px] font-light leading-[1.25]" style={{ fontFamily: 'var(--font-display), serif' }}>
                      {s.nav}
                    </span>
                    <span className="text-[11px] tracking-[0.2em] text-[#12301f]/55">{s.jp}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul
            className="mt-14 flex flex-col gap-3 text-[13px] tracking-[0.1em] transition-opacity duration-700 ease-out"
            style={{ opacity: open ? 1 : 0, transitionDelay: open ? '500ms' : '0ms' }}
          >
            <li>
              <a href={RESERVE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                ご予約（テイクイーツ）<span aria-hidden="true">↗</span>
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                Instagram<span aria-hidden="true">↗</span>
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </li>
            <li className="mt-6 text-[12px] leading-[1.9] text-[#12301f]/60">
              門前仲町駅 徒歩1分
              <br />
              10:00〜16:00（売り切れ次第終了）・年中無休
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
