'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
  { title: '中途採用申請 - エンジニア1名',     status: '承認済', date: '3/08', color: '#059669' },
  { title: '有給休暇申請（3/20-3/21）',        status: '承認済', date: '3/11', color: '#059669' },
  { title: 'リモートワーク端末貸与申請',        status: '下書き', date: '3/07', color: '#94a3b8' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function ApplicationsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <h1 className="text-[24px] font-semibold text-[#0f172a] tracking-tight">申請</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">ワークフロー・承認処理</p>
      </motion.div>

      {/* 承認待ち */}
      {pending.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-8">
          <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>承認待ち</span>
            <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">{pending.length}</span>
          </h2>
          <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden divide-y divide-black/[0.04]">
            {pending.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{item.title}</p>
                  <p className="text-[12px] text-[#94a3b8] mt-0.5">{item.type} · {item.applicant}</p>
                </div>
                <span className="text-[13px] font-semibold text-[#334155] tabular-nums">{item.amount}</span>
                <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 差戻し */}
      {rejected.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.14 }} className="mb-8">
          <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>差戻し</span>
            <span className="text-[12px] font-semibold text-[#6366f1] tabular-nums">{rejected.length}</span>
          </h2>
          <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden divide-y divide-black/[0.04]">
            {rejected.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{item.title}</p>
                  <p className="text-[12px] text-[#e11d48]/70 mt-0.5">{item.reason}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 新規申請 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">新規申請</h2>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden divide-y divide-black/[0.04]">
          {types.map(type => {
            const Icon = type.icon
            return (
              <Link key={type.name} href={type.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#6366f1] transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-[#0f172a] tracking-tight">{type.name}</p>
                  <ChevronRight className="w-4 h-4 text-[#e2e8f0] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 最近の申請 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.28 }}>
        <h2 className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3 px-1">最近の申請</h2>
        <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden divide-y divide-black/[0.04]">
          {recent.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 px-5 py-4 hover:bg-white/50 hover:-translate-y-px transition-all duration-150 cursor-pointer group">
              <p className="flex-1 text-[14px] text-[#64748b] group-hover:text-[#0f172a] transition-colors truncate font-medium tracking-tight">{item.title}</p>
              <span
                className="text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ color: item.color, backgroundColor: `${item.color}10` }}
              >
                {item.status}
              </span>
              <span className="text-[12px] text-[#94a3b8] tabular-nums">{item.date}</span>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
