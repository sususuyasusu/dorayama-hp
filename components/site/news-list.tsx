'use client'

import { useMemo, useState } from 'react'
import { DICT, type Lang } from '@/lib/i18n'
import { NEWS_CATEGORIES, type NewsItem } from '@/lib/news'
import { cn } from '@/lib/utils'
import { NewsRow } from './news-row'

const PAGE = 24

// The full news list: category chips across the top, two ruled columns of
// rows, and a "more" button that adds the next 24 items.
export function NewsList({ items, lang }: { items: NewsItem[]; lang: Lang }) {
  const t = DICT[lang].news
  const [cat, setCat] = useState<string | null>(null)
  const [shown, setShown] = useState(PAGE)
  const cats = useMemo(() => NEWS_CATEGORIES.filter((c) => items.some((n) => n.category === c)), [items])
  const list = cat ? items.filter((n) => n.category === cat) : items
  const more = { ja: 'もっと見る', en: 'Show more', zh: '查看更多', ko: '더 보기' }[lang]

  return (
    <>
      <div role="group" aria-label="Category" className="mt-20 flex flex-wrap gap-2.5">
        {[null, ...cats].map((c) => (
          <button
            key={c ?? 'all'}
            type="button"
            aria-pressed={cat === c}
            onClick={() => {
              setCat(c)
              setShown(PAGE)
            }}
            className={cn(
              'chotai-r rounded-full border px-4 py-1.5 text-[12px] tracking-[0.12em] transition-colors duration-300',
              cat === c ? 'border-paper bg-paper text-[#12301f]' : 'border-paper/30 text-paper hover:border-paper/70',
            )}
          >
            {c ? (t.categories[c] ?? c) : t.filterAll}
            <span className="ml-1.5 opacity-60 tabular-nums">{c ? items.filter((n) => n.category === c).length : items.length}</span>
          </button>
        ))}
      </div>

      <ol className="mt-12 grid gap-x-12 border-t border-paper/10 md:grid-cols-2 md:border-t-0">
        {list.slice(0, shown).map((n) => (
          <li key={n.slug} className="border-b border-paper/10 md:border-t md:[&:nth-child(n+3)]:border-t-0">
            <NewsRow item={n} lang={lang} />
          </li>
        ))}
      </ol>

      {shown < list.length && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className="chotai-r font-mincho border-b border-paper/40 pb-2 text-[14px] tracking-[0.2em] text-paper transition-opacity hover:opacity-70"
          >
            {more}（{list.length - shown}）
          </button>
        </div>
      )}
    </>
  )
}
