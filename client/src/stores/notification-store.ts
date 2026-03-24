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

const SEED_NOTIFICATIONS: Notification[] = []

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
