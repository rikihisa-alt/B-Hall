'use client'

import { Bell, FileText, AlertTriangle, Users, Clock, Settings } from 'lucide-react'

const notifications = [
  {
    title: '承認依頼: 3月度交通費精算',
    description: '田中太郎さんから経費申請の承認依頼が届いています',
    icon: Bell,
    iconColor: '#6E7BF7',
    time: '5分前',
    unread: true,
  },
  {
    title: 'NDA契約書レビュー完了',
    description: '鈴木一郎さんが法務チェックを完了しました',
    icon: FileText,
    iconColor: '#3CB06C',
    time: '30分前',
    unread: true,
  },
  {
    title: '期限超過: 月次経費レポート',
    description: 'タスクの期限が超過しています。至急対応してください',
    icon: AlertTriangle,
    iconColor: '#D4993D',
    time: '1時間前',
    unread: true,
  },
  {
    title: '新入社員オンボーディング更新',
    description: '佐藤花子さんがタスクを更新しました',
    icon: Users,
    iconColor: '#8B6CF7',
    time: '2時間前',
    unread: false,
  },
  {
    title: '契約更新リマインダー',
    description: 'NDA - 株式会社XYZ の有効期限が 3/31 に迫っています',
    icon: Clock,
    iconColor: '#4A9FE8',
    time: '3時間前',
    unread: false,
  },
  {
    title: 'システムメンテナンス予定',
    description: '3月16日 2:00-5:00 にメンテナンスを実施します',
    icon: Settings,
    iconColor: '#4E4E56',
    time: '昨日',
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">通知</h1>
          <p className="text-[14px] text-[#4E4E56] mt-1">3件の未読</p>
        </div>
        <button className="text-[13px] text-[#4E4E56] hover:text-[#8E8E96] transition-colors">
          すべて既読
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-[#111114] overflow-hidden divide-y divide-white/[0.04]">
        {notifications.map((n, i) => {
          const Icon = n.icon
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon className="w-4 h-4" style={{ color: n.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] truncate">{n.title}</p>
                <p className="text-[12px] text-[#3A3A42] mt-0.5 truncate">{n.description}</p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0 pt-0.5">
                <span className="text-[12px] text-[#3A3A42]">{n.time}</span>
                {n.unread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E7BF7]" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
