import { DICT, type Lang } from '@/lib/i18n'
import { HeroLogo } from './hero-logo'
import { HeroVideo } from './hero-video'
import { IntroProgress } from './intro-progress'
import { Reveal } from './reveal'

export function IntroSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].intro
  // Japanese is set vertically; the translations read better left to right
  const vertical = lang === 'ja'
  return (
    <>
      <IntroProgress className="relative h-[300svh]">
        <h1 id="intro-heading" className="sr-only">
          {t.h1}
        </h1>

        {/* pinned video; the logo rises off the top, then the picture melts
            away from the bottom into the green page */}
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <div className="absolute inset-0" style={{ opacity: 'calc(1 - max(0, var(--p) - 0.72) / 0.28)' }}>
            <HeroVideo
              // dorayama.com's server is slow for large files, so the live site
              // streams the opening video from the faster GitHub Pages copy
              src={process.env.NEXT_PUBLIC_VIDEO_URL || 'video/top.mp4'}
              poster="video/top-poster.jpg"
              label={t.video}
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
              // same size and fully visible; it simply travels up and off the top
              transform: 'translateY(calc(min(var(--p), 0.3) / 0.3 * -80svh))',
            }}
          >
            <HeroLogo />
          </div>
        </div>

        {/* copy that scrolls up over the pinned video */}
        <div className="pointer-events-none absolute inset-x-0 top-[115svh] flex justify-end px-6 md:px-[12vw]">
          {vertical ? (
            <p
              className="font-mincho flex flex-row-reverse gap-2.5 text-[14px] leading-[1.9] tracking-[0.25em] text-paper md:gap-8 md:text-[22px] md:leading-[2] md:tracking-[0.3em]"
              style={{ textShadow: '0 0 18px rgba(10,29,18,0.6)' }}
            >
              {/* lines fade in one by one, right to left */}
              {t.copy.map((line, i) => (
                <Reveal
                  key={line}
                  as="span"
                  delay={i * 450}
                  className="block shrink-0 !translate-y-0"
                  style={{ writingMode: 'vertical-rl', marginTop: `${(i % 3) * 1.5}em` }}
                >
                  {line}
                </Reveal>
              ))}
            </p>
          ) : (
            <p
              className="font-mincho flex max-w-xl flex-col gap-3 text-[15px] leading-[1.8] tracking-[0.04em] text-paper md:text-[20px]"
              style={{ textShadow: '0 0 18px rgba(10,29,18,0.6)' }}
            >
              {t.copy.map((line, i) => (
                <Reveal key={line} as="span" delay={i * 450} className="block !translate-y-0">
                  {line}
                </Reveal>
              ))}
            </p>
          )}
        </div>
      </IntroProgress>
      {/* the next section starts while the video is still melting away */}
      <div aria-hidden="true" className="-mt-[45svh]" />
    </>
  )
}
