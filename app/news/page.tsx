import type { Metadata } from 'next'
import { NewsRow } from '@/components/site/news-row'
import { Reveal } from '@/components/site/reveal'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { NEWS } from '@/lib/news'

export const metadata: Metadata = {
  title: 'お知らせ | 門仲どらやき どら山 總本鋪',
  description: '門仲どらやき どら山からのお知らせ。月替わりの旬どらや、メディア掲載などをご案内します。',
}

// News index after hosa.nagoya/news: heading with a photo, then a two-column
// ruled list of date / photo / title rows.
export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-32 pt-32 md:px-10 md:pb-48 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-end gap-12 md:grid-cols-[1fr_22rem]">
            <Reveal>
              <p className="flex items-center gap-2 text-[15px] text-copper" style={{ fontFamily: 'var(--font-display), serif' }}>
                <span aria-hidden="true" className="text-[10px]">・</span>news
              </p>
              <h1 className="font-mincho mt-2 text-[36px] leading-tight text-paper md:text-[44px]">お知らせ</h1>
              <p className="mt-8 text-[14px] leading-[1.8] text-mute md:text-[15px]" style={{ fontFamily: 'var(--font-display), serif' }}>
                Seasonal dorayaki of the month, media coverage
                <br />
                and other news from DORAYAMA in Monzen-nakacho.
              </p>
            </Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="images/03.jpg" alt="銅板の上に並ぶ、焼き色のついたどらやきの皮" className="aspect-[4/3] w-full rounded-[3px] object-cover" />
          </div>

          <ol className="mt-24 grid gap-x-12 border-t border-paper/10 md:grid-cols-2 md:border-t-0">
            {NEWS.map((n, i) => (
              <Reveal as="li" key={n.slug} delay={(i % 2) * 120} className="border-b border-paper/10 md:border-t md:[&:nth-child(n+3)]:border-t-0">
                <NewsRow item={n} />
              </Reveal>
            ))}
          </ol>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
