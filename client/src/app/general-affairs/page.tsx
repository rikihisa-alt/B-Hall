'use client'

import Link from 'next/link'
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

export default function GeneralAffairsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#4A9FE814' }}
        >
          <Building2 className="w-6 h-6" style={{ color: '#4A9FE8' }} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">総務</h1>
          <p className="text-[14px] text-[#4E4E56]">備品・設備・オフィス管理</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          今日の処理
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Package className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">備品管理</p>
                <p className="text-[13px] text-[#3A3A42]">備品の在庫確認・登録</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">2</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Monitor className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">貸出管理</p>
                <p className="text-[13px] text-[#3A3A42]">端末・備品の貸出・返却</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">1</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <ShoppingCart className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">発注処理</p>
                <p className="text-[13px] text-[#3A3A42]">購買申請・発注の確認</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">4</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Wrench className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">修理・メンテ</p>
                <p className="text-[13px] text-[#3A3A42]">設備の修理・点検依頼</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">2</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 管理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          管理
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">備品台帳</span>
              <span className="text-[13px] text-[#3A3A42]">156件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <ArrowLeftRight className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">貸出一覧</span>
              <span className="text-[13px] text-[#3A3A42]">23件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/general-affairs">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Settings className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">設備管理</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
