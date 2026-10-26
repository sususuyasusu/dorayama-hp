import type { Metadata } from 'next'
import { NewsIndexPage, newsIndexMetadata } from '@/components/site/news-pages'
import { OTHER_LANGS, type Lang } from '@/lib/i18n'

type Params = { lang: Exclude<Lang, 'ja'> }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return OTHER_LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  return newsIndexMetadata(lang)
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  return <NewsIndexPage lang={lang} />
}
