import { INSTAGRAM_URL, RESERVE_URL } from '@/lib/site'
import { PillLink } from './pill-link'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { ShopMap } from './shop-map'

const ADDRESS = '東京都江東区門前仲町2丁目6-9 ひいらぎビル1F'
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=%E9%96%80%E4%BB%B2%E3%81%A9%E3%82%89%E3%82%84%E3%81%8D%20%E3%81%A9%E3%82%89%E5%B1%B1%20%E7%B8%BD%E6%9C%AC%E9%8B%AA'

const INFO: [string, React.ReactNode][] = [
  ['店名', '門仲どらやき どら山 總本鋪'],
  ['住所', <>〒135-0048<br />{ADDRESS}</>],
  ['アクセス', '東京メトロ東西線「門前仲町駅」徒歩1分'],
  ['営業時間', '10:00〜16:00（売り切れ次第終了）'],
  ['定休日', '年中無休'],
  ['お支払い', 'クレジットカード・交通系IC'],
  [
    'お問い合わせ',
    <a key="mail" href="mailto:info@dorayama.com" className="underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-copper">
      info@dorayama.com
    </a>,
  ],
]

export function AccessSection() {
  return (
    <section id="access" aria-labelledby="access-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="access-heading"
          jp="店舗情報"
          en="Access"
          lead={[
            'A one-minute walk from Monzen-nakacho Station,',
            'open every day from 10:00 until sold out.',
          ]}
        />

        <Reveal className="mt-16 max-w-3xl">
          <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">
            毎日10時から16時まで、年中無休で営業しています。毎朝焼いた分がなくなり次第終了となりますので、確実にお求めになりたい方はご予約が便利です。ご予約はテイクイーツから、翌日以降のお受け取り分を5個から、30日先まで承ります（お受け取りは10:30〜15:45）。お支払いはオンライン決済のほか店頭でも可能で、店頭ではクレジットカードと交通系ICがご利用いただけます。
          </p>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-16">
          <Reveal>
            <dl className="border-t border-paper/10 text-[13px] tracking-[0.08em]">
              {INFO.map(([term, value]) => (
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
                ご予約（翌日以降・5個から）
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
              className="self-end text-[12px] tracking-[0.1em] text-mute underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
            >
              Googleマップで開く・経路を調べる
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
