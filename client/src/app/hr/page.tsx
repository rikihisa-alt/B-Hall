'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  UserCheck,
  ClipboardList,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react'

const today = [
  { name: '入退社手続き', desc: '佐藤太郎 入社（3/15 期限）', icon: UserPlus,  count: 2, href: '/hr' },
  { name: '届出・申請',   desc: '社保届出・雇保手続き',       icon: FileText,  count: 3, href: '/hr' },
  { name: '勤怠確認',     desc: '月次勤怠の確認・承認',       icon: Calendar,  count: 0, href: '/hr' },
  { name: '異動・評価',   desc: '人事異動・昇格管理',         icon: UserCheck, count: 1, href: '/hr' },
]

const manage = [
  { name: '従業員一覧', meta: '42名 在籍',          icon: Users,         href: '/hr' },
  { name: '組織図',      meta: '部署・チーム構成',    icon: ClipboardList, href: '/hr' },
  { name: '雇用契約',    meta: '契約更新 1件期限近',  icon: FileText,      href: '/hr' },
]

const systems = [
  { name: '社会保険', meta: '加入・喪失管理',    icon: Shield,   href: '/hr' },
  { name: '年末調整', meta: '次回 12月',         icon: Calendar, href: '/hr' },
  { name: '健康診断', meta: '4月実施 未受診5名', icon: Heart,    href: '/hr' },
  { name: '就業規則', meta: 'v3.2 最新',         icon: FileText, href: '/hr' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export default function HRPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">人事</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">従業員・入退社・社保・手続き</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">今日の処理</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-[#34d399] tabular-nums">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.16 }} className="mb-8">
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">管理</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-[#94a3b8]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 制度・法定 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
        <h2 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] mb-3 px-1">制度・法定</h2>
        <div className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]">
          {systems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#64748b] group-hover:text-[#34d399] transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-[#f1f5f9] tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-[#94a3b8]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
