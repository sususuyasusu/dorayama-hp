'use client'

import { useEffect, useState } from 'react'
import EVENTS from '@/lib/events.json'
import type { Lang } from '@/lib/i18n'

type Text = { name: string; place: string; period: string; note: string }
type Ev = { id: string; show: string; start: string; end: string; map: string } & Record<Lang, Text>

// badge words: during the event / announced ahead of it
const LABEL: Record<Lang, { now: string[]; soon: string[]; map: string }> = {
  ja: { now: ['催事中'], soon: ['開催', '予定'], map: '地図を見る' },
  en: { now: ['Now', 'open'], soon: ['Coming', 'soon'], map: 'Map' },
  zh: { now: ['进行中'], soon: ['即将', '举办'], map: '查看地图' },
  ko: { now: ['진행 중'], soon: ['개최', '예정'], map: '지도 보기' },
}

// today's date in Tokyo as YYYY-MM-DD
const tokyoToday = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10)
const visible = (today: string) => (EVENTS as Ev[]).filter((e) => e.show <= today && today <= e.end)

// Event notice for pop-up shops. It decides by the viewer's date: each event
// appears on its "show" day (a month ahead), switches to "now" on the first
// day and disappears after the last day, without a rebuild.
export function EventBanner({ lang = 'ja' }: { lang?: Lang }) {
  const [today, setToday] = useState(tokyoToday)
  useEffect(() => setToday(tokyoToday()), [])
  const list = visible(today)
  if (!list.length) return null
  const l = LABEL[lang]
  return (
    <section aria-labelledby="event-heading" className="px-4 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <h2
          id="event-heading"
          className="pl-6 text-[20px] font-light tracking-[0.3em] text-paper md:pl-9 md:text-[22px]"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          Event
        </h2>
        <ul className="mt-4 border-t border-paper/15">
          {list.map((e) => {
            const t = e[lang]
            const badge = today >= e.start ? l.now : l.soon
            return (
              <li key={e.id} className="flex items-center gap-5 border-b border-paper/15 py-8 pl-4 md:gap-10 md:py-9 md:pl-8">
                <span
                  aria-label={badge.join('')}
                  className="font-mincho flex size-[60px] shrink-0 flex-col items-center justify-center rounded-full bg-copper text-center text-[12px] leading-[1.35] tracking-[0.12em] text-paper md:size-[64px] md:text-[14px]"
                >
                  {badge.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </span>
                <div className="min-w-0 flex-1 md:pl-14">
                  <p className="font-mincho text-[18px] tracking-[0.12em] text-paper md:text-[20px]">
                    {t.name}
                    <span className="ml-3 inline-block text-[13px] tracking-[0.08em] text-mute md:text-[14px]">{t.place}</span>
                  </p>
                  <p className="font-mincho mt-3 text-[13px] leading-[1.9] tracking-[0.06em] text-mute">
                    {t.period}
                    {t.note && <>　{t.note}</>}
                  </p>
                  <a href={e.map} target="_blank" rel="noopener noreferrer" className="font-mincho mt-3 inline-block border-b border-paper/40 pb-1 text-[12px] tracking-[0.2em] text-paper sm:hidden">
                    {l.map}
                  </a>
                </div>
                <a
                  href={e.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mincho hidden shrink-0 border-b border-paper/40 pb-1 text-[13px] tracking-[0.2em] text-paper transition-colors hover:border-copper sm:inline-block"
                >
                  {l.map}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
