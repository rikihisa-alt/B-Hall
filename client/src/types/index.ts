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
