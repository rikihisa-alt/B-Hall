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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function ImprovementsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">

      {/* ── Header ── */}
      <motion.div
        className="flex items-center gap-5 mb-14"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#FDF2F8' }}
        >
          <MessageSquare className="w-6 h-6" style={{ color: '#DB2777' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">改善</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">提案・目安箱・フィードバック</p>
        </div>
      </motion.div>

      {/* ── 今日の処理 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">今日の処理</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Lightbulb className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">新規提案</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <EyeOff className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">匿名投稿</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Clock className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">対応中の提案</span>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">3</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <CheckCircle2 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <div className="flex-1 min-w-0">
                <span className="text-[15px] font-semibold text-[#1E293B] block">実施済確認</span>
                <span className="text-[13px] text-[#94A3B8] font-medium">効果を振り返る</span>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 最近の提案 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">最近の提案</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Lightbulb className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">リモートワーク申請フローの簡素化</span>
              <span
                className="text-[13px] font-medium rounded-full px-2.5 py-0.5"
                style={{ color: '#D97706', backgroundColor: '#D9770610' }}
              >検討中</span>
              <span className="flex items-center gap-1 text-[13px] text-[#94A3B8] font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />8票
              </span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Lightbulb className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">社内勉強会の月次開催</span>
              <span
                className="text-[13px] font-medium rounded-full px-2.5 py-0.5"
                style={{ color: '#059669', backgroundColor: '#05966910' }}
              >実施決定</span>
              <span className="flex items-center gap-1 text-[13px] text-[#94A3B8] font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />15票
              </span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Lightbulb className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">経費精算のモバイル対応</span>
              <span
                className="text-[13px] font-medium rounded-full px-2.5 py-0.5"
                style={{ color: '#0284C7', backgroundColor: '#0284C710' }}
              >対応中</span>
              <span className="flex items-center gap-1 text-[13px] text-[#94A3B8] font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />12票
              </span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
