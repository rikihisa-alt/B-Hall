'use client'

import Link from 'next/link'
import {
  FileText,
  Receipt,
  Calendar,
  Plane,
  ShoppingCart,
  UserPlus,
  Laptop,
  Stamp,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 申請・承認
   3セクション構成:
     あなたの対応 → 承認待ち・差戻し
     新規申請     → 申請種別一覧
     履歴         → 最近の申請
───────────────────────────────── */

const pendingApprovals = [
  {
    id: 'APP-001',
    title: '3月度交通費精算',
    applicant: '田中太郎',
    amount: '¥32,450',
    date: '3/12',
    type: '経費申請',
  },
  {
    id: 'APP-003',
    title: '出張申請 - 大阪支社訪問',
    applicant: '山田一郎',
    amount: '¥85,000',
    date: '3/10',
    type: '出張申請',
  },
]

const rejectedItems = [
  {
    id: 'APP-004',
    title: 'ノートPC購入申請',
    reason: '見積比較資料の添付をお願いします',
    date: '3/09',
  },
]

const applicationTypes = [
  { name: '経費申請', icon: Receipt, gradient: 'from-emerald-500 to-emerald-600', href: '/applications' },
  { name: '休暇申請', icon: Calendar, gradient: 'from-blue-500 to-blue-600', href: '/applications' },
  { name: '出張申請', icon: Plane, gradient: 'from-violet-500 to-violet-600', href: '/applications' },
  { name: '購買申請', icon: ShoppingCart, gradient: 'from-amber-500 to-amber-600', href: '/applications' },
  { name: '採用申請', icon: UserPlus, gradient: 'from-pink-500 to-pink-600', href: '/applications' },
  { name: '端末申請', icon: Laptop, gradient: 'from-sky-500 to-sky-600', href: '/applications' },
  { name: '稟議起票', icon: Stamp, gradient: 'from-orange-500 to-orange-600', href: '/ringi' },
  { name: 'その他', icon: FileText, gradient: 'from-gray-500 to-gray-600', href: '/applications' },
]

const recentApplications = [
  { id: 'APP-005', title: '中途採用申請 - エンジニア1名', status: '承認済', date: '3/08', statusColor: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  { id: 'APP-002', title: '有給休暇申請（3/20-3/21）', status: '承認済', date: '3/11', statusColor: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  { id: 'APP-006', title: 'リモートワーク端末貸与申請', status: '下書き', date: '3/07', statusColor: 'text-[#5A6070] bg-white/[0.06]' },
]

export default function ApplicationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">申請・承認</h1>
          <p className="text-[13px] text-[#5A6070]">ワークフロー処理</p>
        </div>
      </div>

      {/* ── あなたの対応 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          あなたの対応
        </p>

        {/* 承認待ち */}
        {pendingApprovals.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04] mb-3">
            <div className="px-4 py-2.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#F5A524]" />
              <span className="text-[11px] font-semibold text-[#F5A524]">承認待ち {pendingApprovals.length}件</span>
            </div>
            {pendingApprovals.map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-white/85 group-hover:text-[#7C8CFF] transition-colors">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#4B5263]">
                      <span>{item.type}</span>
                      <span>·</span>
                      <span>{item.applicant}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.amount && (
                      <span className="text-[13px] font-semibold text-[#A8B0BD]">{item.amount}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 差戻し */}
        {rejectedItems.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04]">
            <div className="px-4 py-2.5 flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-[#FF5D5D]" />
              <span className="text-[11px] font-semibold text-[#FF5D5D]">差戻し {rejectedItems.length}件</span>
            </div>
            {rejectedItems.map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-white/85 group-hover:text-[#7C8CFF] transition-colors">{item.title}</p>
                    <p className="text-[11px] text-[#FF5D5D]/70 mt-0.5">理由: {item.reason}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 新規申請 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          新規申請
        </p>
        <div className="grid grid-cols-4 gap-2">
          {applicationTypes.map((type) => {
            const Icon = type.icon
            return (
              <Link key={type.name} href={type.href}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group text-center">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[11px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">{type.name}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 最近の申請 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          最近の申請
        </p>
        <div className="space-y-1">
          {recentApplications.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors truncate">{item.title}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.statusColor}`}>
                {item.status}
              </span>
              <span className="text-[11px] text-[#3A3F4B]">{item.date}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
