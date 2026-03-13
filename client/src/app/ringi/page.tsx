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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function RingiPage() {
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
          style={{ backgroundColor: '#FFFBEB' }}
        >
          <Stamp className="w-6 h-6" style={{ color: '#D97706' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">稟議</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">決裁プロセス管理</p>
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
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Clock className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">承認待ち</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">未決裁の稟議を確認</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <RotateCcw className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">差戻し対応</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">修正が必要な稟議</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Plus className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">新規起票</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">稟議書を作成する</p>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <CheckCircle2 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">決裁済確認</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">決裁完了の稟議を確認</p>
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
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Search className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">稟議一覧</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <GitBranch className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">承認ルート設定</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">テンプレート</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 最近の稟議 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">
          最近の稟議
        </p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Stamp className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">社内研修プログラム導入</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">¥800,000</p>
              </div>
              <span className="text-[13px] font-medium" style={{ color: '#16A34A' }}>決裁済</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Stamp className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">オフィス移転費用</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">¥5,200,000</p>
              </div>
              <span className="text-[13px] font-medium" style={{ color: '#D97706' }}>承認待ち</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Stamp className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">マーケティングツール導入</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">¥360,000</p>
              </div>
              <span className="text-[13px] font-medium" style={{ color: '#E11D48' }}>差戻し</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
