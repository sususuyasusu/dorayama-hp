import { Reveal, RevealLines } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

export function StoreSection() {
  return (
    <section id="store" aria-labelledby="store-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="store-heading"
          jp="總本鋪"
          en="Store"
          lead={[
            'On the approach to Fukagawa Fudodo and Tomioka Hachimangu,',
            'the batter is baked fresh in the shop every morning.',
          ]}
          catchCopy={['参道の', '焼きたてを']}
        />

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-8">
          <SmartImage
            src="images/20.jpg"
            alt="のれんの掛かった、どら山 總本鋪の外観"
            parallax={0.05}
            className="col-span-2 aspect-[4/3] md:col-span-7 md:aspect-[4/5]"
          />
          <div className="col-span-2 flex flex-col justify-end gap-10 md:col-span-4 md:col-start-9 md:pb-10">
            <RevealLines
              lines={['深川不動堂と富岡八幡宮の参道。', '毎朝、店内で生地を焼いています。']}
              className="font-mincho text-base text-paper md:text-lg"
            />
            <Reveal delay={300}>
              <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute">
                2022年6月、門前仲町に開いた總本鋪。東京メトロ東西線「門前仲町駅」から徒歩1分、三菱UFJ銀行ビルの裏の路地に、白い暖簾が目印の小さな店を構えています。窓越しに銅板で焼く様子が見え、店先には焼きたての香り。参拝の帰りや、ちょっとした手みやげに立ち寄っていただける店でありたいと思っています。
              </p>
            </Reveal>
            <Reveal delay={500}>
              <ul className="flex flex-col gap-3 text-[12px] tracking-[0.1em] text-mute">
                <li className="flex items-center gap-3">
                  <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-copper" />
                  テレビ朝日「じゅん散歩」で紹介
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-copper" />
                  富岡八幡宮へ定期奉納
                </li>
              </ul>
            </Reveal>
          </div>
          <SmartImage
            src="images/22.jpg"
            alt="どらやきが並ぶ店内の棚"
            className="mt-12 aspect-[3/4] md:col-span-4 md:col-start-2 md:mt-24"
          />
          <SmartImage
            src="images/52.jpg"
            alt="ギフト用の箱と紙袋"
            parallax={0.05}
            className="mt-28 aspect-[3/4] md:col-span-5 md:col-start-7 md:mt-48"
          />
        </div>
      </div>
    </section>
  )
}
