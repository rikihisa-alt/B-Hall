'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  PieChart as RePieChart, Pie, Cell,
  ResponsiveContainer,
} from 'recharts'
import { useTaskStore } from '@/stores/task-store'
import { useRingiStore } from '@/stores/ringi-store'
import { useApplicationStore } from '@/stores/application-store'
import { useAuth } from '@/hooks/use-auth'
import { formatRelative } from '@/lib/date'
import {
  Workflow,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
  Clock,
  FileText,
  ClipboardCheck,
  ListChecks,
  AlertCircle,
  Stamp,
} from 'lucide-react'

const statusColorMap: Record<string, string> = {
  todo: '#9CA3AF',
  in_progress: '#3B82F6',
  reviewing: '#8B5CF6',
  approving: '#F59E0B',
  done: '#22C55E',
  rejected: '#EF4444',
  on_hold: '#6B7280',
  cancelled: '#9CA3AF',
}

const statusLabelMap: Record<string, string> = {
  todo: '未着手',
  in_progress: '進行中',
  reviewing: '確認待ち',
  approving: '承認待ち',
  done: '完了',
  rejected: '差戻し',
  on_hold: '保留',
  cancelled: '中止',
}

const appStatusBadge: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '下書き' },
  submitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '提出済' },
  approving: { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', label: '承認待ち' },
  approved: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E', label: '承認済' },
  rejected: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', label: '却下' },
  resubmitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '再提出' },
  withdrawn: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '取下げ' },
}

export default function OperationsPage() {
  const { currentUser, mounted, getUserName } = useAuth()
  const { getActiveTasks } = useTaskStore()
  const { getRingis, getPendingApprovals: getRingiPending } = useRingiStore()
  const { getApplications, getPendingApprovals: getAppPending } = useApplicationStore()

  const userId = currentUser?.id || ''
  const tasks = useMemo(() => (mounted ? getActiveTasks() : []), [mounted, getActiveTasks])
  const ringis = useMemo(() => (mounted ? getRingis() : []), [mounted, getRingis])
  const applications = useMemo(() => (mounted ? getApplications() : []), [mounted, getApplications])

  const pendingRingis = useMemo(
    () => (mounted && userId ? getRingiPending(userId) : []),
    [mounted, userId, getRingiPending]
  )
  const pendingApps = useMemo(
    () => (mounted && userId ? getAppPending(userId) : []),
    [mounted, userId, getAppPending]
  )

  // Active workflows: in-progress applications and ringis
  const activeFlows = useMemo(() => {
    const flows: Array<{ id: string; title: string; type: string; status: string; assignee: string; created: string; href: string }> = []

    applications
      .filter((a) => a.status === 'approving' || a.status === 'submitted' || a.status === 'resubmitted')
      .forEach((a) => {
        const currentStep = a.approval_steps.find((s) => s.status === 'pending')
        flows.push({
          id: a.id,
          title: a.title,
          type: a.type_label,
          status: a.status === 'approving' ? '承認待ち' : '提出済',
          assignee: currentStep ? currentStep.approver_name : getUserName(a.applicant_id),
          created: a.created_at,
          href: '/applications',
        })
      })

    ringis
      .filter((r) => r.status === 'approving' || r.status === 'submitted')
      .forEach((r) => {
        const currentStep = r.approval_steps.find((s) => s.status === 'pending')
        flows.push({
          id: r.id,
          title: r.title,
          type: '稟議',
          status: r.status === 'approving' ? '承認待ち' : '提出済',
          assignee: currentStep ? currentStep.approver_name : '',
          created: r.created_at,
          href: '/ringi',
        })
      })

    return flows.sort((a, b) => b.created.localeCompare(a.created))
  }, [applications, ringis, getUserName])

  // Task status pie chart data
  const taskStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1
    })
    return Object.entries(counts).map(([status, value]) => ({
      name: statusLabelMap[status] || status,
      value,
      color: statusColorMap[status] || '#9CA3AF',
    }))
  }, [tasks])

  // Stats
  const activeFlowCount = activeFlows.length
  const pendingCount = pendingRingis.length + pendingApps.length
  const overdueCount = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done' && t.status !== 'cancelled'
  ).length
  const completedThisMonth = tasks.filter((t) => {
    if (t.status !== 'done') return false
    const now = new Date()
    const updated = new Date(t.updated_at)
    return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear()
  }).length

  // Recent activity: recently updated tasks/apps sorted by date
  const recentActivity = useMemo(() => {
    const items: Array<{ id: string; title: string; type: string; status: string; date: string; href: string }> = []

    tasks.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 4).forEach((t) => {
      items.push({
        id: t.id,
        title: t.title,
        type: 'タスク',
        status: statusLabelMap[t.status] || t.status,
        date: t.updated_at,
        href: '/tasks',
      })
    })

    applications.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 3).forEach((a) => {
      const badge = appStatusBadge[a.status]
      items.push({
        id: a.id,
        title: a.title,
        type: a.type_label,
        status: badge?.label || a.status,
        date: a.updated_at,
        href: '/applications',
      })
    })

    return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  }, [tasks, applications])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
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
        <span className="text-text-secondary font-medium">業務統制</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">業務統制</h1>
        <p className="text-[13px] text-text-secondary mt-1">フロー・申請・承認の統合管理</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div className="grid grid-cols-4 gap-4 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        {[
          { label: '進行中フロー', value: activeFlowCount, color: '#3B82F6' },
          { label: '承認待ち', value: pendingCount, color: '#F59E0B' },
          { label: '期限超過', value: overdueCount, color: '#EF4444' },
          { label: '今月完了', value: completedThisMonth, color: '#22C55E' },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>{s.value}</p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Flows + Task Breakdown */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Active Flows */}
        <motion.div
          className="col-span-2 bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">進行中のフロー</h2>
            <Link href="/applications" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて表示
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeFlows.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Workflow className="w-10 h-10 text-text-muted mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-[14px] text-text-muted">進行中のフローはありません</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-bg-base">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">ステータス</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">フロー名</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">種別</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">担当者</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {activeFlows.map((flow) => {
                  const isApproving = flow.status === '承認待ち'
                  return (
                    <tr key={flow.id} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer">
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          isApproving
                            ? 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[rgba(245,158,11,0.18)]'
                            : 'bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border-[rgba(59,130,246,0.18)]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isApproving ? '#F59E0B' : '#3B82F6' }} />
                          {flow.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{flow.title}</td>
                      <td className="px-6 py-3.5 text-[13px] text-text-muted">{flow.type}</td>
                      <td className="px-6 py-3.5 text-[13px] text-text-secondary">{flow.assignee}</td>
                      <td className="px-6 py-3.5">
                        <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Task Status Breakdown */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[18px] font-bold text-text-primary mb-4">タスク状況</h2>
          {taskStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RePieChart>
                  <Pie data={taskStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                    {taskStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {taskStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-text-primary font-semibold tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.value}件</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[13px] text-text-muted text-center py-8">タスクデータなし</p>
          )}
        </motion.div>
      </div>

      {/* Approval Queue + Recent Activity */}
      <div className="grid grid-cols-2 gap-5">
        {/* Approval Queue */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
              <h2 className="text-[18px] font-bold text-text-primary tracking-tight">承認キュー</h2>
            </div>
            <span className="text-[12px] text-text-muted">{pendingCount}件</span>
          </div>

          {pendingCount === 0 ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[13px] text-text-muted">承認待ちはありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingRingis.map((r) => (
                <Link key={r.id} href="/ringi">
                  <div className="flex items-center gap-3 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <FileText className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{r.title}</p>
                      <p className="text-[12px] text-text-muted">稟議</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
              {pendingApps.map((a) => (
                <Link key={a.id} href="/applications">
                  <div className="flex items-center gap-3 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <ClipboardCheck className="w-4 h-4 text-[#22C55E] shrink-0" strokeWidth={1.75} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{a.title}</p>
                      <p className="text-[12px] text-text-muted">{a.type_label}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
              <h2 className="text-[18px] font-bold text-text-primary tracking-tight">最近の変更</h2>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-[13px] text-text-muted">最近の変更はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentActivity.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className="flex items-center gap-3 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{item.title}</p>
                      <p className="text-[12px] text-text-muted">
                        {item.type} / {item.status}
                      </p>
                    </div>
                    <span className="text-[12px] text-text-muted shrink-0 tabular-nums">
                      {formatRelative(item.date)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
