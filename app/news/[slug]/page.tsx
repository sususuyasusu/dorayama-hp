import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/site/reveal'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { NEWS } from '@/lib/news'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return NEWS.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const item = NEWS.find((n) => n.slug === slug)
  return { title: item ? `${item.title} | お知らせ | 門仲どらやき どら山` : 'お知らせ | 門仲どらやき どら山' }
}

// Article after hosa.nagoya news detail: date and title on the left,
// photo on the right, body text below, and a link back to the list.
export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = NEWS.find((n) => n.slug === slug)
  if (!item) notFound()

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-32 pt-32 md:px-10 md:pb-48 md:pt-44">
        <article className="mx-auto max-w-5xl">
          <div className="grid items-end gap-10 md:grid-cols-[1fr_22rem] md:gap-16">
            <Reveal>
              <time className="text-[13px] tracking-[0.1em] text-mute tabular-nums">{item.date}</time>
              <h1 className="font-mincho mt-6 text-[22px] leading-[1.7] tracking-[0.06em] text-paper md:text-[28px]">{item.title}</h1>
            </Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.alt} className="aspect-[4/3] w-full rounded-[3px] object-cover" />
          </div>

          <Reveal delay={200} className="mx-auto mt-20 max-w-2xl">
            {item.body.map((p) => (
              <p key={p} className="font-mincho mb-6 text-[15px] leading-[2.2] tracking-[0.06em] text-paper/90">
                {p}
              </p>
            ))}
          </Reveal>

          <div className="mt-20 flex justify-center">
            <a
              href="news/"
              className="font-mincho group inline-flex items-center gap-10 border-b border-paper/40 pb-3 text-[14px] tracking-[0.2em] text-paper"
            >
              お知らせ一覧
              <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-full bg-copper transition-transform duration-500 group-hover:translate-x-0.5">
                <svg viewBox="0 0 10 10" className="size-2 fill-ink">
                  <path d="M3 2l4 3-4 3z" />
                </svg>
              </span>
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
