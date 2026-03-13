'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
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

export default function AccountingPage() {
  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">経理・財務</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">経理・財務</h1>
        <p className="text-[13px] text-text-secondary mt-1">経費・請求・支払・資金管理</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 分析 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">分析</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {analysis.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
