import { DICT, prefix, type Lang } from '@/lib/i18n'
import { MEDIA_NEWS, localized } from '@/lib/news'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

// "As seen on": every TV / radio / magazine / web feature as a compact ruled
// row — kind and month on the left, the outlet in mincho, one short line under
// it. Two columns from tablet up so the list stays short as it grows.
export function MediaSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].media
  if (!MEDIA_NEWS.length) return null
  const items = [...MEDIA_NEWS].sort((a, b) => (a.media!.date < b.media!.date ? 1 : -1))
  return (
    <section id="media" aria-labelledby="media-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="media-heading" jp={t.label} en="Media" lead={t.lead} vertical={lang === 'ja'} />
        <Reveal className="mt-10 max-w-2xl">
          <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">{t.intro}</p>
        </Reveal>

        <ol className="mt-12 grid gap-x-12 border-t border-paper/15 md:grid-cols-2 md:border-t-0">
          {items.map((n, i) => {
            const m = n.media!
            const [y, mo] = m.date.split('-')
            return (
              <Reveal
                as="li"
                key={n.slug}
                delay={(i % 2) * 120}
                className="border-b border-paper/15 md:border-t md:[&:nth-child(n+3)]:border-t-0"
              >
                <a
                  href={`${prefix(lang)}news/${n.slug}/`}
                  className="group grid grid-cols-[4.25rem_1fr_auto] items-center gap-x-4 px-2 py-5 transition-colors duration-500 hover:bg-[#0a1d12] md:grid-cols-[5rem_1fr_auto] md:gap-x-6 md:px-4 md:py-6"
                >
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="chotai-r inline-block rounded-full border border-copper/70 px-2 py-px text-[10px] tracking-[0.12em] text-copper">
                      {t.kinds[m.kind] ?? m.kind}
                    </span>
                    <time dateTime={m.date} className="text-[11px] tracking-[0.08em] text-mute tabular-nums">
                      {y}.{mo}
                    </time>
                  </div>
                  <div className="min-w-0">
                    <p className="chotai font-mincho text-[16px] leading-[1.5] tracking-[0.03em] text-paper md:text-[19px]">{m.outlet}</p>
                    <p className="mt-1.5 line-clamp-1 text-[11px] leading-relaxed tracking-[0.04em] text-mute md:text-[12px]">
                      {lang === 'ja' ? m.summary : localized(n, lang).title}
                    </p>
                  </div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-3 text-mute transition-[color,translate] duration-500 group-hover:translate-x-0.5 group-hover:text-paper"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                  <span className="sr-only">{t.more}</span>
                </a>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
