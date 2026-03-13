'use client'

import { motion } from 'framer-motion'
import { Bell, FileText, AlertTriangle, Users, Clock, Settings } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

const notifications = [
  {
    title: '承認依頼: 3月度交通費精算',
    description: '田中太郎さんから経費申請の承認依頼が届いています',
    icon: Bell,
    iconColor: '#6366F1',
    time: '5分前',
    unread: true,
  },
  {
    title: 'NDA契約書レビュー完了',
    description: '鈴木一郎さんが法務チェックを完了しました',
    icon: FileText,
    iconColor: '#059669',
    time: '30分前',
    unread: true,
  },
  {
    title: '期限超過: 月次経費レポート',
    description: 'タスクの期限が超過しています。至急対応してください',
    icon: AlertTriangle,
    iconColor: '#D97706',
    time: '1時間前',
    unread: true,
  },
  {
    title: '新入社員オンボーディング更新',
    description: '佐藤花子さんがタスクを更新しました',
    icon: Users,
    iconColor: '#8B5CF6',
    time: '2時間前',
    unread: false,
  },
  {
    title: '契約更新リマインダー',
    description: 'NDA - 株式会社XYZ の有効期限が 3/31 に迫っています',
    icon: Clock,
    iconColor: '#0284C7',
    time: '3時間前',
    unread: false,
  },
  {
    title: 'システムメンテナンス予定',
    description: '3月16日 2:00-5:00 にメンテナンスを実施します',
    icon: Settings,
    iconColor: '#94A3B8',
    time: '昨日',
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">

      {/* ── Header ── */}
      <motion.div
        className="flex items-center justify-between mb-14"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">通知</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">3件の未読</p>
        </div>
        <button className="text-[13px] text-[#94A3B8] font-medium hover:text-[#1E293B] transition-colors">
          すべて既読
        </button>
      </motion.div>

      {/* ── Notification List ── */}
      <motion.div
        className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        {notifications.map((n, i) => {
          const Icon = n.icon
          return (
            <div
              key={i}
              className="flex items-start gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon className="w-5 h-5" style={{ color: n.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B] truncate">{n.title}</p>
                <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5 truncate">{n.description}</p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                <span className="text-[13px] text-[#94A3B8] font-medium">{n.time}</span>
                {n.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                )}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
