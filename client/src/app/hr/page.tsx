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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 28 } },
}

export default function HRPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="flex items-center gap-5 mb-14"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#F5F3FF]">
          <Users className="w-7 h-7 text-[#7C3AED]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">人事</h1>
          <p className="text-[15px] text-[#94A3B8] font-medium mt-0.5">従業員・入退社・社保・手続き</p>
        </div>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }} className="mb-12">
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">今日の処理</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                    <p className="text-[13px] text-[#94A3B8] mt-0.5 font-medium">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.16 }} className="mb-12">
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">管理</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <p className="flex-1 text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                  <span className="text-[14px] text-[#94A3B8] font-medium">{item.meta}</span>
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* 制度・法定 */}
      <motion.section variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
        <h2 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-4 px-1">制度・法定</h2>
        <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]">
          {systems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-6 py-5 hover:bg-[#FAFBFC] transition-colors cursor-pointer group">
                  <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors shrink-0" />
                  <p className="flex-1 text-[15px] font-semibold text-[#1E293B]">{item.name}</p>
                  <span className="text-[14px] text-[#94A3B8] font-medium">{item.meta}</span>
                  <ChevronRight className="w-[18px] h-[18px] text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
