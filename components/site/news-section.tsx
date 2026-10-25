import { NEWS } from '@/lib/news'
import { NewsRow } from './news-row'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

// Same heading as the other categories, then the ruled list of the latest
// items and a link to the news page.
export function NewsSection() {
  return (
    <section id="news" aria-labelledby="news-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="news-heading"
          jp="お知らせ"
          en="News"
          lead={['Seasonal dorayaki of the month,', 'media coverage and other news from the shop.']}
        />

        <ol className="mt-20 border-t border-paper/10">
          {NEWS.slice(0, 4).map((n, i) => (
            <Reveal as="li" key={n.slug} delay={i * 120} className="border-b border-paper/10">
              <NewsRow item={n} />
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 flex justify-end">
          <a href="news/" className="font-mincho group inline-flex items-center gap-10 border-b border-paper/40 pb-3 text-[14px] tracking-[0.2em] text-paper">
            お知らせ一覧
            <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-full bg-copper transition-transform duration-500 group-hover:translate-x-0.5">
              <svg viewBox="0 0 10 10" className="size-2 fill-ink">
                <path d="M3 2l4 3-4 3z" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
