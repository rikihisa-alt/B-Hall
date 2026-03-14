import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification, NotificationType } from '@/types'
import { generateId } from '@/lib/id'

// ── Store 型定義 ──

interface NotificationState {
  notifications: Notification[]
  _hydrated: boolean
}

interface NotificationActions {
  addNotification: (data: {
    user_id: string
    type: NotificationType
    title: string
    body: string
    source_type: Notification['source_type']
    source_id: string
    action_url: string
  }) => Notification
  markAsRead: (id: string) => void
  markAllAsRead: (userId: string) => void
  getUnreadCount: (userId: string) => number
  getNotifications: (userId: string) => Notification[]
  deleteNotification: (id: string) => void
  setHydrated: () => void
}

type NotificationStore = NotificationState & NotificationActions

// ── シードデータ ──

const now = new Date().toISOString()
const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'task_assigned',
    title: 'タスクが割り当てられました',
    body: 'タスク「新入社員の入社手続き」が割り当てられました',
    source_type: 'task',
    source_id: 'task-1',
    is_read: false,
    action_url: '/tasks',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'approval_completed',
    title: '申請が承認されました',
    body: '経費申請が承認されました',
    source_type: 'application',
    source_id: 'app-1',
    is_read: false,
    action_url: '/applications',
    created_at: thirtyMinAgo,
    updated_at: thirtyMinAgo,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'notif-3',
    user_id: 'user-1',
    type: 'deadline_approaching',
    title: '締切が近づいています',
    body: '月次レポートの締切が近づいています',
    source_type: 'task',
    source_id: 'task-3',
    is_read: false,
    action_url: '/tasks',
    created_at: oneHourAgo,
    updated_at: oneHourAgo,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'notif-4',
    user_id: 'user-1',
    type: 'comment',
    title: 'コメントが追加されました',
    body: '田中さんがコメントしました',
    source_type: 'task',
    source_id: 'task-1',
    is_read: true,
    action_url: '/tasks',
    created_at: threeHoursAgo,
    updated_at: threeHoursAgo,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'notif-5',
    user_id: 'user-1',
    type: 'deadline_approaching',
    title: '契約更新期限',
    body: '契約書 NDA-2024-03 が更新期限です',
    source_type: 'task',
    source_id: 'task-5',
    is_read: true,
    action_url: '/documents',
    created_at: sixHoursAgo,
    updated_at: sixHoursAgo,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
]

// ── Store ──

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,
      _hydrated: false,

      addNotification: (data) => {
        const timestamp = new Date().toISOString()
        const newNotification: Notification = {
          id: generateId(),
          ...data,
          is_read: false,
          created_at: timestamp,
          updated_at: timestamp,
          created_by: 'system',
          updated_by: 'system',
          deleted_at: null,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
        return newNotification
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id
              ? { ...n, is_read: true, updated_at: new Date().toISOString() }
              : n
          ),
        }))
      },

      markAllAsRead: (userId) => {
        const timestamp = new Date().toISOString()
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.user_id === userId && !n.is_read
              ? { ...n, is_read: true, updated_at: timestamp }
              : n
          ),
        }))
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (n) => n.user_id === userId && !n.is_read && n.deleted_at === null
        ).length
      },

      getNotifications: (userId) => {
        return get()
          .notifications.filter(
            (n) => n.user_id === userId && n.deleted_at === null
          )
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id
              ? { ...n, deleted_at: new Date().toISOString() }
              : n
          ),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
