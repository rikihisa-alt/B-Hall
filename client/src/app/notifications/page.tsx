'use client'

import { motion } from 'framer-motion'
import { Bell, FileText, AlertTriangle, Users, Clock, Settings } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

const notifications = [
  {
    title: '承認依頼: 3月度交通費精算',
    description: '田中太郎さんから経費申請の承認依頼が届いています',
    icon: Bell,
    iconColor: '#34d399',
    time: '5分前',
    unread: true,
  },
  {
    title: 'NDA契約書レビュー完了',
    description: '鈴木一郎さんが法務チェックを完了しました',
    icon: FileText,
    iconColor: '#34d399',
    time: '30分前',
    unread: true,
  },
  {
    title: '期限超過: 月次経費レポート',
    description: 'タスクの期限が超過しています。至急対応してください',
    icon: AlertTriangle,
    iconColor: '#fbbf24',
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
    iconColor: '#38bdf8',
    time: '3時間前',
    unread: false,
  },
  {
    title: 'システムメンテナンス予定',
    description: '3月16日 2:00-5:00 にメンテナンスを実施します',
    icon: Settings,
    iconColor: '#64748b',
    time: '昨日',
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* ── Header ── */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <div>
          <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">通知</h1>
          <p className="text-[13px] text-[#94a3b8] mt-1">3件の未読</p>
        </div>
        <button className="text-[13px] text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">
          すべて既読
        </button>
      </motion.div>

      {/* ── Notification List ── */}
      <motion.div
        className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]"
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
              className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon className="w-5 h-5" strokeWidth={1.75} style={{ color: n.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight truncate">{n.title}</p>
                <p className="text-[12px] text-[#94a3b8] mt-0.5 truncate">{n.description}</p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                <span className="text-[12px] text-[#94a3b8]">{n.time}</span>
                {n.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#34d399]" />
                )}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
