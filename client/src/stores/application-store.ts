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

const SEED_APPLICATIONS: Application[] = []

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
