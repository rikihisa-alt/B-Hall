'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Workflow,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ChevronRight,
  RotateCcw,
  Stamp,
} from 'lucide-react'

/* ── Mock Data ── */

const stats = [
  { label: '進行中フロー', value: '14', color: '#3B82F6' },
  { label: '承認待ち', value: '5', color: '#F59E0B' },
  { label: '期限超過', value: '2', color: '#EF4444' },
  { label: '今月完了', value: '23', color: '#22C55E' },
]

const activeFlows = [
  { title: '3月度 経費精算承認', type: '申請・承認', step: '部長承認', status: '承認待ち' as const, assignee: '鈴木一郎', created: '3/10' },
  { title: '新入社員オンボーディング', type: 'タスクフロー', step: '書類回収', status: '進行中' as const, assignee: '佐藤花子', created: '3/12' },
  { title: '備品購入申請（モニター5台）', type: '申請・承認', step: '管理部承認', status: '承認待ち' as const, assignee: '伊藤恵', created: '3/13' },
  { title: 'NDA契約書レビュー', type: '稟議', step: '法務確認', status: '進行中' as const, assignee: '高橋美咲', created: '3/11' },
  { title: '月次報告書提出', type: '定期タスク', step: '作成中', status: '進行中' as const, assignee: '田中次郎', created: '3/14' },
]

const recentApprovals = [
  { title: '交通費精算 2月分', approver: '山田太郎', result: '承認' as const, date: '3/13' },
  { title: '有給休暇申請（3/20-21）', approver: '鈴木一郎', result: '承認' as const, date: '3/12' },
  { title: 'ソフトウェア購入申請', approver: '山田太郎', result: '差戻し' as const, date: '3/11' },
  { title: '出張申請（大阪 3/25-26）', approver: '佐藤花子', result: '承認' as const, date: '3/10' },
]

const statusColors: Record<string, string> = {
  '承認待ち': '#F59E0B',
  '進行中': '#3B82F6',
  '完了': '#22C55E',
}

const statusBadge: Record<string, string> = {
  '承認待ち': 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[rgba(245,158,11,0.18)]',
  '進行中': 'bg-[rgba(59,130,246,0.08)] text-[#3B82F6] border-[rgba(59,130,246,0.18)]',
  '完了': 'bg-[rgba(34,197,94,0.08)] text-[#22C55E] border-[rgba(34,197,94,0.18)]',
}

const resultBadge: Record<string, string> = {
  '承認': 'bg-[rgba(34,197,94,0.08)] text-[#22C55E] border-[rgba(34,197,94,0.18)]',
  '差戻し': 'bg-[rgba(239,68,68,0.08)] text-[#EF4444] border-[rgba(239,68,68,0.18)]',
}

export default function OperationsPage() {
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
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <p className="text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>{s.value}</p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Flows Table */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden mb-8"
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

        <table className="w-full">
          <thead>
            <tr className="bg-bg-base">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">ステータス</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">フロー名</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">種別</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">現在ステップ</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">担当者</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">起票日</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {activeFlows.map((flow, i) => (
              <tr key={i} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] group transition-colors cursor-pointer">
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusBadge[flow.status] || ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[flow.status] || 'rgba(28,25,23,0.3)' }} />
                    {flow.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{flow.title}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-muted">{flow.type}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-secondary">{flow.step}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-secondary">{flow.assignee}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{flow.created}</td>
                <td className="px-6 py-3.5">
                  <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Recent Approvals */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            <h2 className="text-[18px] font-bold text-text-primary tracking-tight">最近の承認履歴</h2>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-bg-base">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">申請名</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">承認者</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">結果</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">日付</th>
            </tr>
          </thead>
          <tbody>
            {recentApprovals.map((item, i) => (
              <tr key={i} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer">
                <td className="px-6 py-3.5 text-[14px] font-medium text-text-primary">{item.title}</td>
                <td className="px-6 py-3.5 text-[13px] text-text-secondary">{item.approver}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${resultBadge[item.result] || ''}`}>
                    {item.result === '承認' ? <CheckCircle2 className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                    {item.result}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
