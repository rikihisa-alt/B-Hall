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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function ReportsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* ── Header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">報告</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">日報・インシデント・週報</p>
      </motion.div>

      {/* ── 今日の処理 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          今日の処理
        </p>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] divide-y divide-white/[0.06]">
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">日報作成</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">週報確認</span>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">2</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <AlertTriangle className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">インシデント</span>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <ShieldAlert className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">事故報告</p>
                <p className="text-[12px] text-[#94a3b8]">事故・災害の記録</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 管理 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          管理
        </p>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] divide-y divide-white/[0.06]">
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">日報一覧</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">週報・月報</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Inbox className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">インシデント履歴</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
