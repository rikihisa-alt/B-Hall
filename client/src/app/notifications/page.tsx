'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertTriangle,
  Stamp,
  Settings,
  CheckCheck,
} from 'lucide-react'

type NotificationType = 'task' | 'approval' | 'comment' | 'deadline' | 'alert' | 'system'

interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  time: string
  read: boolean
  sender?: string
}

const typeConfig: Record<NotificationType, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  task: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  approval: { icon: Stamp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  comment: { icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  deadline: { icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
  alert: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  system: { icon: Settings, color: 'text-[#5A6070]', bg: 'bg-white/[0.03]' },
}

const demoNotifications: Notification[] = [
  {
    id: 'N-001',
    title: '承認依頼: 3月度交通費精算',
    description: '田中太郎さんから経費申請の承認依頼が届いています。金額: ¥32,450',
    type: 'approval',
    time: '5分前',
    read: false,
    sender: '田中太郎',
  },
  {
    id: 'N-002',
    title: 'タスク割当: 新入社員オンボーディング準備',
    description: '佐藤花子さんからタスクが割り当てられました。期限: 3月14日',
    type: 'task',
    time: '30分前',
    read: false,
    sender: '佐藤花子',
  },
  {
    id: 'N-003',
    title: 'コメント: NDA契約書最終確認',
    description: '鈴木一郎さんがコメントしました: 「法務チェック完了しました。問題ありません。」',
    type: 'comment',
    time: '1時間前',
    read: false,
    sender: '鈴木一郎',
  },
  {
    id: 'N-004',
    title: '期限超過: 月次経費レポート作成',
    description: 'タスクの期限が超過しています。至急対応してください。',
    type: 'deadline',
    time: '2時間前',
    read: true,
  },
  {
    id: 'N-005',
    title: 'キャッシュフロー注意',
    description: '来月の固定支出が通常より高く、資金繰りに注意が必要です。',
    type: 'alert',
    time: '3時間前',
    read: true,
  },
  {
    id: 'N-006',
    title: '稟議決裁完了: 社内研修プログラム導入',
    description: '稟議 RNG-2026-004 が全承認者により決裁されました。実行タスクを確認してください。',
    type: 'approval',
    time: '5時間前',
    read: true,
    sender: '代表取締役',
  },
  {
    id: 'N-007',
    title: '契約更新リマインダー',
    description: 'NDA - 株式会社XYZ の有効期限が 3/31 に迫っています。更新手続きを開始してください。',
    type: 'deadline',
    time: '昨日',
    read: true,
  },
  {
    id: 'N-008',
    title: '差戻し: ノートPC購入申請',
    description: '田中取締役から申請が差戻しされました。理由: 「見積比較資料の添付をお願いします。」',
    type: 'approval',
    time: '昨日',
    read: true,
    sender: '田中取締役',
  },
  {
    id: 'N-009',
    title: 'システムメンテナンス予定',
    description: '3月16日(日) 2:00-5:00にシステムメンテナンスを実施します。',
    type: 'system',
    time: '2日前',
    read: true,
  },
  {
    id: 'N-010',
    title: '健康診断リマインダー',
    description: '4月実施の健康診断について、対象者リストの確認と日程調整をお願いします。',
    type: 'alert',
    time: '3日前',
    read: true,
  },
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = demoNotifications.filter(n => !n.read).length
  const filteredNotifications = filter === 'unread'
    ? demoNotifications.filter(n => !n.read)
    : demoNotifications

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-semibold text-white/90">通知</h1>
          {unreadCount > 0 && (
            <span className="text-[12px] font-medium text-[#7C8CFF] bg-[#7C8CFF]/10 px-2 py-0.5 rounded-md">
              {unreadCount}件未読
            </span>
          )}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[#5A6070] hover:text-[#A8B0BD] hover:bg-white/[0.03] transition-all">
          <CheckCheck className="w-3.5 h-3.5" />
          すべて既読にする
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5">
        {[
          { key: 'all' as const, label: 'すべて' },
          { key: 'unread' as const, label: '未読' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              filter === tab.key
                ? 'bg-white/[0.06] text-white/90'
                : 'text-[#5A6070] hover:text-[#A8B0BD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.06]">
        {filteredNotifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-[13px] text-[#5A6070]">通知はありません</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3.5 px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.02] ${
                  !notification.read ? 'bg-white/[0.02]' : ''
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-[13px] leading-snug truncate ${
                        !notification.read ? 'text-white/90 font-medium' : 'text-[#A8B0BD]'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-[11px] text-[#5A6070] mt-1 line-clamp-1">
                        {notification.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                      <span className="text-[11px] text-[#3A3F4B]">{notification.time}</span>
                      {!notification.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C8CFF]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
