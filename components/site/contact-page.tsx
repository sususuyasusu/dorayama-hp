import type { Metadata } from 'next'
import { prefix, type Lang } from '@/lib/i18n'
import { alternates } from '@/lib/seo'
import { ContactForm } from './contact-form'
import { SectionHeading } from './section-heading'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

// お問い合わせの専用ページ（2026-11-14 本人「問い合わせフォームはページを分けて」）。/contact/ ・ /en/contact/ ほか
const META: Record<Lang, { title: string; description: string; label: string; lead: string[]; back: string }> = {
  ja: {
    title: 'お問い合わせ | 門仲どらやき どら山 總本鋪',
    description: '門仲どらやき どら山へのご質問、取材・催事・卸のご相談はこちらのフォームから。',
    label: 'お問い合わせ',
    lead: ['Questions, press and event inquiries.', 'We reply by email.'],
    back: '店舗情報へ戻る',
  },
  en: {
    title: 'Contact | Monnaka Dorayaki DORAYAMA',
    description: 'Questions about the shop, press, events or wholesale — please use this form.',
    label: 'Contact',
    lead: ['Questions, press and event inquiries.', 'We reply by email.'],
    back: 'Back to shop information',
  },
  zh: {
    title: '联系我们 | 门仲铜锣烧 DORAYAMA',
    description: '关于店铺的问题、采访、活动或批发合作，请通过此表单联系我们。',
    label: '联系我们',
    lead: ['Questions, press and event inquiries.', 'We reply by email.'],
    back: '返回店铺信息',
  },
  ko: {
    title: '문의 | 몬나카 도라야키 DORAYAMA',
    description: '가게에 대한 질문, 취재・행사・도매 상담은 이 양식으로 보내 주세요.',
    label: '문의',
    lead: ['Questions, press and event inquiries.', 'We reply by email.'],
    back: '매장 정보로 돌아가기',
  },
}

export function contactMetadata(lang: Lang): Metadata {
  const m = META[lang]
  return { title: m.title, description: m.description, alternates: alternates(lang, 'contact/') }
}

export function ContactPage({ lang }: { lang: Lang }) {
  const m = META[lang]
  return (
    <>
      <SiteHeader lang={lang} />
      <main className="px-4 pb-32 pt-32 md:px-10 md:pb-48 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <h1 className="sr-only">{m.label}</h1>
          <SectionHeading id="contact-page-heading" jp={m.label} en="Contact" lead={m.lead} vertical={lang === 'ja'} />
          <ContactForm lang={lang} standalone />
          <p className="mt-20">
            <a href={`${prefix(lang)}#access`} className="text-[13px] tracking-[0.1em] text-mute underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper">
              {m.back}
            </a>
          </p>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
