import type { Lang } from '@/lib/i18n'
import { AccessSection } from './access-section'
import { ConceptSection } from './concept-section'
import { IntroSection } from './intro-section'
import { MediaSection } from './media-section'
import { NewsSection } from './news-section'
import { ProductsSection } from './products-section'
import { SignatureSection } from './signature-section'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { StoreSection } from './store-section'

// the whole top page, in one of the four languages
export function Home({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <main>
        <IntroSection lang={lang} />
        <div className="relative z-10">
          <NewsSection lang={lang} />
        </div>
        <MediaSection lang={lang} />
        <SignatureSection lang={lang} />
        <ConceptSection lang={lang} />
        <ProductsSection lang={lang} />
        <StoreSection lang={lang} />
        <AccessSection lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
