'use client'

import Link from 'next/link'
import {
  BookOpen,
  FileText,
  HelpCircle,
  Shield,
  FolderOpen,
  Clock,
  Eye,
  ArrowRight,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: ドキュメント
   セクション構成:
     カテゴリ → 業務マニュアル・テンプレート・FAQ・規程ガイド
     管理     → ナレッジ一覧・テンプレート管理・最近追加
     統計     → 今月の閲覧数
───────────────────────────────── */

const categories = [
  {
    name: '業務マニュアル',
    count: 24,
    icon: BookOpen,
    gradient: 'from-blue-500 to-blue-600',
    href: '/knowledge',
  },
  {
    name: 'テンプレート',
    count: 34,
    icon: FileText,
    gradient: 'from-emerald-500 to-emerald-600',
    href: '/knowledge',
  },
  {
    name: 'FAQ',
    count: 45,
    icon: HelpCircle,
    gradient: 'from-amber-500 to-amber-600',
    href: '/knowledge',
  },
  {
    name: '規程・ガイド',
    count: 25,
    icon: Shield,
    gradient: 'from-violet-500 to-violet-600',
    href: '/knowledge',
  },
]

const management = [
  { name: 'ナレッジ一覧', sub: '128記事', icon: FolderOpen, href: '/knowledge' },
  { name: 'テンプレート管理', sub: '34件', icon: FileText, href: '/knowledge' },
  { name: '最近追加', sub: '6件', icon: Clock, href: '/knowledge' },
]

export default function KnowledgePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">ドキュメント</h1>
          <p className="text-[13px] text-[#5A6070]">テンプレート・手順書・FAQ・社内知識</p>
        </div>
      </div>

      {/* ── カテゴリ ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          カテゴリ
        </p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.name} href={cat.href}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-white/85 group-hover:text-white transition-colors">{cat.name}</p>
                  <p className="text-[11px] text-[#4B5263] mt-0.5">{cat.count}件</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 管理 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          管理
        </p>
        <div className="space-y-1">
          {management.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">{item.name}</p>
                  </div>
                  <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">{item.sub}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 統計 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          統計
        </p>
        <div className="space-y-1">
          <Link href="/knowledge">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">今月の閲覧数</p>
              </div>
              <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">1.2K</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
