'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
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
  { title: '中途採用申請 - エンジニア1名',     status: '承認済', date: '3/08', statusType: 'success' as const },
  { title: '有給休暇申請（3/20-3/21）',        status: '承認済', date: '3/11', statusType: 'success' as const },
  { title: 'リモートワーク端末貸与申請',        status: '下書き', date: '3/07', statusType: 'muted' as const },
]

const statusStyles = {
  success: { color: 'text-success', bg: 'bg-[rgba(34,197,94,0.15)]' },
  muted: { color: 'text-text-muted', bg: 'bg-[rgba(240,246,252,0.06)]' },
}

export default function ApplicationsPage() {
  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">申請・承認</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">申請・承認</h1>
        <p className="text-[13px] text-text-secondary mt-1">ワークフロー・承認処理</p>
      </div>

      {/* 承認待ち */}
      {pending.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>承認待ち</span>
            <span className="text-[12px] font-semibold text-warning tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{pending.length}</span>
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {pending.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.title}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">{item.type} · {item.applicant}</p>
                </div>
                <span className="text-[13px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.amount}</span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 差戻し */}
      {rejected.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>差戻し</span>
            <span className="text-[12px] font-semibold text-danger tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{rejected.length}</span>
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {rejected.map(item => (
              <div key={item.id} className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.title}</p>
                  <p className="text-[12px] text-danger/70 mt-0.5">{item.reason}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 新規申請 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">新規申請</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {types.map(type => {
            const Icon = type.icon
            return (
              <Link key={type.name} href={type.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{type.name}</p>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 最近の申請 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">最近の申請</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {recent.map((item, idx) => {
            const style = statusStyles[item.statusType]
            return (
              <div key={idx} className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                <p className="flex-1 text-[14px] text-text-secondary group-hover:text-text-primary transition-colors truncate font-medium tracking-tight">{item.title}</p>
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg ${style.color} ${style.bg}`}>
                  {item.status}
                </span>
                <span className="text-[12px] text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.date}</span>
              </div>
            )
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
