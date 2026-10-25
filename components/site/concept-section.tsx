import { PillLink } from './pill-link'
import { Reveal, RevealLines } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

const POEM = ['富岡八幡宮奉納、', '毎朝、銅板で一枚ずつ。', 'また食べたくなる、', '毎日食べたくなる。']

const COMMITMENTS = [
  { title: 'おふとん生地', body: '卵白をメレンゲにして、ふかふかのおふとんのような皮に。' },
  { title: '銅板手焼き', body: '毎朝、店頭の銅板で一枚ずつ手で焼いています。' },
  {
    title: '新三同割',
    body: '卵・小麦粉・砂糖を等分にする伝統配合を、幾千回の試作で独自の黄金比率に。',
  },
  { title: '塩入りつぶあん', body: '北海道十勝産小豆と白双糖。甘さ控えめ、隠し味に塩。' },
  {
    title: '国産素材',
    body: '十勝小豆、純国産本みりん、香川県産うどん粉、国産こめ油、北海道産てんさい糖。',
  },
]

export function ConceptSection() {
  return (
    <section id="concept" aria-labelledby="concept-heading" className="px-4 py-32 md:px-10 md:py-48">
      <SectionHeading
        id="concept-heading"
        jp="こだわり"
        en="Concept"
        lead={[
          'Each dorayaki is baked by hand on a copper griddle every morning,',
          'and has long been offered to Tomioka Hachimangu Shrine.',
        ]}
        className="mx-auto mb-24 max-w-6xl md:mb-32"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-2 md:gap-16">
        <SmartImage
          src="images/02.jpg"
          alt="薄暗い店内で静かに並ぶどらやき"
          parallax={0.06}
          className="aspect-[4/5] w-full"
        />

        <div className="flex flex-col items-start md:pl-10">
          <RevealLines
            lines={POEM}
            className="font-mincho flex flex-col gap-6 text-base text-paper sm:text-xl lg:text-[26px]"
            lineClassName="md:[&:nth-child(2)]:pl-[1.5em] md:[&:nth-child(3)]:pl-[3em]"
            stagger={360}
          />
          <Reveal delay={1200} className="mt-16">
            <PillLink href="#commitment">こだわりを見る</PillLink>
          </Reveal>
        </div>
      </div>

      <div id="commitment" className="mx-auto mt-40 max-w-4xl scroll-mt-24 md:mt-56">
        <Reveal className="mb-16 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-copper" />
          <h3 className="text-[12px] tracking-[0.2em] text-mute">どら山のこだわり</h3>
        </Reveal>
        <ol className="border-t border-paper/10">
          {COMMITMENTS.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 120}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 border-b border-paper/10 py-10 md:grid-cols-[4rem_14rem_1fr] md:items-baseline md:gap-x-8"
            >
              <span className="text-[12px] text-copper tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="font-mincho text-lg text-paper">{item.title}</h4>
              <p className="col-start-2 text-[13px] leading-loose tracking-[0.08em] text-mute md:col-start-3">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
