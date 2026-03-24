import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, ChecklistItem } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シードタスク ──

const now = today()

const SEED_TASKS: Task[] = []

// ── Store 型定義 ──

interface TaskState {
  tasks: Task[]
  _hydrated: boolean
}

interface TaskActions {
  addTask: (data: Partial<Task>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  getActiveTasks: () => Task[]
  getTasksByAssignee: (userId: string) => Task[]
  updateTaskStatus: (id: string, status: Task['status']) => void
  addChecklistItem: (taskId: string, text: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  removeChecklistItem: (taskId: string, itemId: string) => void
  setHydrated: () => void
}

type TaskStore = TaskState & TaskActions

// ── Store ──

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: SEED_TASKS,
      _hydrated: false,

      addTask: (data: Partial<Task>) => {
        const now = today()
        const newTask: Task = {
          id: generateId(),
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'その他',
          sub_category: data.sub_category || '',
          department: data.department || '',
          assignee_id: data.assignee_id || '',
          reviewer_id: data.reviewer_id || '',
          approver_id: data.approver_id || '',
          due_date: data.due_date || null,
          priority: data.priority || 'medium',
          status: data.status || 'todo',
          source_event: data.source_event || '',
          template_id: data.template_id || '',
          parent_task_id: data.parent_task_id || '',
          checklist: data.checklist || [],
          tags: data.tags || [],
          related_application_id: data.related_application_id || '',
          related_ringi_id: data.related_ringi_id || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updated_at: today() }
              : t
          ),
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, deleted_at: today(), updated_at: today() }
              : t
          ),
        }))
      },

      getTask: (id: string) => {
        return get().tasks.find((t) => t.id === id && !t.deleted_at)
      },

      getActiveTasks: () => {
        return get().tasks.filter((t) => !t.deleted_at)
      },

      getTasksByAssignee: (userId: string) => {
        return get().tasks.filter(
          (t) => t.assignee_id === userId && !t.deleted_at
        )
      },

      updateTaskStatus: (id: string, status: Task['status']) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status, updated_at: today() }
              : t
          ),
        }))
      },

      addChecklistItem: (taskId: string, text: string) => {
        const newItem: ChecklistItem = {
          id: generateId(),
          text,
          completed: false,
        }
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: [...t.checklist, newItem],
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      toggleChecklistItem: (taskId: string, itemId: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((item) =>
                    item.id === itemId
                      ? { ...item, completed: !item.completed }
                      : item
                  ),
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      removeChecklistItem: (taskId: string, itemId: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.filter((item) => item.id !== itemId),
                  updated_at: today(),
                }
              : t
          ),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
