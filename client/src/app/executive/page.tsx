'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useTaskStore } from '@/stores/task-store'
import { useRingiStore } from '@/stores/ringi-store'
import { useApplicationStore } from '@/stores/application-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { useAuth } from '@/hooks/use-auth'
import { isOverdue } from '@/lib/date'
import {
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  ClipboardCheck,
  Users,
  Building2,
  TrendingUp,
  Zap,
} from 'lucide-react'

const priorityColors: Record<string, string> = {
  urgent: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#9CA3AF',
}

const priorityLabels: Record<string, string> = {
  urgent: '緊急',
  high: '重要',
  medium: '通常',
  low: '低',
}

export default function ExecutivePage() {
  const { currentUser, mounted, getUserName } = useAuth()
  const { getActiveTasks } = useTaskStore()
  const { getRingis, getPendingApprovals: getRingiPending } = useRingiStore()
  const { getApplications, getPendingApprovals: getAppPending } = useApplicationStore()
  const { getEmployees } = useEmployeeStore()

  const tasks = useMemo(() => (mounted ? getActiveTasks() : []), [mounted, getActiveTasks])
  const ringis = useMemo(() => (mounted ? getRingis() : []), [mounted, getRingis])
  const applications = useMemo(() => (mounted ? getApplications() : []), [mounted, getApplications])
  const employees = useMemo(() => (mounted ? getEmployees() : []), [mounted, getEmployees])

  const userId = currentUser?.id || ''

  // Pending approvals for current user
  const pendingRingis = useMemo(
    () => (mounted && userId ? getRingiPending(userId) : []),
    [mounted, userId, getRingiPending]
  )
  const pendingApps = useMemo(
    () => (mounted && userId ? getAppPending(userId) : []),
    [mounted, userId, getAppPending]
  )

  const totalPending = pendingRingis.length + pendingApps.length

  // Task completion rate
  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0
    const done = tasks.filter((t) => t.status === 'done').length
    return Math.round((done / tasks.length) * 100)
  }, [tasks])

  // High/urgent incomplete tasks
  const urgentTasks = useMemo(() => {
    return tasks
      .filter(
        (t) =>
          (t.priority === 'urgent' || t.priority === 'high') &&
          t.status !== 'done' &&
          t.status !== 'cancelled'
      )
      .sort((a, b) => {
        const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return (pOrder[a.priority] || 3) - (pOrder[b.priority] || 3)
      })
  }, [tasks])

  // Department health: pending tasks per department
  const deptHealth = useMemo(() => {
    const deptMap: Record<string, number> = {}
    tasks.forEach((t) => {
      if (t.status !== 'done' && t.status !== 'cancelled') {
        const dept = t.department || '未分類'
        deptMap[dept] = (deptMap[dept] || 0) + 1
      }
    })
    const colors = ['#4F46E5', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EF4444']
    return Object.entries(deptMap)
      .map(([name, count], i) => ({
        name,
        count,
        color: colors[i % colors.length],
      }))
      .sort((a, b) => b.count - a.count)
  }, [tasks])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px] animate-pulse" />
          ))}
        </div>
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
        <span className="text-text-secondary font-medium">役員</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">役員ダッシュボード</h1>
        <p className="text-[13px] text-text-secondary mt-1">経営指標の確認</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        {[
          { label: '要対応', value: totalPending, suffix: '件', color: '#EF4444', icon: Zap },
          { label: 'タスク完了率', value: completionRate, suffix: '%', color: '#22C55E', icon: TrendingUp },
          { label: '従業員数', value: employees.length, suffix: '名', color: '#3B82F6', icon: Users },
          { label: '進行中稟議', value: ringis.filter((r) => r.status === 'approving' || r.status === 'submitted').length, suffix: '件', color: '#4F46E5', icon: FileText },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-3 md:p-5 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: kpi.color }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                <kpi.icon className="w-[18px] h-[18px]" style={{ color: kpi.color }} strokeWidth={1.75} />
              </div>
            </div>
            <p className="text-xl md:text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>
              {kpi.value}<span className="text-[14px] text-text-muted ml-1">{kpi.suffix}</span>
            </p>
            <p className="text-[12px] text-text-muted mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
        {/* Pending Decisions */}
        <motion.div
          className="lg:col-span-2 bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">要対応</h2>
            <span className="text-[12px] text-text-muted">{totalPending}件</span>
          </div>

          {totalPending === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-[14px] text-text-muted">対応が必要な案件はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Pending Ringis */}
              {pendingRingis.map((r) => (
                <Link key={r.id} href="/ringi">
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-[8px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-accent" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{r.title}</p>
                      <p className="text-[12px] text-text-muted">稟議</p>
                    </div>
                    {r.amount && (
                      <span className="text-[13px] font-semibold text-text-secondary tabular-nums shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                        {'\u00A5'}{r.amount.toLocaleString()}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
              {/* Pending Applications */}
              {pendingApps.map((a) => (
                <Link key={a.id} href="/applications">
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-[8px] bg-[rgba(34,197,94,0.08)] flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-4 h-4 text-[#22C55E]" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{a.title}</p>
                      <p className="text-[12px] text-text-muted">{a.type_label}</p>
                    </div>
                    {a.amount && (
                      <span className="text-[13px] font-semibold text-text-secondary tabular-nums shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                        {'\u00A5'}{a.amount.toLocaleString()}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Department Health */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">部門別状況</h2>
          </div>
          {deptHealth.length === 0 ? (
            <p className="text-[13px] text-text-muted text-center py-4">データなし</p>
          ) : (
            <div className="space-y-3">
              {deptHealth.map((dept) => (
                <div key={dept.name} className="p-3.5 rounded-[10px] bg-bg-elevated border border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-text-primary">{dept.name}</span>
                    <span className="text-[12px] font-semibold tabular-nums" style={{ fontFamily: 'var(--font-inter)', color: dept.color }}>
                      {dept.count}件
                    </span>
                  </div>
                  <div className="h-1.5 bg-[rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((dept.count / Math.max(...deptHealth.map((d) => d.count))) * 100, 100)}%`,
                        background: dept.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Urgent Tasks */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">重要未完了タスク</h2>
          </div>
          <Link href="/tasks" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
            すべて表示
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {urgentTasks.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-[13px] text-text-muted">緊急・重要な未完了タスクはありません</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {urgentTasks.slice(0, 6).map((t) => {
              const isTaskOverdue = t.due_date && isOverdue(t.due_date)
              return (
                <Link key={t.id} href="/tasks">
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0"
                      style={{
                        background: `${priorityColors[t.priority]}10`,
                        color: priorityColors[t.priority],
                        borderColor: `${priorityColors[t.priority]}25`,
                      }}
                    >
                      {priorityLabels[t.priority]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{t.title}</p>
                      <p className="text-[12px] text-text-muted">
                        {t.department} / {getUserName(t.assignee_id)}
                      </p>
                    </div>
                    {isTaskOverdue && (
                      <span className="text-[11px] text-[#EF4444] font-semibold shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        期限切れ
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
