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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function AccountingPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="flex items-center gap-5 mb-14"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#ECFDF5]">
          <Calculator className="w-7 h-7 text-[#059669]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">経理</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">経費・請求・支払・資金管理</p>
        </div>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-12">
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">今日の処理</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                    <p className="text-[13px] text-[#94A3B8] mt-0.5 font-medium">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.16 }} className="mb-12">
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">管理</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <p className="flex-1 text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                  <span className="text-[14px] text-[#94A3B8] font-medium">{item.meta}</span>
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 分析 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">分析</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {analysis.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <p className="flex-1 text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                  <span className="text-[14px] text-[#94A3B8] font-medium">{item.meta}</span>
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
