import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

// ── シードユーザー ──

const now = new Date().toISOString()

const SEED_USERS: User[] = []

// ── Store 型定義 ──

interface AuthState {
  currentUser: User | null
  users: User[]
  _hydrated: boolean
}

interface AuthActions {
  switchUser: (userId: string) => void
  getCurrentUser: () => User | null
  setHydrated: () => void
}

type AuthStore = AuthState & AuthActions

// ── Store ──

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: SEED_USERS,
      _hydrated: false,

      switchUser: (userId: string) => {
        const user = get().users.find((u) => u.id === userId)
        if (user) {
          set({ currentUser: user })
        }
      },

      getCurrentUser: () => {
        const { currentUser } = get()
        if (!currentUser) {
          return get().users[0] ?? null
        }
        return currentUser
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
