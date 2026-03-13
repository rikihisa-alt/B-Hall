'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronRight,
} from 'lucide-react'

const today = [
  { name: '経費精算',   desc: '未処理の経費申請を確認',  icon: Receipt,       count: 4, href: '/accounting' },
  { name: '請求管理',   desc: '請求書の発行・送付',      icon: CreditCard,    count: 2, href: '/accounting' },
  { name: '支払処理',   desc: '支払依頼の承認・実行',    icon: Banknote,      count: 3, href: '/accounting' },
  { name: '入金確認',   desc: '入金の消込・確認',        icon: ArrowDownLeft,  count: 1, href: '/accounting' },
]

const manage = [
  { name: '口座残高',         meta: '¥28.4M',          icon: Wallet,     href: '/accounting' },
  { name: 'キャッシュフロー',  meta: '月別入出金推移',   icon: TrendingUp, href: '/accounting' },
  { name: '取引一覧',         meta: '全取引の検索・管理', icon: BarChart3,  href: '/accounting' },
]

const analysis = [
  { name: '月次レポート', meta: '3月度 確認待ち',  icon: PieChart,  href: '/accounting' },
  { name: '収支分析',     meta: '費目別・部門別',   icon: BarChart3, href: '/accounting' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function AccountingPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">経理</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">経費・請求・支払・資金管理</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">今日の処理</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.16 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">管理</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-[#94a3b8]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 分析 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">分析</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {analysis.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-[#94a3b8]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
