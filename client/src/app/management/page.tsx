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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function ManagementPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* ── Header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#0f172a] tracking-tight">経営</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">分析・投資判断・経営可視化</p>
      </motion.div>

      {/* ── Metrics Row ── */}
      <motion.div
        className="flex gap-8 mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <div>
          <p className="text-[12px] text-[#94a3b8]">月間売上</p>
          <p className="text-[22px] font-semibold text-[#0f172a] tracking-tight">&yen;8.4M</p>
          <p className="text-[12px] font-semibold text-[#059669]">+12.3%</p>
        </div>
        <div>
          <p className="text-[12px] text-[#94a3b8]">営業利益</p>
          <p className="text-[22px] font-semibold text-[#0f172a] tracking-tight">&yen;1.53M</p>
          <p className="text-[12px] font-semibold text-[#059669]">18.2%</p>
        </div>
        <div>
          <p className="text-[12px] text-[#94a3b8]">従業員</p>
          <p className="text-[22px] font-semibold text-[#0f172a] tracking-tight">48名</p>
        </div>
        <div>
          <p className="text-[12px] text-[#94a3b8]">リスク</p>
          <p className="text-[22px] font-semibold text-[#0f172a] tracking-tight">3件</p>
          <p className="text-[12px] font-semibold text-[#e11d48]">要対応</p>
        </div>
      </motion.div>

      {/* ── 分析 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">分析</p>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04]">
          <Link href="/management">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">月次レポート</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <PieChart className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">収支分析</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">部門別分析</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Target className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">投資判断支援</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 注意 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">注意</p>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04]">
          <div className="px-5 py-4">
            <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">高額稟議 1件が未決裁</span>
          </div>
          <div className="px-5 py-4">
            <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">離職率 2.1%</span>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
