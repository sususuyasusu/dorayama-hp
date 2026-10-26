import type { Metadata } from 'next'
import { DICT, HTML_LANG, prefix, type Lang } from '@/lib/i18n'
import { NEWS, formatDate, localized, type NewsItem } from '@/lib/news'
import { alternates } from '@/lib/seo'
import { NewsList } from './news-list'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function newsIndexMetadata(lang: Lang): Metadata {
  const t = DICT[lang].meta
  return { title: t.newsTitle, description: t.newsDescription, alternates: alternates(lang, 'news/') }
}

export function newsDetailMetadata(lang: Lang, slug: string): Metadata {
  const item = NEWS.find((n) => n.slug === slug)
  const site = DICT[lang].meta.newsTitle
  if (!item) return { title: site }
  const { title, body } = localized(item, lang)
  return {
    title: `${title} | ${site}`,
    description: body[0],
    alternates: alternates(lang, `news/${item.slug}/`),
    openGraph: { title, description: body[0], images: [`/${item.image}`], type: 'article' },
  }
}

// News index after hosa.nagoya/news: heading with a photo, then the list.
export function NewsIndexPage({ lang }: { lang: Lang }) {
  const t = DICT[lang].news
  return (
    <>
      <SiteHeader lang={lang} />
      <main className="px-4 pb-32 pt-32 md:px-10 md:pb-48 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-end gap-12 md:grid-cols-[1fr_22rem]">
            <div>
              <h1 className="sr-only">{t.label}</h1>
              <SectionHeading id="news-page-heading" jp={t.label} en="News" lead={t.pageLead} vertical={lang === 'ja'} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="images/03.jpg" alt="" className="aspect-[4/3] w-full rounded-[3px] object-cover" />
          </div>
          <NewsList items={NEWS} lang={lang} />
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}

const SITE_URL = 'https://dorayama.com'

// structured data so search engines read each item as a news article from the
// shop (date, headline, photo, publisher) and know where it sits in the site
function articleJsonLd(item: NewsItem, lang: Lang, title: string, body: string[]) {
  const url = `${SITE_URL}/${prefix(lang)}news/${item.slug}/`
  const t = DICT[lang]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title.slice(0, 110),
      description: body[0],
      articleBody: body.join('\n'),
      image: [`${SITE_URL}/${item.image}`],
      datePublished: `${item.date}T09:00:00+09:00`,
      dateModified: `${item.date}T09:00:00+09:00`,
      inLanguage: HTML_LANG[lang],
      articleSection: t.news.categories[item.category] ?? item.category,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      author: { '@type': 'Organization', name: '門仲どらやき どら山 總本鋪', url: `${SITE_URL}/` },
      publisher: {
        '@type': 'Organization',
        name: '門仲どらやき どら山 總本鋪',
        url: `${SITE_URL}/`,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
      },
      about: { '@id': `${SITE_URL}/#shop` },
      ...(item.media ? { mentions: { '@type': 'Organization', name: item.media.outlet } } : {}),
      ...(item.instagram ? { sameAs: [item.instagram] } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.nav.intro, item: `${SITE_URL}/${prefix(lang)}` },
        { '@type': 'ListItem', position: 2, name: t.nav.news, item: `${SITE_URL}/${prefix(lang)}news/` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ]
}

// Article after hosa.nagoya news detail: date and title on the left,
// photo on the right, body text below, and a link back to the list.
export function NewsDetailPage({ lang, slug }: { lang: Lang; slug: string }) {
  const item = NEWS.find((n) => n.slug === slug)!
  const t = DICT[lang].news
  const { title, body } = localized(item, lang)
  const p = prefix(lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(item, lang, title, body)) }} />
      <SiteHeader lang={lang} />
      <main className="px-4 pb-32 pt-32 md:px-10 md:pb-48 md:pt-44">
        <article className="mx-auto max-w-5xl">
          <div className="grid items-end gap-10 md:grid-cols-[1fr_22rem] md:gap-16">
            <Reveal>
              <div className="flex items-center gap-4">
                <time dateTime={item.date} className="text-[13px] tracking-[0.1em] text-mute tabular-nums">
                  {formatDate(item.date)}
                </time>
                <span className="chotai-r text-[11px] tracking-[0.2em] text-copper">{t.categories[item.category] ?? item.category}</span>
              </div>
              <h1 className="font-mincho mt-6 text-[22px] leading-[1.7] tracking-[0.06em] text-paper md:text-[28px]">{title}</h1>
              {item.media && (
                <p className="chotai mt-5 inline-block rounded-full border border-copper/70 px-3 py-1 text-[12px] tracking-[0.1em] text-copper">{item.media.outlet}</p>
              )}
            </Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.alt} className="aspect-square w-full rounded-[3px] object-cover" />
          </div>

          <Reveal delay={200} className="mx-auto mt-20 max-w-2xl">
            {body.map((para) => (
              <p key={para} className="font-mincho mb-6 text-[15px] leading-[2.2] tracking-[0.06em] text-paper/90">
                {para}
              </p>
            ))}
            {lang !== 'ja' && item.i18n?.[lang] && (
              <p className="mt-10 text-[13px] leading-loose tracking-[0.04em] text-mute">
                {t.original}{' '}
                <a href={`news/${item.slug}/`} lang="ja" className="underline decoration-paper/30 underline-offset-4 hover:text-paper">
                  日本語
                </a>
              </p>
            )}
            {item.instagram && (
              <p className="mt-6 text-[13px] tracking-[0.06em]">
                <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="text-mute underline decoration-paper/30 underline-offset-4 hover:text-paper">
                  {t.viewOnInstagram} ↗
                </a>
              </p>
            )}
          </Reveal>

          <div className="mt-20 flex justify-center">
            <a href={`${p}news/`} className="font-mincho group inline-flex items-center gap-10 border-b border-paper/40 pb-3 text-[14px] tracking-[0.2em] text-paper">
              {t.back}
              <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-full bg-copper transition-transform duration-500 group-hover:translate-x-0.5">
                <svg viewBox="0 0 10 10" className="size-2 fill-ink">
                  <path d="M3 2l4 3-4 3z" />
                </svg>
              </span>
            </a>
          </div>
        </article>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
