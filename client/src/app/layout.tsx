import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { BottomBar } from '@/components/layout/bottom-bar'
import { NavigationProvider } from '@/components/layout/sidebar-context'
import { ToastProvider } from '@/components/ui/toast-provider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'B-Hall',
  description: 'Company Workspace OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="antialiased">
        <NavigationProvider>
          <ToastProvider>
            <div className="flex flex-col h-screen overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                <div className="max-w-[1440px] mx-auto px-4 py-4 md:px-8 md:py-6">
                  {children}
                </div>
              </main>
              <BottomBar />
            </div>
          </ToastProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
