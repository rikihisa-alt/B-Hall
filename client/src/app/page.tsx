'use client'

import Link from 'next/link'
import {
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
  AlertTriangle,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react'

interface ModuleTile {
  name: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  badge?: number
  badgeColor?: string
}

const operationsModules: ModuleTile[] = [
  {
    name: 'タスク',
    description: '業務の進捗を管理',
    href: '/tasks',
    icon: CheckSquare,
    gradient: 'from-blue-500 to-blue-600',
    badge: 5,
  },
  {
    name: '申請・承認',
    description: '各種申請のワークフロー',
    href: '/applications',
    icon: FileText,
    gradient: 'from-indigo-500 to-indigo-600',
    badge: 3,
  },
  {
    name: '稟議',
    description: '決裁プロセスを可視化',
    href: '/ringi',
    icon: Stamp,
    gradient: 'from-amber-500 to-amber-600',
    badge: 1,
    badgeColor: 'bg-amber-500',
  },
  {
    name: '日報・報告',
    description: '報告・改善活動を記録',
    href: '/reports',
    icon: ClipboardList,
    gradient: 'from-teal-500 to-teal-600',
  },
]

const departmentModules: ModuleTile[] = [
  {
    name: '人事・労務',
    description: '従業員・手続き管理',
    href: '/hr',
    icon: Users,
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    name: '総務',
    description: '備品・貸与物・設備',
    href: '/general-affairs',
    icon: Building2,
    gradient: 'from-sky-500 to-sky-600',
  },
  {
    name: '法務・文書',
    description: '契約書・規程を一元管理',
    href: '/documents',
    icon: FolderOpen,
    gradient: 'from-rose-500 to-rose-600',
    badge: 2,
    badgeColor: 'bg-rose-500',
  },
  {
    name: '経理・財務',
    description: '会計・資金の管理',
    href: '/accounting',
    icon: Calculator,
    gradient: 'from-emerald-500 to-emerald-600',
  },
]

const executiveModules: ModuleTile[] = [
  {
    name: '経営管理',
    description: '会社の状態を俯瞰',
    href: '/management',
    icon: BarChart3,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    name: 'ナレッジ',
    description: '手順書・テンプレート',
    href: '/knowledge',
    icon: Lightbulb,
    gradient: 'from-yellow-500 to-yellow-600',
  },
  {
    name: '改善・目安箱',
    description: '提案・ヒヤリハットを共有',
    href: '/improvements',
    icon: MessageSquare,
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    name: 'ジジロボ',
    description: 'AIアシスタントに相談',
    href: '/assistant',
    icon: Bot,
    gradient: 'from-cyan-500 to-cyan-600',
  },
]

const urgentItems = [
  { text: '経費申請の承認期限が超過しています', href: '/applications', type: '承認' },
  { text: '稟議 RNG-2026-001 の確認待ち', href: '/ringi', type: '稟議' },
  { text: 'NDA契約書の期限が今月末です', href: '/documents', type: '文書' },
]

function TileCard({ tile }: { tile: ModuleTile }) {
  const Icon = tile.icon
  return (
    <Link href={tile.href}>
      <div className="group relative glass rounded-2xl p-5 hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 active:scale-[0.98]">
        {/* Glow */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tile.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

        <div className="relative flex items-start gap-4">
          <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${tile.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 shrink-0`}>
            <Icon className="w-[22px] h-[22px] text-white" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                {tile.name}
              </h3>
              {tile.badge && tile.badge > 0 && (
                <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-full ${tile.badgeColor || 'bg-primary-500'} text-white text-[10px] font-bold px-1.5`}>
                  {tile.badge}
                </span>
              )}
            </div>
            <p className="text-[13px] text-gray-400 mt-0.5">{tile.description}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 mt-1.5" />
        </div>
      </div>
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em]">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200/60 to-transparent" />
    </div>
  )
}

export default function HomePage() {
  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'おはようございます' : hour < 18 ? 'お疲れ様です' : 'お疲れ様です'

  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="mb-8">
        <p className="text-[13px] text-gray-400 font-medium mb-1">{dateStr}</p>
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">
          {greeting}、田中さん
        </h1>
      </div>

      {/* Today's Focus */}
      {urgentItems.length > 0 && (
        <div className="mb-8">
          <div className="glass rounded-2xl overflow-hidden border border-amber-100/80">
            <div className="px-5 py-3 border-b border-amber-100/60 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[13px] font-semibold text-gray-700">対応が必要な項目</span>
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{urgentItems.length}件</span>
            </div>
            <div className="divide-y divide-gray-100/50">
              {urgentItems.map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <div className="px-5 py-3 flex items-center gap-3 hover:bg-white/60 transition-colors cursor-pointer group">
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100/80 px-2 py-0.5 rounded-md shrink-0">{item.type}</span>
                    <span className="text-[13px] text-gray-600 flex-1">{item.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module Grid */}
      <div className="space-y-8">
        {/* Operations */}
        <section>
          <SectionLabel>業務統制</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {operationsModules.map((tile) => (
              <TileCard key={tile.href} tile={tile} />
            ))}
          </div>
        </section>

        {/* Department */}
        <section>
          <SectionLabel>部門管理</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departmentModules.map((tile) => (
              <TileCard key={tile.href} tile={tile} />
            ))}
          </div>
        </section>

        {/* Executive */}
        <section>
          <SectionLabel>経営・ナレッジ</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {executiveModules.map((tile) => (
              <TileCard key={tile.href} tile={tile} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-10 grid grid-cols-4 gap-3">
        {[
          { label: '本日のタスク', value: '5', accent: 'text-blue-600' },
          { label: '承認待ち', value: '3', accent: 'text-amber-600' },
          { label: '今月経費', value: '¥284K', accent: 'text-emerald-600' },
          { label: '未読通知', value: '8', accent: 'text-rose-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-subtle rounded-xl px-4 py-3 text-center">
            <p className="text-[11px] text-gray-400">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.accent} mt-0.5`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
