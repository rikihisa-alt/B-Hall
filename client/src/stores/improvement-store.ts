import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Improvement, ImprovementCategory } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード改善提案 ──

const SEED_IMPROVEMENTS: Improvement[] = [
  {
    id: 'imp-1',
    title: '経費精算プロセスの電子化',
    category: 'process',
    description: '現在紙ベースで行っている経費精算を完全電子化する。領収書のスキャン・OCR処理、承認フローのデジタル化により処理時間を大幅に削減。',
    expected_effect: '経費精算の処理時間を現在の3日から即日に短縮。紙の使用量を年間約5,000枚削減。',
    author_id: 'user-3',
    department: '経理部',
    is_anonymous: false,
    status: 'proposed',
    votes: 3,
    voted_by: ['user-1', 'user-2', 'user-6'],
    related_task_id: '',
    created_at: daysFromNow(-10),
    updated_at: daysFromNow(-10),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'imp-2',
    title: '会議室予約システム導入',
    category: 'process',
    description: '会議室の予約をカレンダーシステムと連動させ、ダブルブッキングの防止と利用状況の可視化を実現する。',
    expected_effect: 'ダブルブッキング発生率を0%に。会議室稼働率の可視化により、スペースの有効活用が可能に。',
    author_id: 'user-6',
    department: '総務部',
    is_anonymous: false,
    status: 'approved',
    votes: 5,
    voted_by: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    related_task_id: '',
    created_at: daysFromNow(-20),
    updated_at: daysFromNow(-5),
    created_by: 'user-6',
    updated_by: 'user-5',
    deleted_at: null,
  },
  {
    id: 'imp-3',
    title: '印刷コスト削減施策',
    category: 'cost',
    description: '社内文書のペーパーレス化を推進し、印刷コストの30%削減を目指す。デフォルト両面印刷設定、電子署名の導入を提案。',
    expected_effect: '年間印刷コスト約120万円の30%（約36万円）削減。CO2排出量の削減にも貢献。',
    author_id: 'user-6',
    department: '総務部',
    is_anonymous: false,
    status: 'in_progress',
    votes: 4,
    voted_by: ['user-1', 'user-3', 'user-4', 'user-5'],
    related_task_id: 'task-1',
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-3),
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
  {
    id: 'imp-4',
    title: 'ヒヤリハット報告の簡素化',
    category: 'safety',
    description: '現在のヒヤリハット報告書のフォーマットを簡素化し、スマートフォンからも簡単に報告できるようにする。報告のハードルを下げることで報告件数の増加を目指す。',
    expected_effect: 'ヒヤリハット報告件数の50%増加。早期のリスク発見と事故予防の強化。',
    author_id: 'user-2',
    department: '人事部',
    is_anonymous: false,
    status: 'reviewing',
    votes: 2,
    voted_by: ['user-4', 'user-6'],
    related_task_id: '',
    created_at: daysFromNow(-7),
    updated_at: daysFromNow(-2),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'imp-5',
    title: 'リモートワーク環境改善',
    category: 'environment',
    description: 'リモートワーク時のコミュニケーション課題を解消するため、オンラインツールの統一と利用ガイドラインの策定を提案。併せてリモートワーク手当の見直しも検討。',
    expected_effect: 'リモートワーク時の生産性10%向上。従業員満足度スコアの改善。',
    author_id: 'user-4',
    department: '経営企画',
    is_anonymous: false,
    status: 'proposed',
    votes: 6,
    voted_by: ['user-1', 'user-2', 'user-3', 'user-5', 'user-6', 'user-4'],
    related_task_id: '',
    created_at: daysFromNow(-5),
    updated_at: daysFromNow(-5),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
]

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
