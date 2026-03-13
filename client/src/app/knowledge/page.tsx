'use client'

import Link from 'next/link'
import {
  BookOpen,
  FileText,
  HelpCircle,
  Shield,
  FolderOpen,
  Clock,
  ChevronRight,
} from 'lucide-react'

export default function KnowledgePage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#C9A43E14' }}
        >
          <BookOpen className="w-6 h-6 text-[#C9A43E]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">ドキュメント</h1>
          <p className="text-[13px] text-[#8E8E96]">テンプレート・手順書・FAQ</p>
        </div>
      </div>

      {/* ── カテゴリ ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">カテゴリ</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">業務マニュアル</span>
              <span className="text-[13px] text-[#3A3A42]">24件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">テンプレート</span>
              <span className="text-[13px] text-[#3A3A42]">34件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <HelpCircle className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">FAQ</span>
              <span className="text-[13px] text-[#3A3A42]">45件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Shield className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">規程・ガイド</span>
              <span className="text-[13px] text-[#3A3A42]">25件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 管理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">管理</p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FolderOpen className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">ナレッジ一覧</span>
              <span className="text-[13px] text-[#3A3A42]">128記事</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">テンプレート管理</span>
              <span className="text-[13px] text-[#3A3A42]">34件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
          <Link href="/knowledge">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7]" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white">最近追加</span>
              <span className="text-[13px] text-[#3A3A42]">6件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56]" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
