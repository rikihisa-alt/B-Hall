import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee, EmploymentType } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'
import { ONBOARDING_TASKS, OFFBOARDING_TASKS } from '@/lib/event-templates'
import type { EventTaskTemplate } from '@/lib/event-templates'
import { useTaskStore } from '@/stores/task-store'

// ── タスク担当者マッピング ──
// カテゴリ / 部署 に応じて担当者を決定する

function resolveAssigneeId(template: EventTaskTemplate): string {
  // 人事・労務 → user-2 (佐藤花子・人事担当)
  if (template.category === '人事' || template.category === '労務') {
    return 'user-2'
  }
  // 総務・IT → user-6 (伊藤恵・総務担当)
  if (template.category === '総務' || template.category === 'IT') {
    return 'user-6'
  }
  // 経理 → user-3 (鈴木一郎・経理担当)
  if (template.category === '経理') {
    return 'user-3'
  }
  return 'user-2'
}

// ── シード従業員データ ──

const now = today()

const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    user_id: 'user-1',
    name: '田中太郎',
    name_kana: 'タナカタロウ',
    department: '開発部',
    position: '管理者',
    employment_type: 'full_time',
    hire_date: '2020-04-01',
    termination_date: '',
    email: 'tanaka@bhall.jp',
    phone: '090-1234-5678',
    emergency_contact: {
      name: '田中花子',
      phone: '090-8765-4321',
      relationship: '配偶者',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-04-15',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'emp-2',
    user_id: 'user-2',
    name: '佐藤花子',
    name_kana: 'サトウハナコ',
    department: '人事部',
    position: '人事担当',
    employment_type: 'full_time',
    hire_date: '2021-06-15',
    termination_date: '',
    email: 'sato@bhall.jp',
    phone: '090-2345-6789',
    emergency_contact: {
      name: '佐藤一郎',
      phone: '090-9876-5432',
      relationship: '父',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-04-15',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'emp-3',
    user_id: 'user-3',
    name: '鈴木一郎',
    name_kana: 'スズキイチロウ',
    department: '経理部',
    position: '経理担当',
    employment_type: 'full_time',
    hire_date: '2019-10-01',
    termination_date: '',
    email: 'suzuki@bhall.jp',
    phone: '090-3456-7890',
    emergency_contact: {
      name: '鈴木美紀',
      phone: '090-6543-2109',
      relationship: '配偶者',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-04-15',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'emp-4',
    user_id: 'user-4',
    name: '高橋美咲',
    name_kana: 'タカハシミサキ',
    department: '経理部',
    position: '一般従業員',
    employment_type: 'contract',
    hire_date: '2023-01-10',
    termination_date: '',
    email: 'takahashi@bhall.jp',
    phone: '090-4567-8901',
    emergency_contact: {
      name: '高橋健太',
      phone: '090-5432-1098',
      relationship: '兄',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-05-20',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'emp-5',
    user_id: 'user-5',
    name: '山田太郎',
    name_kana: 'ヤマダタロウ',
    department: '経営企画',
    position: '代表取締役',
    employment_type: 'full_time',
    hire_date: '2018-01-01',
    termination_date: '',
    email: 'yamada@bhall.jp',
    phone: '090-5678-9012',
    emergency_contact: {
      name: '山田恵子',
      phone: '090-4321-0987',
      relationship: '配偶者',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-03-10',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'emp-6',
    user_id: 'user-6',
    name: '伊藤恵',
    name_kana: 'イトウメグミ',
    department: '総務部',
    position: '総務担当',
    employment_type: 'full_time',
    hire_date: '2022-03-01',
    termination_date: '',
    email: 'ito@bhall.jp',
    phone: '090-6789-0123',
    emergency_contact: {
      name: '伊藤誠',
      phone: '090-3210-9876',
      relationship: '夫',
    },
    social_insurance_status: 'enrolled',
    employment_insurance_status: 'enrolled',
    health_check_date: '2025-04-15',
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface EmployeeState {
  employees: Employee[]
  _hydrated: boolean
}

interface EmployeeActions {
  addEmployee: (data: Partial<Employee>) => Employee
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  getEmployees: (includeTerminated?: boolean) => Employee[]
  getEmployee: (id: string) => Employee | undefined
  triggerOnboarding: (employeeId: string) => void
  triggerOffboarding: (employeeId: string) => void
  setHydrated: () => void
}

type EmployeeStore = EmployeeState & EmployeeActions

// ── Store ──

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: SEED_EMPLOYEES,
      _hydrated: false,

      addEmployee: (data: Partial<Employee>) => {
        const now = today()
        const newEmployee: Employee = {
          id: generateId(),
          user_id: data.user_id || '',
          name: data.name || '',
          name_kana: data.name_kana || '',
          department: data.department || '',
          position: data.position || '',
          employment_type: data.employment_type || 'full_time',
          hire_date: data.hire_date || now,
          termination_date: '',
          email: data.email || '',
          phone: data.phone || '',
          emergency_contact: data.emergency_contact || null,
          social_insurance_status: data.social_insurance_status || 'not_enrolled',
          employment_insurance_status: data.employment_insurance_status || 'not_enrolled',
          health_check_date: data.health_check_date || '',
          status: 'active',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ employees: [...state.employees, newEmployee] }))
        return newEmployee
      },

      updateEmployee: (id: string, updates: Partial<Employee>) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id
              ? { ...e, ...updates, updated_at: today() }
              : e
          ),
        }))
      },

      getEmployees: (includeTerminated = false) => {
        return get().employees.filter(
          (e) =>
            !e.deleted_at &&
            (includeTerminated || e.status !== 'terminated')
        )
      },

      getEmployee: (id: string) => {
        return get().employees.find((e) => e.id === id && !e.deleted_at)
      },

      triggerOnboarding: (employeeId: string) => {
        const employee = get().getEmployee(employeeId)
        if (!employee) return

        const addTask = useTaskStore.getState().addTask

        ONBOARDING_TASKS.forEach((template) => {
          addTask({
            title: template.title,
            description: `${template.description}（対象: ${employee.name}）`,
            category: template.category,
            sub_category: '入社手続き',
            department: template.department,
            assignee_id: resolveAssigneeId(template),
            reviewer_id: 'user-1',
            approver_id: 'user-5',
            due_date: daysFromNow(template.dueOffsetDays),
            priority: 'high',
            status: 'todo',
            source_event: `入社: ${employee.name}`,
            tags: ['入社', employee.name],
            created_by: 'system',
            updated_by: 'system',
          })
        })
      },

      triggerOffboarding: (employeeId: string) => {
        const employee = get().getEmployee(employeeId)
        if (!employee) return

        const addTask = useTaskStore.getState().addTask

        OFFBOARDING_TASKS.forEach((template) => {
          addTask({
            title: template.title,
            description: `${template.description}（対象: ${employee.name}）`,
            category: template.category,
            sub_category: '退社手続き',
            department: template.department,
            assignee_id: resolveAssigneeId(template),
            reviewer_id: 'user-1',
            approver_id: 'user-5',
            due_date: daysFromNow(template.dueOffsetDays),
            priority: 'high',
            status: 'todo',
            source_event: `退社: ${employee.name}`,
            tags: ['退社', employee.name],
            created_by: 'system',
            updated_by: 'system',
          })
        })

        // ステータスを terminated に、退職日を今日に更新
        get().updateEmployee(employeeId, {
          status: 'terminated',
          termination_date: today(),
        })
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-employees',
      partialize: (state) => ({
        employees: state.employees,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
