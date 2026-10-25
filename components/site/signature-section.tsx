import { Reveal } from './reveal'
import { WindowPanel } from './window-panel'

const ITEMS = [
  {
    name: 'おふとん生地',
    image: 'images/70.jpg',
    alt: '銅鍋の横で、銅板に生地を流す手元',
    copy: [
      '卵の白身を泡立てたメレンゲに、',
      '卵・小麦粉・砂糖を合わせた',
      'どら山の黄金比率の生地。',
      '毎朝、銅鍋で仕込み、',
      'ひとつずつ銅板へ流します。',
    ],
  },
  {
    name: '銅板手焼き',
    image: 'images/71.jpg',
    alt: '銅板の上でこんがりと焼き上がった皮',
    copy: [
      '熱をむらなく伝える銅板で、',
      '一枚ずつ手で焼き上げます。',
      '焼き色と火の通りを見極め、',
      'ふかふかのおふとんのような',
      '皮に仕上げます。',
    ],
  },
  {
    name: '黑どら',
    image: 'images/72.jpg',
    alt: '断面を見せた、つぶあんの黑どら',
    copy: [
      '焼きたての皮で挟むのは、',
      '北海道十勝産の小豆を',
      '甘さ控えめに炊いたつぶあん。',
      '隠し味に塩をきかせた、',
      'どら山の定番です。',
    ],
  },
]

// After nasu-ougiya.com: a vertical section title, then full-screen windows
// that scroll by while the photo and text inside stay still on screen, each
// with a bold vertical name, vertical copy and a vertical "details" link.
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
        <WindowPanel key={item.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#0a1d12]/75 via-[#0a1d12]/40 to-transparent md:w-3/5"
          />
          <div className="absolute inset-0 flex flex-row-reverse items-start gap-6 px-6 pt-[min(12svh,96px)] text-paper md:gap-10 md:px-[12vw] md:pt-[min(16svh,160px)]">
            <h3
              className="font-mincho shrink-0 whitespace-nowrap text-[min(30px,5.5svh)] font-bold tracking-[0.15em] md:text-[min(40px,6svh)]"
              style={{ writingMode: 'vertical-rl' }}
            >
              {item.name}
            </h3>
            <p
              className="font-mincho mt-[min(48px,6svh)] flex flex-row-reverse gap-2.5 text-[min(15px,2.7svh)] leading-[1.9] tracking-[0.18em] md:mt-[min(96px,9svh)] md:gap-5 md:text-[min(19px,2.9svh)] md:tracking-[0.2em]"
            >
              {item.copy.map((line) => (
                <span key={line} className="block shrink-0 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                  {line}
                </span>
              ))}
            </p>
            <a
              href="#products"
              className="chotai font-mincho mt-[min(128px,18svh)] shrink-0 whitespace-nowrap text-[min(14px,2.6svh)] font-bold tracking-[0.2em] transition-opacity hover:opacity-70 md:mt-[min(224px,24svh)] md:text-[min(17px,2.7svh)]"
              style={{ writingMode: 'vertical-rl' }}
            >
              （商品詳細）
            </a>
          </div>
        </WindowPanel>
      ))}
    </section>
  )
}
