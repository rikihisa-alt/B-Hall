'use client'

import Link from 'next/link'
import {
  Shield,
  Building,
  TrendingUp,
  CheckSquare,
  FileText,
  Stamp,
  ClipboardList,
  Users,
  Building2,
  FolderOpen,
  Calculator,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Bot,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react'

const categories = [
  {
    id: 'operations',
    name: '業務統制',
    description: 'タスク・申請・承認・稟議・報告を一元管理',
    href: '/operations',
    icon: Shield,
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    bgGlow: 'bg-blue-500/5',
    borderColor: 'border-blue-200/40',
    iconBg: 'from-blue-500 to-indigo-600',
    stats: { pending: 8, urgent: 2 },
    modules: [
      { name: 'タスク', icon: CheckSquare, badge: 5, href: '/tasks' },
      { name: '申請・承認', icon: FileText, badge: 3, href: '/applications' },
      { name: '稟議', icon: Stamp, badge: 1, href: '/ringi' },
      { name: '日報・報告', icon: ClipboardList, href: '/reports' },
    ],
  },
  {
    id: 'department',
    name: '部門管理',
    description: '人事・総務・法務・経理の専門業務を横断管理',
    href: '/department',
    icon: Building,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGlow: 'bg-emerald-500/5',
    borderColor: 'border-emerald-200/40',
    iconBg: 'from-emerald-500 to-teal-600',
    stats: { pending: 4, urgent: 1 },
    modules: [
      { name: '人事・労務', icon: Users, href: '/hr' },
      { name: '総務', icon: Building2, href: '/general-affairs' },
      { name: '法務・文書', icon: FolderOpen, href: '/documents' },
      { name: '経理・財務', icon: Calculator, href: '/accounting' },
    ],
  },
  {
    id: 'executive',
    name: '経営・ナレッジ',
    description: '経営判断・知識共有・改善活動を推進',
    href: '/executive',
    icon: TrendingUp,
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    bgGlow: 'bg-amber-500/5',
    borderColor: 'border-amber-200/40',
    iconBg: 'from-amber-500 to-orange-600',
    stats: { pending: 3, urgent: 0 },
    modules: [
      { name: '経営管理', icon: BarChart3, href: '/management' },
      { name: 'ナレッジ', icon: Lightbulb, href: '/knowledge' },
      { name: '改善・目安箱', icon: MessageSquare, href: '/improvements' },
      { name: 'ジジロボ', icon: Bot, href: '/assistant' },
    ],
  },
]

export default function HomePage() {
  const today = new Date()
  const greeting = today.getHours() < 12 ? 'おはようございます' : today.getHours() < 18 ? 'お疲れ様です' : 'お疲れ様です'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}、田中さん
        </h1>
        <p className="text-gray-500 mt-1">
          未対応 <span className="text-primary-600 font-semibold">15件</span>、
          緊急 <span className="text-danger font-semibold">3件</span> の対応が必要です
        </p>
      </div>

      {/* Urgent Banner */}
      <div className="glass rounded-2xl p-4 border border-amber-200/60 bg-amber-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">緊急の対応事項があります</p>
            <p className="text-xs text-gray-500 mt-0.5">経費申請の承認期限切れ 2件 / 稟議の確認待ち 1件</p>
          </div>
          <Link href="/operations" className="text-xs font-medium text-amber-600 hover:text-amber-700 shrink-0">
            確認する →
          </Link>
        </div>
      </div>

      {/* Category Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const CatIcon = cat.icon
          return (
            <Link key={cat.id} href={cat.href}>
              <div className={`group relative glass rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden ${cat.borderColor}`}>
                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${cat.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <CatIcon className="w-6 h-6 text-white" />
                  </div>
                  {cat.stats.urgent > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      {cat.stats.urgent}件緊急
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="relative mb-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                </div>

                {/* Module List */}
                <div className="relative space-y-2 mb-5">
                  {cat.modules.map((mod) => {
                    const ModIcon = mod.icon
                    return (
                      <div
                        key={mod.name}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 border border-gray-100/60"
                      >
                        <ModIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">{mod.name}</span>
                        {mod.badge && mod.badge > 0 && (
                          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary-500 text-white text-[10px] font-bold px-1.5">
                            {mod.badge}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-100/60">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>未対応 {cat.stats.pending}件</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                    <span>開く</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '本日のタスク', value: '5', sub: '2件完了', color: 'text-blue-600' },
          { label: '承認待ち', value: '3', sub: '1件緊急', color: 'text-emerald-600' },
          { label: '今月の経費', value: '¥284K', sub: '予算比 72%', color: 'text-amber-600' },
          { label: '未読通知', value: '8', sub: '3件重要', color: 'text-rose-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
