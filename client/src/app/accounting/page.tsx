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
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 経理
   3セクション構成:
     今日の処理 → 経費・請求・支払・入金
     管理       → 口座・キャッシュフロー・取引
     分析       → 月次・収支
───────────────────────────────── */

const todayActions = [
  {
    name: '経費精算',
    sub: '未処理の経費申請を確認',
    icon: Receipt,
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 4,
    href: '/accounting',
  },
  {
    name: '請求管理',
    sub: '請求書の発行・送付',
    icon: CreditCard,
    gradient: 'from-blue-500 to-blue-600',
    badge: 2,
    href: '/accounting',
  },
  {
    name: '支払処理',
    sub: '支払依頼の承認・実行',
    icon: Banknote,
    gradient: 'from-amber-500 to-amber-600',
    badge: 3,
    href: '/accounting',
  },
  {
    name: '入金確認',
    sub: '入金の消込・確認',
    icon: ArrowDownLeft,
    gradient: 'from-violet-500 to-violet-600',
    badge: 1,
    href: '/accounting',
  },
]

const management = [
  { name: '口座残高', sub: '¥28.4M', icon: Wallet, href: '/accounting' },
  { name: 'キャッシュフロー', sub: '月別入出金推移', icon: TrendingUp, href: '/accounting' },
  { name: '取引一覧', sub: '全取引の検索・管理', icon: BarChart3, href: '/accounting' },
]

const analysis = [
  { name: '月次レポート', sub: '3月度 確認待ち', icon: PieChart, href: '/accounting' },
  { name: '収支分析', sub: '費目別・部門別', icon: BarChart3, href: '/accounting' },
]

const alerts = [
  { text: 'C社 入金遅延（¥520,000 / 3日超過）', type: 'danger' as const },
  { text: '月次締め 3/15 期限', type: 'warning' as const },
  { text: '未消込取引 2件', type: 'info' as const },
]

function getAlertStyle(type: 'danger' | 'warning' | 'info') {
  switch (type) {
    case 'danger': return 'bg-[#FF5D5D]/8 text-[#FF5D5D] border-[#FF5D5D]/15'
    case 'warning': return 'bg-[#F5A524]/8 text-[#F5A524] border-[#F5A524]/15'
    case 'info': return 'bg-[#60A5FA]/8 text-[#60A5FA] border-[#60A5FA]/15'
  }
}

export default function AccountingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">経理</h1>
          <p className="text-[13px] text-[#5A6070]">経費・請求・支払・資金管理</p>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] ${getAlertStyle(alert.type)}`}>
            {alert.type === 'danger' ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{alert.text}</span>
          </div>
        ))}
      </div>

      {/* ── 今日の処理 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          今日の処理
        </p>
        <div className="grid grid-cols-2 gap-3">
          {todayActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.name} href={action.href}>
                <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {action.badge > 0 && (
                      <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#FF5D5D] text-white text-[10px] font-bold px-1 leading-none ring-2 ring-[#0F1115]">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-white/85 group-hover:text-white transition-colors">{action.name}</p>
                  <p className="text-[11px] text-[#4B5263] mt-0.5">{action.sub}</p>
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

      {/* ── 分析 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          分析
        </p>
        <div className="space-y-1">
          {analysis.map((item) => {
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
    </div>
  )
}
