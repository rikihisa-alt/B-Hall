'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  BookOpen,
  FileText,
  HelpCircle,
  Shield,
  FolderOpen,
  Clock,
  ChevronRight,
} from 'lucide-react'

export default function KnowledgePage() {
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
        <span className="text-text-secondary font-medium">ナレッジ</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">ドキュメント</h1>
        <p className="text-[13px] text-text-secondary mt-1">テンプレート・手順書・FAQ</p>
      </motion.div>

      {/* カテゴリ */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">カテゴリ</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">業務マニュアル</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>24件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">テンプレート</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>34件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <HelpCircle className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">FAQ</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>45件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <Shield className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">規程・ガイド</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>25件</span>
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
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <FolderOpen className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">ナレッジ一覧</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>128記事</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">テンプレート管理</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>34件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">最近追加</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>6件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
