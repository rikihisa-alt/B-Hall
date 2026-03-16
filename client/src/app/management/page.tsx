'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
  PieChart as RePieChart, Pie, Cell,
} from 'recharts'
import { fadeUp, staggerContainer } from '@/lib/animation'
import { useCountUp } from '@/lib/use-count-up'
import { useTaskStore } from '@/stores/task-store'
import { useRingiStore } from '@/stores/ringi-store'
import { useApplicationStore } from '@/stores/application-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { useAuth } from '@/hooks/use-auth'
import { isOverdue } from '@/lib/date'
import {
  Users,
  ListChecks,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  UserPlus,
  UserMinus,
} from 'lucide-react'

/* ── Mock Revenue Data (no accounting store yet) ── */
const revenueData = [
  { month: '10月', revenue: 720, expense: 580 },
  { month: '11月', revenue: 690, expense: 560 },
  { month: '12月', revenue: 810, expense: 620 },
  { month: '1月', revenue: 780, expense: 600 },
  { month: '2月', revenue: 820, expense: 640 },
  { month: '3月', revenue: 840, expense: 660 },
]

/* ── Chart Tooltip ── */
function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-bg-elevated border border-border rounded-[10px] px-4 py-3 shadow-lg">
      <p className="text-[12px] text-text-muted mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>
          <span className="text-text-secondary">{p.name === 'revenue' ? '売上' : '費用'}: </span>
          <span className="text-text-primary">{'\u00A5'}{p.value}万</span>
        </p>
      ))}
    </div>
  )
}

/* ── Metric Card ── */
function MetricCard({ label, value, suffix, icon: Icon, color, delay }: {
  label: string; value: number; suffix?: string;
  icon: typeof Users; color: string; delay: number
}) {
  const count = useCountUp(value, 1200, delay)
  return (
    <motion.div
      variants={fadeUp}
      className="bg-bg-surface border border-border rounded-[16px] p-3 md:p-5 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-2xl md:text-[36px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
        {count}<span className="text-[14px] md:text-[16px] text-text-muted ml-1">{suffix}</span>
      </p>
      <p className="text-[13px] text-text-muted">{label}</p>
    </motion.div>
  )
}

/* ── Page ── */
export default function ManagementPage() {
  const { mounted, getUserName } = useAuth()
  const { getActiveTasks } = useTaskStore()
  const { getRingis } = useRingiStore()
  const { getApplications } = useApplicationStore()
  const { getEmployees } = useEmployeeStore()

  const tasks = useMemo(() => (mounted ? getActiveTasks() : []), [mounted, getActiveTasks])
  const ringis = useMemo(() => (mounted ? getRingis() : []), [mounted, getRingis])
  const applications = useMemo(() => (mounted ? getApplications() : []), [mounted, getApplications])
  const employees = useMemo(() => (mounted ? getEmployees() : []), [mounted, getEmployees])

  // Metrics
  const employeeCount = employees.length
  const pendingTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').length
  const approvingRingis = ringis.filter((r) => r.status === 'approving' || r.status === 'submitted').length
  const approvingApps = applications.filter((a) => a.status === 'approving' || a.status === 'submitted').length

  // Department task breakdown
  const deptTaskData = useMemo(() => {
    const deptMap: Record<string, { todo: number; in_progress: number; done: number }> = {}
    tasks.forEach((t) => {
      const dept = t.department || '未分類'
      if (!deptMap[dept]) deptMap[dept] = { todo: 0, in_progress: 0, done: 0 }
      if (t.status === 'todo') deptMap[dept].todo++
      else if (t.status === 'in_progress' || t.status === 'reviewing' || t.status === 'approving') deptMap[dept].in_progress++
      else if (t.status === 'done') deptMap[dept].done++
    })
    return Object.entries(deptMap).map(([name, counts]) => ({
      name,
      ...counts,
    }))
  }, [tasks])

  // High-value ringis (> 100万)
  const highValueRingis = useMemo(() => {
    return ringis
      .filter((r) => r.amount && r.amount >= 1000000)
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
  }, [ringis])

  // Overdue tasks
  const overdueTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.due_date && isOverdue(t.due_date) && t.status !== 'done' && t.status !== 'cancelled'
    )
  }, [tasks])

  // Employee by department
  const empByDept = useMemo(() => {
    const deptMap: Record<string, number> = {}
    employees.forEach((e) => {
      const dept = e.department || '未分類'
      deptMap[dept] = (deptMap[dept] || 0) + 1
    })
    const colors = ['#4F46E5', '#3B82F6', '#60A5FA', '#22C55E', '#F59E0B', '#8B5CF6']
    return Object.entries(deptMap).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }))
  }, [employees])

  // Status badge
  const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'rgba(156,163,175,0.08)', text: '#9CA3AF', label: '下書き' },
    submitted: { bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', label: '提出済' },
    approving: { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', label: '承認待ち' },
    approved: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E', label: '承認済' },
    rejected: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', label: '却下' },
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-64 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-bg-elevated rounded-[16px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 280, damping: 28 }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-[13px] mb-4">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-secondary font-medium">経営</span>
        </nav>
        <h1 className="text-xl md:text-[28px] font-bold text-text-primary tracking-[-0.02em]">経営ダッシュボード</h1>
        <p className="text-[15px] text-text-secondary mt-1">会社全体の状況を一画面で把握</p>
      </div>

      {/* Metrics */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        <MetricCard label="従業員数" value={employeeCount} suffix="名" icon={Users} color="#3B82F6" delay={0} />
        <MetricCard label="未処理タスク" value={pendingTasks} suffix="件" icon={ListChecks} color="#F59E0B" delay={150} />
        <MetricCard label="承認待ち稟議" value={approvingRingis} suffix="件" icon={FileText} color="#4F46E5" delay={300} />
        <MetricCard label="未承認申請" value={approvingApps} suffix="件" icon={ClipboardCheck} color="#22C55E" delay={450} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
        {/* Revenue Chart */}
        <motion.div
          className="lg:col-span-2 bg-bg-surface border border-border rounded-[16px] p-4 md:p-6 shadow-card"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-text-primary">月次収支推移</h2>
            <span className="text-[12px] text-text-muted">過去6ヶ月</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="mFillRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#mFillRev)" />
              <Area type="monotone" dataKey="expense" name="expense" stroke="#F59E0B" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Employee by Department Pie */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] p-6 shadow-card"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.25 }}
        >
          <h2 className="text-[18px] font-bold text-text-primary mb-4">人員構成</h2>
          {empByDept.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RePieChart>
                  <Pie data={empByDept} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                    {empByDept.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {empByDept.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-text-primary font-semibold tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.value}名</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[13px] text-text-muted text-center py-8">データなし</p>
          )}
        </motion.div>
      </div>

      {/* Department Tasks + High Value Ringis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8">
        {/* Department Tasks Bar Chart */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] p-4 md:p-6 shadow-card"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
        >
          <h2 className="text-[18px] font-bold text-text-primary mb-5">部門別タスク状況</h2>
          {deptTaskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptTaskData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload) return null
                    return (
                      <div className="bg-bg-elevated border border-border rounded-[10px] px-4 py-3 shadow-lg">
                        <p className="text-[12px] text-text-muted mb-1">{label}</p>
                        {payload.map((p, i) => (
                          <p key={i} className="text-[12px]" style={{ color: p.color }}>
                            {p.name === 'todo' ? '未着手' : p.name === 'in_progress' ? '進行中' : '完了'}: {String(p.value)}
                          </p>
                        ))}
                      </div>
                    )
                  }}
                />
                <Bar dataKey="todo" name="todo" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="in_progress" name="in_progress" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="done" name="done" fill="#22C55E" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[13px] text-text-muted text-center py-8">タスクデータなし</p>
          )}
        </motion.div>

        {/* High Value Ringis */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary">重要稟議</h2>
            <Link href="/ringi" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて表示
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {highValueRingis.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-[13px] text-text-muted">100万円以上の稟議はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {highValueRingis.map((r) => {
                const badge = statusBadge[r.status] || statusBadge.draft
                return (
                  <Link key={r.id} href="/ringi">
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-text-primary truncate">{r.title}</p>
                        <p className="text-[12px] text-text-muted mt-0.5">
                          {r.departments.join(', ')}
                        </p>
                      </div>
                      <span
                        className="text-[14px] font-bold tabular-nums shrink-0"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {'\u00A5'}{(r.amount || 0).toLocaleString()}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0"
                        style={{ background: badge.bg, color: badge.text, borderColor: `${badge.text}25` }}
                      >
                        {badge.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Risk / Alerts */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
          <h2 className="text-[18px] font-bold text-text-primary">リスク・アラート</h2>
        </div>
        <div className="divide-y divide-border">
          {overdueTasks.length > 0 ? (
            overdueTasks.slice(0, 5).map((t) => (
              <Link key={t.id} href="/tasks">
                <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-text-primary truncate">
                      期限超過: {t.title}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      担当: {getUserName(t.assignee_id)} / {t.department}
                    </p>
                  </div>
                  <span className="text-[12px] text-[#EF4444] font-semibold shrink-0">
                    <Clock className="w-3 h-3 inline mr-1" />
                    期限切れ
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-[13px] text-text-muted">現在アラートはありません</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
