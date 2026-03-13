'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Shield,
  CheckSquare,
  FileText,
  Stamp,
  ClipboardList,
  ArrowLeft,
  Plus,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users as UsersIcon,
} from 'lucide-react'

const modules = [
  {
    name: 'タスク',
    description: '業務タスクの作成・進捗管理・期限管理',
    icon: CheckSquare,
    href: '/tasks',
    color: 'from-blue-500 to-blue-600',
    badge: 5,
    stats: [
      { label: '未着手', value: 3 },
      { label: '進行中', value: 8 },
      { label: '確認待ち', value: 2 },
      { label: '完了（今週）', value: 12 },
    ],
    recentItems: [
      { title: '月次報告書の作成', status: '進行中', priority: '高', dueDate: '3/14' },
      { title: '新入社員オンボーディング準備', status: '未着手', priority: '中', dueDate: '3/15' },
      { title: '取引先契約書の確認', status: '確認待ち', priority: '高', dueDate: '3/13' },
    ],
  },
  {
    name: '申請・承認',
    description: '経費・休暇・各種申請の提出と承認フロー',
    icon: FileText,
    href: '/applications',
    color: 'from-emerald-500 to-emerald-600',
    badge: 3,
    stats: [
      { label: '承認待ち', value: 3 },
      { label: '差戻し', value: 1 },
      { label: '承認済（今月）', value: 15 },
      { label: '申請合計', value: 24 },
    ],
    recentItems: [
      { title: '出張旅費精算（大阪出張）', status: '承認待ち', priority: '中', dueDate: '3/14' },
      { title: '有給休暇申請（3/20）', status: '承認待ち', priority: '低', dueDate: '3/16' },
      { title: 'ソフトウェア購入申請', status: '差戻し', priority: '高', dueDate: '3/13' },
    ],
  },
  {
    name: '稟議',
    description: '決裁・意思決定の起案・承認管理',
    icon: Stamp,
    href: '/ringi',
    color: 'from-amber-500 to-amber-600',
    badge: 1,
    stats: [
      { label: '決裁待ち', value: 1 },
      { label: '回覧中', value: 2 },
      { label: '決裁済（今月）', value: 4 },
      { label: '却下', value: 0 },
    ],
    recentItems: [
      { title: '新規開発ツール導入（年間120万円）', status: '決裁待ち', priority: '高', dueDate: '3/15' },
      { title: 'オフィス移転計画（Phase1）', status: '回覧中', priority: '中', dueDate: '3/20' },
    ],
  },
  {
    name: '日報・報告',
    description: '日報・週報・月報・インシデント報告',
    icon: ClipboardList,
    href: '/reports',
    color: 'from-orange-500 to-orange-600',
    stats: [
      { label: '未提出', value: 1 },
      { label: '未読コメント', value: 4 },
      { label: '今月の報告', value: 18 },
      { label: 'インシデント', value: 1 },
    ],
    recentItems: [
      { title: '3/12 日報', status: '提出済', priority: '低', dueDate: '3/12' },
      { title: 'サーバー障害報告', status: '対応中', priority: '高', dueDate: '3/11' },
    ],
  },
]

const quickActions = [
  { label: 'タスク作成', icon: Plus, color: 'bg-blue-500', href: '/tasks' },
  { label: '経費申請', icon: FileText, color: 'bg-emerald-500', href: '/applications' },
  { label: '稟議起案', icon: Stamp, color: 'bg-amber-500', href: '/ringi' },
  { label: '日報提出', icon: ClipboardList, color: 'bg-orange-500', href: '/reports' },
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case '高': return 'text-[#FF5D5D] bg-[#FF5D5D]/10'
    case '中': return 'text-[#F5A524] bg-[#F5A524]/10'
    case '低': return 'text-[#6B7280] bg-white/[0.06]'
    default: return 'text-[#6B7280] bg-white/[0.06]'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case '進行中': case '回覧中': case '対応中': return 'text-[#60A5FA] bg-[#60A5FA]/10'
    case '未着手': case '未提出': return 'text-[#6B7280] bg-white/[0.06]'
    case '確認待ち': case '承認待ち': case '決裁待ち': return 'text-[#F5A524] bg-[#F5A524]/10'
    case '差戻し': return 'text-[#FF5D5D] bg-[#FF5D5D]/10'
    case '完了': case '提出済': case '承認済': case '決裁済': return 'text-[#2FBF71] bg-[#2FBF71]/10'
    default: return 'text-[#6B7280] bg-white/[0.06]'
  }
}

export default function OperationsPage() {
  const router = useRouter()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white/90">業務統制</h1>
            <p className="text-sm text-[#6B7280]">タスク・申請・承認・稟議・報告を一元管理</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-[10px] font-semibold text-[#4B5263] uppercase tracking-[0.1em] mb-3">
          クイックアクション
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium text-[#A8B0BD] hover:bg-white/[0.07] hover:border-white/[0.10] transition-all duration-200 active:scale-[0.98]"
              >
                <div className={`w-6 h-6 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                {action.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#FF5D5D]" />
            <span className="text-xs text-[#5A6070] font-medium">緊急対応</span>
          </div>
          <p className="text-2xl font-bold text-[#FF5D5D]">2</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#F5A524]" />
            <span className="text-xs text-[#5A6070] font-medium">承認待ち</span>
          </div>
          <p className="text-2xl font-bold text-[#F5A524]">4</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#60A5FA]" />
            <span className="text-xs text-[#5A6070] font-medium">進行中</span>
          </div>
          <p className="text-2xl font-bold text-[#60A5FA]">10</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-4 h-4 text-[#2FBF71]" />
            <span className="text-xs text-[#5A6070] font-medium">今週完了</span>
          </div>
          <p className="text-2xl font-bold text-[#2FBF71]">12</p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-5">
        {modules.map((mod) => {
          const ModIcon = mod.icon
          return (
            <div key={mod.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-sm`}>
                      <ModIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white/90">{mod.name}</h3>
                        {mod.badge && mod.badge > 0 && (
                          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[#FF5D5D]/15 text-[#FF5D5D] text-[10px] font-bold px-1.5">
                            {mod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280]">{mod.description}</p>
                    </div>
                  </div>
                  <Link
                    href={mod.href}
                    className="flex items-center gap-1 text-sm font-medium text-[#7C8CFF] hover:text-[#929FFF] transition-colors"
                  >
                    開く <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {mod.stats.map((stat) => (
                    <div key={stat.label} className="bg-white/[0.04] rounded-lg px-3 py-2 text-center">
                      <p className="text-lg font-bold text-white/90">{stat.value}</p>
                      <p className="text-[11px] text-[#5A6070]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.06] px-5 py-3">
                <p className="text-xs font-medium text-[#4B5263] mb-2">最近の項目</p>
                <div className="space-y-1">
                  {mod.recentItems.map((item, idx) => (
                    <Link key={idx} href={mod.href}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                        <span className="flex-1 text-sm text-[#A8B0BD] truncate">{item.title}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-[#5A6070]">{item.dueDate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
