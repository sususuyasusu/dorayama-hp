import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Noto_Serif_JP, Shippori_Mincho } from 'next/font/google'
import { Loader } from '@/components/site/loader'
import { alternates } from '@/lib/seo'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import { ViewportFade } from '@/components/site/viewport-fade'
import './globals.css'

const mincho = Shippori_Mincho({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mincho',
  display: 'swap',
  preload: false,
})

// sharp serif for all Latin text and figures (category titles use the 300 cut)
const display = Cormorant_Garamond({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// extra-light mincho for the small vertical category labels
const hairline = Noto_Serif_JP({
  weight: '200',
  subsets: ['latin'],
  variable: '--font-hairline',
  display: 'swap',
  preload: false,
})

// the Japanese mincho lacks simplified Chinese and Hangul, and mixing it with a
// fallback font makes the characters sit at different heights, so the Chinese
// and Korean pages are set entirely in one font of their own (globals.css).
// They come straight from Google Fonts at view time: bundling them at build
// time means hundreds of font files and the build times out.
const CJK_FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap'

const SITE_URL = 'https://dorayama.com'
const DESCRIPTION =
  '門前仲町、深川不動堂と富岡八幡宮の参道にあるどらやき専門店。毎朝、店頭の銅板で一枚ずつ手焼きする、ふかふかの「おふとん生地」と塩入りつぶあん。東京メトロ門前仲町駅から徒歩1分、年中無休。'
// Google Analytics 4 (property: どら山 總本鋪 - GA4 / stream: どら山 公式HP)
const GA_ID = 'G-2L6DPTLG8W'

// structured data so search engines can show the shop's address, hours and map
const SHOP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': `${SITE_URL}/#shop`,
  name: '門仲どらやき どら山 總本鋪',
  alternateName: ['どら山', 'DORAYAMA'],
  description: DESCRIPTION,
  url: `${SITE_URL}/`,
  image: [`${SITE_URL}/images/70.jpg`, `${SITE_URL}/images/71.jpg`, `${SITE_URL}/images/72.jpg`],
  logo: `${SITE_URL}/images/logo-full.png`,
  email: 'info@dorayama.com',
  servesCuisine: '和菓子（どらやき）',
  priceRange: '¥',
  address: {
    '@type': 'PostalAddress',
    postalCode: '135-0048',
    addressRegion: '東京都',
    addressLocality: '江東区',
    streetAddress: '門前仲町2丁目6-9 ひいらぎビル1F',
    addressCountry: 'JP',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 35.6726091, longitude: 139.7957982 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '16:00',
    },
  ],
  paymentAccepted: '現金, クレジットカード, 交通系IC',
  sameAs: ['https://www.instagram.com/dorayama_jp/'],
}

// until the free certificate is issued, http stays as is; once https answers,
// visitors on http are moved over to it
const HTTPS_UPGRADE = `(function(){var h=location.hostname;if(location.protocol!=='http:'||!/(^|\\.)dorayama\\.com$/.test(h))return;fetch('https://'+h+'/robots.txt',{mode:'no-cors',cache:'no-store'}).then(function(){location.replace('https://'+h+location.pathname+location.search+location.hash)}).catch(function(){})})();`

// analytics only on the real site, not on the GitHub preview copy
const GA_INIT = `(function(){if(!/(^|\\.)dorayama\\.com$/.test(location.hostname))return;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');})();`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '門仲どらやき どら山 總本鋪 | 門前仲町のどらやき専門店 DORAYAMA',
  description: DESCRIPTION,
  keywords: ['門仲どらやき', 'どら山', 'どらやき', '門前仲町', '門仲', '和菓子', '深川', '富岡八幡宮', '深川不動堂', '手土産', '生どら'],
  alternates: alternates('ja', ''),
  robots: { index: true, follow: true },
  openGraph: {
    title: '門仲どらやき どら山 總本鋪',
    description: '毎朝、銅板で一枚ずつ。門前仲町のどらやき専門店。',
    url: '/',
    siteName: '門仲どらやき どら山 總本鋪',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: '/images/70.jpg', alt: '門仲どらやき どら山' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '門仲どらやき どら山 總本鋪',
    description: '毎朝、銅板で一枚ずつ。門前仲町のどらやき専門店。',
    images: ['/images/70.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '48x48' },
      { url: '/icon.png?v=2', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png?v=2',
  },
}

export const viewport: Viewport = {
  themeColor: '#12301f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${mincho.variable} ${display.variable} ${hairline.variable}`}
    >
      <head>
        {/* every relative image / page link resolves from the site root, on any page */}
        <base href={`${process.env.NEXT_PUBLIC_SITE_BASE ?? "/dorayama-hp"}/`} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={CJK_FONTS} />
        <script dangerouslySetInnerHTML={{ __html: HTTPS_UPGRADE }} />
        {/* one root layout serves every language; set the page language from the address */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=location.pathname.match(/\\/(en|zh|ko)(\\/|$)/);if(m)document.documentElement.lang=m[1]==='zh'?'zh-Hans':m[1];})();`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: GA_INIT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SHOP_JSON_LD) }} />
      </head>
      <body
        className="antialiased"
        style={{ backgroundImage: 'url(images/grain.png)', backgroundBlendMode: 'overlay' }}
      >
        <Loader />
        <SmoothScroll />
        <ViewportFade />
        {children}
      </body>
    </html>
  )
}
