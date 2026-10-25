import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Noto_Sans_JP, Noto_Serif_JP, Shippori_Mincho } from 'next/font/google'
import { Loader } from '@/components/site/loader'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import './globals.css'

const mincho = Shippori_Mincho({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mincho',
  display: 'swap',
  preload: false,
})

const notoSans = Noto_Sans_JP({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: false,
})

// sharp, hairline serif for the large English category titles
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

const inter = Inter({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '門仲どらやき どら山 總本鋪 | DORAYAMA',
  description:
    '門前仲町、深川不動堂と富岡八幡宮の参道にあるどらやき専門店。毎朝、店頭の銅板で一枚ずつ手焼きする、ふかふかの「おふとん生地」と塩入りつぶあん。',
  generator: 'v0.app',
  openGraph: {
    title: '門仲どらやき どら山 總本鋪',
    description: '毎朝、銅板で一枚ずつ。門前仲町のどらやき専門店。',
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
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
      className={`${mincho.variable} ${notoSans.variable} ${inter.variable} ${display.variable} ${hairline.variable}`}
    >
      <body
        className="antialiased"
        style={{ backgroundImage: 'url(images/grain.png)', backgroundBlendMode: 'overlay' }}
      >
        <Loader />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
