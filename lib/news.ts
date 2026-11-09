// Shop news. Built from the shop's Instagram posts (rewritten for the site by
// instagram/build_news.py) plus a few hand-written items; newest first.
import data from './news-data.json'
import type { Lang } from './i18n'

export type MediaInfo = { outlet: string; kind: string; date: string; summary: string }
type Translation = { title: string; summary: string }

export type NewsItem = {
  slug: string
  date: string
  category: string
  title: string
  body: string[]
  image: string
  alt: string
  media?: MediaInfo | null
  instagram?: string
  i18n?: Partial<Record<'en' | 'zh' | 'ko', Translation>>
  // 旬どらの記事だけ: 何月の旬どらか と 各言語の商品名（トップの商品欄に使う）
  shun?: { month: number; ja: string; en: string; zh: string; ko: string } | null
}

export const NEWS = data as NewsItem[]
export const MEDIA_NEWS = NEWS.filter((n) => n.media)
// お知らせに載っている旬どらは常に最新の1件だけ（instagram/build_news.py が古い分を外す）
export const LATEST_SHUN = NEWS.find((n) => n.category === '旬どら')
export const NEWS_CATEGORIES = ['旬どら', '新商品', '催事・出店', 'メディア', '店舗のお知らせ', '開店までの歩み', 'その他']

// 2026-10-01 -> 2026.10.01
export const formatDate = (d: string) => d.split('-').join('.')

// title and lines of text for a language; other languages fall back to Japanese
export function localized(item: NewsItem, lang: Lang): { title: string; body: string[] } {
  if (lang === 'ja') return { title: item.title, body: item.body }
  const t = item.i18n?.[lang]
  return t ? { title: t.title, body: [t.summary] } : { title: item.title, body: item.body }
}
