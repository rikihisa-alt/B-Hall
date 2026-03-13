'use client'

import Link from 'next/link'
import {
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  FileText,
  Shield,
  Heart,
  Calendar,
  ArrowRight,
  AlertCircle,
  Clock,
  ClipboardList,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 人事・労務
   3セクション構成:
     今日の処理 → 入退社・手続き・届出・勤怠
     管理       → 従業員・組織・契約
     制度       → 社保・年調・健診・規程
───────────────────────────────── */

const todayActions = [
  {
    name: '入退社手続き',
    sub: '佐藤太郎 入社（3/15期限）',
    icon: UserPlus,
    gradient: 'from-violet-500 to-violet-600',
    badge: 2,
    href: '/hr',
  },
  {
    name: '届出・申請',
    sub: '社保届出・雇保手続き',
    icon: FileText,
    gradient: 'from-blue-500 to-blue-600',
    badge: 3,
    href: '/hr',
  },
  {
    name: '勤怠確認',
    sub: '月次勤怠の確認・承認',
    icon: Calendar,
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 0,
    href: '/hr',
  },
  {
    name: '異動・評価',
    sub: '人事異動・昇格管理',
    icon: UserCheck,
    gradient: 'from-amber-500 to-amber-600',
    badge: 1,
    href: '/hr',
  },
]

const management = [
  { name: '従業員一覧', sub: '42名 在籍', icon: Users, href: '/hr' },
  { name: '組織図', sub: '部署・チーム構成', icon: ClipboardList, href: '/hr' },
  { name: '雇用契約', sub: '契約更新 1件期限近', icon: FileText, href: '/hr' },
]

const systems = [
  { name: '社会保険', sub: '加入・喪失管理', icon: Shield, href: '/hr' },
  { name: '年末調整', sub: '次回 12月', icon: Calendar, href: '/hr' },
  { name: '健康診断', sub: '4月実施 未受診5名', icon: Heart, href: '/hr' },
  { name: '就業規則', sub: 'v3.2 最新', icon: FileText, href: '/hr' },
]

const alerts = [
  { text: '佐藤太郎の入社手続き — 3/15 期限', type: 'warning' as const },
  { text: '年度末健康診断 未受診者 5名', type: 'info' as const },
  { text: '山田健太 契約更新 3/31 期限', type: 'warning' as const },
]

function getAlertStyle(type: 'danger' | 'warning' | 'info') {
  switch (type) {
    case 'danger': return 'bg-[#FF5D5D]/8 text-[#FF5D5D] border-[#FF5D5D]/15'
    case 'warning': return 'bg-[#F5A524]/8 text-[#F5A524] border-[#F5A524]/15'
    case 'info': return 'bg-[#60A5FA]/8 text-[#60A5FA] border-[#60A5FA]/15'
  }
}

export default function HRPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">人事・労務</h1>
          <p className="text-[13px] text-[#5A6070]">従業員管理・入退社・社保・手続き</p>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] ${getAlertStyle(alert.type)}`}>
            {alert.type === 'warning' ? (
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

      {/* ── 制度・法定 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          制度・法定
        </p>
        <div className="space-y-1">
          {systems.map((item) => {
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
