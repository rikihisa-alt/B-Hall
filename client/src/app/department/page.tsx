'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Building2,
  Users,
  BarChart3,
  FileText,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

/* ── Mock Data ── */

const departments = [
  { name: '開発部', head: '田中太郎', members: 12, tasks: 18, completed: 14, budget: 280, color: '#4F46E5' },
  { name: '営業部', head: '佐藤花子', members: 8, tasks: 24, completed: 19, budget: 150, color: '#3B82F6' },
  { name: '人事部', head: '鈴木一郎', members: 5, tasks: 12, completed: 10, budget: 80, color: '#60A5FA' },
  { name: '経理部', head: '高橋美咲', members: 4, tasks: 15, completed: 11, budget: 60, color: '#22C55E' },
  { name: '総務部', head: '伊藤恵', members: 3, tasks: 9, completed: 7, budget: 45, color: '#F59E0B' },
  { name: '法務部', head: '山田太郎', members: 3, tasks: 8, completed: 6, budget: 55, color: '#8B5CF6' },
]

const summaryStats = [
  { label: '総部署数', value: '6', color: '#4F46E5' },
  { label: '総従業員数', value: '35', suffix: '名', color: '#3B82F6' },
  { label: '全体タスク完了率', value: '78', suffix: '%', color: '#22C55E' },
  { label: '月間予算合計', value: '670', prefix: '¥', suffix: '万', color: '#F59E0B' },
]

export default function DepartmentPage() {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">部門</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">部門</h1>
        <p className="text-[13px] text-text-secondary mt-1">部門構成と業務状況の管理</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {summaryStats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>
              {s.prefix}{s.value}{s.suffix}
            </p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Department Table */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[18px] font-bold text-text-primary tracking-tight">部門一覧</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-bg-base">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">部門名</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">責任者</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">人数</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">タスク進捗</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">月間予算</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => {
              const progress = Math.round((dept.completed / dept.tasks) * 100)
              return (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer"
                  style={{ borderLeftWidth: 3, borderLeftColor: 'transparent' }}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: `${dept.color}12` }}>
                        <Building2 className="w-4 h-4" style={{ color: dept.color }} strokeWidth={1.75} />
                      </div>
                      <span className="text-[14px] font-medium text-text-primary">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-text-secondary">{dept.head}</td>
                  <td className="px-6 py-3.5 text-[13px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>{dept.members}名</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden max-w-[100px]">
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: dept.color }} />
                      </div>
                      <span className="text-[12px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{dept.completed}/{dept.tasks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>¥{dept.budget}万</td>
                  <td className="px-6 py-3.5">
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
