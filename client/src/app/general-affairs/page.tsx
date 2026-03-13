'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2,
  Package,
  Monitor,
  ShoppingCart,
  Wrench,
  ClipboardList,
  ArrowLeftRight,
  Settings,
  ChevronRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function GeneralAffairsPage() {
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
          <Building2 className="w-6 h-6" style={{ color: '#0284C7' }} />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">総務</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">備品・設備・オフィス管理</p>
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
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Package className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">備品管理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">備品の在庫確認・登録</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">2</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Monitor className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">貸出管理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">端末・備品の貸出・返却</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">1</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <ShoppingCart className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">発注処理</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">購買申請・発注の確認</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">4</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Wrench className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1E293B]">修理・メンテ</p>
                <p className="text-[13px] text-[#94A3B8] font-medium">設備の修理・点検依頼</p>
              </div>
              <span className="min-w-[24px] h-6 rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 flex items-center justify-center">2</span>
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
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <ClipboardList className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">備品台帳</span>
              <span className="text-[14px] text-[#94A3B8] font-medium">156件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <ArrowLeftRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">貸出一覧</span>
              <span className="text-[14px] text-[#94A3B8] font-medium">23件</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <Settings className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
              <span className="flex-1 text-[15px] font-semibold text-[#1E293B]">設備管理</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
