'use client'

import { useEffect, useState } from 'react'
import { RESERVE_URL, SECTIONS } from '@/lib/site'
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper/[0.06] bg-ink/70 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-6 px-4 md:h-16 md:px-10">
        <p className="flex items-center gap-3 text-[12px] tracking-[0.2em] text-paper" aria-live="polite">
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
          <span
            className={cn(
              'absolute h-px w-6 bg-paper transition-transform duration-500',
              open ? 'rotate-45' : '-translate-y-1',
            )}
          />
          <span
            className={cn(
              'absolute h-px w-6 bg-paper transition-transform duration-500',
              open ? '-rotate-45' : 'translate-y-1',
            )}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-ink px-4 pb-10 pt-12 md:hidden"
      >
        <nav aria-label="モバイルナビゲーション">
          <ul className="flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 text-lg tracking-[0.2em] text-paper"
                >
                  <span aria-hidden="true" className="text-[11px] text-copper tabular-nums">
                    {String(SECTIONS.indexOf(s) + 1).padStart(2, '0')}
                  </span>
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={RESERVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(pillClass, 'mt-14 w-full')}
        >
          ご予約
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      </div>
    </header>
  )
}
