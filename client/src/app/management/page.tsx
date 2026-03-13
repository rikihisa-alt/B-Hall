'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  DollarSign,
  BarChart3,
  FileText,
  PieChart,
  Target,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart as RePieChart, Pie, Cell,
} from 'recharts'
import { useCountUp } from '@/lib/use-count-up'
import { fadeUp, staggerContainer } from '@/lib/animation'

/* ── Mock Data ── */

const metrics = [
  { label: '月間売上', value: 840, prefix: '¥', suffix: '万', change: 12.3, up: true, icon: DollarSign, color: '#22C55E' },
  { label: '営業利益', value: 153, prefix: '¥', suffix: '万', change: 18.2, up: true, icon: TrendingUp, color: '#2563EB' },
  { label: '従業員数', value: 48, suffix: '名', change: 3, up: true, icon: Users, color: '#3B82F6' },
  { label: 'リスク案件', value: 3, suffix: '件', change: 1, up: true, icon: AlertTriangle, color: '#EF4444' },
]

const revenueData = [
  { month: '10月', revenue: 720, expense: 580 },
  { month: '11月', revenue: 690, expense: 560 },
  { month: '12月', revenue: 810, expense: 620 },
  { month: '1月', revenue: 780, expense: 600 },
  { month: '2月', revenue: 820, expense: 640 },
  { month: '3月', revenue: 840, expense: 660 },
]

const expenseBreakdown = [
  { name: '人件費', value: 420, color: '#2563EB' },
  { name: '設備費', value: 120, color: '#3B82F6' },
  { name: '外注費', value: 80, color: '#60A5FA' },
  { name: 'その他', value: 40, color: '#93C5FD' },
]

const alerts = [
  { text: '高額稟議 1件が未決裁（¥2,400万）', priority: 'high' as const, href: '/ringi' },
  { text: '契約更新期限 2件（3月末）', priority: 'medium' as const, href: '/documents' },
  { text: '離職率 2.1% — 業界平均超過', priority: 'low' as const, href: '/hr' },
]

const analysisLinks = [
  { name: '月次レポート', icon: FileText, href: '/management' },
  { name: '収支分析', icon: PieChart, href: '/management' },
  { name: '部門別分析', icon: BarChart3, href: '/management' },
  { name: '投資判断支援', icon: Target, href: '/management' },
]

const priorityColors = { high: '#EF4444', medium: '#F59E0B', low: '#3B82F6' }

/* ── Metric Card ── */
function MetricCard({ label, value, prefix, suffix, change, up, icon: Icon, color, delay }: {
  label: string; value: number; prefix?: string; suffix?: string;
  change: number; up: boolean; icon: typeof DollarSign; color: string; delay: number
}) {
  const count = useCountUp(value, 1200, delay)
  return (
    <motion.div
      variants={fadeUp}
      className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={1.75} />
        </div>
        <div className={`flex items-center gap-1 text-[12px] font-semibold ${up && label !== 'リスク案件' ? 'text-success' : 'text-danger'}`}>
          {up && label !== 'リスク案件' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change % 1 !== 0 ? `+${change}%` : `+${change}`}
        </div>
      </div>
      <p className="text-[36px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
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
          <span className="text-text-secondary">{p.name === 'revenue' ? '売上' : '費用'}: </span>
          <span className="text-text-primary">¥{p.value}万</span>
        </p>
      ))}
    </div>
  )
}

/* ── Page ── */
export default function ManagementPage() {
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
        <h1 className="text-[28px] font-bold text-text-primary tracking-[-0.02em]">経営ダッシュボード</h1>
        <p className="text-[15px] text-text-secondary mt-1">会社全体の状況を一画面で把握</p>
      </div>

      {/* Metrics */}
      <motion.div className="grid grid-cols-4 gap-5 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 150} />
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Revenue Chart */}
        <motion.div
          className="col-span-2 bg-bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-text-primary">売上・費用推移</h2>
            <span className="text-[12px] text-text-muted">過去6ヶ月</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="mFillRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(240,246,252,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(240,246,252,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#mFillRev)" />
              <Area type="monotone" dataKey="expense" name="expense" stroke="#F59E0B" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Pie */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.25 }}
        >
          <h2 className="text-[18px] font-bold text-text-primary mb-4">費用内訳</h2>
          <ResponsiveContainer width="100%" height={160}>
            <RePieChart>
              <Pie data={expenseBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none">
                {expenseBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <span className="text-text-primary font-semibold tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>¥{item.value}万</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Risk Alerts */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary">注意事項</h2>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((a, i) => (
              <Link key={i} href={a.href}>
                <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityColors[a.priority] }} />
                  <span className="flex-1 text-[14px] text-text-primary">{a.text}</span>
                  <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Analysis Links */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.35 }}
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary">分析ツール</h2>
          </div>
          <div className="divide-y divide-border">
            {analysisLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group">
                    <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
                    <span className="flex-1 text-[14px] font-medium text-text-primary">{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
