import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Application, ApprovalStep, Attachment } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シードデータ ──

const now = today()
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    type: 'expense',
    type_label: '経費精算',
    applicant_id: 'user-4',
    title: '3月度交通費・会議費精算',
    description: '3月度の交通費および取引先との会議費の精算申請です。',
    amount: 45000,
    form_data: {
      date: twoDaysAgo,
      description: '3月度交通費・会議費精算',
      amount: 45000,
      category: '交通費',
    },
    status: 'approved',
    approval_steps: [
      {
        id: 'step-1-1',
        approver_id: 'user-3',
        approver_name: '鈴木一郎',
        status: 'approved',
        comment: '内容確認しました。承認します。',
        decided_at: twoDaysAgo,
        order: 1,
      },
      {
        id: 'step-1-2',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'approved',
        comment: '',
        decided_at: twoDaysAgo,
        order: 2,
      },
    ],
    related_task_id: '',
    attachments: [],
    created_at: fiveDaysAgo,
    updated_at: twoDaysAgo,
    created_by: 'user-4',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'app-2',
    type: 'leave',
    type_label: '休暇申請',
    applicant_id: 'user-2',
    title: '有給休暇申請（3/25-3/26）',
    description: '私用のため有給休暇を取得したいです。',
    amount: null,
    form_data: {
      start_date: daysFromNow(11),
      end_date: daysFromNow(12),
      leave_type: '有給',
      reason: '私用のため',
    },
    status: 'approving',
    approval_steps: [
      {
        id: 'step-2-1',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 1,
      },
    ],
    related_task_id: '',
    attachments: [],
    created_at: twoDaysAgo,
    updated_at: twoDaysAgo,
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'app-3',
    type: 'travel',
    type_label: '出張申請',
    applicant_id: 'user-3',
    title: '大阪支社出張申請',
    description: '大阪支社での四半期経理レビュー会議に出席するための出張申請です。',
    amount: 120000,
    form_data: {
      destination: '大阪支社',
      start_date: daysFromNow(7),
      end_date: daysFromNow(9),
      purpose: '四半期経理レビュー会議',
      estimated_cost: 120000,
    },
    status: 'approving',
    approval_steps: [
      {
        id: 'step-3-1',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 1,
      },
      {
        id: 'step-3-2',
        approver_id: 'user-5',
        approver_name: '山田太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 2,
      },
    ],
    related_task_id: '',
    attachments: [],
    created_at: twoDaysAgo,
    updated_at: twoDaysAgo,
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'app-4',
    type: 'purchase',
    type_label: '購買申請',
    applicant_id: 'user-6',
    title: 'オフィス家具購入申請',
    description: 'スタンディングデスク3台と椅子3脚の購入申請です。新入社員用の備品として必要です。',
    amount: 85000,
    form_data: {
      item_name: 'スタンディングデスク・オフィスチェア',
      quantity: 6,
      unit_price: 14166,
      vendor: 'オフィスコム株式会社',
      reason: '新入社員用備品の購入',
    },
    status: 'draft',
    approval_steps: [
      {
        id: 'step-4-1',
        approver_id: 'user-3',
        approver_name: '鈴木一郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 1,
      },
      {
        id: 'step-4-2',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 2,
      },
    ],
    related_task_id: '',
    attachments: [],
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface ApplicationState {
  applications: Application[]
  _hydrated: boolean
}

interface ApplicationActions {
  createApplication: (data: Partial<Application> & { type: Application['type']; type_label: string; applicant_id: string; title: string }) => Application
  submitApplication: (id: string) => void
  approveStep: (applicationId: string, stepId: string, comment?: string) => void
  rejectStep: (applicationId: string, stepId: string, comment: string) => void
  withdrawApplication: (id: string) => void
  getApplications: () => Application[]
  getApplicationsByApplicant: (userId: string) => Application[]
  getPendingApprovals: (userId: string) => Application[]
  getApplication: (id: string) => Application | undefined
  addAttachment: (applicationId: string, attachment: Attachment) => void
  removeAttachment: (applicationId: string, attachmentId: string) => void
  setHydrated: () => void
}

type ApplicationStore = ApplicationState & ApplicationActions

// ── Store ──

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: SEED_APPLICATIONS,
      _hydrated: false,

      createApplication: (data) => {
        const timestamp = today()
        const newApp: Application = {
          id: generateId(),
          type: data.type,
          type_label: data.type_label,
          applicant_id: data.applicant_id,
          title: data.title,
          description: data.description || '',
          amount: data.amount ?? null,
          form_data: data.form_data || {},
          status: 'draft',
          approval_steps: data.approval_steps || [],
          related_task_id: data.related_task_id || '',
          attachments: data.attachments || [],
          created_at: timestamp,
          updated_at: timestamp,
          created_by: data.applicant_id,
          updated_by: data.applicant_id,
          deleted_at: null,
        }
        set((state) => ({
          applications: [...state.applications, newApp],
        }))
        return newApp
      },

      submitApplication: (id: string) => {
        const timestamp = today()
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id && (app.status === 'draft' || app.status === 'resubmitted')
              ? { ...app, status: 'approving' as const, updated_at: timestamp }
              : app
          ),
        }))
      },

      approveStep: (applicationId: string, stepId: string, comment?: string) => {
        const timestamp = today()
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== applicationId) return app

            const updatedSteps = app.approval_steps.map((step) =>
              step.id === stepId
                ? {
                    ...step,
                    status: 'approved' as const,
                    comment: comment || '',
                    decided_at: timestamp,
                  }
                : step
            )

            // Check if all steps are approved
            const allApproved = updatedSteps.every((s) => s.status === 'approved')

            return {
              ...app,
              approval_steps: updatedSteps,
              status: allApproved ? ('approved' as const) : app.status,
              updated_at: timestamp,
            }
          }),
        }))
      },

      rejectStep: (applicationId: string, stepId: string, comment: string) => {
        const timestamp = today()
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== applicationId) return app

            const updatedSteps = app.approval_steps.map((step) =>
              step.id === stepId
                ? {
                    ...step,
                    status: 'rejected' as const,
                    comment,
                    decided_at: timestamp,
                  }
                : step
            )

            return {
              ...app,
              approval_steps: updatedSteps,
              status: 'rejected' as const,
              updated_at: timestamp,
            }
          }),
        }))
      },

      withdrawApplication: (id: string) => {
        const timestamp = today()
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, status: 'withdrawn' as const, updated_at: timestamp }
              : app
          ),
        }))
      },

      getApplications: () => {
        return get().applications.filter((app) => !app.deleted_at)
      },

      getApplicationsByApplicant: (userId: string) => {
        return get().applications.filter(
          (app) => app.applicant_id === userId && !app.deleted_at
        )
      },

      getPendingApprovals: (userId: string) => {
        return get().applications.filter(
          (app) =>
            !app.deleted_at &&
            (app.status === 'approving' || app.status === 'submitted') &&
            app.approval_steps.some(
              (step) => step.approver_id === userId && step.status === 'pending'
            )
        )
      },

      getApplication: (id: string) => {
        return get().applications.find((app) => app.id === id && !app.deleted_at)
      },

      addAttachment: (applicationId: string, attachment: Attachment) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? { ...app, attachments: [...app.attachments, attachment], updated_at: today() }
              : app
          ),
        }))
      },

      removeAttachment: (applicationId: string, attachmentId: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? { ...app, attachments: app.attachments.filter((a) => a.id !== attachmentId), updated_at: today() }
              : app
          ),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-applications',
      partialize: (state) => ({
        applications: state.applications,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
