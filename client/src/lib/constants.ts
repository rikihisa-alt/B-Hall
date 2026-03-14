import type { TaskStatus, TaskPriority, ApplicationStatus, RingiStatus, UserRole, ApplicationType, EmploymentType } from '@/types'

// ── タスクステータス ──

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '未着手',
  in_progress: '進行中',
  reviewing: '確認待ち',
  approving: '承認待ち',
  rejected: '差戻し',
  on_hold: '保留',
  done: '完了',
  cancelled: '中止',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'neutral',
  in_progress: 'info',
  reviewing: 'warning',
  approving: 'warning',
  rejected: 'danger',
  on_hold: 'neutral',
  done: 'success',
  cancelled: 'neutral',
}

/** ステータス遷移表: 現ステータスから移行可能なステータスのリスト */
export const TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress', 'cancelled'],
  in_progress: ['reviewing', 'on_hold', 'cancelled'],
  reviewing: ['approving', 'in_progress', 'rejected'],
  approving: ['done', 'rejected'],
  rejected: ['in_progress', 'cancelled'],
  on_hold: ['in_progress', 'cancelled'],
  done: [],
  cancelled: [],
}

// ── タスク優先度 ──

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
}

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
}

// ── 業務カテゴリ ──

export const TASK_CATEGORIES = [
  '人事',
  '労務',
  '経理',
  '財務',
  '総務',
  '法務',
  '報告',
  '改善',
  '経営',
  'IT',
  'その他',
] as const

// ── 部署 ──

export const DEPARTMENTS = [
  '経営企画',
  '人事部',
  '経理部',
  '総務部',
  '法務部',
  '開発部',
  '営業部',
  '管理部',
] as const

// ── 申請ステータス ──

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: '下書き',
  submitted: '提出済み',
  approving: '承認中',
  approved: '承認済み',
  rejected: '却下',
  resubmitted: '再提出',
  withdrawn: '取下げ',
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: 'neutral',
  submitted: 'info',
  approving: 'warning',
  approved: 'success',
  rejected: 'danger',
  resubmitted: 'info',
  withdrawn: 'neutral',
}

// ── 申請種別 ──

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  expense: '経費精算',
  leave: '休暇申請',
  travel: '出張申請',
  purchase: '購買申請',
  overtime: '残業申請',
  contract_review: '契約確認',
  payment_request: '支払依頼',
  hiring: '採用申請',
  device_account: '端末・アカウント発行',
  ringi: '稟議起票',
  welfare: '福利厚生利用',
  custom: 'その他',
}

// ── 稟議ステータス ──

export const RINGI_STATUS_LABELS: Record<RingiStatus, string> = {
  draft: '下書き',
  submitted: '提出済み',
  approving: '承認中',
  approved: '決裁済み',
  rejected: '却下',
}

export const RINGI_STATUS_COLORS: Record<RingiStatus, string> = {
  draft: 'neutral',
  submitted: 'info',
  approving: 'warning',
  approved: 'success',
  rejected: 'danger',
}

// ── ユーザーロール ──

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ceo: '経営者',
  exec: '役員',
  admin: '管理者',
  mgr: '部門責任者',
  acc: '経理担当',
  hr: '人事担当',
  labor: '労務担当',
  ga: '総務担当',
  legal: '法務担当',
  staff: '一般従業員',
  viewer: '閲覧専用',
  audit: '監査',
}

// ── 雇用形態 ──

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: '正社員',
  part_time: 'パート',
  contract: '契約社員',
  temporary: '派遣社員',
}
