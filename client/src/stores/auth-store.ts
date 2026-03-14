import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

// ── シードユーザー ──

const now = new Date().toISOString()

const SEED_USERS: User[] = [
  {
    id: 'user-1',
    email: 'tanaka@bhall.jp',
    name: '田中太郎',
    name_kana: 'タナカタロウ',
    role: 'admin',
    department: '開発部',
    position: '管理者',
    avatar_initial: '田',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'user-2',
    email: 'sato@bhall.jp',
    name: '佐藤花子',
    name_kana: 'サトウハナコ',
    role: 'hr',
    department: '人事部',
    position: '人事担当',
    avatar_initial: '佐',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'user-3',
    email: 'suzuki@bhall.jp',
    name: '鈴木一郎',
    name_kana: 'スズキイチロウ',
    role: 'acc',
    department: '経理部',
    position: '経理担当',
    avatar_initial: '鈴',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'user-4',
    email: 'takahashi@bhall.jp',
    name: '高橋美咲',
    name_kana: 'タカハシミサキ',
    role: 'staff',
    department: '経理部',
    position: '一般従業員',
    avatar_initial: '高',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'user-5',
    email: 'yamada@bhall.jp',
    name: '山田太郎',
    name_kana: 'ヤマダタロウ',
    role: 'ceo',
    department: '経営企画',
    position: '代表取締役',
    avatar_initial: '山',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'user-6',
    email: 'ito@bhall.jp',
    name: '伊藤恵',
    name_kana: 'イトウメグミ',
    role: 'ga',
    department: '総務部',
    position: '総務担当',
    avatar_initial: '伊',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface AuthState {
  currentUser: User | null
  users: User[]
  _hydrated: boolean
}

interface AuthActions {
  switchUser: (userId: string) => void
  getCurrentUser: () => User
  setHydrated: () => void
}

type AuthStore = AuthState & AuthActions

// ── Store ──

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: SEED_USERS[0],
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
          return SEED_USERS[0]
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
