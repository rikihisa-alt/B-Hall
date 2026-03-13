'use client'

import {
  CheckSquare,
  FileText,
  Stamp,
  Users,
  Building2,
  FolderOpen,
  Calculator,
  ClipboardList,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Bot,
} from 'lucide-react'
import { LauncherCard } from '@/components/ui/launcher-card'
import { QuickActions } from '@/components/ui/quick-actions'

const modules = [
  {
    name: 'タスク',
    description: '業務タスクの管理・進捗確認',
    icon: CheckSquare,
    href: '/tasks',
    badge: 5,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: '申請・承認',
    description: '経費・休暇・各種申請',
    icon: FileText,
    href: '/applications',
    badge: 3,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    name: '稟議',
    description: '決裁・意思決定の管理',
    icon: Stamp,
    href: '/ringi',
    badge: 1,
    color: 'from-amber-500 to-amber-600',
  },
  {
    name: '人事・労務',
    description: '従業員情報・手続き管理',
    icon: Users,
    href: '/hr',
    color: 'from-violet-500 to-violet-600',
  },
  {
    name: '総務',
    description: '備品・設備・庶務管理',
    icon: Building2,
    href: '/general-affairs',
    color: 'from-sky-500 to-sky-600',
  },
  {
    name: '法務・文書',
    description: '契約書・規程・証憑管理',
    icon: FolderOpen,
    href: '/documents',
    color: 'from-rose-500 to-rose-600',
  },
  {
    name: '経理・財務',
    description: '取引・請求・支払・CF管理',
    icon: Calculator,
    href: '/accounting',
    color: 'from-teal-500 to-teal-600',
  },
  {
    name: '日報・報告',
    description: '報告書・インシデント・改善',
    icon: ClipboardList,
    href: '/reports',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: '経営管理',
    description: '経営状況・投資判断・分析',
    icon: BarChart3,
    href: '/management',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    name: 'ナレッジ',
    description: 'テンプレート・手順書・FAQ',
    icon: Lightbulb,
    href: '/knowledge',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    name: '改善・目安箱',
    description: '改善提案・匿名投稿',
    icon: MessageSquare,
    href: '/improvements',
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: 'ジジロボ',
    description: 'AIアシスタント',
    icon: Bot,
    href: '/assistant',
    color: 'from-gray-600 to-gray-700',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          おはようございます、田中さん
        </h1>
        <p className="text-gray-500 mt-1">
          今日の未対応タスクが <span className="text-primary-600 font-semibold">5件</span>、
          承認待ちが <span className="text-warning font-semibold">3件</span> あります
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Module Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          業務モジュール
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <LauncherCard key={mod.href} module={mod} />
          ))}
        </div>
      </div>
    </div>
  )
}
