import { Reveal } from './reveal'

const ITEMS = [
  {
    name: '黑どら',
    image: 'images/40.jpg',
    alt: '断面を見せた黑どら',
    copy: [
      'どら山の定番、つぶあんのどらやき。',
      '北海道十勝産の小豆を',
      '甘さ控えめに炊き上げ、',
      '隠し味に塩をきかせました。',
      'ふかふかの生地との対比をどうぞ。',
    ],
  },
  {
    name: '白どら',
    image: 'images/41.jpg',
    alt: '断面を見せた白どら',
    copy: [
      '白いんげん豆の白あんを挟んだ、',
      'やさしい甘さのどらやき。',
      'なめらかな口あたりが、',
      '卵白を泡立てた軽い生地に',
      'よくなじみます。',
    ],
  },
  {
    name: 'あんバターどら',
    image: 'images/42.jpg',
    alt: 'つぶあんとバターを挟んだ、あんバターどら',
    copy: [
      '塩入りのつぶあんに、',
      '十勝産生乳のバターを重ねました。',
      'あんの甘さとバターのコク、',
      'ひと口目から満ち足りる、',
      'どら山の人気のひと品です。',
    ],
  },
]

// After nasu-ougiya.com: a vertical section title, then full-screen photo
// panels that pin in place while the next one slides up over them, each with
// a bold vertical name, vertical copy and a vertical "details" link.
export function SignatureSection() {
  return (
    <section aria-labelledby="signature-heading">
      <div className="flex justify-center py-28 md:py-40">
        {/* the heading itself is the vertical, fading element: a wrapper box
            around vertical text is mis-sized by Safari and pushes it off centre */}
        <Reveal
          as="h2"
          className="font-mincho text-[30px] font-bold tracking-[0.2em] text-paper md:text-[38px]"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span id="signature-heading">定番商品</span>
        </Reveal>
      </div>

      {ITEMS.map((item) => (
        <div key={item.name} className="sticky top-0 h-svh overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#ebe7df]/70 via-[#ebe7df]/35 to-transparent md:w-3/5"
          />
          <div className="absolute inset-0 flex flex-row-reverse items-start gap-6 px-6 pt-[12svh] text-[#12301f] md:gap-10 md:px-[12vw] md:pt-[18svh]">
            <h3
              className="font-mincho shrink-0 text-[30px] font-bold tracking-[0.15em] md:text-[40px]"
              style={{ writingMode: 'vertical-rl' }}
            >
              {item.name}
            </h3>
            <p
              className="font-mincho mt-12 flex flex-row-reverse gap-2.5 text-[15px] leading-[1.9] tracking-[0.18em] md:mt-24 md:gap-5 md:text-[19px] md:tracking-[0.2em]"
            >
              {item.copy.map((line) => (
                <span key={line} className="block shrink-0" style={{ writingMode: 'vertical-rl' }}>
                  {line}
                </span>
              ))}
            </p>
            <a
              href="#products"
              className="font-mincho mt-32 shrink-0 text-[14px] font-bold tracking-[0.2em] transition-opacity hover:opacity-70 md:mt-56 md:text-[17px]"
              style={{ writingMode: 'vertical-rl' }}
            >
              （商品詳細）
            </a>
          </div>
        </div>
      ))}
    </section>
  )
}
