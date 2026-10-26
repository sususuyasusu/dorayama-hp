import { DICT, type Lang } from '@/lib/i18n'
import { INSTAGRAM_URL, RESERVE_URL } from '@/lib/site'
import { PillLink } from './pill-link'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { ShopMap } from './shop-map'

const ADDRESS: Record<Lang, string> = {
  ja: '東京都江東区門前仲町2丁目6-9 ひいらぎビル1F',
  en: 'Hiiragi Bldg. 1F, 2-6-9 Monzen-nakacho, Koto-ku, Tokyo',
  zh: '东京都江东区门前仲町2丁目6-9 ひいらぎビル1F',
  ko: '도쿄도 고토구 몬젠나카초 2초메 6-9 히이라기 빌딩 1층',
}
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=%E9%96%80%E4%BB%B2%E3%81%A9%E3%82%89%E3%82%84%E3%81%8D%20%E3%81%A9%E3%82%89%E5%B1%B1%20%E7%B8%BD%E6%9C%AC%E9%8B%AA'

export function AccessSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].access
  const info: [string, React.ReactNode][] = [
    [t.rows.name, t.values.name],
    [t.rows.address, <>〒135-0048<br />{ADDRESS[lang]}</>],
    [t.rows.access, t.values.access],
    [t.rows.hours, t.values.hours],
    [t.rows.closed, t.values.closed],
    [t.rows.payment, t.values.payment],
    [
      t.rows.contact,
      <a key="mail" href="mailto:info@dorayama.com" className="underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-copper">
        info@dorayama.com
      </a>,
    ],
  ]
  return (
    <section id="access" aria-labelledby="access-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="access-heading" jp={t.label} en="Access" lead={t.lead} vertical={lang === 'ja'} />

        <Reveal className="mt-16 max-w-3xl">
          <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">{t.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-16">
          <Reveal>
            <dl className="border-t border-paper/10 text-[13px] tracking-[0.08em]">
              {info.map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-paper/10 py-5 md:grid-cols-[8rem_1fr]"
                >
                  <dt className="text-mute">{term}</dt>
                  <dd className="leading-loose text-paper tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 flex flex-wrap gap-4">
              <PillLink href={RESERVE_URL} external>
                {t.reserve}
              </PillLink>
              <PillLink href={INSTAGRAM_URL} external>
                Instagram
              </PillLink>
            </div>
          </Reveal>

          <Reveal delay={200} className="flex flex-col gap-4">
            <ShopMap className="img-frame relative aspect-square w-full overflow-hidden md:aspect-auto md:min-h-[28rem] md:flex-1" />
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="chotai-r self-end text-[12px] tracking-[0.1em] text-mute underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
            >
              {t.map}
              <span className="sr-only">{DICT[lang].header.newTab}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
