import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, ChecklistItem } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シードタスク ──

const now = today()

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '新入社員の入社手続き',
    description:
      '4月入社予定の新入社員3名の入社手続きを進める。社会保険、雇用保険の加入手続き、入社書類の回収、オリエンテーション資料の準備を行う。',
    category: '人事',
    sub_category: '入社手続き',
    department: '人事部',
    assignee_id: 'user-2',
    reviewer_id: 'user-1',
    approver_id: 'user-5',
    due_date: daysFromNow(2),
    priority: 'high',
    status: 'in_progress',
    source_event: '入社',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-1-1', text: '入社書類一式の送付', completed: true },
      { id: 'cl-1-2', text: '社会保険・雇用保険の届出書類準備', completed: false },
      { id: 'cl-1-3', text: 'オリエンテーション資料の作成', completed: false },
    ],
    tags: ['入社', '社保', '新入社員'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'task-2',
    title: '月次経費精算の締め',
    description:
      '3月度の経費精算を締め、各部署からの提出状況を確認する。未提出の部署にはリマインドを送付。',
    category: '経理',
    sub_category: '経費精算',
    department: '経理部',
    assignee_id: 'user-3',
    reviewer_id: 'user-4',
    approver_id: 'user-5',
    due_date: daysFromNow(1),
    priority: 'urgent',
    status: 'todo',
    source_event: '月次締め',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-2-1', text: '各部署の提出状況を確認', completed: false },
      { id: 'cl-2-2', text: '未提出部署へリマインド送付', completed: false },
      { id: 'cl-2-3', text: '精算データの集計・確認', completed: false },
    ],
    tags: ['月次', '経費', '締め'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'task-3',
    title: '就業規則の改定案作成',
    description:
      'テレワーク制度の正式導入に伴い、就業規則の改定案を作成する。労務担当と連携し、法令順守の観点からレビューを受ける。',
    category: '人事',
    sub_category: '規程改定',
    department: '人事部',
    assignee_id: 'user-2',
    reviewer_id: 'user-1',
    approver_id: 'user-5',
    due_date: daysFromNow(5),
    priority: 'medium',
    status: 'reviewing',
    source_event: '規程改定',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-3-1', text: '現行規則の確認', completed: true },
      { id: 'cl-3-2', text: '改定案のドラフト作成', completed: true },
      { id: 'cl-3-3', text: '労務担当のレビュー', completed: false },
    ],
    tags: ['就業規則', 'テレワーク'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'task-4',
    title: 'Q1予算レビュー',
    description:
      '第1四半期の予算執行状況をレビューし、各部門の予実対比を分析する。経営陣への報告資料を作成する。',
    category: '経理',
    sub_category: '予算管理',
    department: '経理部',
    assignee_id: 'user-3',
    reviewer_id: 'user-4',
    approver_id: 'user-5',
    due_date: daysFromNow(3),
    priority: 'high',
    status: 'approving',
    source_event: '月次締め',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-4-1', text: '部門別予算データ集計', completed: true },
      { id: 'cl-4-2', text: '予実対比分析', completed: true },
      { id: 'cl-4-3', text: '報告資料作成', completed: false },
    ],
    tags: ['予算', 'Q1', '予実対比'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'task-5',
    title: '備品発注リスト更新',
    description:
      'オフィス備品の在庫確認を行い、不足している備品の発注リストを更新する。特にコピー用紙、トナー、文房具の在庫を確認。',
    category: '総務',
    sub_category: '備品管理',
    department: '総務部',
    assignee_id: 'user-6',
    reviewer_id: 'user-1',
    approver_id: 'user-5',
    due_date: daysFromNow(7),
    priority: 'low',
    status: 'todo',
    source_event: '',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-5-1', text: '在庫棚卸し', completed: false },
      { id: 'cl-5-2', text: '発注リスト作成', completed: false },
    ],
    tags: ['備品', '発注'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
  {
    id: 'task-6',
    title: '取引先NDA更新確認',
    description:
      '期限が近づいているNDA契約の一覧を確認し、更新が必要な契約の手続きを進める。法務部と連携して対応。',
    category: '法務',
    sub_category: '契約管理',
    department: '法務部',
    assignee_id: 'user-1',
    reviewer_id: 'user-5',
    approver_id: 'user-5',
    due_date: daysFromNow(10),
    priority: 'medium',
    status: 'in_progress',
    source_event: '契約更新',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-6-1', text: '期限切れ間近のNDA一覧作成', completed: true },
      { id: 'cl-6-2', text: '取引先への更新連絡', completed: false },
      { id: 'cl-6-3', text: '更新契約書のドラフト作成', completed: false },
    ],
    tags: ['NDA', '契約更新', '法務'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'task-7',
    title: 'セキュリティ研修資料作成',
    description:
      '全社員向けのセキュリティ研修資料を作成する。最新のサイバー攻撃動向、パスワード管理、フィッシング対策を含む。',
    category: 'IT',
    sub_category: '研修',
    department: '開発部',
    assignee_id: 'user-1',
    reviewer_id: 'user-5',
    approver_id: 'user-5',
    due_date: daysFromNow(14),
    priority: 'medium',
    status: 'todo',
    source_event: '',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-7-1', text: '最新の脅威情報の収集', completed: false },
      { id: 'cl-7-2', text: 'スライド資料の作成', completed: false },
      { id: 'cl-7-3', text: 'テスト問題の作成', completed: false },
    ],
    tags: ['セキュリティ', '研修', 'IT'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'task-8',
    title: '社内報3月号の編集',
    description:
      '社内報3月号の記事を編集する。今月のトピック：新入社員紹介、部署紹介（開発部）、社長メッセージ。',
    category: '総務',
    sub_category: '社内広報',
    department: '総務部',
    assignee_id: 'user-6',
    reviewer_id: 'user-1',
    approver_id: 'user-5',
    due_date: daysFromNow(5),
    priority: 'low',
    status: 'in_progress',
    source_event: '',
    template_id: '',
    parent_task_id: '',
    checklist: [
      { id: 'cl-8-1', text: '記事の収集・確認', completed: true },
      { id: 'cl-8-2', text: 'レイアウトの作成', completed: false },
    ],
    tags: ['社内報', '広報'],
    related_application_id: '',
    related_ringi_id: '',
    created_at: now,
    updated_at: now,
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface TaskState {
  tasks: Task[]
  _hydrated: boolean
}

interface TaskActions {
  addTask: (data: Partial<Task>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  getActiveTasks: () => Task[]
  getTasksByAssignee: (userId: string) => Task[]
  updateTaskStatus: (id: string, status: Task['status']) => void
  addChecklistItem: (taskId: string, text: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  removeChecklistItem: (taskId: string, itemId: string) => void
  setHydrated: () => void
}

type TaskStore = TaskState & TaskActions

// ── Store ──

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: SEED_TASKS,
      _hydrated: false,

      addTask: (data: Partial<Task>) => {
        const now = today()
        const newTask: Task = {
          id: generateId(),
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'その他',
          sub_category: data.sub_category || '',
          department: data.department || '',
          assignee_id: data.assignee_id || '',
          reviewer_id: data.reviewer_id || '',
          approver_id: data.approver_id || '',
          due_date: data.due_date || null,
          priority: data.priority || 'medium',
          status: data.status || 'todo',
          source_event: data.source_event || '',
          template_id: data.template_id || '',
          parent_task_id: data.parent_task_id || '',
          checklist: data.checklist || [],
          tags: data.tags || [],
          related_application_id: data.related_application_id || '',
          related_ringi_id: data.related_ringi_id || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updated_at: today() }
              : t
          ),
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, deleted_at: today(), updated_at: today() }
              : t
          ),
        }))
      },

      getTask: (id: string) => {
        return get().tasks.find((t) => t.id === id && !t.deleted_at)
      },

      getActiveTasks: () => {
        return get().tasks.filter((t) => !t.deleted_at)
      },

      getTasksByAssignee: (userId: string) => {
        return get().tasks.filter(
          (t) => t.assignee_id === userId && !t.deleted_at
        )
      },

      updateTaskStatus: (id: string, status: Task['status']) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status, updated_at: today() }
              : t
          ),
        }))
      },

      addChecklistItem: (taskId: string, text: string) => {
        const newItem: ChecklistItem = {
          id: generateId(),
          text,
          completed: false,
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: [...t.checklist, newItem],
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      toggleChecklistItem: (taskId: string, itemId: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((item) =>
                    item.id === itemId
                      ? { ...item, completed: !item.completed }
                      : item
                  ),
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      removeChecklistItem: (taskId: string, itemId: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.filter((item) => item.id !== itemId),
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
