import { Cormorant_Garamond, JetBrains_Mono, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// load the three font families used across the site
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-noto-jp',
})

// page metadata for the browser tab and social sharing
export const metadata = {
  title: {
    default: 'NeuraCortex // Cultivated Cortical Compute',
    template: '%s // NeuraCortex',
  },
  description: 'A wetware compute company growing living cortical tissue on microelectrode arrays.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jetbrains.variable} ${notoJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mint text-ink">
        {/* shared header on every page */}
        <Navbar />

        {/* page content slot */}
        <main className="flex-1">{children}</main>

        {/* shared footer on every page */}
        <Footer />
      </body>
    </html>
  )
}
