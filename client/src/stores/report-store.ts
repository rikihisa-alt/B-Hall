import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Report, ReportType } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード報告 ──

const SEED_REPORTS: Report[] = []

// ── Store 型定義 ──

interface ReportState {
  reports: Report[]
  _hydrated: boolean
}

interface ReportActions {
  addReport: (data: Partial<Report>) => Report
  updateReport: (id: string, data: Partial<Report>) => void
  deleteReport: (id: string) => void
  submitReport: (id: string) => void
  reviewReport: (id: string, reviewerId: string) => void
  getReports: () => Report[]
  getReportsByType: (type: ReportType) => Report[]
  getReportsByAuthor: (authorId: string) => Report[]
  setHydrated: () => void
}

type ReportStore = ReportState & ReportActions

// ── Store ──

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: SEED_REPORTS,
      _hydrated: false,

      addReport: (data: Partial<Report>) => {
        const now = today()
        const newReport: Report = {
          id: generateId(),
          type: data.type || 'daily',
          title: data.title || '',
          content: data.content || '',
          author_id: data.author_id || '',
          department: data.department || '',
          period_start: data.period_start || now,
          period_end: data.period_end || now,
          status: data.status || 'draft',
          reviewer_id: data.reviewer_id || '',
          is_anonymous: data.is_anonymous || false,
          tags: data.tags || [],
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ reports: [...state.reports, newReport] }))
        return newReport
      },

      updateReport: (id: string, data: Partial<Report>) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, ...data, updated_at: today() } : r
          ),
        }))
      },

      deleteReport: (id: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, deleted_at: today() } : r
          ),
        }))
      },

      submitReport: (id: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id && r.status === 'draft'
              ? { ...r, status: 'submitted' as const, updated_at: today() }
              : r
          ),
        }))
      },

      reviewReport: (id: string, reviewerId: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id && r.status === 'submitted'
              ? { ...r, status: 'reviewed' as const, reviewer_id: reviewerId, updated_at: today() }
              : r
          ),
        }))
      },

      getReports: () => {
        return get().reports.filter((r) => !r.deleted_at)
      },

      getReportsByType: (type: ReportType) => {
        return get().reports.filter((r) => !r.deleted_at && r.type === type)
      },

      getReportsByAuthor: (authorId: string) => {
        return get().reports.filter((r) => !r.deleted_at && r.author_id === authorId)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-reports',
      partialize: (state) => ({
        reports: state.reports,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
