'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { BottomBar } from '@/components/layout/bottom-bar'
import { SetupGuard } from '@/components/setup-guard'

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBlankLayout = pathname === '/setup' || pathname === '/welcome'

  return (
    <SetupGuard>
      {isBlankLayout ? (
        // Setup wizard gets its own full-screen layout (no header/sidebar/bottombar)
        <>{children}</>
      ) : (
        // Normal app shell
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div className="max-w-[1440px] mx-auto px-4 py-4 md:px-8 md:py-6">
              {children}
            </div>
          </main>
          <BottomBar />
        </div>
      )}
    </SetupGuard>
  )
}
