'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  ChevronRight,
  ListTodo,
  Search,
  Plus,
  Filter,
} from 'lucide-react'

/* ── Mock Data ── */

const tasks = [
  { title: '新入社員オンボーディング準備', status: '進行中' as const, category: '人事', assignee: '佐藤花子', date: '3/14', priority: '高' as const },
  { title: '月次経費レポート作成', status: '確認待ち' as const, category: '経理', assignee: '高橋美咲', date: '3/10', priority: '中' as const },
  { title: 'NDA契約書最終確認', status: '完了' as const, category: '法務', assignee: '鈴木一郎', date: '3/12', priority: '低' as const },
  { title: '社内研修プログラム企画', status: '未着手' as const, category: '人事', assignee: '田中太郎', date: '3/20', priority: '中' as const },
  { title: 'オフィス備品発注', status: '進行中' as const, category: '総務', assignee: '伊藤恵', date: '3/15', priority: '高' as const },
  { title: '決算準備チェックリスト', status: '未着手' as const, category: '経理', assignee: '高橋美咲', date: '3/31', priority: '高' as const },
]

const statusColors: Record<string, string> = {
  '完了': '#22C55E',
  '進行中': '#3B82F6',
  '確認待ち': '#F59E0B',
  '未着手': 'rgba(240,246,252,0.4)',
}

const statusBadge: Record<string, string> = {
  '完了': 'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
  '進行中': 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border-[rgba(59,130,246,0.3)]',
  '確認待ち': 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
  '未着手': 'bg-[rgba(240,246,252,0.08)] text-text-muted border-border',
}

const priorityStyles: Record<string, string> = {
  '高': 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
  '中': 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
  '低': 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border-[rgba(59,130,246,0.3)]',
}

const stats = [
  { label: '全タスク', value: 6, color: '#2563EB' },
  { label: '進行中', value: 2, color: '#3B82F6' },
  { label: '未着手', value: 2, color: 'rgba(240,246,252,0.4)' },
  { label: '完了', value: 1, color: '#22C55E' },
]

export default function TasksPage() {
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
        <span className="text-text-secondary font-medium">タスク</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">タスク</h1>
          <p className="text-[13px] text-text-secondary mt-1">{tasks.length}件のタスク</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 h-9 rounded-[10px] bg-bg-surface border border-border text-[13px] text-text-secondary font-medium hover:bg-bg-elevated transition-colors">
            <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
            フィルタ
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold px-4 h-9 rounded-[10px] text-[13px] shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:-translate-y-[2px] hover:shadow-[0_0_28px_rgba(37,99,235,0.5)] active:translate-y-0 transition-all duration-200">
            <Plus className="w-4 h-4" strokeWidth={2} />
            新規タスク
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>{s.value}</p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Task Table */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
      >
        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <Search className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="タスクを検索..."
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-muted outline-none"
          />
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-bg-base">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">ステータス</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">タスク名</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">カテゴリ</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">担当者</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">期限</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">優先度</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-[rgba(255,255,255,0.03)] group transition-colors cursor-pointer"
                style={{ borderLeftWidth: 3, borderLeftColor: 'transparent' }}
              >
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusBadge[task.status] || ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[task.status] || 'rgba(240,246,252,0.4)' }} />
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{task.title}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-muted">{task.category}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-secondary">{task.assignee}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{task.date}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
