import type { MetadataRoute } from 'next'
import { LANGS, prefix } from '@/lib/i18n'
import { NEWS } from '@/lib/news'

export const dynamic = 'force-static'

const SITE_URL = 'https://dorayama.com'

// every page in every language, with links between the language versions
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly', lastModified: Date) =>
    LANGS.map((l) => ({
      url: `${SITE_URL}/${prefix(l)}${path}`,
      lastModified,
      changeFrequency,
      priority: l === 'ja' ? priority : priority * 0.8,
      alternates: { languages: Object.fromEntries(LANGS.map((x) => [x === 'zh' ? 'zh-Hans' : x, `${SITE_URL}/${prefix(x)}${path}`])) },
    }))
  return [
    ...page('', 1, 'weekly', now),
    ...page('news/', 0.7, 'weekly', now),
    ...NEWS.flatMap((n) => page(`news/${n.slug}/`, 0.5, 'monthly', new Date(n.date))),
  ]
}
