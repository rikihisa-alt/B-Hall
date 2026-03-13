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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function DocumentsPage() {
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
          style={{ backgroundColor: '#FEF2F2' }}
        >
          <FolderOpen className="w-6 h-6" style={{ color: '#DC2626' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">契約</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">契約書・規程・法定文書</p>
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
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileCheck className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">契約確認</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">契約書の確認・締結処理</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">2</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Shield className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">NDA管理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">秘密保持契約の管理</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BookOpen className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">規程管理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">社内規程の整備・改定</p>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">届出管理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">行政届出・法定書類</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
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
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <ClipboardList className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">契約書一覧</span>
              <span className="text-[14px] text-[#94A3B8] font-medium">234件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Clock className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">更新期限管理</span>
              <span className="text-[14px] text-[#94A3B8] font-medium">3件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BookOpen className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">規程集</span>
              <span className="text-[14px] text-[#94A3B8] font-medium">v3.2</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ── 分析 ── */}
      <motion.section
        className="mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.24 }}
      >
        <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">
          分析
        </p>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-[#F1F5F9]">
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Calendar className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">契約期限カレンダー</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <BarChart3 className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">文書分類統計</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
