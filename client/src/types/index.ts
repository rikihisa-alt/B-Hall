// ─── B-Hall 型定義 ───

// ── Enums ──

export type UserRole =
  | 'ceo'
  | 'exec'
  | 'admin'
  | 'mgr'
  | 'acc'
  | 'hr'
  | 'labor'
  | 'ga'
  | 'legal'
  | 'staff'
  | 'viewer'
  | 'audit'

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'reviewing'
  | 'approving'
  | 'rejected'
  | 'on_hold'
  | 'done'
  | 'cancelled'

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'approving'
  | 'approved'
  | 'rejected'
  | 'resubmitted'
  | 'withdrawn'

export type ApplicationType =
  | 'expense'
  | 'leave'
  | 'travel'
  | 'purchase'
  | 'overtime'
  | 'contract_review'
  | 'payment_request'
  | 'hiring'
  | 'device_account'
  | 'ringi'
  | 'welfare'
  | 'custom'

export type RingiStatus =
  | 'draft'
  | 'submitted'
  | 'approving'
  | 'approved'
  | 'rejected'

export type NotificationType =
  | 'task_assigned'
  | 'deadline_approaching'
  | 'deadline_exceeded'
  | 'approval_requested'
  | 'approval_completed'
  | 'rejected'
  | 'comment'
  | 'mention'
  | 'system'

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary'

// ── Base Entity ──

export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  deleted_at: string | null
}

// ── User ──

export interface User extends BaseEntity {
  email: string
  name: string
  name_kana: string
  role: UserRole
  department: string
  position: string
  avatar_initial: string
  status: 'active' | 'inactive' | 'suspended'
}

// ── Task ──

export interface Task extends BaseEntity {
  title: string
  description: string
  category: string
  sub_category: string
  department: string
  assignee_id: string
  reviewer_id: string
  approver_id: string
  due_date: string | null
  priority: TaskPriority
  status: TaskStatus
  source_event: string
  template_id: string
  parent_task_id: string
  checklist: ChecklistItem[]
  tags: string[]
  related_application_id: string
  related_ringi_id: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

// ── Comment ──

export interface Comment extends BaseEntity {
  parent_type: 'task' | 'application' | 'ringi'
  parent_id: string
  author_id: string
  content: string
  attachments: Attachment[]
}

// ── Attachment ──

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploaded_at: string
  uploaded_by: string
}

// ── Notification ──

export interface Notification extends BaseEntity {
  user_id: string
  type: NotificationType
  title: string
  body: string
  source_type: 'task' | 'application' | 'ringi' | 'system'
  source_id: string
  is_read: boolean
  action_url: string
}

// ── Application (Workflow/Approval) ──

export interface Application extends BaseEntity {
  type: ApplicationType
  type_label: string
  applicant_id: string
  title: string
  description: string
  amount: number | null
  form_data: Record<string, unknown>
  status: ApplicationStatus
  approval_steps: ApprovalStep[]
  related_task_id: string
  attachments: Attachment[]
}

export interface ApprovalStep {
  id: string
  approver_id: string
  approver_name: string
  status: 'pending' | 'approved' | 'rejected'
  comment: string
  decided_at: string
  order: number
}

// ── Ringi ──

export interface Ringi extends BaseEntity {
  title: string
  background: string
  purpose: string
  content: string
  amount: number | null
  roi_estimate: string
  risk: string
  effect: string
  departments: string[]
  status: RingiStatus
  decision_date: string
  approval_steps: ApprovalStep[]
  related_contract_id: string
  execution_task_id: string
  attachments: Attachment[]
}

// ── Employee ──

export interface Employee extends BaseEntity {
  user_id: string
  name: string
  name_kana: string
  department: string
  position: string
  employment_type: EmploymentType
  hire_date: string
  termination_date: string
  email: string
  phone: string
  emergency_contact: {
    name: string
    phone: string
    relationship: string
  } | null
  social_insurance_status: 'enrolled' | 'not_enrolled' | 'lost'
  employment_insurance_status: 'enrolled' | 'not_enrolled' | 'lost'
  health_check_date: string
  status: 'active' | 'on_leave' | 'terminated'
}

// ── Accounting ──

export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction extends BaseEntity {
  type: TransactionType
  date: string
  description: string
  amount: number
  category: string
  department: string
  counterparty: string
  account: string
  sub_account: string
  memo: string
  receipt_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface Invoice extends BaseEntity {
  invoice_number: string
  counterparty: string
  issue_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  status: 'draft' | 'issued' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  memo: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface Payment extends BaseEntity {
  payee: string
  amount: number
  payment_date: string
  due_date: string
  method: 'bank_transfer' | 'cash' | 'credit_card' | 'other'
  status: 'pending' | 'approved' | 'completed' | 'cancelled'
  description: string
  related_invoice_id: string
  approved_by: string
}

// ── Document (文書管理) ──

export type DocumentCategory = 'contract' | 'nda' | 'regulation' | 'manual' | 'form' | 'certificate' | 'report' | 'other'

export interface Document extends BaseEntity {
  title: string
  category: DocumentCategory
  description: string
  department: string
  tags: string[]
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  version: number
  expiry_date: string | null
  status: 'active' | 'expired' | 'archived'
  related_entity_type: string
  related_entity_id: string
}

// ── Report (報告) ──

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'incident' | 'improvement'

export interface Report extends BaseEntity {
  type: ReportType
  title: string
  content: string
  author_id: string
  department: string
  period_start: string
  period_end: string
  status: 'draft' | 'submitted' | 'reviewed'
  reviewer_id: string
  is_anonymous: boolean
  tags: string[]
}

// ── Improvement (改善) ──

export type ImprovementCategory = 'process' | 'cost' | 'quality' | 'safety' | 'environment' | 'other'

export interface Improvement extends BaseEntity {
  title: string
  category: ImprovementCategory
  description: string
  expected_effect: string
  author_id: string
  department: string
  is_anonymous: boolean
  status: 'proposed' | 'reviewing' | 'approved' | 'in_progress' | 'completed' | 'rejected'
  votes: number
  voted_by: string[]
  related_task_id: string
}

// ── Knowledge (ナレッジ) ──

export type KnowledgeType = 'manual' | 'procedure' | 'faq' | 'guide' | 'template' | 'column'

export interface KnowledgeArticle extends BaseEntity {
  title: string
  type: KnowledgeType
  content: string
  department: string
  tags: string[]
  author_id: string
  version: number
  is_published: boolean
  view_count: number
}

// ── General Affairs (総務) ──

export interface EquipmentItem extends BaseEntity {
  name: string
  category: string
  serial_number: string
  assigned_to: string
  status: 'available' | 'in_use' | 'maintenance' | 'disposed'
  purchase_date: string
  notes: string
}

export interface FacilityBooking extends BaseEntity {
  facility_name: string
  booked_by: string
  date: string
  start_time: string
  end_time: string
  purpose: string
  status: 'confirmed' | 'cancelled'
}
