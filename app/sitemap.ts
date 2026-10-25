import type { MetadataRoute } from 'next'
import { NEWS } from '@/lib/news'

export const dynamic = 'force-static'

const SITE_URL = 'https://dorayama.com'

// list of every page for search engines (written out as sitemap.xml)
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/news/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...NEWS.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
