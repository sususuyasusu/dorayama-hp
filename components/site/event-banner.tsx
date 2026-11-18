'use client'

import { useEffect, useState } from 'react'
import EVENTS from '@/lib/events.json'
import type { Lang } from '@/lib/i18n'

type Text = { name: string; place: string; period: string; note: string }
type Ev = { id: string; start: string; end: string; map: string } & Record<Lang, Text>

const LABEL: Record<Lang, { now: string; map: string }> = {
  ja: { now: 'ただいま出店中', map: '地図を見る' },
  en: { now: 'Now open at', map: 'Map' },
  zh: { now: '正在出店', map: '查看地图' },
  ko: { now: '지금 출점 중', map: '지도 보기' },
}

// today's date in Tokyo as YYYY-MM-DD
const tokyoToday = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10)
const running = (today: string) => (EVENTS as Ev[]).filter((e) => e.start <= today && today <= e.end)

// "Now open at" notice for pop-up shops. It decides by the viewer's date, so it
// appears on the first day and disappears after the last day without a rebuild.
export function EventBanner({ lang = 'ja' }: { lang?: Lang }) {
  const [list, setList] = useState<Ev[]>(() => running(tokyoToday()))
  useEffect(() => setList(running(tokyoToday())), [])
  if (!list.length) return null
  const l = LABEL[lang]
  return (
    <section aria-label={l.now} className="px-4 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-4">
        {list.map((e) => {
          const t = e[lang]
          return (
            <div key={e.id} className="flex flex-col gap-4 border-y border-paper/15 py-6 md:flex-row md:items-center md:gap-10">
              <span className="chotai font-mincho inline-flex shrink-0 items-center gap-3 text-[13px] tracking-[0.2em] text-copper">
                <span aria-hidden="true" className="size-2 rounded-full bg-copper" />
                {l.now}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mincho text-[18px] tracking-[0.08em] text-paper md:text-[20px]">
                  {t.name}
                  <span className="ml-3 text-[13px] text-mute md:text-[14px]">{t.place}</span>
                </p>
                <p className="mt-2 text-[13px] leading-[1.9] tracking-[0.06em] text-mute">
                  {t.period}　{t.note}
                </p>
              </div>
              <a href={e.map} target="_blank" rel="noopener noreferrer" className="chotai-r font-mincho shrink-0 self-start border-b border-paper/40 pb-1 text-[13px] tracking-[0.2em] text-paper transition-colors hover:border-copper md:self-center">
                {l.map}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
