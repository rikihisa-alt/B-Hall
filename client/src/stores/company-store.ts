import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── 型定義 ──

export type EmployeeCountRange = '1-10' | '11-30' | '31-50' | '51-100' | '101-300' | '300+'

export interface CompanyInfo {
  name: string
  name_kana: string
  postal_code: string
  address: string
  phone: string
  email: string
  website: string
  industry: string
  employee_count_range: EmployeeCountRange | ''
  fiscal_year_start: number // month 1-12
  established_date: string
  representative: string
  departments: string[]
  setup_completed: boolean
  created_at: string
}

interface CompanyState {
  company: CompanyInfo
  _hydrated: boolean
}

interface CompanyActions {
  updateCompany: (data: Partial<CompanyInfo>) => void
  completeSetup: () => void
  resetSetup: () => void
  setHydrated: () => void
}

type CompanyStore = CompanyState & CompanyActions

// ── 初期値 ──

const INITIAL_COMPANY: CompanyInfo = {
  name: '',
  name_kana: '',
  postal_code: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  industry: '',
  employee_count_range: '',
  fiscal_year_start: 4,
  established_date: '',
  representative: '',
  departments: [],
  setup_completed: false,
  created_at: '',
}

// ── Store ──

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      company: { ...INITIAL_COMPANY },
      _hydrated: false,

      updateCompany: (data: Partial<CompanyInfo>) => {
        set((state) => ({
          company: { ...state.company, ...data },
        }))
      },

      completeSetup: () => {
        set((state) => ({
          company: {
            ...state.company,
            setup_completed: true,
            created_at: new Date().toISOString(),
          },
        }))
      },

      resetSetup: () => {
        set({ company: { ...INITIAL_COMPANY } })
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-company',
      partialize: (state) => ({
        company: state.company,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
