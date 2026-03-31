import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ──

export interface TutorialStep {
  title: string
  description: string
  completed: boolean
}

export interface TutorialItem {
  key: string
  title: string
  description: string
  icon: string // lucide icon name
  steps: TutorialStep[]
  completed: boolean
  href: string
}

interface TutorialProgress {
  completed: number
  total: number
  percentage: number
}

interface TutorialState {
  items: TutorialItem[]
  skippedAll: boolean
  _hydrated: boolean
}

interface TutorialActions {
  completeTutorialStep: (itemKey: string, stepIndex: number) => void
  completeTutorial: (itemKey: string) => void
  skipAllTutorials: () => void
  resetTutorials: () => void
  getProgress: () => TutorialProgress
  setHydrated: () => void
}

type TutorialStore = TutorialState & TutorialActions

// ── Default tutorial data ──

const DEFAULT_ITEMS: TutorialItem[] = [
  {
    key: 'dashboard',
    title: 'ダッシュボード',
    description: 'ダッシュボードの見方を学ぶ',
    icon: 'Home',
    href: '/',
    completed: false,
    steps: [
      { title: 'ダッシュボードを確認する', description: 'メトリクスカードで会社の状況を把握', completed: false },
      { title: '売上推移グラフを確認する', description: '月次の収支トレンドを確認', completed: false },
      { title: '最近のアクティビティを確認する', description: 'チーム全体の動きを把握', completed: false },
    ],
  },
  {
    key: 'tasks',
    title: 'タスク管理',
    description: 'タスクを作成・管理する',
    icon: 'CheckSquare',
    href: '/tasks',
    completed: false,
    steps: [
      { title: 'タスクを新規作成する', description: '「新規タスク」ボタンからタスクを作成', completed: false },
      { title: 'タスクのステータスを変更する', description: 'ボード表示でドラッグ&ドロップ', completed: false },
      { title: 'タスクにコメントする', description: 'タスク詳細からコメントを追加', completed: false },
    ],
  },
  {
    key: 'applications',
    title: '申請・承認',
    description: '申請を作成し承認フローを理解する',
    icon: 'FileText',
    href: '/applications',
    completed: false,
    steps: [
      { title: '申請を新規作成する', description: '経費申請や休暇申請を作成', completed: false },
      { title: '承認フローを確認する', description: '申請の承認状態を確認', completed: false },
      { title: '申請を承認・差戻しする', description: '承認待ちの申請を処理', completed: false },
    ],
  },
  {
    key: 'ringi',
    title: '稟議',
    description: '稟議を起案する',
    icon: 'Stamp',
    href: '/ringi',
    completed: false,
    steps: [
      { title: '稟議を起案する', description: '新規稟議を作成', completed: false },
      { title: '承認ルートを設定する', description: '承認経路を確認', completed: false },
      { title: '稟議の進捗を確認する', description: '稟議一覧で状態を把握', completed: false },
    ],
  },
  {
    key: 'hr',
    title: '人事・労務',
    description: '従業員情報を管理する',
    icon: 'Users',
    href: '/hr',
    completed: false,
    steps: [
      { title: '従業員を登録する', description: '新規従業員を追加', completed: false },
      { title: '従業員情報を確認する', description: '従業員一覧から詳細を確認', completed: false },
      { title: '勤怠を確認する', description: '出退勤データを確認', completed: false },
    ],
  },
  {
    key: 'accounting',
    title: '経理・財務',
    description: '取引・請求・支払を管理する',
    icon: 'Calculator',
    href: '/accounting',
    completed: false,
    steps: [
      { title: '取引を登録する', description: '収入・支出の取引を記録', completed: false },
      { title: '請求書を作成する', description: '請求書を新規作成', completed: false },
      { title: 'キャッシュフローを確認する', description: '資金繰りを可視化', completed: false },
    ],
  },
  {
    key: 'general-affairs',
    title: '総務',
    description: '備品・施設を管理する',
    icon: 'Building2',
    href: '/general-affairs',
    completed: false,
    steps: [
      { title: '備品を登録する', description: '会社の備品を管理', completed: false },
      { title: '施設を予約する', description: '会議室等の施設予約', completed: false },
    ],
  },
  {
    key: 'documents',
    title: '文書管理',
    description: '文書を登録・管理する',
    icon: 'Scale',
    href: '/documents',
    completed: false,
    steps: [
      { title: '文書を登録する', description: '契約書・規程を登録', completed: false },
      { title: '文書を検索する', description: 'カテゴリ・キーワードで検索', completed: false },
    ],
  },
  {
    key: 'reports',
    title: '報告',
    description: '日報・報告を作成する',
    icon: 'ClipboardList',
    href: '/reports',
    completed: false,
    steps: [
      { title: '日報を作成する', description: '日報・週報を投稿', completed: false },
      { title: '報告を確認する', description: '提出された報告をレビュー', completed: false },
    ],
  },
  {
    key: 'improvements',
    title: '改善提案',
    description: '改善提案を投稿する',
    icon: 'Lightbulb',
    href: '/improvements',
    completed: false,
    steps: [
      { title: '改善提案を投稿する', description: 'アイデアを投稿', completed: false },
      { title: '提案に投票する', description: '良い提案に投票', completed: false },
    ],
  },
  {
    key: 'knowledge',
    title: 'ナレッジ',
    description: 'ナレッジ記事を作成する',
    icon: 'BookOpen',
    href: '/knowledge',
    completed: false,
    steps: [
      { title: 'ナレッジ記事を作成する', description: '手順書・FAQを作成', completed: false },
      { title: 'ナレッジを検索する', description: '記事を検索・閲覧', completed: false },
    ],
  },
  {
    key: 'assistant',
    title: 'ジジロボ',
    description: 'AIアシスタントを使う',
    icon: 'Bot',
    href: '/assistant',
    completed: false,
    steps: [
      { title: 'ジジロボに質問する', description: '業務について質問', completed: false },
      { title: '日常会話をしてみる', description: '雑談・相談', completed: false },
    ],
  },
]

// ── Store ──

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      items: DEFAULT_ITEMS.map((item) => ({ ...item, steps: item.steps.map((s) => ({ ...s })) })),
      skippedAll: false,
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      completeTutorialStep: (itemKey: string, stepIndex: number) => {
        set((state) => {
          const items = state.items.map((item) => {
            if (item.key !== itemKey) return item
            const steps = item.steps.map((step, i) =>
              i === stepIndex ? { ...step, completed: true } : step
            )
            const allDone = steps.every((s) => s.completed)
            return { ...item, steps, completed: allDone }
          })
          return { items }
        })
      },

      completeTutorial: (itemKey: string) => {
        set((state) => {
          const items = state.items.map((item) => {
            if (item.key !== itemKey) return item
            return {
              ...item,
              completed: true,
              steps: item.steps.map((s) => ({ ...s, completed: true })),
            }
          })
          return { items }
        })
      },

      skipAllTutorials: () => {
        set((state) => ({
          skippedAll: true,
          items: state.items.map((item) => ({
            ...item,
            completed: true,
            steps: item.steps.map((s) => ({ ...s, completed: true })),
          })),
        }))
      },

      resetTutorials: () => {
        set({
          skippedAll: false,
          items: DEFAULT_ITEMS.map((item) => ({
            ...item,
            steps: item.steps.map((s) => ({ ...s })),
          })),
        })
      },

      getProgress: () => {
        const { items } = get()
        const total = items.length
        const completed = items.filter((i) => i.completed).length
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      },
    }),
    {
      name: 'b-hall-tutorial',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
