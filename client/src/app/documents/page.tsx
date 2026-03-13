'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function DocumentsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* ── Header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#0f172a] tracking-tight">契約</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">契約書・規程・法定文書</p>
      </motion.div>

      {/* ── 今日の処理 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">
          今日の処理
        </p>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04]">
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileCheck className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">契約確認</p>
                <p className="text-[12px] text-[#94a3b8]">契約書の確認・締結処理</p>
              </div>
              <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">2</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Shield className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">NDA管理</p>
                <p className="text-[12px] text-[#94a3b8]">秘密保持契約の管理</p>
              </div>
              <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">規程管理</p>
                <p className="text-[12px] text-[#94a3b8]">社内規程の整備・改定</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">届出管理</p>
                <p className="text-[12px] text-[#94a3b8]">行政届出・法定書類</p>
              </div>
              <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
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
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">
          管理
        </p>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04]">
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">契約書一覧</span>
              <span className="text-[12px] text-[#94a3b8]">234件</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">更新期限管理</span>
              <span className="text-[12px] text-[#94a3b8]">3件</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">規程集</span>
              <span className="text-[12px] text-[#94a3b8]">v3.2</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 分析 ── */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">
          分析
        </p>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] divide-y divide-black/[0.04]">
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Calendar className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">契約期限カレンダー</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">文書分類統計</span>
              <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
