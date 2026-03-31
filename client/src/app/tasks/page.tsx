'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  ChevronRight,
  ListTodo,
  Search,
  Plus,
  Filter,
  X,
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
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set())
  const [filterPriority, setFilterPriority] = useState<Set<string>>(new Set())
  const [filterDepartment, setFilterDepartment] = useState<Set<string>>(new Set())
  const [filterAssignee, setFilterAssignee] = useState<Set<string>>(new Set())
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close filter panel on outside click
  useEffect(() => {
    if (!filterOpen) return
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || '未割当'
  }

  const allTasks = useMemo(() => {
    if (!mounted || !hydrated) return []
    return getActiveTasks()
  }, [mounted, hydrated, getActiveTasks])

  // Compute unique values for filter options
  const filterOptions = useMemo(() => {
    const statuses = new Set<string>()
    const priorities = new Set<string>()
    const departments = new Set<string>()
    const assignees = new Map<string, string>()
    allTasks.forEach((t) => {
      statuses.add(TASK_STATUS_LABELS[t.status] || t.status)
      priorities.add(priorityLabels[t.priority] || '中')
      if (t.department) departments.add(t.department)
      const name = getUserName(t.assignee_id)
      assignees.set(t.assignee_id, name)
    })
    return {
      statuses: Array.from(statuses),
      priorities: Array.from(priorities),
      departments: Array.from(departments),
      assignees: Array.from(assignees.entries()),
    }
  }, [allTasks, users])

  const activeFilterCount = filterStatus.size + filterPriority.size + filterDepartment.size + filterAssignee.size

  const clearAllFilters = () => {
    setFilterStatus(new Set())
    setFilterPriority(new Set())
    setFilterDepartment(new Set())
    setFilterAssignee(new Set())
  }

  const toggleFilterItem = (set: Set<string>, item: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(item)) next.delete(item)
    else next.add(item)
    setter(next)
  }

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = allTasks

    // Status tab filter
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter)
    }

    // Advanced filters
    if (filterStatus.size > 0) {
      result = result.filter((t) => filterStatus.has(TASK_STATUS_LABELS[t.status] || t.status))
    }
    if (filterPriority.size > 0) {
      result = result.filter((t) => filterPriority.has(priorityLabels[t.priority] || '中'))
    }
    if (filterDepartment.size > 0) {
      result = result.filter((t) => t.department && filterDepartment.has(t.department))
    }
    if (filterAssignee.size > 0) {
      result = result.filter((t) => filterAssignee.has(t.assignee_id))
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q)
      )
    }

    return result
  }, [allTasks, activeFilter, searchQuery, filterStatus, filterPriority, filterDepartment, filterAssignee])

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

  // Show skeleton on initial render
  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-bg-elevated rounded" />
        <div className="h-10 w-2/3 bg-bg-elevated rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 md:h-24 bg-bg-elevated rounded-[16px]" />
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
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6 md:mb-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">タスク</h1>
          <p className="text-[13px] text-text-secondary mt-1">タスクの管理・進捗確認</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 h-11 md:h-9 rounded-[10px] border text-[13px] font-medium transition-colors cursor-pointer ${
                activeFilterCount > 0
                  ? 'bg-[rgba(79,70,229,0.08)] border-accent/30 text-accent'
                  : 'bg-bg-surface border-border text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
              フィルタ
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] md:w-[340px] max-w-[340px] bg-bg-surface border border-border rounded-[16px] shadow-lg z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <span className="text-[13px] font-semibold text-text-primary">フィルタ</span>
                    <div className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-[11px] text-accent font-medium hover:underline cursor-pointer"
                        >
                          すべてクリア
                        </button>
                      )}
                      <button onClick={() => setFilterOpen(false)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-bg-elevated transition-colors cursor-pointer">
                        <X className="w-3.5 h-3.5 text-text-muted" />
                      </button>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-5 max-h-[420px] overflow-y-auto">
                    {/* Status */}
                    <div>
                      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">ステータス</p>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.statuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleFilterItem(filterStatus, s, setFilterStatus)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                              filterStatus.has(s)
                                ? 'bg-accent text-white border-accent'
                                : 'bg-bg-base border-border text-text-secondary hover:border-accent/40'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Priority */}
                    <div>
                      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">優先度</p>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.priorities.map((p) => (
                          <button
                            key={p}
                            onClick={() => toggleFilterItem(filterPriority, p, setFilterPriority)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                              filterPriority.has(p)
                                ? 'bg-accent text-white border-accent'
                                : 'bg-bg-base border-border text-text-secondary hover:border-accent/40'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Department */}
                    {filterOptions.departments.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">部署</p>
                        <div className="flex flex-wrap gap-1.5">
                          {filterOptions.departments.map((d) => (
                            <button
                              key={d}
                              onClick={() => toggleFilterItem(filterDepartment, d, setFilterDepartment)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                                filterDepartment.has(d)
                                  ? 'bg-accent text-white border-accent'
                                  : 'bg-bg-base border-border text-text-secondary hover:border-accent/40'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Assignee */}
                    {filterOptions.assignees.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">担当者</p>
                        <div className="flex flex-wrap gap-1.5">
                          {filterOptions.assignees.map(([id, name]) => (
                            <button
                              key={id}
                              onClick={() => toggleFilterItem(filterAssignee, id, setFilterAssignee)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                                filterAssignee.has(id)
                                  ? 'bg-accent text-white border-accent'
                                  : 'bg-bg-base border-border text-text-secondary hover:border-accent/40'
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-accent text-white font-semibold px-4 h-11 md:h-9 rounded-[10px] text-[13px] shadow-[0_0_12px_rgba(79,70,229,0.2)] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(79,70,229,0.35)] active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            新規タスク
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div
        data-tutorial="task-views"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className={`bg-bg-surface border rounded-[16px] p-3 md:p-4 shadow-card cursor-pointer transition-all hover:-translate-y-0.5 ${
              activeFilter === s.filter
                ? 'border-accent shadow-[0_0_12px_rgba(79,70,229,0.12)]'
                : 'border-border'
            }`}
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
            onClick={() => setActiveFilter(s.filter)}
          >
            <p className="text-[22px] md:text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>{s.value}</p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[11px] text-text-muted font-medium">適用中:</span>
          {Array.from(filterStatus).map((s) => (
            <span key={`s-${s}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(79,70,229,0.08)] text-[11px] font-medium text-accent border border-accent/20">
              {s}
              <button onClick={() => toggleFilterItem(filterStatus, s, setFilterStatus)} className="hover:text-accent/70 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {Array.from(filterPriority).map((p) => (
            <span key={`p-${p}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(79,70,229,0.08)] text-[11px] font-medium text-accent border border-accent/20">
              {p}
              <button onClick={() => toggleFilterItem(filterPriority, p, setFilterPriority)} className="hover:text-accent/70 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {Array.from(filterDepartment).map((d) => (
            <span key={`d-${d}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(79,70,229,0.08)] text-[11px] font-medium text-accent border border-accent/20">
              {d}
              <button onClick={() => toggleFilterItem(filterDepartment, d, setFilterDepartment)} className="hover:text-accent/70 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {Array.from(filterAssignee).map((id) => (
            <span key={`a-${id}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(79,70,229,0.08)] text-[11px] font-medium text-accent border border-accent/20">
              {getUserName(id)}
              <button onClick={() => toggleFilterItem(filterAssignee, id, setFilterAssignee)} className="hover:text-accent/70 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={clearAllFilters} className="text-[11px] text-text-muted hover:text-accent font-medium cursor-pointer">
            すべてクリア
          </button>
        </div>
      )}

      {/* Task Table */}
      <motion.div
        data-tutorial="task-list"
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
      >
        {/* Search Bar */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border flex items-center gap-3">
          <Search className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="タスクを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-muted outline-none"
          />
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {filteredTasks.length === 0 ? (
            <div className="px-4 py-12 text-center text-[14px] text-text-muted">
              {searchQuery || activeFilter !== 'all'
                ? '条件に一致するタスクはまだありません'
                : 'タスクはまだありません'}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const statusLabel = TASK_STATUS_LABELS[task.status]
              const pLabel = priorityLabels[task.priority] || '中'
              const overdueFlag = isOverdue(task.due_date)
              return (
                <div
                  key={task.id}
                  className="px-4 py-3 active:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusBadge[statusLabel] || ''}`}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[statusLabel] || 'rgba(28,25,23,0.3)' }} />
                      {statusLabel}
                    </span>
                    <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${priorityStyles[pLabel] || ''}`}>
                      {pLabel}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-text-primary mb-1.5">{task.title}</p>
                  <div className="flex items-center gap-3 text-[12px] text-text-muted">
                    <span>{getUserName(task.assignee_id)}</span>
                    <span className={`tabular-nums ${overdueFlag ? 'text-danger font-medium' : ''}`} style={{ fontFamily: 'var(--font-inter)' }}>
                      {task.due_date ? formatDateCompact(task.due_date) : '-'}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop Table View */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-bg-base">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">ステータス</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">タスク名</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">カテゴリ</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">担当者</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">期限</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">優先度</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[14px] text-text-muted">
                  {searchQuery || activeFilter !== 'all'
                    ? '条件に一致するタスクはまだありません'
                    : 'タスクはまだありません'}
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
