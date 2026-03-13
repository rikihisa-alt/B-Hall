'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Users,
  Building2,
  FolderOpen,
  FileText,
  Stamp,
  ClipboardList,
  BookOpen,
  BarChart3,
  MessageSquare,
  Bot,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'

/* ── Panel sections — NOT a uniform grid ── */

const primary = [
  { name: '経理',  desc: '経費・請求・支払',       href: '/accounting',     icon: Calculator,   count: 4 },
  { name: '人事',  desc: '従業員・社保・手続き',    href: '/hr',             icon: Users,        count: 3 },
  { name: '申請',  desc: 'ワークフロー・承認',      href: '/applications',   icon: FileText,     count: 5 },
]

const operations = [
  { name: '総務',          desc: '備品・設備・オフィス',    href: '/general-affairs', icon: Building2,     count: 2 },
  { name: '契約',          desc: '契約書・規程・文書',     href: '/documents',       icon: FolderOpen,    count: 1 },
  { name: '稟議',          desc: '決裁プロセス',           href: '/ringi',           icon: Stamp,         count: 1 },
  { name: '報告',          desc: '日報・インシデント',     href: '/reports',         icon: ClipboardList          },
]

const insight = [
  { name: '経営',          desc: '分析・投資判断',         href: '/management',      icon: BarChart3              },
  { name: '改善',          desc: '提案・フィードバック',   href: '/improvements',    icon: MessageSquare          },
  { name: 'ドキュメント',  desc: 'テンプレート・手順書',   href: '/knowledge',       icon: BookOpen               },
  { name: 'ジジロボ',      desc: 'AIアシスタント',         href: '/assistant',       icon: Bot                    },
]

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

type PanelItem = {
  name: string
  desc: string
  href: string
  icon: typeof Calculator
  count?: number
}

function PanelRow({ item }: { item: PanelItem }) {
  const Icon = item.icon
  return (
    <Link href={item.href}>
      <div className="group flex items-center gap-4 px-5 py-4 hover:bg-white/50 transition-all duration-150 cursor-pointer hover:-translate-y-px">
        <Icon className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors shrink-0" strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{item.name}</p>
          <p className="text-[12px] text-[#94a3b8] mt-px">{item.desc}</p>
        </div>
        {item.count && item.count > 0 && (
          <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">{item.count}</span>
        )}
        <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" />
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-10"
      >
        <h1 className="text-[24px] font-semibold text-[#0f172a] tracking-tight">
          ワークスペース
        </h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">
          業務セクションを選んでください
        </p>
      </motion.div>

      {/* Primary — 主要業務 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.04 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">主要業務</h2>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04] overflow-hidden">
          {primary.map(item => <PanelRow key={item.href} item={item} />)}
        </div>
      </motion.section>

      {/* Operations — 管理業務 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">管理業務</h2>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04] overflow-hidden">
          {operations.map(item => <PanelRow key={item.href} item={item} />)}
        </div>
      </motion.section>

      {/* Insight — 分析・ナレッジ */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.12 }}>
        <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">分析・ナレッジ</h2>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04] overflow-hidden">
          {insight.map(item => <PanelRow key={item.href} item={item} />)}
        </div>
      </motion.section>
    </div>
  )
}
