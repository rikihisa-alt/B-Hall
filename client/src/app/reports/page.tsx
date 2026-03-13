'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  ClipboardList,
  FileText,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  Inbox,
} from 'lucide-react'

export default function ReportsPage() {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">報告・改善</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">報告</h1>
        <p className="text-[13px] text-text-secondary mt-1">日報・インシデント・週報</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">日報作成</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">週報確認</span>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>2</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <AlertTriangle className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">インシデント</span>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>1</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <ShieldAlert className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">事故報告</p>
                <p className="text-[12px] text-text-secondary">事故・災害の記録</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">日報一覧</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">週報・月報</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Inbox className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">インシデント履歴</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
