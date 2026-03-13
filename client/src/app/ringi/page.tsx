'use client'

import Link from 'next/link'
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

export default function RingiPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#D4993D14' }}
        >
          <Stamp className="w-6 h-6" style={{ color: '#D4993D' }} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">稟議</h1>
          <p className="text-[14px] text-[#4E4E56]">決裁プロセス管理</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          今日の処理
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">承認待ち</p>
                <p className="text-[13px] text-[#3A3A42]">未決裁の稟議を確認</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">1</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <RotateCcw className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">差戻し対応</p>
                <p className="text-[13px] text-[#3A3A42]">修正が必要な稟議</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">1</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Plus className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">新規起票</p>
                <p className="text-[13px] text-[#3A3A42]">稟議書を作成する</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <CheckCircle2 className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">決裁済確認</p>
                <p className="text-[13px] text-[#3A3A42]">決裁完了の稟議を確認</p>
              </div>
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
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Search className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">稟議一覧</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <GitBranch className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">承認ルート設定</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">テンプレート</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 最近の稟議 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          最近の稟議
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">社内研修プログラム導入</p>
                <p className="text-[13px] text-[#3A3A42]">¥800,000</p>
              </div>
              <span className="text-[13px]" style={{ color: '#3CB06C' }}>決裁済</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">オフィス移転費用</p>
                <p className="text-[13px] text-[#3A3A42]">¥5,200,000</p>
              </div>
              <span className="text-[13px]" style={{ color: '#D4993D' }}>承認待ち</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/ringi">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Stamp className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">マーケティングツール導入</p>
                <p className="text-[13px] text-[#3A3A42]">¥360,000</p>
              </div>
              <span className="text-[13px]" style={{ color: '#E55A5A' }}>差戻し</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
