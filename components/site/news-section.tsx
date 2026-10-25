import { INSTAGRAM_URL } from '@/lib/site'
import { Reveal } from './reveal'

// Only items confirmed in the shop's records (press releases / broadcast).
// Day of month is shown only where it is known.
const NEWS = [
  { date: '2026.10', title: '10月の旬どら「幻の栗マロンかぼちゃどら」', image: 'images/14.jpg', alt: '幻の栗マロンかぼちゃどら' },
  { date: '2026.09', title: '9月の旬どら「熊本県産紅はるかどら」', image: 'images/61.jpg', alt: '熊本県産紅はるかどら' },
  { date: '2026.08.04', title: '8月限定の旬どら「くりくり和栗どら」', image: 'images/60.jpg', alt: 'くりくり和栗どら' },
  { date: '2026.05.18', title: 'テレビ朝日「じゅん散歩」でご紹介いただきました', image: 'images/21.jpg', alt: 'どら山の店先' },
]

// Layout after hosa.nagoya: heading on the left with a vertical link at the
// foot, and on the right a ruled list of vertical date / photo / title rows.
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
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-14 flex-col items-center gap-6 border-t border-paper/15 pt-6 text-paper"
            >
              <span className="font-mincho text-[13px] tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
                最新情報はInstagramで
              </span>
              <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-full bg-copper transition-transform duration-500 group-hover:translate-x-0.5">
                <svg viewBox="0 0 10 10" className="size-2 fill-ink">
                  <path d="M3 2l4 3-4 3z" />
                </svg>
              </span>
              <span aria-hidden="true" className="w-full border-b border-dotted border-paper/50" />
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </Reveal>
        </div>

        <ol className="border-t border-paper/10">
          {NEWS.map((n, i) => (
            <Reveal as="li" key={n.title} delay={i * 120} className="relative border-b border-paper/10">
              <span aria-hidden="true" className="absolute -top-px left-0 h-px w-3 bg-paper/70" />
              <div className="flex items-center gap-5 py-6 md:gap-8 md:py-8">
                <time
                  className="w-4 shrink-0 text-[12px] tracking-[0.08em] text-mute tabular-nums"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {n.date}
                </time>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={n.image}
                  alt={n.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-28 shrink-0 rounded-[3px] object-cover md:w-44"
                />
                <p className="font-mincho text-[14px] leading-[1.8] tracking-[0.06em] text-paper md:text-[17px]">{n.title}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
