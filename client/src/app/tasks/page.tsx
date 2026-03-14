'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  ChevronRight,
  ListTodo,
  Search,
  Plus,
  Filter,
} from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import { TaskCreateModal } from '@/features/tasks/components/task-create-modal'
import {
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from '@/lib/constants'
import { formatDateCompact, isOverdue } from '@/lib/date'
import type { TaskStatus } from '@/types'

/* ── Style Maps ── */

const statusColors: Record<string, string> = {
  '完了': '#22C55E',
  '進行中': '#3B82F6',
  '確認待ち': '#F59E0B',
  '承認待ち': '#F59E0B',
  '未着手': 'rgba(28,25,23,0.3)',
  '差戻し': '#EF4444',
  '保留': 'rgba(28,25,23,0.3)',
  '中止': 'rgba(28,25,23,0.3)',
}

const statusBadge: Record<string, string> = {
  '完了': 'bg-[rgba(34,197,94,0.08)] text-[#22C55E] border-[rgba(34,197,94,0.18)]',
  '進行中': 'bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border-[rgba(59,130,246,0.18)]',
  '確認待ち': 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[rgba(245,158,11,0.18)]',
  '承認待ち': 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[rgba(245,158,11,0.18)]',
  '未着手': 'bg-[rgba(28,25,23,0.04)] text-text-muted border-border',
  '差戻し': 'bg-[rgba(239,68,68,0.08)] text-[#EF4444] border-[rgba(239,68,68,0.18)]',
  '保留': 'bg-[rgba(28,25,23,0.04)] text-text-muted border-border',
  '中止': 'bg-[rgba(28,25,23,0.04)] text-text-muted border-border',
}

const priorityLabels: Record<string, string> = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
}

const priorityStyles: Record<string, string> = {
  '緊急': 'bg-[rgba(239,68,68,0.08)] text-[#EF4444] border-[rgba(239,68,68,0.18)]',
  '高': 'bg-[rgba(239,68,68,0.08)] text-[#EF4444] border-[rgba(239,68,68,0.18)]',
  '中': 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[rgba(245,158,11,0.18)]',
  '低': 'bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border-[rgba(59,130,246,0.18)]',
}

type FilterTab = 'all' | TaskStatus

export default function TasksPage() {
  const router = useRouter()
  const getActiveTasks = useTaskStore((s) => s.getActiveTasks)
  const hydrated = useTaskStore((s) => s._hydrated)
  const users = useAuthStore((s) => s.users)

  const [mounted, setMounted] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  const allTasks = useMemo(() => {
    if (!mounted || !hydrated) return []
    return getActiveTasks()
  }, [mounted, hydrated, getActiveTasks])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = allTasks

    // Status filter
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q)
      )
    }

    return result
  }, [allTasks, activeFilter, searchQuery])

  // Stats from real data
  const stats = useMemo(() => {
    const total = allTasks.length
    const inProgress = allTasks.filter((t) => t.status === 'in_progress').length
    const todo = allTasks.filter((t) => t.status === 'todo').length
    const done = allTasks.filter((t) => t.status === 'done').length
    return [
      { label: '全タスク', value: total, color: '#4F46E5', filter: 'all' as FilterTab },
      { label: '進行中', value: inProgress, color: '#3B82F6', filter: 'in_progress' as FilterTab },
      { label: '未着手', value: todo, color: 'rgba(28,25,23,0.3)', filter: 'todo' as FilterTab },
      { label: '完了', value: done, color: '#22C55E', filter: 'done' as FilterTab },
    ]
  }, [allTasks])

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || '未割当'
  }

  // Show skeleton on initial render
  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-bg-elevated rounded" />
        <div className="h-10 w-2/3 bg-bg-elevated rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
        <div className="h-96 bg-bg-elevated rounded-[16px]" />
      </div>
    )
  }

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
          <p className="text-[13px] text-text-secondary mt-1">{filteredTasks.length}件のタスク</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 h-9 rounded-[10px] bg-bg-surface border border-border text-[13px] text-text-secondary font-medium hover:bg-bg-elevated transition-colors">
            <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
            フィルタ
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-accent text-white font-semibold px-4 h-9 rounded-[10px] text-[13px] shadow-[0_0_12px_rgba(79,70,229,0.2)] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(79,70,229,0.35)] active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
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
            className={`bg-bg-surface border rounded-[16px] p-4 shadow-card cursor-pointer transition-all hover:-translate-y-0.5 ${
              activeFilter === s.filter
                ? 'border-accent shadow-[0_0_12px_rgba(79,70,229,0.12)]'
                : 'border-border'
            }`}
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
            onClick={() => setActiveFilter(s.filter)}
          >
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>{s.value}</p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Task Table */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[14px] text-text-muted">
                  {searchQuery || activeFilter !== 'all'
                    ? '条件に一致するタスクがありません'
                    : 'タスクがありません'}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const statusLabel = TASK_STATUS_LABELS[task.status]
                const pLabel = priorityLabels[task.priority] || '中'
                const overdueFlag = isOverdue(task.due_date)
                return (
                  <tr
                    key={task.id}
                    className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer"
                    style={{ borderLeftWidth: 3, borderLeftColor: 'transparent' }}
                    onClick={() => router.push(`/tasks/${task.id}`)}
                  >
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusBadge[statusLabel] || ''}`}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[statusLabel] || 'rgba(28,25,23,0.3)' }} />
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{task.title}</td>
                    <td className="px-6 py-3.5 text-[13px] text-text-muted">{task.category}</td>
                    <td className="px-6 py-3.5 text-[13px] text-text-secondary">{getUserName(task.assignee_id)}</td>
                    <td className={`px-6 py-3.5 text-[13px] tabular-nums ${overdueFlag ? 'text-danger font-medium' : 'text-text-muted'}`} style={{ fontFamily: 'var(--font-inter)' }}>
                      {task.due_date ? formatDateCompact(task.due_date) : '-'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${priorityStyles[pLabel] || ''}`}>
                        {pLabel}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Create Task Modal */}
      <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </motion.div>
  )
}
