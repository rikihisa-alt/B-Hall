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
  { title: 'リモートワーク端末貸与申請',        status: '下書き', date: '3/07', color: '#94A3B8' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function ApplicationsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="flex items-center gap-5 mb-14"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#EEF2FF]">
          <FileText className="w-7 h-7 text-[#6366F1]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">申請</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">ワークフロー・承認処理</p>
        </div>
      </motion.div>

      {/* 承認待ち */}
      {pending.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-12">
          <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D97706]" />
            <span>承認待ち</span>
            <span className="text-[#D97706]">{pending.length}</span>
          </h2>
          <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
            {pending.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#1E293B]">{item.title}</p>
                  <p className="text-[13px] text-[#94A3B8] mt-0.5 font-medium">{item.type} · {item.applicant}</p>
                </div>
                <span className="text-[15px] font-semibold text-[#475569] tabular-nums">{item.amount}</span>
                <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 差戻し */}
      {rejected.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.14 }} className="mb-12">
          <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[#E11D48]" />
            <span>差戻し</span>
            <span className="text-[#E11D48]">{rejected.length}</span>
          </h2>
          <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
            {rejected.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#1E293B]">{item.title}</p>
                  <p className="text-[13px] text-[#E11D48]/70 mt-0.5 font-medium">{item.reason}</p>
                </div>
                <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 新規申請 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="mb-12">
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">新規申請</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {types.map(type => {
            const Icon = type.icon
            return (
              <Link key={type.name} href={type.href}>
                <div className="flex items-center gap-5 px-6 py-4.5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <p className="flex-1 text-[15px] font-semibold text-[#1E293B]">{type.name}</p>
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 最近の申請 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.28 }}>
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">最近の申請</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {recent.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
              <p className="flex-1 text-[15px] text-[#64748B] group-hover:text-[#1E293B] transition-colors truncate font-medium">{item.title}</p>
              <span
                className="text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ color: item.color, backgroundColor: `${item.color}10` }}
              >
                {item.status}
              </span>
              <span className="text-[13px] text-[#CBD5E1] tabular-nums font-medium">{item.date}</span>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
