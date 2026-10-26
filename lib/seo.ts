import type { Metadata } from 'next'
import { DICT, LANGS, prefix, type Lang } from './i18n'

// canonical and hreflang links for a page that exists in all four languages;
// `path` is the page below the language prefix, e.g. '' or 'news/'
export function alternates(lang: Lang, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const l of LANGS) languages[l === 'zh' ? 'zh-Hans' : l] = `/${prefix(l)}${path}`
  languages['x-default'] = `/${path}`
  return { canonical: `/${prefix(lang)}${path}`, languages }
}

export function homeMetadata(lang: Lang): Metadata {
  const t = DICT[lang].meta
  return {
    title: t.title,
    description: t.description,
    alternates: alternates(lang, ''),
    openGraph: { title: t.title, description: t.description, url: `/${prefix(lang)}`, locale: { ja: 'ja_JP', en: 'en_US', zh: 'zh_CN', ko: 'ko_KR' }[lang], type: 'website', images: [{ url: '/images/70.jpg' }] },
  }
}
