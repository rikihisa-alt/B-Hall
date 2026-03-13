'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Crown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  FileText,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Target,
} from 'lucide-react'

/* ── Mock Data ── */

const kpis = [
  { label: '月間売上', value: '840', prefix: '¥', suffix: '万', change: 12.3, up: true, color: '#22C55E' },
  { label: '営業利益率', value: '18.2', suffix: '%', change: 2.1, up: true, color: '#2563EB' },
  { label: '従業員数', value: '48', suffix: '名', change: 3, up: true, color: '#3B82F6' },
  { label: 'リスク案件', value: '3', suffix: '件', change: 1, up: true, color: '#EF4444' },
]

const pendingDecisions = [
  { title: '新規事業投資（AI事業部立ち上げ）', amount: '¥2,400万', type: '稟議', urgency: 'high' as const, date: '3/10' },
  { title: 'オフィス移転計画承認', amount: '¥800万', type: '稟議', urgency: 'medium' as const, date: '3/12' },
  { title: '新規採用5名計画', amount: '¥150万/月', type: '人事', urgency: 'medium' as const, date: '3/14' },
  { title: '情報セキュリティ対策費', amount: '¥320万', type: '総務', urgency: 'low' as const, date: '3/18' },
]

const riskItems = [
  { title: '離職率が業界平均を超過', status: '要対策', category: '人事', severity: 'high' as const },
  { title: '契約更新期限 2件（3月末）', status: '確認中', category: '法務', severity: 'medium' as const },
  { title: '月次決算の遅延リスク', status: '監視中', category: '経理', severity: 'low' as const },
]

const urgencyStyles: Record<string, string> = {
  high: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
  medium: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
  low: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border-[rgba(59,130,246,0.3)]',
}

const urgencyLabels: Record<string, string> = {
  high: '緊急',
  medium: '重要',
  low: '通常',
}

export default function ExecutivePage() {
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
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">役員ダッシュボード</h1>
        <p className="text-[13px] text-text-secondary mt-1">経営指標と意思決定状況</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{ borderLeftWidth: 3, borderLeftColor: kpi.color }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] text-text-muted">{kpi.label}</p>
              <div className={`flex items-center gap-1 text-[12px] font-semibold ${kpi.up && kpi.color !== '#EF4444' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {kpi.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {kpi.up ? '+' : ''}{kpi.change}{typeof kpi.change === 'number' && kpi.change % 1 !== 0 ? '%' : ''}
              </div>
            </div>
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>
              {kpi.prefix}{kpi.value}{kpi.suffix}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-5">
        {/* Pending Decisions */}
        <motion.div
          className="col-span-2 bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">未決裁案件</h2>
            <Link href="/ringi" className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              すべて表示
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-bg-base">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">案件名</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">金額</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">種別</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">緊急度</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">起票日</th>
                <th className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {pendingDecisions.map((item, i) => (
                <tr key={i} className="border-b border-border hover:bg-[rgba(255,255,255,0.03)] group transition-colors cursor-pointer">
                  <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{item.title}</td>
                  <td className="px-6 py-3.5 text-[13px] text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.amount}</td>
                  <td className="px-6 py-3.5 text-[13px] text-text-muted">{item.type}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${urgencyStyles[item.urgency]}`}>
                      {urgencyLabels[item.urgency]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.date}</td>
                  <td className="px-6 py-3.5">
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Risk Monitor */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">リスク監視</h2>
          </div>
          <div className="space-y-4">
            {riskItems.map((risk, i) => (
              <div key={i} className="p-4 rounded-[10px] bg-bg-elevated border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${urgencyStyles[risk.severity]}`}>
                    {risk.status}
                  </span>
                  <span className="text-[11px] text-text-muted">{risk.category}</span>
                </div>
                <p className="text-[13px] font-medium text-text-primary">{risk.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
