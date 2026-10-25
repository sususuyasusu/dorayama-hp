import type { NewsItem } from '@/lib/news'

// One news row. Like peaceput: on hover the whole row fills with a deep band
// and the arrow box flips colour. Plain rules between rows, no tick marks.
export function NewsRow({ item }: { item: NewsItem }) {
  return (
    <a
      href={`news/${item.slug}/`}
      className="group relative flex items-center gap-5 px-3 py-6 transition-colors duration-500 hover:bg-[#0a1d12] focus-visible:bg-[#0a1d12] md:gap-8 md:px-5 md:py-8"
    >
      <time className="w-4 shrink-0 text-[12px] tracking-[0.08em] text-mute tabular-nums" style={{ writingMode: 'vertical-rl' }}>
        {item.date}
      </time>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.alt}
        loading="lazy"
        className="aspect-[4/3] w-28 shrink-0 rounded-[3px] object-cover transition-transform duration-700 group-hover:scale-[1.03] md:w-44"
      />
      <p className="chotai font-mincho flex-1 text-[14px] leading-[1.8] tracking-[0.06em] text-paper md:text-[17px]">{item.title}</p>
      <span
        aria-hidden="true"
        className="flex size-5 shrink-0 items-center justify-center rounded-[3px] bg-paper text-[#12301f] transition-colors duration-500 group-hover:bg-[#12301f] group-hover:text-paper md:size-6"
      >
        <svg viewBox="0 0 16 16" className="size-3 md:size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </a>
  )
}
