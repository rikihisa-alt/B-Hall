import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import { today } from '@/lib/date'

// ── 型定義 ──

export interface LeaveBalance {
  id: string
  employee_id: string
  year: number
  granted_days: number
  used_days: number
  pending_days: number
  expiry_date: string
  created_at: string
}

export type LeaveType = 'paid' | 'sick' | 'special' | 'maternity' | 'childcare'

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  paid: '有給休暇',
  sick: '病気休暇',
  special: '特別休暇',
  maternity: '産前産後休暇',
  childcare: '育児休暇',
}

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id: string
  employee_id: string
  type: LeaveType
  start_date: string
  end_date: string
  days: number
  reason: string
  status: LeaveRequestStatus
  approved_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ── シードデータ ──

const now = today()

const SEED_BALANCES: LeaveBalance[] = [
  { id: 'lb-1', employee_id: 'emp-1', year: 2026, granted_days: 20, used_days: 5,  pending_days: 1, expiry_date: '2027-03-31', created_at: now },
  { id: 'lb-2', employee_id: 'emp-2', year: 2026, granted_days: 20, used_days: 3,  pending_days: 2, expiry_date: '2027-03-31', created_at: now },
  { id: 'lb-3', employee_id: 'emp-3', year: 2026, granted_days: 20, used_days: 7,  pending_days: 0, expiry_date: '2027-03-31', created_at: now },
  { id: 'lb-4', employee_id: 'emp-4', year: 2026, granted_days: 20, used_days: 4,  pending_days: 1, expiry_date: '2027-03-31', created_at: now },
  { id: 'lb-5', employee_id: 'emp-5', year: 2026, granted_days: 20, used_days: 8,  pending_days: 0, expiry_date: '2027-03-31', created_at: now },
  { id: 'lb-6', employee_id: 'emp-6', year: 2026, granted_days: 20, used_days: 6,  pending_days: 1, expiry_date: '2027-03-31', created_at: now },
]

const SEED_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-1', employee_id: 'emp-1', type: 'paid',
    start_date: '2026-03-10', end_date: '2026-03-10', days: 1,
    reason: '私用のため', status: 'approved', approved_by: 'user-5',
    created_at: '2026-03-05T09:00:00.000Z', updated_at: '2026-03-05T10:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-2', employee_id: 'emp-2', type: 'paid',
    start_date: '2026-04-01', end_date: '2026-04-02', days: 2,
    reason: '家族旅行のため', status: 'pending', approved_by: '',
    created_at: '2026-03-20T09:00:00.000Z', updated_at: '2026-03-20T09:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-3', employee_id: 'emp-3', type: 'sick',
    start_date: '2026-02-15', end_date: '2026-02-17', days: 3,
    reason: 'インフルエンザのため', status: 'approved', approved_by: 'user-5',
    created_at: '2026-02-14T18:00:00.000Z', updated_at: '2026-02-15T08:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-4', employee_id: 'emp-4', type: 'paid',
    start_date: '2026-03-28', end_date: '2026-03-28', days: 1,
    reason: '通院のため', status: 'pending', approved_by: '',
    created_at: '2026-03-22T09:00:00.000Z', updated_at: '2026-03-22T09:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-5', employee_id: 'emp-1', type: 'special',
    start_date: '2026-01-06', end_date: '2026-01-06', days: 1,
    reason: '結婚記念日', status: 'approved', approved_by: 'user-5',
    created_at: '2025-12-20T09:00:00.000Z', updated_at: '2025-12-21T10:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-6', employee_id: 'emp-6', type: 'paid',
    start_date: '2026-04-07', end_date: '2026-04-07', days: 1,
    reason: '引越し作業', status: 'pending', approved_by: '',
    created_at: '2026-03-23T11:00:00.000Z', updated_at: '2026-03-23T11:00:00.000Z', deleted_at: null,
  },
  {
    id: 'lr-7', employee_id: 'emp-5', type: 'paid',
    start_date: '2026-02-03', end_date: '2026-02-05', days: 3,
    reason: '海外出張後の休養', status: 'approved', approved_by: 'user-1',
    created_at: '2026-01-28T09:00:00.000Z', updated_at: '2026-01-29T09:00:00.000Z', deleted_at: null,
  },
]

// ── Store ──

interface LeaveState {
  balances: LeaveBalance[]
  requests: LeaveRequest[]
  _hydrated: boolean
}

interface LeaveActions {
  getBalance: (employeeId: string) => LeaveBalance | undefined
  requestLeave: (data: { employee_id: string; type: LeaveType; start_date: string; end_date: string; days: number; reason: string }) => LeaveRequest
  approveLeave: (id: string, approvedBy: string) => void
  rejectLeave: (id: string, approvedBy: string) => void
  getRequests: (employeeId?: string) => LeaveRequest[]
  getPendingRequests: () => LeaveRequest[]
  setHydrated: () => void
}

type LeaveStore = LeaveState & LeaveActions

export const useLeaveStore = create<LeaveStore>()(
  persist(
    (set, get) => ({
      balances: [],
      requests: [],
      _hydrated: false,

      getBalance: (employeeId: string) => {
        return get().balances.find((b) => b.employee_id === employeeId && b.year === 2026)
      },

      requestLeave: (data) => {
        const now = today()
        const newRequest: LeaveRequest = {
          id: generateId(),
          employee_id: data.employee_id,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          days: data.days,
          reason: data.reason,
          status: 'pending',
          approved_by: '',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        }

        set((state) => ({
          requests: [...state.requests, newRequest],
          balances: state.balances.map((b) =>
            b.employee_id === data.employee_id && b.year === 2026
              ? { ...b, pending_days: b.pending_days + data.days }
              : b
          ),
        }))

        return newRequest
      },

      approveLeave: (id: string, approvedBy: string) => {
        const request = get().requests.find((r) => r.id === id)
        if (!request || request.status !== 'pending') return

        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? { ...r, status: 'approved' as const, approved_by: approvedBy, updated_at: today() }
              : r
          ),
          balances: state.balances.map((b) =>
            b.employee_id === request.employee_id && b.year === 2026
              ? {
                  ...b,
                  used_days: b.used_days + request.days,
                  pending_days: Math.max(0, b.pending_days - request.days),
                }
              : b
          ),
        }))
      },

      rejectLeave: (id: string, approvedBy: string) => {
        const request = get().requests.find((r) => r.id === id)
        if (!request || request.status !== 'pending') return

        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? { ...r, status: 'rejected' as const, approved_by: approvedBy, updated_at: today() }
              : r
          ),
          balances: state.balances.map((b) =>
            b.employee_id === request.employee_id && b.year === 2026
              ? { ...b, pending_days: Math.max(0, b.pending_days - request.days) }
              : b
          ),
        }))
      },

      getRequests: (employeeId?: string) => {
        const requests = get().requests.filter((r) => !r.deleted_at)
        if (employeeId) return requests.filter((r) => r.employee_id === employeeId)
        return requests
      },

      getPendingRequests: () => {
        return get().requests.filter((r) => !r.deleted_at && r.status === 'pending')
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-leave',
      partialize: (state) => ({
        balances: state.balances,
        requests: state.requests,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
