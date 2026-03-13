'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  FolderOpen,
  FileCheck,
  Shield,
  BookOpen,
  FileText,
  ClipboardList,
  Clock,
  Calendar,
  BarChart3,
  ChevronRight,
} from 'lucide-react'

export default function DocumentsPage() {
  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">文書管理</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">文書管理</h1>
        <p className="text-[13px] text-text-secondary mt-1">契約書・規程・法定文書</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <FileCheck className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">契約確認</p>
                <p className="text-[12px] text-text-secondary">契約書の確認・締結処理</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>2</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Shield className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">NDA管理</p>
                <p className="text-[12px] text-text-secondary">秘密保持契約の管理</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>1</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">規程管理</p>
                <p className="text-[12px] text-text-secondary">社内規程の整備・改定</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">届出管理</p>
                <p className="text-[12px] text-text-secondary">行政届出・法定書類</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>1</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">契約書一覧</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>234件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">更新期限管理</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>3件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">規程集</span>
              <span className="text-[12px] text-text-secondary">v3.2</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* 分析 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">分析</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Calendar className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">契約期限カレンダー</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">文書分類統計</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
