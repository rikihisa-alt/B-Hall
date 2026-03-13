'use client'

import Link from 'next/link'
import {
  ClipboardList,
  FileText,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  Clock,
  BookOpen,
  Inbox,
  Users,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 日報・報告
   3セクション構成:
     今日の処理 → 日報作成・週報確認・インシデント・事故報告
     管理       → 日報一覧・週報/月報・インシデント履歴
     提出状況   → 今月の提出率・未提出者
───────────────────────────────── */

const todayActions = [
  {
    name: '日報作成',
    sub: '本日の日報を記入する',
    icon: FileText,
    gradient: 'from-orange-500 to-orange-600',
    badge: 0,
    href: '/reports',
  },
  {
    name: '週報確認',
    sub: '未確認の週報がある',
    icon: BarChart3,
    gradient: 'from-blue-500 to-blue-600',
    badge: 2,
    href: '/reports',
  },
  {
    name: 'インシデント',
    sub: '対応が必要な報告',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-red-600',
    badge: 1,
    href: '/reports',
  },
  {
    name: '事故報告',
    sub: '事故・災害の記録',
    icon: ShieldAlert,
    gradient: 'from-rose-500 to-rose-600',
    badge: 0,
    href: '/reports',
  },
]

const management = [
  { name: '日報一覧', sub: '全員の日報を閲覧', icon: FileText, href: '/reports' },
  { name: '週報・月報', sub: '定期報告管理', icon: BookOpen, href: '/reports' },
  { name: 'インシデント履歴', sub: '過去の報告・対応記録', icon: Inbox, href: '/reports' },
]

const alerts = [
  { text: 'サーバールーム空調異常 — インシデント対応中', type: 'danger' as const },
  { text: '未確認の週報が 2件 あります', type: 'warning' as const },
  { text: '今月の日報提出率が 80% を下回っています', type: 'info' as const },
]

function getAlertStyle(type: 'danger' | 'warning' | 'info') {
  switch (type) {
    case 'danger': return 'bg-[#FF5D5D]/8 text-[#FF5D5D] border-[#FF5D5D]/15'
    case 'warning': return 'bg-[#F5A524]/8 text-[#F5A524] border-[#F5A524]/15'
    case 'info': return 'bg-[#60A5FA]/8 text-[#60A5FA] border-[#60A5FA]/15'
  }
}

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">日報・報告</h1>
          <p className="text-[13px] text-[#5A6070]">報告・インシデント・改善活動</p>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] ${getAlertStyle(alert.type)}`}>
            {alert.type === 'danger' ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : alert.type === 'warning' ? (
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

      {/* ── 提出状況 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          提出状況
        </p>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          {/* 提出率 */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-1.5">
                <p className="text-[13px] font-medium text-[#A8B0BD]">今月の提出率</p>
                <p className="text-lg font-bold text-[#F5A524]">78%</p>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                <div className="w-[78%] h-full rounded-full bg-gradient-to-r from-[#F5A524] to-[#F5A524]/70" />
              </div>
            </div>
          </div>
          {/* 未提出者 */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#FF5D5D]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-[#A8B0BD]">未提出者</p>
              <p className="text-[11px] text-[#4B5263] mt-0.5">今月の日報未提出</p>
            </div>
            <span className="text-lg font-bold text-[#FF5D5D]">4名</span>
          </div>
        </div>
      </section>
    </div>
  )
}
