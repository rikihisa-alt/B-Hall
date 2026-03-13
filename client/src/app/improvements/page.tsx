'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  MessageSquare,
  Lightbulb,
  EyeOff,
  Clock,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react'

export default function ImprovementsPage() {
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
        <span className="text-text-secondary font-medium">改善提案</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">改善</h1>
        <p className="text-[13px] text-text-secondary mt-1">提案・目安箱・フィードバック</p>
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
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">新規提案</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <EyeOff className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">匿名投稿</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">対応中の提案</span>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>3</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <CheckCircle2 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-semibold text-text-primary tracking-tight block">実施済確認</span>
                <span className="text-[12px] text-text-secondary">効果を振り返る</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* 最近の提案 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">最近の提案</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">リモートワーク申請フローの簡素化</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium text-warning"
                style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
              >検討中</span>
              <span className="flex items-center gap-1 text-[12px] text-text-secondary">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span style={{ fontFamily: 'var(--font-inter)' }}>8票</span>
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">社内勉強会の月次開催</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium text-success"
                style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
              >実施決定</span>
              <span className="flex items-center gap-1 text-[12px] text-text-secondary">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span style={{ fontFamily: 'var(--font-inter)' }}>15票</span>
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">経費精算のモバイル対応</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium text-info"
                style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}
              >対応中</span>
              <span className="flex items-center gap-1 text-[12px] text-text-secondary">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span style={{ fontFamily: 'var(--font-inter)' }}>12票</span>
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
