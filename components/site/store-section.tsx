import { DICT, type Lang } from '@/lib/i18n'
import { Reveal, RevealLines } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

export function StoreSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].store
  return (
    <section id="store" aria-labelledby="store-heading" className="px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="store-heading" jp={t.label} en="Store" lead={t.lead} catchCopy={t.catchCopy} vertical={lang === 'ja'} />

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-8">
          <SmartImage
            src="images/20.jpg"
            alt={t.alts[0]}
            parallax={0.05}
            className="col-span-2 aspect-[4/3] md:col-span-7 md:aspect-[4/5]"
          />
          <div className="col-span-2 flex flex-col justify-end gap-10 md:col-span-4 md:col-start-9 md:pb-10">
            <RevealLines lines={t.lines} className="chotai font-mincho text-base text-paper md:text-lg" />
            <Reveal delay={300}>
              <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute">{t.body}</p>
            </Reveal>
            <Reveal delay={500}>
              <ul className="flex flex-col gap-3 text-[12px] tracking-[0.1em] text-mute">
                {t.bullets.map((b) => (
                  <li key={b} className="chotai flex items-center gap-3">
                    <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-copper" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <SmartImage src="images/22.jpg" alt={t.alts[1]} className="mt-12 aspect-[3/4] md:col-span-4 md:col-start-2 md:mt-24" />
          <SmartImage
            src="images/52.jpg"
            alt={t.alts[2]}
            parallax={0.05}
            className="mt-28 aspect-[3/4] md:col-span-5 md:col-start-7 md:mt-48"
          />
        </div>
      </div>
    </section>
  )
}
