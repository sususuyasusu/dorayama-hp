import { NewsIndexPage, newsIndexMetadata } from '@/components/site/news-pages'

export const metadata = newsIndexMetadata('ja')

export default function NewsPage() {
  return <NewsIndexPage lang="ja" />
}
