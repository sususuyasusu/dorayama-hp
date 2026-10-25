import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// let every search engine crawl the whole site, and point it to the page list
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://dorayama.com/sitemap.xml',
    host: 'https://dorayama.com',
  }
}
