import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Improvement, ImprovementCategory } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード改善提案 ──

const SEED_IMPROVEMENTS: Improvement[] = []

// ── Store 型定義 ──

interface ImprovementState {
  improvements: Improvement[]
  _hydrated: boolean
}

interface ImprovementActions {
  addImprovement: (data: Partial<Improvement>) => Improvement
  updateImprovement: (id: string, data: Partial<Improvement>) => void
  deleteImprovement: (id: string) => void
  updateStatus: (id: string, status: Improvement['status']) => void
  vote: (id: string, userId: string) => void
  getImprovements: () => Improvement[]
  getImprovementsByCategory: (category: ImprovementCategory) => Improvement[]
  setHydrated: () => void
}

type ImprovementStore = ImprovementState & ImprovementActions

// ── Store ──

export const useImprovementStore = create<ImprovementStore>()(
  persist(
    (set, get) => ({
      improvements: SEED_IMPROVEMENTS,
      _hydrated: false,

      addImprovement: (data: Partial<Improvement>) => {
        const now = today()
        const newImprovement: Improvement = {
          id: generateId(),
          title: data.title || '',
          category: data.category || 'other',
          description: data.description || '',
          expected_effect: data.expected_effect || '',
          author_id: data.author_id || '',
          department: data.department || '',
          is_anonymous: data.is_anonymous || false,
          status: 'proposed',
          votes: 0,
          voted_by: [],
          related_task_id: '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ improvements: [...state.improvements, newImprovement] }))
        return newImprovement
      },

      updateImprovement: (id: string, data: Partial<Improvement>) => {
        set((state) => ({
          improvements: state.improvements.map((imp) =>
            imp.id === id ? { ...imp, ...data, updated_at: today() } : imp
          ),
        }))
      },

      deleteImprovement: (id: string) => {
        set((state) => ({
          improvements: state.improvements.map((imp) =>
            imp.id === id ? { ...imp, deleted_at: today() } : imp
          ),
        }))
      },

      updateStatus: (id: string, status: Improvement['status']) => {
        set((state) => ({
          improvements: state.improvements.map((imp) =>
            imp.id === id ? { ...imp, status, updated_at: today() } : imp
          ),
        }))
      },

      vote: (id: string, userId: string) => {
        set((state) => ({
          improvements: state.improvements.map((imp) => {
            if (imp.id !== id) return imp
            const hasVoted = imp.voted_by.includes(userId)
            if (hasVoted) {
              return {
                ...imp,
                votes: imp.votes - 1,
                voted_by: imp.voted_by.filter((uid) => uid !== userId),
                updated_at: today(),
              }
            }
            return {
              ...imp,
              votes: imp.votes + 1,
              voted_by: [...imp.voted_by, userId],
              updated_at: today(),
            }
          }),
        }))
      },

      getImprovements: () => {
        return get().improvements.filter((imp) => !imp.deleted_at)
      },

      getImprovementsByCategory: (category: ImprovementCategory) => {
        return get().improvements.filter((imp) => !imp.deleted_at && imp.category === category)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-improvements',
      partialize: (state) => ({
        improvements: state.improvements,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
