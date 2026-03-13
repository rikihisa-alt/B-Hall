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
  Zap,
  ArrowRight,
} from 'lucide-react'

/* ─── Tile data ─── */
interface AppTile {
  name: string
  sub: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  accent: string       // gradient for icon bg
  glow: string         // hover glow color
  badge?: number
  urgent?: boolean
}

const workTiles: AppTile[] = [
  {
    name: 'タスク',
    sub: '進捗・期限を管理',
    href: '/tasks',
    icon: CheckSquare,
    accent: 'from-blue-500 to-blue-600',
    glow: 'rgba(59,130,246,0.10)',
    badge: 5,
  },
  {
    name: '申請・承認',
    sub: 'ワークフローを処理',
    href: '/applications',
    icon: FileText,
    accent: 'from-indigo-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.10)',
    badge: 3,
  },
  {
    name: '稟議',
    sub: '決裁プロセスを可視化',
    href: '/ringi',
    icon: Stamp,
    accent: 'from-amber-500 to-amber-600',
    glow: 'rgba(245,158,11,0.10)',
    badge: 1,
    urgent: true,
  },
  {
    name: '報告・改善',
    sub: '日報・インシデントを記録',
    href: '/reports',
    icon: ClipboardList,
    accent: 'from-teal-500 to-teal-600',
    glow: 'rgba(20,184,166,0.10)',
  },
]

const deptTiles: AppTile[] = [
  {
    name: '人事・労務',
    sub: '従業員・手続き管理',
    href: '/hr',
    icon: Users,
    accent: 'from-violet-500 to-violet-600',
    glow: 'rgba(139,92,246,0.10)',
  },
  {
    name: '総務',
    sub: '備品・設備・貸与物',
    href: '/general-affairs',
    icon: Building2,
    accent: 'from-sky-500 to-sky-600',
    glow: 'rgba(14,165,233,0.10)',
  },
  {
    name: '法務・文書',
    sub: '契約・規程を一元管理',
    href: '/documents',
    icon: FolderOpen,
    accent: 'from-rose-500 to-rose-600',
    glow: 'rgba(244,63,94,0.10)',
    badge: 2,
  },
  {
    name: '経理・財務',
    sub: '会計・資金フローを管理',
    href: '/accounting',
    icon: Calculator,
    accent: 'from-emerald-500 to-emerald-600',
    glow: 'rgba(16,185,129,0.10)',
  },
]

const mgmtTiles: AppTile[] = [
  {
    name: '経営管理',
    sub: '会社全体を俯瞰',
    href: '/management',
    icon: BarChart3,
    accent: 'from-orange-500 to-orange-600',
    glow: 'rgba(249,115,22,0.10)',
  },
  {
    name: 'ナレッジ',
    sub: '手順書・テンプレート',
    href: '/knowledge',
    icon: Lightbulb,
    accent: 'from-yellow-500 to-yellow-600',
    glow: 'rgba(234,179,8,0.10)',
  },
  {
    name: '改善・目安箱',
    sub: '提案・ヒヤリハットを共有',
    href: '/improvements',
    icon: MessageSquare,
    accent: 'from-pink-500 to-pink-600',
    glow: 'rgba(236,72,153,0.10)',
  },
  {
    name: 'ジジロボ',
    sub: 'AIアシスタントに相談',
    href: '/assistant',
    icon: Bot,
    accent: 'from-cyan-500 to-cyan-600',
    glow: 'rgba(6,182,212,0.10)',
  },
]

/* ─── Urgent strip items ─── */
const alerts = [
  { label: '承認', text: '経費申請の承認期限が超過', href: '/applications' },
  { label: '稟議', text: 'RNG-2026-001 の確認待ち', href: '/ringi' },
  { label: '文書', text: 'NDA契約の期限が今月末', href: '/documents' },
]

/* ─── Components ─── */
function Tile({ tile }: { tile: AppTile }) {
  const Icon = tile.icon
  return (
    <Link href={tile.href}>
      <div
        className="tile-glow group rounded-[18px] bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
        style={{ ['--tile-glow' as string]: tile.glow }}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${tile.accent} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="w-[18px] h-[18px] text-white" />
          </div>
          {tile.badge && (
            <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 ${
              tile.urgent
                ? 'bg-[#FF5D5D]/15 text-[#FF5D5D]'
                : 'bg-[#7C8CFF]/15 text-[#7C8CFF]'
            }`}>
              {tile.badge}
            </span>
          )}
        </div>

        {/* Text */}
        <h3 className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">
          {tile.name}
        </h3>
        <p className="text-[12px] text-[#5A6070] mt-0.5 group-hover:text-[#7B8392] transition-colors">
          {tile.sub}
        </p>
      </div>
    </Link>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3 px-0.5">
        <h2 className="text-[10px] font-semibold text-[#4B5263] uppercase tracking-[0.12em]">{label}</h2>
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>
      {children}
    </section>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'おはようございます' : 'お疲れ様です'
  const dateStr = now.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[12px] text-[#4B5263] font-medium mb-1">{dateStr}</p>
        <h1 className="text-[24px] font-semibold text-white tracking-tight">
          {greeting}、田中さん
        </h1>
      </div>

      {/* Alert strip */}
      {alerts.length > 0 && (
        <div className="mb-8 rounded-[14px] bg-white/[0.03] border border-[#FF5D5D]/10 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#F5A524]" />
            <span className="text-[12px] font-medium text-[#A8B0BD]">対応が必要</span>
            <span className="text-[10px] font-semibold text-[#FF5D5D] bg-[#FF5D5D]/10 px-1.5 py-0.5 rounded-full">{alerts.length}</span>
          </div>
          {alerts.map((a, i) => (
            <Link key={i} href={a.href}>
              <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group border-b border-white/[0.03] last:border-0">
                <span className="text-[10px] font-medium text-[#5A6070] bg-white/[0.05] px-2 py-0.5 rounded-[4px] shrink-0">{a.label}</span>
                <span className="text-[12px] text-[#7B8392] group-hover:text-[#A8B0BD] flex-1 transition-colors">{a.text}</span>
                <ArrowRight className="w-3 h-3 text-[#3B3F4A] group-hover:text-[#5A6070] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* App tiles */}
      <div className="space-y-8">
        <Section label="業務">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {workTiles.map((t) => <Tile key={t.href} tile={t} />)}
          </div>
        </Section>

        <Section label="部門">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {deptTiles.map((t) => <Tile key={t.href} tile={t} />)}
          </div>
        </Section>

        <Section label="経営・ナレッジ">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {mgmtTiles.map((t) => <Tile key={t.href} tile={t} />)}
          </div>
        </Section>
      </div>

      {/* Quick stats row */}
      <div className="mt-10 grid grid-cols-4 gap-3">
        {[
          { label: '本日のタスク', value: '5', color: 'text-blue-400' },
          { label: '承認待ち', value: '3', color: 'text-[#F5A524]' },
          { label: '今月経費', value: '¥284K', color: 'text-[#2FBF71]' },
          { label: '未読通知', value: '8', color: 'text-[#FF5D5D]' },
        ].map((s) => (
          <div key={s.label} className="rounded-[12px] bg-white/[0.03] border border-white/[0.04] px-4 py-3 text-center">
            <p className="text-[10px] text-[#4B5263] font-medium">{s.label}</p>
            <p className={`text-[18px] font-bold ${s.color} mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
