'use client'

import { useEffect, useRef, useState } from 'react'
import { DICT, LANGS, LANG_LABEL, LANG_SHORT, prefix, type Lang } from '@/lib/i18n'
import { INSTAGRAM_URL, RESERVE_URL, SECTIONS } from '@/lib/site'
import { cn } from '@/lib/utils'

// Language switch next to the hamburger: a small pill with the current
// language that opens a list of the four; each link keeps the page you are on.
function LanguageSwitch({ lang, dark }: { lang: Lang; dark: boolean }) {
  const [open, setOpen] = useState(false)
  const [hrefs, setHrefs] = useState<Record<Lang, string>>(() => ({ ja: './', en: 'en/', zh: 'zh/', ko: 'ko/' }))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // the same page in each language, relative to the site root
    const base = new URL(document.baseURI).pathname
    let rest = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : ''
    const m = rest.match(/^(en|zh|ko)(\/|$)/)
    if (m) rest = rest.slice(m[0].length)
    const next = {} as Record<Lang, string>
    for (const l of LANGS) next[l] = base + prefix(l) + rest
    setHrefs(next)
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('click', close)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={DICT[lang].header.language}
        className="inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-full px-1.5 text-[11px] tracking-[0.12em] transition-colors duration-500 lg:h-[34px] lg:text-[13px] 2xl:h-10 2xl:text-[14px]"
      >
        {/* thin globe line icon */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15px] lg:size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        {LANG_SHORT[lang]}
      </button>
      <ul
        className={cn(
          'absolute right-0 top-[calc(100%+8px)] min-w-[8.5rem] overflow-hidden rounded-[4px] border py-1.5 text-[13px] tracking-[0.08em] shadow-lg transition-[opacity,visibility,translate] duration-300',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
          dark ? 'border-[#12301f]/15 bg-[#ebe7df] text-[#12301f]' : 'border-paper/15 bg-[#12301f]/95 text-paper backdrop-blur-md',
        )}
      >
        {LANGS.map((l) => (
          <li key={l}>
            <a
              href={hrefs[l]}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              className={cn('flex items-center justify-between gap-4 px-4 py-2 transition-colors hover:bg-current/10', l === lang && 'opacity-50')}
            >
              {LANG_LABEL[l]}
              <span className="text-[10px] opacity-70">{LANG_SHORT[l]}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteHeader({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang]
  const p = prefix(lang)
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
            blurred ? 'border-transparent opacity-100' : 'border-transparent opacity-0',
          )}
        />
        <div className="relative flex h-[38px] items-center justify-between gap-6 px-4 transition-colors duration-500 md:h-[43px] md:px-10 lg:h-[53px] lg:px-14 2xl:h-16 2xl:px-20">
          <a href={`${p}#intro`} onClick={() => setOpen(false)} aria-label={t.header.top} className="block">
            {/* logo drawn in the current text colour (white over video, green on washi) */}
            <span
              aria-hidden="true"
              className="block h-[22px] w-[38px] bg-current transition-colors duration-500 md:h-[24px] md:w-[41px] lg:h-[30px] lg:w-[51px] 2xl:h-[36px] 2xl:w-[61px]"
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

        <div className="flex items-center gap-3 lg:gap-5 2xl:gap-6">
        <LanguageSwitch lang={lang} dark={dark} />
        {/* the menu is always behind the hamburger, on every screen size */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.header.close : t.header.open}
          className="relative flex size-8 items-center justify-center lg:size-10 2xl:size-12"
        >
          {/* three thin lines cross-fade into a thin × */}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn('absolute size-5 lg:size-6 2xl:size-7 transition-[opacity,visibility] duration-500', open ? 'invisible opacity-0' : 'opacity-100')}
          >
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn('absolute size-5 lg:size-6 2xl:size-7 transition-[opacity,visibility] duration-500', open ? 'opacity-100' : 'invisible opacity-0')}
          >
            <path d="M15.5 4.5l-11 11M15.5 15.5l-11-11" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </button>
        {/* reservation pill to the right of the hamburger; follows the ink colour */}
        <a
          href={RESERVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="chotai-r inline-flex h-[26px] items-center whitespace-nowrap rounded-full border border-current px-3.5 text-[11px] tracking-[0.15em] transition-colors duration-500 hover:bg-current/10 lg:h-[34px] lg:px-5 lg:text-[13px] 2xl:h-10 2xl:px-6 2xl:text-[14px]"
        >
          {t.header.reserve}
          <span className="sr-only">{t.header.newTab}</span>
        </a>
        </div>
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
        <div className="px-5 pb-16 pt-[calc(3.5rem+16vh)] text-[#12301f] md:px-10 md:pt-[calc(4rem+18vh)] lg:px-14 2xl:px-20">
          <nav aria-label="Menu">
            <ul className="chotai flex flex-col gap-3">
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
                    href={`${p}#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className="flex items-baseline gap-4"
                  >
                    <span className="text-[26px] font-light leading-[1.25] md:text-[40px]" style={{ fontFamily: 'var(--font-display), serif' }}>
                      {s.nav}
                    </span>
                    <span className="text-[11px] tracking-[0.2em] text-[#12301f]/55">{t.nav[s.id]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul
            className="chotai mt-14 flex flex-col gap-3 text-[13px] tracking-[0.1em] transition-opacity duration-700 ease-out"
            style={{ opacity: open ? 1 : 0, transitionDelay: open ? '500ms' : '0ms' }}
          >
            <li>
              <a href={RESERVE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                {t.header.reserveLong}<span aria-hidden="true">↗</span>
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                Instagram<span aria-hidden="true">↗</span>
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </li>
            <li className="mt-6 text-[12px] leading-[1.9] text-[#12301f]/60">
              {t.header.walk}
              <br />
              {t.header.hours}
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
