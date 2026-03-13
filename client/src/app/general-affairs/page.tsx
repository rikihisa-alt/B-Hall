'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Building2,
  Package,
  Monitor,
  ShoppingCart,
  Wrench,
  ClipboardList,
  ArrowLeftRight,
  Settings,
  ChevronRight,
} from 'lucide-react'

export default function GeneralAffairsPage() {
  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">総務・庶務</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">総務・庶務</h1>
        <p className="text-[13px] text-text-secondary mt-1">備品・設備・オフィス管理</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Package className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">備品管理</p>
                <p className="text-[12px] text-text-secondary">備品の在庫確認・登録</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>2</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Monitor className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">貸出管理</p>
                <p className="text-[12px] text-text-secondary">端末・備品の貸出・返却</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>1</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <ShoppingCart className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">発注処理</p>
                <p className="text-[12px] text-text-secondary">購買申請・発注の確認</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>4</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Wrench className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">修理・メンテ</p>
                <p className="text-[12px] text-text-secondary">設備の修理・点検依頼</p>
              </div>
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>2</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">備品台帳</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>156件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <ArrowLeftRight className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">貸出一覧</span>
              <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>23件</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
              <Settings className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">設備管理</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
