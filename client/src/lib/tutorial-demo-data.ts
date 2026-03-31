import { useTaskStore } from '@/stores/task-store'
import { useApplicationStore } from '@/stores/application-store'
import { useAccountingStore } from '@/stores/accounting-store'
import { daysFromNow, today } from '@/lib/date'

// Prefix for demo data IDs to avoid duplicates
const DEMO_PREFIX = 'tutorial-demo-'

/** Seed 3 demo tasks */
export function seedDemoTasks(): void {
  const store = useTaskStore.getState()
  // Avoid duplicates
  if (store.tasks.some((t) => t.id.startsWith(DEMO_PREFIX))) return

  const tasks = [
    {
      title: '月次経費精算の締め',
      description: '今月分の経費精算を取りまとめ、承認フローに回す。各部門からの提出を確認してください。',
      category: '経理',
      sub_category: '経費精算',
      department: '経理部',
      priority: 'high' as const,
      status: 'todo' as const,
      due_date: daysFromNow(3),
      tags: ['月次', '経理'],
    },
    {
      title: '新入社員のPC発注',
      description: '4月入社の新入社員3名分のPC・モニターを発注する。スペック要件は総務部に確認済み。',
      category: '総務',
      sub_category: '備品調達',
      department: '総務部',
      priority: 'medium' as const,
      status: 'in_progress' as const,
      due_date: daysFromNow(7),
      tags: ['入社準備', '備品'],
    },
    {
      title: 'セキュリティ研修資料作成',
      description: '全社セキュリティ研修の資料を準備する。情報漏洩防止とパスワード管理について。',
      category: '人事',
      sub_category: '研修',
      department: '人事部',
      priority: 'medium' as const,
      status: 'todo' as const,
      due_date: daysFromNow(14),
      tags: ['研修', 'セキュリティ'],
    },
  ]

  for (let i = 0; i < tasks.length; i++) {
    const data = tasks[i]
    // Use the store's addTask but we need to set a predictable ID for demo detection
    const task = store.addTask(data)
    // Patch the ID for demo detection
    useTaskStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === task.id ? { ...t, id: `${DEMO_PREFIX}task-${i}` } : t
      ),
    }))
  }
}

/** Seed 2 demo applications */
export function seedDemoApplications(): void {
  const store = useApplicationStore.getState()
  if (store.applications.some((a) => a.id.startsWith(DEMO_PREFIX))) return

  const applications = [
    {
      type: 'expense' as const,
      type_label: '経費申請',
      applicant_id: 'demo-user',
      title: '交通費精算（3月分）',
      description: '3月の営業訪問に伴う交通費の精算申請です。',
      amount: 15000,
      status: 'approving' as const,
      approval_steps: [
        {
          id: `${DEMO_PREFIX}step-1`,
          approver_id: 'manager-1',
          approver_name: '鈴木部長',
          status: 'pending' as const,
          comment: '',
          decided_at: '',
          order: 1,
        },
      ],
    },
    {
      type: 'leave' as const,
      type_label: '休暇申請',
      applicant_id: 'demo-user',
      title: '有給休暇（4/10〜4/11）',
      description: '私用のため有給休暇を取得したく申請いたします。',
      amount: null,
      status: 'approving' as const,
      approval_steps: [
        {
          id: `${DEMO_PREFIX}step-2`,
          approver_id: 'manager-1',
          approver_name: '鈴木部長',
          status: 'pending' as const,
          comment: '',
          decided_at: '',
          order: 1,
        },
      ],
    },
  ]

  for (let i = 0; i < applications.length; i++) {
    const data = applications[i]
    const app = store.createApplication(data)
    useApplicationStore.setState((state) => ({
      applications: state.applications.map((a) =>
        a.id === app.id ? { ...a, id: `${DEMO_PREFIX}app-${i}` } : a
      ),
    }))
  }
}

/** Seed 5 demo transactions */
export function seedDemoTransactions(): void {
  const store = useAccountingStore.getState()
  if (store.transactions.some((t) => t.id.startsWith(DEMO_PREFIX))) return

  const transactions = [
    {
      type: 'income' as const,
      description: 'Webサイト制作 — 株式会社ABC',
      amount: 1200000,
      category: '売上',
      counterparty: '株式会社ABC',
      department: '営業部',
      status: 'confirmed' as const,
    },
    {
      type: 'income' as const,
      description: 'コンサルティング顧問料 — DEF合同会社',
      amount: 800000,
      category: '売上',
      counterparty: 'DEF合同会社',
      department: '営業部',
      status: 'confirmed' as const,
    },
    {
      type: 'income' as const,
      description: 'システム保守契約 — GHI株式会社',
      amount: 500000,
      category: '売上',
      counterparty: 'GHI株式会社',
      department: '営業部',
      status: 'pending' as const,
    },
    {
      type: 'expense' as const,
      description: 'AWS利用料（3月分）',
      amount: 180000,
      category: '通信費',
      counterparty: 'Amazon Web Services',
      department: '開発部',
      status: 'confirmed' as const,
    },
    {
      type: 'expense' as const,
      description: 'オフィス消耗品購入',
      amount: 45000,
      category: '消耗品費',
      counterparty: 'アスクル',
      department: '総務部',
      status: 'confirmed' as const,
    },
  ]

  for (let i = 0; i < transactions.length; i++) {
    const data = transactions[i]
    const txn = store.addTransaction(data)
    useAccountingStore.setState((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === txn.id ? { ...t, id: `${DEMO_PREFIX}txn-${i}` } : t
      ),
    }))
  }
}
