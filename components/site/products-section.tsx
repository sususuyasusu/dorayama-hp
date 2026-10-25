'use client'

import { type FocusEvent, useEffect, useRef, useState } from 'react'
import { RESERVE_URL } from '@/lib/site'
import { CrossfadeImage } from './crossfade-image'
import { PillLink } from './pill-link'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { SmartImage } from './smart-image'

type Product = {
  name: string
  description: string
  price?: string
  image: string
  alt: string
  gallery?: string[]
}

const PRODUCTS: Product[] = [
  {
    name: '黑どら（つぶあん）',
    description: '塩をきかせた十勝小豆のつぶあん。',
    price: '299',
    image: 'images/40.jpg',
    alt: '黑どら（つぶあん）',
  },
  {
    name: '白どら（白あん）',
    description: '白いんげん豆のやさしい白あん。',
    price: '299',
    image: 'images/41.jpg',
    alt: '白どら（白あん）',
  },
  {
    name: 'あんバターどら',
    description: 'つぶあんと、十勝産生乳のバター。',
    price: '399',
    image: 'images/42.jpg',
    alt: 'つぶあんとバターを挟んだ、あんバターどら',
  },
  {
    name: 'めっちゃ抹茶どら',
    description: '抹茶をたっぷり使った、緑のどらやき。',
    price: '450',
    image: 'images/43.jpg',
    alt: '抹茶色の生地の、めっちゃ抹茶どら',
  },
  {
    name: '生どら',
    description: '季節のフルーツとクリームをふかふか生地で。',
    price: '480',
    image: 'images/44.jpg',
    alt: 'フルーツとクリームを挟んだ生どら',
    gallery: ['images/45.jpg', 'images/46.jpg', 'images/47.jpg', 'images/48.jpg', 'images/49.jpg'],
  },
  {
    name: '旬どら（月替わり）',
    description: '10月は「幻の栗マロンかぼちゃどら」。',
    price: '450〜',
    image: 'images/14.jpg',
    alt: '10月の旬どら、幻の栗マロンかぼちゃどら',
  },
  {
    name: '手みやげ・ギフト',
    description: '個包装と箱、紙袋でお渡しします。',
    image: 'images/51.jpg',
    alt: '個包装のどらやきとギフト箱、紙袋',
  },
]

export function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const distanceRef = useRef(0)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    let raf = 0

    // vertical scrolling drives the horizontal track on every screen size
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0
      track.style.transform = `translate3d(${(-progress * distanceRef.current).toFixed(1)}px,0,0)`
      // each panel's caption is see-through near the screen edges and fades in
      // as the panel slides toward the middle
      const vw = window.innerWidth
      track.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
        const r = el.getBoundingClientRect()
        const offset = Math.abs(r.left + r.width / 2 - vw / 2) / vw
        const t = Math.min(Math.max((0.62 - offset) / 0.32, 0), 1)
        const eased = t * t * (3 - 2 * t)
        el.style.opacity = eased.toFixed(3)
        el.style.translate = `0 ${((1 - eased) * 14).toFixed(1)}px`
      })
    }
    const measure = () => {
      const distance = Math.max(track.scrollWidth - window.innerWidth, 0)
      distanceRef.current = distance
      setHeight(window.innerHeight + distance)
      update()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Keep keyboard focus visible: scroll the page to the point where the focused panel is in view.
  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return
    sticky.scrollLeft = 0
    const panel = (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')
    if (!panel || !distanceRef.current) return
    const target = Math.min(Math.max(panel.offsetLeft - window.innerWidth * 0.15, 0), distanceRef.current)
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: sectionTop + target, behavior: 'auto' })
  }

  return (
    <section id="products" aria-labelledby="products-heading">
      <div ref={sectionRef} style={{ height: height ?? undefined }} className="relative">
        <div
          ref={stickyRef}
          className="sticky top-0 flex h-svh items-center overflow-hidden md:h-screen"
        >
          <div
            ref={trackRef}
            onFocus={handleFocus}
            className="flex w-max flex-row items-end gap-[12vw] px-[6vw] pt-16 will-change-transform md:gap-[8vw] md:px-[8vw]"
          >
            <div className="flex w-[86vw] shrink-0 flex-col justify-end pb-[12vh] md:w-[30rem] md:pb-24">
              <SectionHeading
                id="products-heading"
                jp="お品書き"
                en="Products"
                lead={['Skins baked fresh every morning,', 'with classic and seasonal fillings.']}
              />
              <Reveal delay={300} className="mt-10 text-[13px] leading-loose tracking-[0.08em] text-mute md:pl-[calc(2rem+4rem)]">
                <p>毎朝焼き上げる皮に、季節ごとの餡を。ご予約は翌日以降、5個から承ります。</p>
              </Reveal>
            </div>

            {PRODUCTS.map((p, i) => (
              <ProductPanel key={p.name} product={p} index={i + 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-32 pt-8 md:px-10 md:pb-48 md:pt-24">
        <Reveal>
          <h3 className="mb-8 text-[12px] tracking-[0.2em] text-mute">その他</h3>
          <dl className="border-t border-paper/10 text-[13px] tracking-[0.1em]">
            {[
              ['皮だけ（4枚）', '430'],
              ['瓶コーヒー', '300'],
            ].map(([name, price]) => (
              <div key={name} className="flex items-baseline justify-between border-b border-paper/10 py-5">
                <dt className="text-paper">{name}</dt>
                <dd className="text-paper tabular-nums">
                  {price}
                  <span className="ml-0.5 text-mute">圓</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[11px] tracking-[0.1em] text-mute">価格はすべて税込です。</p>
        </Reveal>
      </div>
    </section>
  )
}

function ProductPanel({ product, index }: { product: Product; index: number }) {
  return (
    <article
      data-panel
      aria-labelledby={`product-${index}`}
      className="flex w-[82vw] shrink-0 flex-col gap-6 md:w-[min(56vw,calc(62vh*1.25))] md:gap-8"
    >
      {product.gallery ? (
        <CrossfadeImage
          images={[product.image, ...product.gallery]}
          alt={product.alt}
          className="h-[46svh] w-full md:h-[62vh]"
        />
      ) : (
        <SmartImage src={product.image} alt={product.alt} className="h-[46svh] w-full md:h-[62vh]" />
      )}
      <div
        data-fade
        className="flex flex-wrap items-end justify-between gap-4 pb-[12vh] opacity-0 will-change-[opacity,translate] md:gap-6 md:pb-24"
      >
        <div className="min-w-0">
          <h3 id={`product-${index}`} className="flex items-baseline gap-4 text-paper">
            <span className="text-[12px] text-copper tabular-nums" aria-hidden="true">
              {index}.
            </span>
            <span className="font-mincho text-lg md:text-xl">{product.name}</span>
          </h3>
          <p className="mt-1 pl-7 text-[12px] leading-loose tracking-[0.08em] text-mute">
            {product.description}
          </p>
        </div>
        <div className="flex items-center gap-6 pl-7 md:pl-0">
          {product.price && (
            <p className="font-mincho text-lg leading-none text-paper tabular-nums" aria-label={`税込${product.price}円`}>
              {product.price}
              <span className="ml-1 text-sm text-mute">圓</span>
            </p>
          )}
          <PillLink href={RESERVE_URL} external ariaLabel={`${product.name}をご予約（新しいタブで開きます）`}>
            ご予約
          </PillLink>
        </div>
      </div>
    </article>
  )
}
