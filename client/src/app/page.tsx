'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ListTodo,
  Clock,
  Wallet,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useCountUp } from '@/lib/use-count-up'
import { fadeUp, staggerContainer } from '@/lib/animation'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import {
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from '@/lib/constants'
import { formatDateCompact } from '@/lib/date'

/* ── Mock Data (chart + activities kept unchanged) ── */

const chartData = [
  { month: '10月', revenue: 4200, expense: 2800 },
  { month: '11月', revenue: 3800, expense: 2600 },
  { month: '12月', revenue: 5100, expense: 3200 },
  { month: '1月', revenue: 4600, expense: 2900 },
  { month: '2月', revenue: 4900, expense: 3100 },
  { month: '3月', revenue: 5400, expense: 3400 },
]

const activities = [
  { time: '14:32', text: '田中太郎が経費申請を提出', type: 'info' as const },
  { time: '13:15', text: '稟議 #RG-042 が承認されました', type: 'success' as const },
  { time: '11:40', text: '新入社員の入社手続きを開始', type: 'info' as const },
  { time: '10:20', text: '月次レポートの締切が近づいています', type: 'warning' as const },
  { time: '09:05', text: '契約書 NDA-2024-03 が更新期限', type: 'danger' as const },
]

const statusColors: Record<string, string> = {
  '進行中': '#3B82F6',
  '未着手': 'rgba(28,25,23,0.25)',
  '承認待ち': '#F59E0B',
  '確認待ち': '#F59E0B',
  '完了': '#22C55E',
  '差戻し': '#EF4444',
  '保留': 'rgba(28,25,23,0.25)',
  '中止': 'rgba(28,25,23,0.25)',
}

const priorityLabels: Record<string, string> = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
}

const priorityStyles: Record<string, string> = {
  '緊急': 'bg-[rgba(239,68,68,0.08)] text-[#DC2626] border-[rgba(239,68,68,0.18)]',
  '高': 'bg-[rgba(239,68,68,0.08)] text-[#DC2626] border-[rgba(239,68,68,0.18)]',
  '中': 'bg-[rgba(59,130,246,0.08)] text-[#2563EB] border-[rgba(59,130,246,0.18)]',
  '低': 'bg-[rgba(28,25,23,0.04)] text-text-muted border-border',
}

/* ── Metric Card ── */
function MetricCard({ label, value, prefix, suffix, change, up, icon: Icon, color, delay }: {
  label: string; value: number; prefix?: string; suffix?: string;
  change: number; up: boolean; icon: typeof ListTodo; color: string; delay: number
}) {
  const count = useCountUp(value, 1200, delay)
  return (
    <motion.div
      variants={fadeUp}
      className="bg-bg-surface border border-border rounded-[16px] p-3 md:p-5 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-default"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={1.75} />
        </div>
        {change !== 0 && (
          <div className={`flex items-center gap-1 text-[12px] font-semibold ${up ? 'text-success' : 'text-danger'}`}>
            {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {up ? '+' : ''}{change}{typeof change === 'number' && change % 1 !== 0 ? '%' : ''}
          </div>
        )}
      </div>
      <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
        {prefix}{count}{suffix}
      </p>
      <p className="text-[13px] text-text-muted">{label}</p>
    </motion.div>
  )
}

/* ── Custom Chart Tooltip ── */
function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-bg-elevated border border-border rounded-[10px] px-4 py-3 shadow-lg">
      <p className="text-[12px] text-text-muted mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>
          <span className="text-text-secondary">{p.name === 'revenue' ? '収入' : '支出'}: </span>
          <span className="text-text-primary">¥{p.value.toLocaleString()}万</span>
        </p>
      ))}
    </div>
  )
}

/* ── Page ── */
export default function HomePage() {
  const router = useRouter()
  const getActiveTasks = useTaskStore((s) => s.getActiveTasks)
  const hydrated = useTaskStore((s) => s._hydrated)
  const users = useAuthStore((s) => s.users)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Real task data for metrics and recent tasks
  const allTasks = useMemo(() => {
    if (!mounted || !hydrated) return []
    return getActiveTasks()
  }, [mounted, hydrated, getActiveTasks])

  const unprocessedCount = useMemo(() => {
    return allTasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').length
  }, [allTasks])

  const recentTasks = useMemo(() => {
    return [...allTasks]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  }, [allTasks])

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || '未割当'
  }

  const metrics = [
    { label: '未処理タスク', value: mounted && hydrated ? unprocessedCount : 12, change: -3, up: false, icon: ListTodo, color: '#4F46E5' },
    { label: '承認待ち', value: 5, change: 2, up: true, icon: Clock, color: '#F59E0B' },
    { label: '今月の経費', value: 320, prefix: '¥', suffix: '万', change: 8.4, up: true, icon: Wallet, color: '#22C55E' },
    { label: '未読通知', value: 3, change: 0, up: false, icon: Bell, color: '#3B82F6' },
  ]

  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 280, damping: 28 }}
    >
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[13px] text-text-muted mb-1">{dateStr}</p>
          <h1 className="text-2xl md:text-[28px] font-semibold text-text-primary tracking-[-0.02em]">ダッシュボード</h1>
          <p className="text-sm md:text-[15px] text-text-secondary mt-1">業務全体の状況を確認できます</p>
        </div>
        <Link href="/tasks" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-[#6366F1] text-white font-semibold px-5 h-11 md:h-10 rounded-[10px] text-[14px] shadow-[0_0_20px_rgba(79,70,229,0.25)] hover:-translate-y-[2px] hover:shadow-[0_0_28px_rgba(79,70,229,0.35)] active:translate-y-0 transition-all duration-200">
          <ListTodo className="w-4 h-4" strokeWidth={2} />
          タスク一覧
        </Link>
      </div>

      {/* Metric Cards — 4 columns */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 150} />
        ))}
      </motion.div>

      {/* Chart + Activity — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
        {/* Area Chart */}
        <motion.div
          className="lg:col-span-2 bg-bg-surface border border-border rounded-[16px] p-4 md:p-6 shadow-card"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">収支推移</h2>
            <span className="text-[12px] text-text-muted">過去6ヶ月</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(28,25,23,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#fillRevenue)" />
              <Area type="monotone" dataKey="expense" name="expense" stroke="#F59E0B" strokeWidth={2} fill="url(#fillExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] p-4 md:p-6 shadow-card"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary tracking-tight mb-4 md:mb-5">最近の活動</h2>
          <div className="space-y-4">
            {activities.map((a, i) => {
              const dotColor = a.type === 'success' ? '#22C55E' : a.type === 'warning' ? '#F59E0B' : a.type === 'danger' ? '#EF4444' : '#3B82F6'
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                    {i < activities.length - 1 && <div className="w-px h-8 bg-border mt-1" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-text-primary leading-snug">{a.text}</p>
                    <p className="text-[11px] text-text-muted mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks Table */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
          <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary tracking-tight">直近のタスク</h2>
          <Link href="/tasks" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
            すべて表示
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {mounted && hydrated && recentTasks.length > 0 ? (
            recentTasks.map((task) => {
              const statusLabel = TASK_STATUS_LABELS[task.status]
              const pLabel = priorityLabels[task.priority] || '中'
              return (
                <div
                  key={task.id}
                  className="px-4 py-3 active:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[statusLabel] || 'rgba(28,25,23,0.25)' }} />
                    <span className="text-[12px] text-text-secondary">{statusLabel}</span>
                    <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${priorityStyles[pLabel] || ''}`}>
                      {pLabel}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-text-primary mb-1.5">{task.title}</p>
                  <div className="flex items-center gap-3 text-[12px] text-text-muted">
                    <span>{getUserName(task.assignee_id)}</span>
                    <span style={{ fontFamily: 'var(--font-inter)' }}>
                      {task.due_date ? formatDateCompact(task.due_date) : '-'}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3 space-y-2">
                <div className="h-3 w-20 bg-bg-elevated rounded animate-pulse" />
                <div className="h-4 w-48 bg-bg-elevated rounded animate-pulse" />
                <div className="h-3 w-32 bg-bg-elevated rounded animate-pulse" />
              </div>
            ))
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
            {mounted && hydrated && recentTasks.length > 0 ? (
              recentTasks.map((task) => {
                const statusLabel = TASK_STATUS_LABELS[task.status]
                const pLabel = priorityLabels[task.priority] || '中'
                return (
                  <tr
                    key={task.id}
                    className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer"
                    style={{ borderLeftWidth: 3, borderLeftColor: 'transparent' }}
                    onClick={() => router.push(`/tasks/${task.id}`)}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[statusLabel] || 'rgba(28,25,23,0.25)' }} />
                        <span className="text-[13px] text-text-secondary">{statusLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{task.title}</td>
                    <td className="px-6 py-3.5 text-[13px] text-text-muted">{task.category}</td>
                    <td className="px-6 py-3.5 text-[13px] text-text-secondary">{getUserName(task.assignee_id)}</td>
                    <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
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
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-6 py-3.5"><div className="h-4 w-16 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-40 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-12 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-20 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-12 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-8 bg-bg-elevated rounded animate-pulse" /></td>
                  <td className="px-6 py-3.5"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
