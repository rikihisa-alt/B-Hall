'use client'

import Link from 'next/link'
import {
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronRight,
} from 'lucide-react'

const today = [
  { name: '経費精算',   desc: '未処理の経費申請を確認',  icon: Receipt,       count: 4, href: '/accounting' },
  { name: '請求管理',   desc: '請求書の発行・送付',      icon: CreditCard,    count: 2, href: '/accounting' },
  { name: '支払処理',   desc: '支払依頼の承認・実行',    icon: Banknote,      count: 3, href: '/accounting' },
  { name: '入金確認',   desc: '入金の消込・確認',        icon: ArrowDownLeft,  count: 1, href: '/accounting' },
]

const manage = [
  { name: '口座残高',         meta: '¥28.4M',          icon: Wallet,     href: '/accounting' },
  { name: 'キャッシュフロー',  meta: '月別入出金推移',   icon: TrendingUp, href: '/accounting' },
  { name: '取引一覧',         meta: '全取引の検索・管理', icon: BarChart3,  href: '/accounting' },
]

const analysis = [
  { name: '月次レポート', meta: '3月度 確認待ち',  icon: PieChart,  href: '/accounting' },
  { name: '収支分析',     meta: '費目別・部門別',   icon: BarChart3, href: '/accounting' },
]

export default function AccountingPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3CB06C14' }}>
          <Calculator className="w-6 h-6 text-[#3CB06C]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF] tracking-tight">経理</h1>
          <p className="text-[14px] text-[#4E4E56]">経費・請求・支払・資金管理</p>
        </div>
      </div>

      {/* 今日の処理 */}
      <section className="mb-10">
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">今日の処理</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                    <p className="text-[12px] text-[#3A3A42] mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-[#E55A5A] tabular-nums">{item.count}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 管理 */}
      <section className="mb-10">
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">管理</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <p className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[13px] text-[#3A3A42]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 分析 */}
      <section>
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">分析</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {analysis.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <p className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[13px] text-[#3A3A42]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
