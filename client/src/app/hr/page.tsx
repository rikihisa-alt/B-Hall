'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
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

export default function HRPage() {
  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">人事・労務</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">人事・労務</h1>
        <p className="text-[13px] text-text-secondary mt-1">従業員・入退社・社保・手続き</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 制度・法定 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">制度・法定</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {systems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
