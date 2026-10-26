import type { Metadata } from 'next'
import { NewsDetailPage, newsDetailMetadata } from '@/components/site/news-pages'
import { NEWS } from '@/lib/news'

type Params = { slug: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return NEWS.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  return newsDetailMetadata('ja', slug)
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  return <NewsDetailPage lang="ja" slug={slug} />
}
