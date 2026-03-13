'use client'

import Link from 'next/link'
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

export default function ReportsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#E0874414' }}
        >
          <ClipboardList className="w-6 h-6 text-[#E08744]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">報告</h1>
          <p className="text-[13px] text-[#8E8E96]">日報・インシデント・週報</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">今日の処理</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">日報作成</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">週報確認</span>
              <span className="text-[13px] text-[#E55A5A]">2</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <AlertTriangle className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">インシデント</span>
              <span className="text-[13px] text-[#E55A5A]">1</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <ShieldAlert className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] text-[#ECECEF] group-hover:text-white block">事故報告</span>
                <span className="text-[13px] text-[#3A3A42]">事故・災害の記録</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 管理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">管理</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">日報一覧</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">週報・月報</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/reports">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Inbox className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">インシデント履歴</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
