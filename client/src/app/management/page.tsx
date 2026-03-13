'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart3,
  FileText,
  PieChart,
  Target,
  ChevronRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function ManagementPage() {
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
          style={{ backgroundColor: '#F0F9FF' }}
        >
          <BarChart3 className="w-6 h-6" style={{ color: '#0369A1' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">経営</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">分析・投資判断・経営可視化</p>
        </div>
      </motion.div>

      {/* ── Metrics Row ── */}
      <motion.div
        className="flex gap-8 mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <div>
          <p className="text-[13px] text-[#94A3B8] font-medium">月間売上</p>
          <p className="text-[24px] font-bold text-[#1E293B]">&yen;8.4M</p>
          <p className="text-[13px] font-medium text-[#059669]">+12.3%</p>
        </div>
        <div>
          <p className="text-[13px] text-[#94A3B8] font-medium">営業利益</p>
          <p className="text-[24px] font-bold text-[#1E293B]">&yen;1.53M</p>
          <p className="text-[13px] font-medium text-[#059669]">18.2%</p>
        </div>
        <div>
          <p className="text-[13px] text-[#94A3B8] font-medium">従業員</p>
          <p className="text-[24px] font-bold text-[#1E293B]">48名</p>
        </div>
        <div>
          <p className="text-[13px] text-[#94A3B8] font-medium">リスク</p>
          <p className="text-[24px] font-bold text-[#1E293B]">3件</p>
          <p className="text-[13px] font-medium text-[#E11D48]">要対応</p>
        </div>
      </motion.div>

      {/* ── 分析 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">分析</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/management">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">月次レポート</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <PieChart className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">収支分析</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BarChart3 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">部門別分析</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Target className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">投資判断支援</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 注意 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">注意</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <div className="px-6 py-5">
            <span className="text-[15px] font-semibold text-[#1E293B]">高額稟議 1件が未決裁</span>
          </div>
          <div className="px-6 py-5">
            <span className="text-[15px] font-semibold text-[#1E293B]">離職率 2.1%</span>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
