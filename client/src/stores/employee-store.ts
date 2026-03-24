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

const SEED_EMPLOYEES: Employee[] = []

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
