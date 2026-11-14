import type { Metadata } from 'next'
import { ContactPage, contactMetadata } from '@/components/site/contact-page'
import { OTHER_LANGS, type Lang } from '@/lib/i18n'

type Params = { lang: Exclude<Lang, 'ja'> }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return OTHER_LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  return contactMetadata(lang)
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  return <ContactPage lang={lang} />
}
