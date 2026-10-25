import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Noto_Serif_JP, Shippori_Mincho } from 'next/font/google'
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
      className={`${mincho.variable} ${display.variable} ${hairline.variable}`}
    >
      <body
        className="antialiased"
        style={{ backgroundImage: 'url(images/grain.png)', backgroundBlendMode: 'overlay' }}
      >
        <Loader />
        <SmoothScroll />
        {children}
        {/* the bottom of the screen always melts into the textured green, so
            photos and text fade out as they scroll past the lower edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[24svh] md:h-[20vh]"
          style={{
            backgroundColor: '#12301f',
            backgroundImage: 'url(images/grain.png)',
            backgroundBlendMode: 'overlay',
            maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.85) 22%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.85) 22%, transparent 100%)',
          }}
        />
      </body>
    </html>
  )
}
