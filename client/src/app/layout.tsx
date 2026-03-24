import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { NavigationProvider } from '@/components/layout/sidebar-context'
import { ToastProvider } from '@/components/ui/toast-provider'
import { MainShell } from '@/components/layout/main-shell'

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
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('b-hall-theme');
              if (t === 'dark') document.documentElement.classList.add('dark');
              else if (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
            } catch(e){}
          })()
        `}} />
      </head>
      <body className="antialiased">
        <NavigationProvider>
          <ToastProvider>
            <MainShell>
              {children}
            </MainShell>
          </ToastProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
