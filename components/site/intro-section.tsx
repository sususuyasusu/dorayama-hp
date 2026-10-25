import { HeroLogo } from './hero-logo'
import { HeroVideo } from './hero-video'
import { IntroProgress } from './intro-progress'
import { SmartImage } from './smart-image'

const COPY = [
  '深川不動堂と富岡八幡宮の参道、',
  '門前仲町の路地に、どら山はあります。',
  '毎朝、店頭の銅板で一枚ずつ。',
  '卵白を泡立てた、おふとんのような生地に、',
  '十勝の小豆を炊いた、塩入りのつぶあん。',
  '富岡八幡宮に奉納する、縁起の良い門仲どらやき。',
  'また食べたくなる、毎日食べたくなる。',
]

// mobile: 6 columns / desktop: 12 columns, offsets give the scattered feel
const GALLERY = [
  { src: 'images/01.jpg', alt: '銅鍋の横で、銅板に生地を流す手元', cls: 'col-span-4 col-start-1 aspect-[4/3] md:col-span-4 md:col-start-1', px: 0.05 },
  { src: 'images/10.jpg', alt: '断面を見せた黑どら', cls: 'col-span-3 col-start-4 mt-16 aspect-[3/4] md:col-span-3 md:col-start-7 md:mt-40', px: 0.1 },
  { src: 'images/03.jpg', alt: '銅板の上に並ぶ、焼き色のついた皮', cls: 'col-span-3 col-start-1 mt-10 aspect-square md:col-span-2 md:col-start-11 md:-mt-10', px: 0.03 },
  { src: 'images/13.jpg', alt: '小豆の器と、つぶあんのどらやき', cls: 'col-span-4 col-start-3 mt-10 aspect-[4/3] md:col-span-4 md:col-start-3 md:mt-24', px: 0.07 },
  { src: 'images/30.jpg', alt: '焼き上がった皮を返す職人の手元', cls: 'col-span-3 col-start-1 mt-10 aspect-[3/4] md:col-span-3 md:col-start-9 md:mt-56', px: 0.12 },
  { src: 'images/15.jpg', alt: '緑の個包装を手にしたところ', cls: 'col-span-3 col-start-4 mt-24 aspect-[3/4] md:col-span-2 md:col-start-1 md:mt-12', px: 0.04 },
  { src: 'images/12.jpg', alt: 'ふかふかの生地とつぶあんの断面', cls: 'col-span-5 col-start-2 mt-10 aspect-[4/3] md:col-span-4 md:col-start-5 md:mt-32', px: 0.09 },
  { src: 'images/21.jpg', alt: '白い暖簾の掛かった、どら山の店先', cls: 'col-span-3 col-start-1 mt-10 aspect-[3/4] md:col-span-3 md:col-start-10 md:-mt-6', px: 0.05 },
  { src: 'images/31.jpg', alt: '銅板に生地を流す瞬間', cls: 'col-span-3 col-start-4 mt-20 aspect-square md:col-span-3 md:col-start-2 md:mt-36', px: 0.11 },
  { src: 'images/11.jpg', alt: '白あんの白どら', cls: 'col-span-4 col-start-1 mt-10 aspect-[4/3] md:col-span-3 md:col-start-6 md:mt-20', px: 0.06 },
  { src: 'images/22.jpg', alt: '店内の棚に並ぶどらやき', cls: 'col-span-3 col-start-4 mt-10 aspect-[3/4] md:col-span-2 md:col-start-10 md:mt-48', px: 0.08 },
  { src: 'images/50.jpg', alt: '季節の旬どら、かぼちゃのどらやき', cls: 'col-span-4 col-start-2 mt-16 aspect-[4/3] md:col-span-4 md:col-start-4 md:mt-28', px: 0.04 },
]

export function IntroSection() {
  return (
    <>
      <IntroProgress className="relative h-[300svh]">
        <h1 id="intro-heading" className="sr-only">
          門仲どらやき どら山 總本鋪
        </h1>

        {/* pinned video; the logo rises off the top, then the picture melts
            away from the bottom into the green page */}
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <div className="absolute inset-0" style={{ opacity: 'calc(1 - max(0, var(--p) - 0.72) / 0.28)' }}>
            <HeroVideo
              src="video/top.mp4"
              poster="video/top-poster.jpg"
              label="どら山の店先と、銅板でどらやきを焼く様子"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a1d12]/60 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#0a1d12]"
            style={{ opacity: 'calc(0.25 + min(var(--p), 0.6) * 0.35)' }}
          />
          {/* bottom gradient that climbs up the screen at the end */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: 'calc(18% + max(0, var(--p) - 0.55) / 0.45 * 110%)',
              background: 'linear-gradient(to top, #12301f 0%, #12301f 35%, rgba(18,48,31,0) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              transform: 'translateY(calc(min(var(--p), 0.22) / 0.22 * -42svh)) scale(calc(1 - min(var(--p), 0.22) / 0.22 * 0.35))',
              opacity: 'calc(1 - max(0, var(--p) - 0.14) / 0.1)',
            }}
          >
            <HeroLogo />
          </div>
        </div>

        {/* vertical copy that scrolls up over the pinned video */}
        <div className="pointer-events-none absolute inset-x-0 top-[115svh] flex justify-end px-6 md:px-[12vw]">
          <p
            className="font-mincho flex flex-row-reverse gap-2.5 text-[14px] leading-[1.9] tracking-[0.25em] text-paper md:gap-8 md:text-[22px] md:leading-[2] md:tracking-[0.3em]"
            style={{ textShadow: '0 0 18px rgba(10,29,18,0.6)' }}
          >
            {COPY.map((line, i) => (
              <span key={line} style={{ writingMode: 'vertical-rl', marginTop: `${(i % 3) * 1.5}em` }}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </IntroProgress>

      {/* starts while the video is still melting away, so no empty screen */}
      <div aria-label="どら山の写真" className="relative z-10 mx-auto -mt-[55svh] grid max-w-7xl grid-cols-6 gap-x-4 px-4 pb-40 md:grid-cols-12 md:gap-x-8 md:px-10 md:pb-56">
        {GALLERY.map((g) => (
          <SmartImage key={g.src} src={g.src} alt={g.alt} parallax={g.px} className={`w-full ${g.cls}`} />
        ))}
      </div>
    </>
  )
}
