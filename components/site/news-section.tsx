import { NEWS } from '@/lib/news'
import { NewsRow } from './news-row'
import { Reveal } from './reveal'

// Layout after hosa.nagoya: heading on the left with a vertical link to the
// news page at the foot, and on the right a ruled list of the latest items.
export function NewsSection() {
  return (
    <section id="news" aria-labelledby="news-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[14rem_1fr] md:gap-20">
        <div className="flex flex-col justify-between">
          <Reveal>
            <p className="flex items-center gap-2 text-[15px] text-copper" style={{ fontFamily: 'var(--font-display), serif' }}>
              <span aria-hidden="true" className="text-[10px]">・</span>news
            </p>
            <h2 id="news-heading" className="font-mincho mt-2 text-[34px] leading-tight text-paper md:text-[40px]">
              お知らせ
            </h2>
          </Reveal>

          <Reveal delay={300} className="hidden md:block">
            <NewsListLink />
          </Reveal>
        </div>

        <div>
          <ol className="border-t border-paper/10">
            {NEWS.slice(0, 4).map((n, i) => (
              <Reveal as="li" key={n.slug} delay={i * 120} className="border-b border-paper/10">
                <NewsRow item={n} />
              </Reveal>
            ))}
          </ol>
          <div className="mt-10 md:hidden">
            <a href="news/" className="font-mincho inline-flex items-center gap-3 text-[14px] tracking-[0.2em] text-paper">
              お知らせ一覧
              <ArrowDot />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArrowDot() {
  return (
    <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-full bg-copper">
      <svg viewBox="0 0 10 10" className="size-2 fill-ink">
        <path d="M3 2l4 3-4 3z" />
      </svg>
    </span>
  )
}

function NewsListLink() {
  return (
    <a href="news/" className="group inline-flex w-14 flex-col items-center gap-6 border-t border-paper/15 pt-6 text-paper">
      <span className="font-mincho text-[13px] tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
        お知らせ一覧
      </span>
      <span className="transition-transform duration-500 group-hover:translate-x-0.5">
        <ArrowDot />
      </span>
      <span aria-hidden="true" className="w-full border-b border-dotted border-paper/50" />
    </a>
  )
}
