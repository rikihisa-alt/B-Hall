'use client'

import Link from 'next/link'
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

export default function DocumentsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#E55A5A14' }}
        >
          <FolderOpen className="w-6 h-6" style={{ color: '#E55A5A' }} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF]">契約</h1>
          <p className="text-[14px] text-[#4E4E56]">契約書・規程・法定文書</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          今日の処理
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileCheck className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">契約確認</p>
                <p className="text-[13px] text-[#3A3A42]">契約書の確認・締結処理</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">2</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Shield className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">NDA管理</p>
                <p className="text-[13px] text-[#3A3A42]">秘密保持契約の管理</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">1</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">規程管理</p>
                <p className="text-[13px] text-[#3A3A42]">社内規程の整備・改定</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">届出管理</p>
                <p className="text-[13px] text-[#3A3A42]">行政届出・法定書類</p>
              </div>
              <span className="text-[13px] text-[#E55A5A]">1</span>
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
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <ClipboardList className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">契約書一覧</span>
              <span className="text-[13px] text-[#3A3A42]">234件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Clock className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">更新期限管理</span>
              <span className="text-[13px] text-[#3A3A42]">3件</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BookOpen className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">規程集</span>
              <span className="text-[13px] text-[#3A3A42]">v3.2</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 分析 ── */}
      <section className="mb-10">
        <p className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3">
          分析
        </p>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <Calendar className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">契約期限カレンダー</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
          <Link href="/documents">
            <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <BarChart3 className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors" />
              <span className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">文書分類統計</span>
              <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
