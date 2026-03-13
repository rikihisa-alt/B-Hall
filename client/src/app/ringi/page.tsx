'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Stamp,
  Clock,
  Plus,
  RotateCcw,
  CheckCircle2,
  Search,
  GitBranch,
  FileText,
  ChevronRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function RingiPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">稟議</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">決裁プロセス管理</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          今日の処理
        </h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">承認待ち</p>
                <p className="text-[12px] text-[#94a3b8]">未決裁の稟議を確認</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <RotateCcw className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">差戻し対応</p>
                <p className="text-[12px] text-[#94a3b8]">修正が必要な稟議</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Plus className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">新規起票</p>
                <p className="text-[12px] text-[#94a3b8]">稟議書を作成する</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <CheckCircle2 className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">決裁済確認</p>
                <p className="text-[12px] text-[#94a3b8]">決裁完了の稟議を確認</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          管理
        </h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Search className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">稟議一覧</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <GitBranch className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">承認ルート設定</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">テンプレート</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* 最近の稟議 */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          最近の稟議
        </h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">社内研修プログラム導入</p>
                <p className="text-[12px] text-[#94a3b8]">¥800,000</p>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: '#34d399' }}>決裁済</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">オフィス移転費用</p>
                <p className="text-[12px] text-[#94a3b8]">¥5,200,000</p>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: '#fbbf24' }}>承認待ち</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">マーケティングツール導入</p>
                <p className="text-[12px] text-[#94a3b8]">¥360,000</p>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: '#fb7185' }}>差戻し</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
