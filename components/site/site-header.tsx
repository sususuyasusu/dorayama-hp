'use client'

import { useEffect, useState } from 'react'
import { INSTAGRAM_URL, RESERVE_URL, SECTIONS } from '@/lib/site'
import { cn } from '@/lib/utils'

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

  // like lujo: transparent over the opening video, a solid washi bar once the
  // page has scrolled, hidden while scrolling down and back on scrolling up
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 40)
      if (Math.abs(y - lastY) < 6) return
      setHidden(y > lastY && y > window.innerHeight * 0.4)
      lastY = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // scrolled: the earlier translucent green bar with the page blurred behind it;
  // menu open: transparent bar over the washi panel with green ink
  const blurred = scrolled && !open
  const dark = open

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* the bar slides away on its own; the menu panel below stays a sibling so
          the slide never becomes the panel's containing block */}
      <div
        className={cn(
          'relative z-10 transition-[translate] duration-300 ease-out',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          dark ? 'text-[#12301f]' : 'text-paper',
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 border-b backdrop-blur-md transition-[opacity,border-color] duration-500',
            blurred ? 'border-paper/[0.06] bg-ink/70 opacity-100' : 'border-transparent opacity-0',
          )}
        />
        <div className="relative flex h-14 items-center justify-between gap-6 px-4 transition-colors duration-500 md:h-16 md:px-10">
          <a href="#intro" onClick={() => setOpen(false)} aria-label="門仲どらやき どら山 トップへ" className="block">
            {/* logo drawn in the current text colour (white over video, green on washi) */}
            <span
              aria-hidden="true"
              className="block h-[26px] w-[44px] bg-current transition-colors duration-500 md:h-[30px] md:w-[51px]"
              style={{
                maskImage: 'url(images/logo-mark.png)',
                WebkitMaskImage: 'url(images/logo-mark.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
          </a>

        {/* the menu is always behind the hamburger, on every screen size */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          className="relative flex size-10 items-center justify-center"
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
      </div>

      {/* full-screen washi panel that fades in and out (mobile) */}
      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 h-svh overflow-y-auto transition-[opacity,visibility] duration-500 ease-out',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        style={{
          backgroundColor: '#ebe7df',
          backgroundImage: 'url(images/grain.png)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="px-5 pb-16 pt-[calc(3.5rem+16vh)] text-[#12301f] md:px-10 md:pt-[calc(4rem+18vh)]">
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
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className="flex items-baseline gap-4"
                  >
                    <span className="text-[26px] font-light leading-[1.25] md:text-[40px]" style={{ fontFamily: 'var(--font-display), serif' }}>
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
