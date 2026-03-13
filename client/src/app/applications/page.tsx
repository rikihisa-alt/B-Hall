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
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-react'

const pending = [
  { id: 'APP-001', title: '3月度交通費精算',          applicant: '田中太郎', amount: '¥32,450',  type: '経費申請' },
  { id: 'APP-003', title: '出張申請 - 大阪支社訪問',   applicant: '山田一郎', amount: '¥85,000',  type: '出張申請' },
]

const rejected = [
  { id: 'APP-004', title: 'ノートPC購入申請', reason: '見積比較資料の添付をお願いします' },
]

const types = [
  { name: '経費申請', icon: Receipt,      href: '/applications' },
  { name: '休暇申請', icon: Calendar,     href: '/applications' },
  { name: '出張申請', icon: Plane,        href: '/applications' },
  { name: '購買申請', icon: ShoppingCart,  href: '/applications' },
  { name: '採用申請', icon: UserPlus,     href: '/applications' },
  { name: '端末申請', icon: Laptop,       href: '/applications' },
  { name: '稟議起票', icon: Stamp,        href: '/ringi' },
  { name: 'その他',   icon: FileText,     href: '/applications' },
]

const recent = [
  { title: '中途採用申請 - エンジニア1名',     status: '承認済', date: '3/08', color: '#3CB06C' },
  { title: '有給休暇申請（3/20-3/21）',        status: '承認済', date: '3/11', color: '#3CB06C' },
  { title: 'リモートワーク端末貸与申請',        status: '下書き', date: '3/07', color: '#4E4E56' },
]

export default function ApplicationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#6E7BF714' }}>
          <FileText className="w-6 h-6 text-[#6E7BF7]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF] tracking-tight">申請</h1>
          <p className="text-[14px] text-[#4E4E56]">ワークフロー・承認処理</p>
        </div>
      </div>

      {/* 承認待ち */}
      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#D4993D]" />
            <span>承認待ち</span>
            <span className="text-[#D4993D]">{pending.length}</span>
          </h2>
          <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
            {pending.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-[12px] text-[#3A3A42] mt-0.5">{item.type} · {item.applicant}</p>
                </div>
                <span className="text-[14px] font-medium text-[#8E8E96] tabular-nums">{item.amount}</span>
                <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 差戻し */}
      {rejected.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-[#E55A5A]" />
            <span>差戻し</span>
            <span className="text-[#E55A5A]">{rejected.length}</span>
          </h2>
          <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
            {rejected.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-[12px] text-[#E55A5A]/60 mt-0.5">{item.reason}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 新規申請 */}
      <section className="mb-10">
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">新規申請</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {types.map(type => {
            const Icon = type.icon
            return (
              <Link key={type.name} href={type.href}>
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <p className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{type.name}</p>
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 最近の申請 */}
      <section>
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">最近の申請</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {recent.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <p className="flex-1 text-[14px] text-[#8E8E96] group-hover:text-[#ECECEF] transition-colors truncate">{item.title}</p>
              <span className="text-[12px] font-medium px-2 py-0.5 rounded-md" style={{ color: item.color, backgroundColor: `${item.color}14` }}>
                {item.status}
              </span>
              <span className="text-[12px] text-[#3A3A42] tabular-nums">{item.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
