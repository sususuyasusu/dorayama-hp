import { DICT, type Lang } from '@/lib/i18n'
import { Reveal } from './reveal'
import { WindowPanel } from './window-panel'

const IMAGES = ['images/70.jpg', 'images/71.jpg', 'images/72.jpg']
// only the last one is a product, so only it links to the menu
const PRODUCT_INDEX = 2

// After nasu-ougiya.com: a vertical section title, then full-screen windows
// that scroll by while the photo and text inside stay still on screen, each
// with a bold vertical name, vertical copy and a vertical "details" link.
// The translations are set horizontally.
export function SignatureSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].signature
  const vertical = lang === 'ja'
  return (
    <section aria-labelledby="signature-heading">
      <div className="flex justify-center py-28 md:py-40">
        {/* the heading itself is the vertical, fading element: a wrapper box
            around vertical text is mis-sized by Safari and pushes it off centre */}
        <Reveal
          as="h2"
          className="font-mincho text-[30px] font-bold tracking-[0.2em] text-paper md:text-[38px]"
          style={vertical ? { writingMode: 'vertical-rl' } : undefined}
        >
          <span id="signature-heading">{t.heading}</span>
        </Reveal>
      </div>

      {t.items.map((item, i) => (
        <WindowPanel key={item.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES[i]} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#0a1d12]/75 via-[#0a1d12]/40 to-transparent md:w-3/5"
          />
          {vertical ? (
            <div className="absolute inset-0 flex flex-row-reverse items-start gap-6 px-6 pt-[min(12svh,96px)] text-paper md:gap-10 md:px-[12vw] md:pt-[min(16svh,160px)]">
              <h3
                className="font-mincho shrink-0 whitespace-nowrap text-[min(30px,5.5svh)] font-bold tracking-[0.15em] md:text-[min(40px,6svh)]"
                style={{ writingMode: 'vertical-rl' }}
              >
                {item.name}
              </h3>
              <p className="font-mincho mt-[min(48px,6svh)] flex flex-row-reverse gap-2.5 text-[min(15px,2.7svh)] leading-[1.9] tracking-[0.18em] md:mt-[min(96px,9svh)] md:gap-5 md:text-[min(19px,2.9svh)] md:tracking-[0.2em]">
                {item.copy.map((line) => (
                  <span key={line} className="block shrink-0 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                    {line}
                  </span>
                ))}
              </p>
              {i === PRODUCT_INDEX && (
                <a
                  href="#products"
                  className="chotai font-mincho mt-[min(128px,18svh)] shrink-0 whitespace-nowrap text-[min(14px,2.6svh)] font-bold tracking-[0.2em] transition-opacity hover:opacity-70 md:mt-[min(224px,24svh)] md:text-[min(17px,2.7svh)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {t.details}
                </a>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex justify-end px-6 pt-[min(14svh,120px)] text-paper md:px-[10vw] md:pt-[min(18svh,170px)]">
              <div className="max-w-md">
                <h3 className="font-mincho text-[min(28px,5svh)] font-bold tracking-[0.06em] md:text-[min(36px,5.5svh)]">{item.name}</h3>
                <p className="font-mincho mt-6 flex flex-col gap-1 text-[min(15px,2.6svh)] leading-[1.8] tracking-[0.03em] md:text-[min(18px,2.8svh)]">
                  {item.copy.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {i === PRODUCT_INDEX && (
                  <a href={`${lang}/#products`} className="font-mincho mt-8 inline-block text-[14px] font-bold tracking-[0.1em] transition-opacity hover:opacity-70">
                    {t.details}
                  </a>
                )}
              </div>
            </div>
          )}
        </WindowPanel>
      ))}
    </section>
  )
}
