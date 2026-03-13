'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  FileText,
  HelpCircle,
  Shield,
  FolderOpen,
  Clock,
  ChevronRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function KnowledgePage() {
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
          style={{ backgroundColor: '#FEFCE8' }}
        >
          <BookOpen className="w-6 h-6" style={{ color: '#CA8A04' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">ドキュメント</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">テンプレート・手順書・FAQ</p>
        </div>
      </motion.div>

      {/* ── カテゴリ ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">カテゴリ</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BookOpen className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">業務マニュアル</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">24件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">テンプレート</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">34件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <HelpCircle className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">FAQ</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">45件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Shield className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">規程・ガイド</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">25件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
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
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">管理</p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FolderOpen className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">ナレッジ一覧</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">128記事</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">テンプレート管理</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">34件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Clock className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">最近追加</span>
              <span className="text-[13px] text-[#94A3B8] font-medium">6件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8]" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
