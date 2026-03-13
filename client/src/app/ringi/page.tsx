'use client'

import Link from 'next/link'
import {
  Stamp,
  Clock,
  Plus,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Search,
  GitBranch,
  FileText,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 稟議
   3セクション構成:
     今日の処理 → 承認待ち・新規起票・差戻し対応・決裁済確認
     管理       → 稟議一覧・承認ルート設定・テンプレート
     最近の稟議 → 直近3件のステータス付きリスト
───────────────────────────────── */

const todayActions = [
  {
    name: '承認待ち',
    sub: '未決裁の稟議を確認',
    icon: Clock,
    gradient: 'from-amber-500 to-amber-600',
    badge: 1,
    href: '/ringi',
  },
  {
    name: '新規起票',
    sub: '稟議書を作成する',
    icon: Plus,
    gradient: 'from-indigo-500 to-indigo-600',
    badge: 0,
    href: '/ringi',
  },
  {
    name: '差戻し対応',
    sub: '修正が必要な稟議',
    icon: RotateCcw,
    gradient: 'from-rose-500 to-rose-600',
    badge: 1,
    href: '/ringi',
  },
  {
    name: '決裁済確認',
    sub: '決裁完了の稟議を確認',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 0,
    href: '/ringi',
  },
]

const management = [
  { name: '稟議一覧', sub: '全件検索', icon: Search, href: '/ringi' },
  { name: '承認ルート設定', sub: '決裁フロー管理', icon: GitBranch, href: '/ringi' },
  { name: 'テンプレート', sub: '稟議書ひな形', icon: FileText, href: '/ringi' },
]

const recentRingis = [
  {
    title: '社内研修プログラム導入',
    amount: '¥800,000',
    status: '決裁済',
    statusColor: 'text-[#2FBF71] bg-[#2FBF71]/10',
  },
  {
    title: 'オフィス移転費用',
    amount: '¥5,200,000',
    status: '承認待ち',
    statusColor: 'text-[#F5A524] bg-[#F5A524]/10',
  },
  {
    title: 'マーケティングツール導入',
    amount: '¥360,000',
    status: '差戻し',
    statusColor: 'text-[#FF5D5D] bg-[#FF5D5D]/10',
  },
]

const alerts = [
  { text: 'オフィス移転費用 ¥5,200,000 — 承認待ち', type: 'warning' as const },
  { text: 'マーケティングツール導入 — 差戻し・修正が必要', type: 'danger' as const },
]

function getAlertStyle(type: 'danger' | 'warning' | 'info') {
  switch (type) {
    case 'danger': return 'bg-[#FF5D5D]/8 text-[#FF5D5D] border-[#FF5D5D]/15'
    case 'warning': return 'bg-[#F5A524]/8 text-[#F5A524] border-[#F5A524]/15'
    case 'info': return 'bg-[#60A5FA]/8 text-[#60A5FA] border-[#60A5FA]/15'
  }
}

export default function RingiPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Stamp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">稟議</h1>
          <p className="text-[13px] text-[#5A6070]">決裁プロセス管理</p>
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

      {/* ── 最近の稟議 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          最近の稟議
        </p>
        <div className="space-y-1">
          {recentRingis.map((ringi) => (
            <Link key={ringi.title} href="/ringi">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <Stamp className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">{ringi.title}</p>
                </div>
                <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors mr-2">{ringi.amount}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${ringi.statusColor}`}>
                  {ringi.status}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
