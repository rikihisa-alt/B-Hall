'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Bell,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageSquare,
  AtSign,
  Settings,
  ChevronRight,
  ListTodo,
  BellOff,
} from 'lucide-react'
import { useNotificationStore } from '@/stores/notification-store'
import { useAuth } from '@/hooks/use-auth'
import { formatRelative } from '@/lib/date'
import type { NotificationType } from '@/types'
import type { LucideIcon } from 'lucide-react'

// ── 通知タイプに応じたアイコン・色のマッピング ──

const notificationConfig: Record<
  NotificationType,
  { icon: LucideIcon; iconColor: string }
> = {
  task_assigned: { icon: ListTodo, iconColor: 'text-accent' },
  deadline_approaching: { icon: Clock, iconColor: 'text-warning' },
  deadline_exceeded: { icon: AlertTriangle, iconColor: 'text-danger' },
  approval_requested: { icon: FileText, iconColor: 'text-accent' },
  approval_completed: { icon: CheckCircle2, iconColor: 'text-success' },
  rejected: { icon: AlertTriangle, iconColor: 'text-danger' },
  comment: { icon: MessageSquare, iconColor: 'text-[#8B5CF6]' },
  mention: { icon: AtSign, iconColor: 'text-info' },
  system: { icon: Settings, iconColor: 'text-text-muted' },
}

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { currentUser } = useAuth()
  const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !currentUser) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-bg-elevated rounded w-1/4" />
        <div className="h-4 bg-bg-elevated rounded w-1/6" />
        <div className="bg-bg-surface border border-border rounded-[16px] overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border">
              <div className="w-5 h-5 bg-bg-elevated rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-bg-elevated rounded w-2/3" />
                <div className="h-3 bg-bg-elevated rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const notifications = getNotifications(currentUser.id)
  const unreadCount = getUnreadCount(currentUser.id)

  const handleNotificationClick = (notifId: string, actionUrl: string) => {
    markAsRead(notifId)
    if (actionUrl) {
      router.push(actionUrl)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead(currentUser.id)
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">通知</span>
      </nav>

      {/* Header */}
      <motion.div
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">通知</h1>
          <p className="text-[13px] text-text-secondary mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            {unreadCount > 0 ? `${unreadCount}件の未読` : 'すべて既読です'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
          >
            すべて既読
          </button>
        )}
      </motion.div>

      {/* Notification List */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">すべての通知</h2>

        {notifications.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12 flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
              <BellOff className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-semibold text-text-primary mb-1">通知はありません</p>
            <p className="text-[13px] text-text-muted">新しい通知が届くとここに表示されます</p>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {notifications.map((n) => {
              const config = notificationConfig[n.type] ?? notificationConfig.system
              const Icon = config.icon

              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.action_url)}
                  className={`flex items-start gap-3 md:gap-4 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer ${
                    !n.is_read
                      ? 'bg-[rgba(79,70,229,0.02)] border-l-[3px] border-l-accent'
                      : 'border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <Icon className={`w-5 h-5 ${config.iconColor}`} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] tracking-tight truncate ${
                      !n.is_read ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'
                    }`}>
                      {n.title}
                    </p>
                    <p className="text-[12px] text-text-secondary mt-0.5 truncate">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                    <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                      {formatRelative(n.created_at)}
                    </span>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  )
}
