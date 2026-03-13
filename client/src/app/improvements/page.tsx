'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Lightbulb,
  EyeOff,
  Clock,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function ImprovementsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* ── Header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">改善</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">提案・目安箱・フィードバック</p>
      </motion.div>

      {/* ── 今日の処理 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">今日の処理</p>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] divide-y divide-white/[0.06]">
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">新規提案</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <EyeOff className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">匿名投稿</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">対応中の提案</span>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">3</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <CheckCircle2 className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight block">実施済確認</span>
                <span className="text-[12px] text-[#94a3b8]">効果を振り返る</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 最近の提案 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">最近の提案</p>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] divide-y divide-white/[0.06]">
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">リモートワーク申請フローの簡素化</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{ color: '#fbbf24', backgroundColor: '#fbbf2410' }}
              >検討中</span>
              <span className="flex items-center gap-1 text-[12px] text-[#94a3b8]">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />8票
              </span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">社内勉強会の月次開催</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{ color: '#34d399', backgroundColor: '#34d39910' }}
              >実施決定</span>
              <span className="flex items-center gap-1 text-[12px] text-[#94a3b8]">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />15票
              </span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">経費精算のモバイル対応</span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{ color: '#38bdf8', backgroundColor: '#38bdf810' }}
              >対応中</span>
              <span className="flex items-center gap-1 text-[12px] text-[#94a3b8]">
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />12票
              </span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
