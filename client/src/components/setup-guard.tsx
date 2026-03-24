'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCompanyStore } from '@/stores/company-store'

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { company, _hydrated } = useCompanyStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!_hydrated) return

    const isSetupPath = pathname === '/setup'

    if (!company.setup_completed && !isSetupPath) {
      router.replace('/setup')
      return
    }

    if (company.setup_completed && isSetupPath) {
      router.replace('/')
      return
    }

    setReady(true)
  }, [_hydrated, company.setup_completed, pathname, router])

  // While hydrating or redirecting, show nothing
  if (!_hydrated || !ready) {
    return null
  }

  return <>{children}</>
}
