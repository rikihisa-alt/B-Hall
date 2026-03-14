import type { TaskStatus, TaskPriority, ApplicationStatus, RingiStatus, UserRole, ApplicationType, EmploymentType, DocumentCategory, ReportType, ImprovementCategory, KnowledgeType } from '@/types'

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

// ── 経理・財務 ──

export const TRANSACTION_CATEGORIES = [
  '売上', '仕入', '給与', '家賃', '光熱費', '通信費', '交通費',
  '消耗品費', '接待交際費', '広告宣伝費', '支払手数料', '雑費', 'その他',
] as const

export const ACCOUNT_NAMES = [
  '普通預金（三菱UFJ）', '普通預金（みずほ）', '当座預金', '現金', 'クレジットカード',
] as const

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  pending: '未確認',
  confirmed: '確認済み',
  cancelled: '取消',
}

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'neutral',
}

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  income: '収入',
  expense: '支出',
  transfer: '振替',
}

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: '下書き',
  issued: '発行済み',
  sent: '送付済み',
  paid: '入金済み',
  overdue: '期限超過',
  cancelled: '取消',
}

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'neutral',
  issued: 'info',
  sent: 'processing',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'neutral',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: '承認待ち',
  approved: '承認済み',
  completed: '支払済み',
  cancelled: '取消',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  approved: 'info',
  completed: 'success',
  cancelled: 'neutral',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: '銀行振込',
  cash: '現金',
  credit_card: 'クレジットカード',
  other: 'その他',
}

// ── 文書カテゴリ ──

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  contract: '契約書',
  nda: '秘密保持契約',
  regulation: '規程',
  manual: 'マニュアル',
  form: 'フォーム・テンプレート',
  certificate: '証明書',
  report: '報告書',
  other: 'その他',
}

export const DOCUMENT_CATEGORY_COLORS: Record<DocumentCategory, string> = {
  contract: 'info',
  nda: 'warning',
  regulation: 'processing',
  manual: 'success',
  form: 'neutral',
  certificate: 'info',
  report: 'neutral',
  other: 'neutral',
}

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  active: '有効',
  expired: '期限切れ',
  archived: 'アーカイブ',
}

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  active: 'success',
  expired: 'danger',
  archived: 'neutral',
}

// ── 報告種別 ──

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  daily: '日報',
  weekly: '週報',
  monthly: '月報',
  incident: '事故報告',
  improvement: '改善報告',
}

export const REPORT_TYPE_COLORS: Record<ReportType, string> = {
  daily: 'info',
  weekly: 'processing',
  monthly: 'success',
  incident: 'danger',
  improvement: 'warning',
}

export const REPORT_STATUS_LABELS: Record<string, string> = {
  draft: '下書き',
  submitted: '提出済み',
  reviewed: 'レビュー済み',
}

export const REPORT_STATUS_COLORS: Record<string, string> = {
  draft: 'neutral',
  submitted: 'info',
  reviewed: 'success',
}

// ── 改善カテゴリ ──

export const IMPROVEMENT_CATEGORY_LABELS: Record<ImprovementCategory, string> = {
  process: '業務プロセス',
  cost: 'コスト削減',
  quality: '品質向上',
  safety: '安全衛生',
  environment: '環境改善',
  other: 'その他',
}

export const IMPROVEMENT_CATEGORY_COLORS: Record<ImprovementCategory, string> = {
  process: 'info',
  cost: 'success',
  quality: 'warning',
  safety: 'danger',
  environment: 'processing',
  other: 'neutral',
}

export const IMPROVEMENT_STATUS_LABELS: Record<string, string> = {
  proposed: '提案中',
  reviewing: '検討中',
  approved: '承認済',
  in_progress: '実施中',
  completed: '完了',
  rejected: '不採用',
}

export const IMPROVEMENT_STATUS_COLORS: Record<string, string> = {
  proposed: 'info',
  reviewing: 'warning',
  approved: 'success',
  in_progress: 'processing',
  completed: 'success',
  rejected: 'neutral',
}

// ── ナレッジ種別 ──

export const KNOWLEDGE_TYPE_LABELS: Record<KnowledgeType, string> = {
  manual: 'マニュアル',
  procedure: '手順書',
  faq: 'FAQ',
  guide: 'ガイド',
  template: 'テンプレート',
  column: 'コラム',
}

export const KNOWLEDGE_TYPE_COLORS: Record<KnowledgeType, string> = {
  manual: 'info',
  procedure: 'success',
  faq: 'warning',
  guide: 'processing',
  template: 'neutral',
  column: 'info',
}
