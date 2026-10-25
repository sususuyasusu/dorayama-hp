import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const pillClass =
  'chotai inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-paper/80 px-6 text-[12px] font-light tracking-[0.15em] text-paper transition-colors duration-500 hover:bg-paper/10 active:bg-paper/15'

type PillLinkProps = {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
  ariaLabel?: string
}

export function PillLink({ href, children, className, external, ariaLabel }: PillLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(pillClass, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <span className="sr-only">（新しいタブで開きます）</span>}
    </a>
  )
}
