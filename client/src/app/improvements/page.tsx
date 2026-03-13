'use client'

import Link from 'next/link'
import {
  MessageSquare,
  Lightbulb,
  EyeOff,
  Clock,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react'

export default function ImprovementsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#D46BA314' }}
        >
          <MessageSquare className="w-6 h-6 text-[#D46BA3]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">改善</h1>
          <p className="text-[13px] text-[#8E8E96]">提案・目安箱・フィードバック</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">今日の処理</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">新規提案</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <EyeOff className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">匿名投稿</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">対応中の提案</span>
              <span className="text-[13px] text-[#E55A5A]">3</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <CheckCircle2 className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] text-[#ECECEF] group-hover:text-white block">実施済確認</span>
                <span className="text-[13px] text-[#3A3A42]">効果を振り返る</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 最近の提案 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">最近の提案</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">リモートワーク申請フローの簡素化</span>
              <span className="text-[13px]" style={{ color: '#D4993D' }}>検討中</span>
              <span className="flex items-center gap-1 text-[13px] text-[#3A3A42]">
                <ThumbsUp className="w-3 h-3" />8票
              </span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">社内勉強会の月次開催</span>
              <span className="text-[13px]" style={{ color: '#3CB06C' }}>実施決定</span>
              <span className="flex items-center gap-1 text-[13px] text-[#3A3A42]">
                <ThumbsUp className="w-3 h-3" />15票
              </span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Lightbulb className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">経費精算のモバイル対応</span>
              <span className="text-[13px]" style={{ color: '#4A9FE8' }}>対応中</span>
              <span className="flex items-center gap-1 text-[13px] text-[#3A3A42]">
                <ThumbsUp className="w-3 h-3" />12票
              </span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
