import { DICT, prefix, type Lang } from '@/lib/i18n'
import { MEDIA_NEWS, localized } from '@/lib/news'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

// "As seen on": every TV / radio / web feature as a large ruled row — the
// outlet in big mincho, the kind and month on the left, a short line under it.
export function MediaSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].media
  if (!MEDIA_NEWS.length) return null
  const items = [...MEDIA_NEWS].sort((a, b) => (a.media!.date < b.media!.date ? 1 : -1))
  return (
    <section id="media" aria-labelledby="media-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="media-heading" jp={t.label} en="Media" lead={t.lead} vertical={lang === 'ja'} />
        <Reveal className="mt-12 max-w-2xl">
          <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">{t.intro}</p>
        </Reveal>

        <ol className="mt-16 border-t border-paper/15">
          {items.map((n, i) => {
            const m = n.media!
            const [y, mo] = m.date.split('-')
            return (
              <Reveal as="li" key={n.slug} delay={i * 120} className="border-b border-paper/15">
                <a
                  href={`${prefix(lang)}news/${n.slug}/`}
                  className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 gap-y-2 px-2 py-9 transition-colors duration-500 hover:bg-[#0a1d12] md:grid-cols-[8rem_1fr_auto] md:gap-x-10 md:px-5 md:py-12"
                >
                  <div className="flex flex-col gap-2">
                    <span className="chotai-r inline-block w-fit rounded-full border border-copper/70 px-2.5 py-0.5 text-[10px] tracking-[0.15em] text-copper md:text-[11px]">
                      {t.kinds[m.kind] ?? m.kind}
                    </span>
                    <time dateTime={m.date} className="text-[12px] tracking-[0.1em] text-mute tabular-nums">
                      {y}.{mo}
                    </time>
                  </div>
                  <div className="min-w-0">
                    <p className="chotai font-mincho text-[20px] leading-[1.5] tracking-[0.04em] text-paper md:text-[34px]">{m.outlet}</p>
                    <p className="mt-3 text-[12px] leading-loose tracking-[0.06em] text-mute md:text-[13px]">
                      {lang === 'ja' ? m.summary : localized(n, lang).title}
                    </p>
                  </div>
                  <span className="col-start-2 inline-flex items-center gap-3 text-[11px] tracking-[0.15em] text-mute transition-colors group-hover:text-paper md:col-start-3 md:self-center">
                    {t.more}
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
