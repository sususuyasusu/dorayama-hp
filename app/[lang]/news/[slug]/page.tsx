import type { Metadata } from 'next'
import { NewsDetailPage, newsDetailMetadata } from '@/components/site/news-pages'
import { OTHER_LANGS, type Lang } from '@/lib/i18n'
import { NEWS } from '@/lib/news'

type Params = { lang: Exclude<Lang, 'ja'>; slug: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return OTHER_LANGS.flatMap((lang) => NEWS.map((n) => ({ lang, slug: n.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params
  return newsDetailMetadata(lang, slug)
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params
  return <NewsDetailPage lang={lang} slug={slug} />
}
