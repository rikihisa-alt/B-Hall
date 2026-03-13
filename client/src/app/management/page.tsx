'use client'

import Link from 'next/link'
import {
  BarChart3,
  FileText,
  PieChart,
  Target,
  ChevronRight,
} from 'lucide-react'

export default function ManagementPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#4A8FE814' }}
        >
          <BarChart3 className="w-6 h-6 text-[#4A8FE8]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">経営</h1>
          <p className="text-[13px] text-[#8E8E96]">分析・投資判断・経営可視化</p>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="flex gap-8 mb-12">
        <div>
          <p className="text-[12px] text-[#3A3A42]">月間売上</p>
          <p className="text-[20px] font-bold text-[#ECECEF]">&yen;8.4M</p>
          <p className="text-[12px] text-[#3CB06C]">+12.3%</p>
        </div>
        <div>
          <p className="text-[12px] text-[#3A3A42]">営業利益</p>
          <p className="text-[20px] font-bold text-[#ECECEF]">&yen;1.53M</p>
          <p className="text-[12px] text-[#3CB06C]">18.2%</p>
        </div>
        <div>
          <p className="text-[12px] text-[#3A3A42]">従業員</p>
          <p className="text-[20px] font-bold text-[#ECECEF]">48名</p>
        </div>
        <div>
          <p className="text-[12px] text-[#3A3A42]">リスク</p>
          <p className="text-[20px] font-bold text-[#ECECEF]">3件</p>
          <p className="text-[12px] text-[#E55A5A]">要対応</p>
        </div>
      </div>

      {/* ── 分析 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">分析</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/management">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">月次レポート</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <PieChart className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">収支分析</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">部門別分析</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Target className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">投資判断支援</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 注意 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">注意</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <div className="px-4 py-3.5">
            <span className="text-[14px] text-[#ECECEF]">高額稟議 1件が未決裁</span>
          </div>
          <div className="px-4 py-3.5">
            <span className="text-[14px] text-[#ECECEF]">離職率 2.1%</span>
          </div>
        </div>
      </section>
    </div>
  )
}
