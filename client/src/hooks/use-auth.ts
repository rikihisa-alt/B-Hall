'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useEffect, useState } from 'react'
import type { User } from '@/types'

/**
 * 認証フック — コンポーネントから認証状態にアクセスするための便利フック
 * Zustand の persist ミドルウェアによる SSR/ハイドレーション不一致を安全に処理する
 */
export function useAuth() {
  const store = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentUser: User | null = mounted ? store.currentUser : null
  const users: User[] = mounted ? store.users : []

  const switchUser = (userId: string) => {
    store.switchUser(userId)
  }

  const getUserById = (userId: string): User | undefined => {
    return store.users.find((u) => u.id === userId)
  }

  const getUserName = (userId: string): string => {
    const user = store.users.find((u) => u.id === userId)
    return user?.name ?? '不明'
  }

  return {
    currentUser,
    users,
    switchUser,
    getUserById,
    getUserName,
    mounted,
  }
}
