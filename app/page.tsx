import { AccessSection } from '@/components/site/access-section'
import { ConceptSection } from '@/components/site/concept-section'
import { IntroSection } from '@/components/site/intro-section'
import { ProductsSection } from '@/components/site/products-section'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { StoreSection } from '@/components/site/store-section'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <IntroSection />
        <ConceptSection />
        <ProductsSection />
        <StoreSection />
        <AccessSection />
      </main>
      <SiteFooter />
      <p
        aria-hidden="true"
        className="pointer-events-none fixed bottom-4 right-4 z-40 text-[10px] tracking-[0.4em] text-paper/70 mix-blend-difference md:bottom-6 md:right-8"
      >
        DORAYAMA
      </p>
    </>
  )
}
