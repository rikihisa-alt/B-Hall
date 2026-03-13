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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function GeneralAffairsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">総務</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">備品・設備・オフィス管理</p>
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
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Package className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">備品管理</p>
                <p className="text-[12px] text-[#94a3b8]">備品の在庫確認・登録</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">2</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Monitor className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">貸出管理</p>
                <p className="text-[12px] text-[#94a3b8]">端末・備品の貸出・返却</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">1</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <ShoppingCart className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">発注処理</p>
                <p className="text-[12px] text-[#94a3b8]">購買申請・発注の確認</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">4</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Wrench className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">修理・メンテ</p>
                <p className="text-[12px] text-[#94a3b8]">設備の修理・点検依頼</p>
              </div>
              <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">2</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
      >
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">
          管理
        </h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">備品台帳</span>
              <span className="text-[12px] text-[#94a3b8]">156件</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <ArrowLeftRight className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">貸出一覧</span>
              <span className="text-[12px] text-[#94a3b8]">23件</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <Settings className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">設備管理</span>
              <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
