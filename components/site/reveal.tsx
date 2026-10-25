'use client'

import { type ElementType, type ReactNode, useRef } from 'react'
import { useInView } from '@/hooks/use-motion'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.2 })

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[opacity,translate] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

type RevealLinesProps = {
  lines: string[]
  className?: string
  lineClassName?: string
  as?: ElementType
  stagger?: number
}

export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = 'p',
  stagger = 220,
}: RevealLinesProps) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <Reveal key={line} as="span" delay={i * stagger} className={cn('block', lineClassName)}>
          {line}
        </Reveal>
      ))}
    </Tag>
  )
}
