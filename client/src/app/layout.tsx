import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'B-Hall | バックオフィス統合OS',
  description: '株式会社Backlly - バックオフィス統合管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto px-6 py-5 lg:px-8 lg:py-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
