import type { Metadata } from 'next'
import { Home } from '@/components/site/home'
import { OTHER_LANGS, type Lang } from '@/lib/i18n'
import { homeMetadata } from '@/lib/seo'

type Params = { lang: Exclude<Lang, 'ja'> }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return OTHER_LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  return homeMetadata(lang)
}

export default async function LangHome({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  return <Home lang={lang} />
}
