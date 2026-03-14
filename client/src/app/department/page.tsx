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
import {
  Building2,
  Users,
  ListChecks,
  FileText,
  ClipboardCheck,
  ChevronRight,
  ArrowUpRight,
  User,
} from 'lucide-react'

const statusLabels: Record<string, string> = {
  todo: '未着手',
  in_progress: '進行中',
  reviewing: '確認待ち',
  approving: '承認待ち',
  done: '完了',
  rejected: '差戻し',
  on_hold: '保留',
  cancelled: '中止',
}

const statusColors: Record<string, string> = {
  todo: '#9CA3AF',
  in_progress: '#3B82F6',
  reviewing: '#8B5CF6',
  approving: '#F59E0B',
  done: '#22C55E',
  rejected: '#EF4444',
  on_hold: '#6B7280',
  cancelled: '#9CA3AF',
}

const priorityLabels: Record<string, string> = {
  urgent: '緊急',
  high: '重要',
  medium: '通常',
  low: '低',
}

const priorityColors: Record<string, string> = {
  urgent: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#9CA3AF',
}

const employmentLabels: Record<string, string> = {
  full_time: '正社員',
  part_time: 'パートタイム',
  contract: '契約社員',
  temporary: '派遣社員',
}

export default function DepartmentPage() {
  const { currentUser, mounted, getUserName } = useAuth()
  const { getActiveTasks } = useTaskStore()
  const { getRingis } = useRingiStore()
  const { getApplications } = useApplicationStore()
  const { getEmployees } = useEmployeeStore()

  const myDept = currentUser?.department || ''

  const tasks = useMemo(() => (mounted ? getActiveTasks() : []), [mounted, getActiveTasks])
  const ringis = useMemo(() => (mounted ? getRingis() : []), [mounted, getRingis])
  const applications = useMemo(() => (mounted ? getApplications() : []), [mounted, getApplications])
  const employees = useMemo(() => (mounted ? getEmployees() : []), [mounted, getEmployees])

  // Filter by department
  const deptEmployees = useMemo(() => employees.filter((e) => e.department === myDept), [employees, myDept])
  const deptTasks = useMemo(() => tasks.filter((t) => t.department === myDept), [tasks, myDept])
  const deptRingis = useMemo(() => ringis.filter((r) => r.departments.includes(myDept)), [ringis, myDept])
  const deptApps = useMemo(() => {
    const deptUserIds = deptEmployees.map((e) => e.user_id)
    return applications.filter((a) => deptUserIds.includes(a.applicant_id))
  }, [applications, deptEmployees])

  // Stats
  const activeTasks = deptTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length
  const completedTasks = deptTasks.filter((t) => t.status === 'done').length
  const completionRate = deptTasks.length > 0 ? Math.round((completedTasks / deptTasks.length) * 100) : 0

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
        <span className="text-text-secondary font-medium">部門</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">{myDept || '部門'}</h1>
            <p className="text-[13px] text-text-secondary">部門の業務状況と構成メンバー</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-4 gap-4 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        {[
          { label: 'メンバー', value: deptEmployees.length, suffix: '名', color: '#3B82F6', icon: Users },
          { label: '進行中タスク', value: activeTasks, suffix: '件', color: '#F59E0B', icon: ListChecks },
          { label: 'タスク完了率', value: completionRate, suffix: '%', color: '#22C55E', icon: ListChecks },
          { label: '関連稟議', value: deptRingis.length, suffix: '件', color: '#4F46E5', icon: FileText },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.75} />
            </div>
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>
              {s.value}<span className="text-[14px] text-text-muted ml-1">{s.suffix}</span>
            </p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Members */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">メンバー</h2>
          </div>
          {deptEmployees.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Users className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[13px] text-text-muted">メンバーがいません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deptEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                    <span className="text-[13px] font-semibold text-accent">
                      {emp.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{emp.name}</p>
                    <p className="text-[12px] text-text-muted">{emp.position}</p>
                  </div>
                  <span className="text-[11px] text-text-muted bg-bg-elevated px-2 py-0.5 rounded-md shrink-0">
                    {employmentLabels[emp.employment_type] || emp.employment_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Department Tasks */}
        <motion.div
          className="col-span-2 bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">タスク</h2>
            <Link href="/tasks" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて表示
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {deptTasks.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <ListChecks className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-[13px] text-text-muted">タスクはありません</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-bg-base">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">ステータス</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">タスク名</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">優先度</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">担当者</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {deptTasks
                  .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
                  .slice(0, 6)
                  .map((t) => (
                    <tr key={t.id} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer">
                      <td className="px-6 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border"
                          style={{
                            background: `${statusColors[t.status]}10`,
                            color: statusColors[t.status],
                            borderColor: `${statusColors[t.status]}25`,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[t.status] }} />
                          {statusLabels[t.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{t.title}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: priorityColors[t.priority] }}
                        >
                          {priorityLabels[t.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-text-secondary">{getUserName(t.assignee_id)}</td>
                      <td className="px-6 py-3.5">
                        <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* Department Apps + Ringis */}
      <div className="grid grid-cols-2 gap-5">
        {/* Department Applications */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
              <h2 className="text-[18px] font-bold text-text-primary tracking-tight">申請</h2>
            </div>
            <Link href="/applications" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {deptApps.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-[13px] text-text-muted">申請はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deptApps.slice(0, 5).map((a) => {
                const badge: Record<string, { bg: string; text: string; label: string }> = {
                  draft: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '下書き' },
                  submitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '提出済' },
                  approving: { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', label: '承認待ち' },
                  approved: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E', label: '承認済' },
                  rejected: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', label: '却下' },
                  resubmitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '再提出' },
                  withdrawn: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '取下げ' },
                }
                const b = badge[a.status] || badge.draft
                return (
                  <div key={a.id} className="flex items-center gap-3 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{a.title}</p>
                      <p className="text-[12px] text-text-muted">{a.type_label} / {getUserName(a.applicant_id)}</p>
                    </div>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0"
                      style={{ background: b.bg, color: b.text, borderColor: `${b.text}25` }}
                    >
                      {b.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Department Ringis */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
              <h2 className="text-[18px] font-bold text-text-primary tracking-tight">稟議</h2>
            </div>
            <Link href="/ringi" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {deptRingis.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-[13px] text-text-muted">関連する稟議はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deptRingis.slice(0, 5).map((r) => {
                const badge: Record<string, { bg: string; text: string; label: string }> = {
                  draft: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '下書き' },
                  submitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '提出済' },
                  approving: { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', label: '承認待ち' },
                  approved: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E', label: '承認済' },
                  rejected: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', label: '却下' },
                }
                const b = badge[r.status] || badge.draft
                return (
                  <div key={r.id} className="flex items-center gap-3 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{r.title}</p>
                      <p className="text-[12px] text-text-muted">
                        {r.amount ? `\u00A5${r.amount.toLocaleString()}` : '金額未設定'}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0"
                      style={{ background: b.bg, color: b.text, borderColor: `${b.text}25` }}
                    >
                      {b.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
