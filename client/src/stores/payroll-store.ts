import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import { today } from '@/lib/date'

// ── 型定義 ──

export interface PaySlip {
  id: string
  employee_id: string
  year_month: string // "2026-03"
  base_salary: number
  overtime_pay: number
  commuting_allowance: number
  other_allowances: number
  gross_pay: number
  health_insurance: number
  pension_insurance: number
  employment_insurance: number
  income_tax: number
  resident_tax: number
  total_deductions: number
  net_pay: number
  status: 'draft' | 'confirmed' | 'distributed'
  created_at: string
  updated_at: string
}

export interface MonthlyTotal {
  year_month: string
  total_gross: number
  total_deductions: number
  total_net: number
  employee_count: number
}

// ── ヘルパー ──

function calcPaySlip(base: number, overtime: number, commuting: number, other: number): Omit<PaySlip, 'id' | 'employee_id' | 'year_month' | 'status' | 'created_at' | 'updated_at'> {
  const gross = base + overtime + commuting + other
  // 日本の社会保険料率概算
  const health = Math.round(base * 0.04985) // 健康保険 約4.985%
  const pension = Math.round(base * 0.0915)  // 厚生年金 約9.15%
  const employment = Math.round(gross * 0.006) // 雇用保険 約0.6%
  // 所得税は概算（月額給与から社保控除後の課税対象に対して）
  const taxableIncome = gross - health - pension - employment
  const incomeTax = Math.round(taxableIncome * 0.05) // 概算5%
  const residentTax = Math.round(base * 0.1 / 12) // 住民税（年額10%の月割）
  const totalDeductions = health + pension + employment + incomeTax + residentTax
  const net = gross - totalDeductions

  return {
    base_salary: base,
    overtime_pay: overtime,
    commuting_allowance: commuting,
    other_allowances: other,
    gross_pay: gross,
    health_insurance: health,
    pension_insurance: pension,
    employment_insurance: employment,
    income_tax: incomeTax,
    resident_tax: residentTax,
    total_deductions: totalDeductions,
    net_pay: net,
  }
}

// ── シードデータ ──

// 従業員の基本給設定
const EMP_SALARY_CONFIG: { empId: string; base: number; overtime: number; commuting: number; other: number }[] = [
  { empId: 'emp-1', base: 380000, overtime: 45000, commuting: 15000, other: 10000 }, // 田中太郎 - 管理者
  { empId: 'emp-2', base: 320000, overtime: 25000, commuting: 12000, other: 5000 },  // 佐藤花子 - 人事担当
  { empId: 'emp-3', base: 350000, overtime: 35000, commuting: 15000, other: 8000 },  // 鈴木一郎 - 経理担当
  { empId: 'emp-4', base: 280000, overtime: 20000, commuting: 10000, other: 3000 },  // 高橋美咲 - 契約社員
  { empId: 'emp-5', base: 450000, overtime: 0, commuting: 0, other: 50000 },         // 山田太郎 - 代表取締役
  { empId: 'emp-6', base: 300000, overtime: 18000, commuting: 12000, other: 5000 },  // 伊藤恵 - 総務担当
]

const MONTHS = ['2026-01', '2026-02', '2026-03']

function generateSeedPaySlips(): PaySlip[] {
  const slips: PaySlip[] = []
  const nowStr = today()

  for (const month of MONTHS) {
    for (const config of EMP_SALARY_CONFIG) {
      // 月による微変動（残業）
      const monthIndex = MONTHS.indexOf(month)
      const overtimeVariation = monthIndex === 0 ? 1.1 : monthIndex === 1 ? 0.9 : 1.0
      const overtime = Math.round(config.overtime * overtimeVariation)

      const calc = calcPaySlip(config.base, overtime, config.commuting, config.other)

      const status: PaySlip['status'] = month === '2026-03' ? 'draft' : month === '2026-02' ? 'confirmed' : 'distributed'

      slips.push({
        id: `payslip-${config.empId}-${month}`,
        employee_id: config.empId,
        year_month: month,
        ...calc,
        status,
        created_at: nowStr,
        updated_at: nowStr,
      })
    }
  }

  return slips
}

const SEED_PAYSLIPS = generateSeedPaySlips()

// ── Store ──

interface PayrollState {
  paySlips: PaySlip[]
  _hydrated: boolean
}

interface PayrollActions {
  getPaySlips: (employeeId?: string) => PaySlip[]
  getPaySlip: (id: string) => PaySlip | undefined
  updatePaySlip: (id: string, data: Partial<PaySlip>) => void
  distributePaySlips: (yearMonth: string) => void
  getMonthlyTotal: (yearMonth: string) => MonthlyTotal
  setHydrated: () => void
}

type PayrollStore = PayrollState & PayrollActions

export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set, get) => ({
      paySlips: [],
      _hydrated: false,

      getPaySlips: (employeeId?: string) => {
        const slips = get().paySlips
        if (employeeId) {
          return slips.filter((s) => s.employee_id === employeeId)
        }
        return slips
      },

      getPaySlip: (id: string) => {
        return get().paySlips.find((s) => s.id === id)
      },

      updatePaySlip: (id, data) => {
        set((state) => ({
          paySlips: state.paySlips.map((s) =>
            s.id === id ? { ...s, ...data, updated_at: today() } : s
          ),
        }))
      },

      distributePaySlips: (yearMonth) => {
        set((state) => ({
          paySlips: state.paySlips.map((s) =>
            s.year_month === yearMonth && s.status !== 'distributed'
              ? { ...s, status: 'distributed' as const, updated_at: today() }
              : s
          ),
        }))
      },

      getMonthlyTotal: (yearMonth) => {
        const slips = get().paySlips.filter((s) => s.year_month === yearMonth)
        return {
          year_month: yearMonth,
          total_gross: slips.reduce((sum, s) => sum + s.gross_pay, 0),
          total_deductions: slips.reduce((sum, s) => sum + s.total_deductions, 0),
          total_net: slips.reduce((sum, s) => sum + s.net_pay, 0),
          employee_count: slips.length,
        }
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-payroll',
      partialize: (state) => ({
        paySlips: state.paySlips,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
