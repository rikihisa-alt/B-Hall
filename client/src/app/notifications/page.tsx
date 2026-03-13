'use client'

import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  MessageSquare,
  Stamp,
  Calendar,
  CreditCard,
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
  actionUrl?: string
  sender?: string
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  task: { icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' },
  approval: { icon: Stamp, color: 'text-amber-500 bg-amber-50' },
  comment: { icon: MessageSquare, color: 'text-violet-500 bg-violet-50' },
  deadline: { icon: Clock, color: 'text-red-500 bg-red-50' },
  alert: { icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
  system: { icon: Settings, color: 'text-gray-500 bg-gray-50' },
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
    description: '来月の固定支出が通常より¥2,000,000高く、資金繰りに注意が必要です。',
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
    description: '3月16日(日) 2:00-5:00にシステムメンテナンスを実施します。一時的にアクセスできません。',
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知</h1>
          <p className="text-sm text-gray-500 mt-1">
            未読が <span className="text-primary-600 font-semibold">{unreadCount}件</span> あります
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
          <CheckCheck className="w-4 h-4" />
          すべて既読にする
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: 'すべて' },
          { key: 'unread' as const, label: `未読 (${unreadCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white shadow-sm text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="glass rounded-2xl divide-y divide-gray-100/50">
        {filteredNotifications.map((notification) => {
          const type = typeConfig[notification.type]
          const Icon = type.icon

          return (
            <div
              key={notification.id}
              className={`px-5 py-4 hover:bg-white/50 transition-all cursor-pointer group ${
                !notification.read ? 'bg-primary-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${type.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900 font-semibold' : 'text-gray-700'
                      } group-hover:text-primary-600 transition-colors`}>
                        {notification.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{notification.time}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
