'use client'

import { useRef } from 'react'
import { useInView } from '@/hooks/use-motion'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id: string
  /** Japanese category name, set vertically in a thin box */
  jp: string
  /** Large English title */
  en: string
  /** Small English lines under the title */
  lead: string[]
  /** Optional vertical catch copy shown on the right (one string per column) */
  catchCopy?: string[]
  className?: string
}

const EASE = 'cubic-bezier(0.43, 0.05, 0.17, 1)'

// Category heading: boxed vertical Japanese label, a large thin serif English
// title that sharpens out of a blur, a few small English lines, and an
// optional vertical catch copy on the right.
export function SectionHeading({ id, jp, en, lead, catchCopy, className }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shown = useInView(ref, { threshold: 0.3 })
  const fade = (delay: number, extra: React.CSSProperties = {}) => ({
    opacity: shown ? 1 : 0,
    transition: `opacity 1.4s ${EASE} ${delay}ms, filter 1.6s ${EASE} ${delay}ms, translate 1.4s ${EASE} ${delay}ms`,
    ...extra,
  })

  return (
    <div ref={ref} className={cn('flex items-start gap-6 md:gap-16', className)}>
      <span
        className="font-mincho mt-2 shrink-0 border border-paper/40 px-[7px] py-3 text-[12px] leading-[1.5] tracking-[0.2em] text-paper"
        style={fade(0, { writingMode: 'vertical-rl' })}
      >
        {jp}
      </span>

      <div className="min-w-0 flex-1">
        <h2
          id={id}
          className="font-mincho text-[clamp(44px,8vw,96px)] font-normal leading-none tracking-[0.01em] text-paper"
          style={fade(150, { filter: shown ? 'blur(0)' : 'blur(10px)' })}
        >
          {en}
        </h2>
        <p
          className="mt-6 text-[11px] leading-[1.9] tracking-[0.06em] text-mute"
          style={fade(450, { translate: shown ? '0 0' : '0 8px' })}
        >
          {lead.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      {catchCopy && (
        <p
          className="font-mincho hidden shrink-0 flex-row-reverse items-start gap-6 text-[22px] leading-[1.6] tracking-[0.25em] text-paper md:flex lg:text-[26px]"
          style={fade(700)}
        >
          {catchCopy.map((col, i) => (
            <span key={col} style={{ writingMode: 'vertical-rl', marginTop: i % 2 === 1 ? '2.5em' : 0 }}>
              {col}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
