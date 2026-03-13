'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { Bell, FileText, AlertTriangle, Users, Clock, Settings, ChevronRight } from 'lucide-react'

const notifications = [
  {
    title: '承認依頼: 3月度交通費精算',
    description: '田中太郎さんから経費申請の承認依頼が届いています',
    icon: Bell,
    iconColor: 'text-accent',
    time: '5分前',
    unread: true,
  },
  {
    title: 'NDA契約書レビュー完了',
    description: '鈴木一郎さんが法務チェックを完了しました',
    icon: FileText,
    iconColor: 'text-accent',
    time: '30分前',
    unread: true,
  },
  {
    title: '期限超過: 月次経費レポート',
    description: 'タスクの期限が超過しています。至急対応してください',
    icon: AlertTriangle,
    iconColor: 'text-warning',
    time: '1時間前',
    unread: true,
  },
  {
    title: '新入社員オンボーディング更新',
    description: '佐藤花子さんがタスクを更新しました',
    icon: Users,
    iconColor: 'text-[#8B5CF6]',
    time: '2時間前',
    unread: false,
  },
  {
    title: '契約更新リマインダー',
    description: 'NDA - 株式会社XYZ の有効期限が 3/31 に迫っています',
    icon: Clock,
    iconColor: 'text-info',
    time: '3時間前',
    unread: false,
  },
  {
    title: 'システムメンテナンス予定',
    description: '3月16日 2:00-5:00 にメンテナンスを実施します',
    icon: Settings,
    iconColor: 'text-text-muted',
    time: '昨日',
    unread: false,
  },
]

export default function NotificationsPage() {
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
        className="flex items-center justify-between mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">通知</h1>
          <p className="text-[13px] text-text-secondary mt-1" style={{ fontFamily: 'var(--font-inter)' }}>3件の未読</p>
        </div>
        <button className="text-[13px] text-text-secondary hover:text-text-primary transition-colors">
          すべて既読
        </button>
      </motion.div>

      {/* Notification List */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">すべての通知</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {notifications.map((n, i) => {
            const Icon = n.icon
            return (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className={`w-5 h-5 ${n.iconColor}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{n.title}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5 truncate">{n.description}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                  <span className="text-[12px] text-text-secondary">{n.time}</span>
                  {n.unread && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
              </div>
            )
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
