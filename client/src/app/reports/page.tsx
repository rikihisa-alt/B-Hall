'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function ReportsPage() {
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
          style={{ backgroundColor: '#FFF7ED' }}
        >
          <ClipboardList className="w-6 h-6" style={{ color: '#EA580C' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">報告</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">日報・インシデント・週報</p>
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
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">
          今日の処理
        </p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">日報作成</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BarChart3 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">週報確認</span>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">2</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <AlertTriangle className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">インシデント</span>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <ShieldAlert className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">事故報告</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">事故・災害の記録</p>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 管理 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">
          管理
        </p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">日報一覧</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BookOpen className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">週報・月報</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Inbox className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">インシデント履歴</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
