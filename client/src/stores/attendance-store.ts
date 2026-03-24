import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'

// ── Types ──

export interface AttendanceRecord {
  id: string
  employee_id: string
  date: string // YYYY-MM-DD
  clock_in: string | null // HH:mm
  clock_out: string | null // HH:mm
  break_minutes: number
  overtime_minutes: number
  status: 'present' | 'absent' | 'late' | 'half_day' | 'remote'
  note: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface MonthlyStats {
  workDays: number
  totalHours: number
  overtimeHours: number
  lateCount: number
  absentCount: number
}

// ── Helpers ──

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function nowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function nowISO(): string {
  return new Date().toISOString()
}

function calcWorkMinutes(clockIn: string | null, clockOut: string | null, breakMin: number): number {
  if (!clockIn || !clockOut) return 0
  const [inH, inM] = clockIn.split(':').map(Number)
  const [outH, outM] = clockOut.split(':').map(Number)
  return (outH * 60 + outM) - (inH * 60 + inM) - breakMin
}

function calcOvertime(workMinutes: number): number {
  const standard = 8 * 60 // 480 minutes
  return Math.max(0, workMinutes - standard)
}

// ── Seed Data ──

const EMPLOYEE_IDS = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']

const EMPLOYEE_NAMES: Record<string, string> = {
  'user-1': '田中太郎',
  'user-2': '佐藤花子',
  'user-3': '鈴木一郎',
  'user-4': '高橋美咲',
  'user-5': '山本健二',
  'user-6': '伊藤恵',
}

function generateSeedRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const now = nowISO()

  // March 2026: 1st to 23rd
  for (let day = 1; day <= 23; day++) {
    const dateStr = `2026-03-${String(day).padStart(2, '0')}`
    const dayOfWeek = new Date(2026, 2, day).getDay() // 0=Sun, 6=Sat

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    for (const empId of EMPLOYEE_IDS) {
      // Occasional absences
      const seed = (day * 7 + EMPLOYEE_IDS.indexOf(empId) * 13) % 100
      if (seed < 4) {
        // ~4% absent
        records.push({
          id: generateId(),
          employee_id: empId,
          date: dateStr,
          clock_in: null,
          clock_out: null,
          break_minutes: 0,
          overtime_minutes: 0,
          status: 'absent',
          note: seed < 2 ? '体調不良' : '有休取得',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        })
        continue
      }

      // Remote work ~12%
      const isRemote = seed >= 80 && seed < 92

      // Clock in: 8:30 - 9:15 range
      const baseInMinute = 8 * 60 + 30 // 8:30
      const inOffset = ((day * 3 + EMPLOYEE_IDS.indexOf(empId) * 17) % 45) // 0-44 minutes
      const inMinute = baseInMinute + inOffset
      const inH = Math.floor(inMinute / 60)
      const inM = inMinute % 60
      const clockIn = `${String(inH).padStart(2, '0')}:${String(inM).padStart(2, '0')}`

      // Late if after 9:00
      const isLate = inMinute > 9 * 60

      // Clock out: 17:30 - 19:00 range
      const baseOutMinute = 17 * 60 + 30 // 17:30
      const outOffset = ((day * 11 + EMPLOYEE_IDS.indexOf(empId) * 7) % 90) // 0-89 minutes
      const outMinute = baseOutMinute + outOffset
      const outH = Math.floor(outMinute / 60)
      const outM = outMinute % 60
      const clockOut = `${String(outH).padStart(2, '0')}:${String(outM).padStart(2, '0')}`

      const breakMin = 60
      const workMin = calcWorkMinutes(clockIn, clockOut, breakMin)
      const overtimeMin = calcOvertime(workMin)

      let status: AttendanceRecord['status'] = 'present'
      if (isLate) status = 'late'
      if (isRemote) status = 'remote'

      // Half day ~3%
      if (seed >= 92 && seed < 95) {
        status = 'half_day'
      }

      records.push({
        id: generateId(),
        employee_id: empId,
        date: dateStr,
        clock_in: clockIn,
        clock_out: clockOut,
        break_minutes: breakMin,
        overtime_minutes: overtimeMin,
        status,
        note: isRemote ? '在宅勤務' : '',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })
    }
  }

  return records
}

// ── Store Interface ──

interface AttendanceState {
  records: AttendanceRecord[]
  _hydrated: boolean
}

interface AttendanceActions {
  clockIn: (employeeId: string) => void
  clockOut: (employeeId: string) => void
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void
  getRecordsByEmployee: (employeeId: string, month?: string) => AttendanceRecord[]
  getRecordsByDate: (date: string) => AttendanceRecord[]
  getTodayRecord: (employeeId: string) => AttendanceRecord | undefined
  getMonthlyStats: (employeeId: string, yearMonth: string) => MonthlyStats
  setHydrated: () => void
}

type AttendanceStore = AttendanceState & AttendanceActions

export { EMPLOYEE_NAMES }

// ── Store ──

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set, get) => ({
      records: generateSeedRecords(),
      _hydrated: false,

      clockIn: (employeeId: string) => {
        const date = todayStr()
        const existing = get().records.find(
          (r) => r.employee_id === employeeId && r.date === date && !r.deleted_at
        )
        if (existing) return // already has record for today

        const time = nowTime()
        const isLate = (() => {
          const [h, m] = time.split(':').map(Number)
          return h * 60 + m > 9 * 60
        })()

        const newRecord: AttendanceRecord = {
          id: generateId(),
          employee_id: employeeId,
          date,
          clock_in: time,
          clock_out: null,
          break_minutes: 60,
          overtime_minutes: 0,
          status: isLate ? 'late' : 'present',
          note: '',
          created_at: nowISO(),
          updated_at: nowISO(),
          deleted_at: null,
        }

        set((state) => ({ records: [...state.records, newRecord] }))
      },

      clockOut: (employeeId: string) => {
        const date = todayStr()
        set((state) => ({
          records: state.records.map((r) => {
            if (r.employee_id === employeeId && r.date === date && !r.deleted_at && r.clock_in && !r.clock_out) {
              const time = nowTime()
              const workMin = calcWorkMinutes(r.clock_in, time, r.break_minutes)
              const overtimeMin = calcOvertime(workMin)
              return {
                ...r,
                clock_out: time,
                overtime_minutes: overtimeMin,
                updated_at: nowISO(),
              }
            }
            return r
          }),
        }))
      },

      updateRecord: (id: string, updates: Partial<AttendanceRecord>) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates, updated_at: nowISO() } : r
          ),
        }))
      },

      getRecordsByEmployee: (employeeId: string, month?: string) => {
        return get().records.filter((r) => {
          if (r.employee_id !== employeeId || r.deleted_at) return false
          if (month) return r.date.startsWith(month) // e.g. "2026-03"
          return true
        })
      },

      getRecordsByDate: (date: string) => {
        return get().records.filter((r) => r.date === date && !r.deleted_at)
      },

      getTodayRecord: (employeeId: string) => {
        const date = todayStr()
        return get().records.find(
          (r) => r.employee_id === employeeId && r.date === date && !r.deleted_at
        )
      },

      getMonthlyStats: (employeeId: string, yearMonth: string): MonthlyStats => {
        const monthRecords = get().records.filter(
          (r) => r.employee_id === employeeId && r.date.startsWith(yearMonth) && !r.deleted_at
        )

        let totalMinutes = 0
        let overtimeMinutes = 0
        let workDays = 0
        let lateCount = 0
        let absentCount = 0

        for (const r of monthRecords) {
          if (r.status === 'absent') {
            absentCount++
            continue
          }
          if (r.clock_in) {
            workDays++
            const workMin = calcWorkMinutes(r.clock_in, r.clock_out, r.break_minutes)
            totalMinutes += workMin
            overtimeMinutes += r.overtime_minutes
          }
          if (r.status === 'late') lateCount++
        }

        return {
          workDays,
          totalHours: Math.round((totalMinutes / 60) * 10) / 10,
          overtimeHours: Math.round((overtimeMinutes / 60) * 10) / 10,
          lateCount,
          absentCount,
        }
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-attendance',
      partialize: (state) => ({
        records: state.records,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
