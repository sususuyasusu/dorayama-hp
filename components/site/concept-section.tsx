import { DICT, type Lang } from '@/lib/i18n'
import { Reveal, RevealLines } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

export function ConceptSection({ lang = 'ja' }: { lang?: Lang }) {
  const t = DICT[lang].concept
  return (
    <section id="concept" aria-labelledby="concept-heading" className="px-4 py-32 md:px-10 md:py-48">
      <SectionHeading
        id="concept-heading"
        jp={t.label}
        en="Concept"
        lead={t.lead}
        vertical={lang === 'ja'}
        className="mx-auto mb-24 max-w-6xl md:mb-32"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-2 md:gap-16">
        <SmartImage src="images/02.jpg" alt={t.imageAlt} parallax={0.06} className="aspect-[4/5] w-full" />

        <div className="flex flex-col items-start md:pl-10">
          <RevealLines
            lines={t.poem}
            className="chotai font-mincho flex flex-col gap-6 text-base text-paper sm:text-xl lg:text-[26px]"
            lineClassName="md:[&:nth-child(2)]:pl-[1.5em] md:[&:nth-child(3)]:pl-[3em]"
            stagger={360}
          />
          <Reveal delay={1000} className="mt-12 max-w-md">
            <p className="font-mincho text-[14px] leading-[2.2] tracking-[0.08em] text-mute md:text-[15px]">{t.body}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-4xl md:mt-48">
        <ol aria-label={t.listLabel} className="border-t border-paper/10">
          {t.items.map((item, i) => (
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
              <p className="col-start-2 text-[13px] leading-loose tracking-[0.08em] text-mute md:col-start-3">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
