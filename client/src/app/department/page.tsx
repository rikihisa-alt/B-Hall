'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/* Hub page deprecated — redirect to home */
export default function DepartmentPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/') }, [router])
  return null
}
