import { Reveal, RevealLines } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

const POEM = ['富岡八幡宮奉納、', '毎朝、銅板で一枚ずつ。', 'また食べたくなる、', '毎日食べたくなる。']

const COMMITMENTS = [
  {
    title: 'おふとん生地',
    body: '卵の白身を分けて泡立て、きめ細かなメレンゲにしてから生地に合わせます。たっぷりと空気を含ませることで、スポンジケーキのようにふわりと軽い、ふかふかのおふとんのような皮に焼き上がります。',
  },
  {
    title: '銅板手焼き',
    body: '生地は毎朝、店頭の銅板で一枚ずつ手で焼いています。熱をむらなく伝える銅板で、焼き色と火の通りを見極めながら返していく。店先からは、その日の焼きたての香りが漂います。',
  },
  {
    title: '新三同割',
    body: '卵・小麦粉・砂糖を同じ割合で合わせる、和菓子の伝統配合「三同割」。この基本を土台に、幾千回の試作を重ねて、どら山だけの黄金比率にたどり着きました。',
  },
  {
    title: '塩入りつぶあん',
    body: '北海道十勝産の小豆に白双糖を合わせ、甘さを控えめに炊き上げます。隠し味に塩をきかせ、粒の食感を残すのがどら山のつぶあん。ふんわりした生地との対比を楽しめます。',
  },
  {
    title: '国産素材',
    body: '北海道十勝産小豆、純国産本みりん、香川県産うどん粉、国産こめ油、北海道産てんさい糖。毎日食べても飽きのこない味を目指し、素材は国産のものを選んでいます。',
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
          <Reveal delay={1000} className="mt-12 max-w-md">
            <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">
              深川不動堂と富岡八幡宮を結ぶ参道の近く、門前仲町に店を構えるどらやき専門店です。富岡八幡宮に奉納している縁起の良い「門仲どらやき」を、毎朝店内で焼き上げています。ふかふかの生地と、塩をきかせたつぶあん。温めれば焼きたての香りがよみがえる、日々のおやつにも手みやげにもなるどらやきです。
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-4xl md:mt-48">
        <ol aria-label="どら山のこだわり" className="border-t border-paper/10">
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
