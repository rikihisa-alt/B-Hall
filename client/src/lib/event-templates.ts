// ── イベント駆動タスクテンプレート ──
// 入社・退社などのイベント発生時に自動生成されるタスクの定義

export interface EventTaskTemplate {
  title: string
  category: string
  department: string
  dueOffsetDays: number
  description: string
}

/** 入社イベントで自動生成されるタスク群 */
export const ONBOARDING_TASKS: EventTaskTemplate[] = [
  {
    title: '雇用契約書の回収',
    category: '人事',
    department: '人事部',
    dueOffsetDays: 0,
    description: '入社日までに雇用契約書を締結し回収する',
  },
  {
    title: '社会保険手続き',
    category: '労務',
    department: '人事部',
    dueOffsetDays: 5,
    description: '健康保険・厚生年金の加入手続き',
  },
  {
    title: '備品・貸与物手配',
    category: '総務',
    department: '総務部',
    dueOffsetDays: 3,
    description: 'PC・携帯・名刺・社員証等の手配',
  },
  {
    title: 'ITアカウント発行',
    category: 'IT',
    department: '総務部',
    dueOffsetDays: 1,
    description: 'メール・Slack・社内システムのアカウント作成',
  },
  {
    title: '入社オリエンテーション',
    category: '人事',
    department: '人事部',
    dueOffsetDays: 0,
    description: '社内ルール・福利厚生・業務説明',
  },
]

/** 退社イベントで自動生成されるタスク群 */
export const OFFBOARDING_TASKS: EventTaskTemplate[] = [
  {
    title: '退職届の受領確認',
    category: '人事',
    department: '人事部',
    dueOffsetDays: 0,
    description: '退職届の正式受領と確認',
  },
  {
    title: '社保喪失届',
    category: '労務',
    department: '人事部',
    dueOffsetDays: 5,
    description: '健康保険・厚生年金の喪失手続き',
  },
  {
    title: '備品・貸与物返却確認',
    category: '総務',
    department: '総務部',
    dueOffsetDays: -1,
    description: 'PC・携帯・名刺・社員証等の返却確認',
  },
  {
    title: 'アカウント停止',
    category: 'IT',
    department: '総務部',
    dueOffsetDays: 0,
    description: '全システムアカウントの停止・削除',
  },
  {
    title: '最終給与計算',
    category: '経理',
    department: '経理部',
    dueOffsetDays: 10,
    description: '最終給与・退職金の計算処理',
  },
]
