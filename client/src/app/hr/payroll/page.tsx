'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, staggerContainer, fadeUp } from '@/lib/animation'
import {
  ChevronRight,
  ChevronLeft,
  Banknote,
  Users,
  TrendingDown,
  Wallet,
  Send,
  Eye,
  FileText,
} from 'lucide-react'
import { usePayrollStore } from '@/stores/payroll-store'
import type { PaySlip } from '@/stores/payroll-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { useToast } from '@/components/ui/toast-provider'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ── 定数 ──

const STATUS_LABELS: Record<PaySlip['status'], string> = {
  draft: '下書き',
  confirmed: '確定',
  distributed: '配布済',
}

const STATUS_BADGE_VARIANT: Record<PaySlip['status'], 'neutral' | 'info' | 'success'> = {
  draft: 'neutral',
  confirmed: 'info',
  distributed: 'success',
}

const MONTHS = ['2026-01', '2026-02', '2026-03']
const MONTH_LABELS: Record<string, string> = {
  '2026-01': '2026年1月',
  '2026-02': '2026年2月',
  '2026-03': '2026年3月',
}

// ── ヘルパー ──

function yen(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

export default function PayrollPage() {
  const paySlips = usePayrollStore((s) => s.paySlips)
  const getMonthlyTotal = usePayrollStore((s) => s.getMonthlyTotal)
  const distributePaySlips = usePayrollStore((s) => s.distributePaySlips)
  const hydrated = usePayrollStore((s) => s._hydrated)
  const employees = useEmployeeStore((s) => s.employees)
  const empHydrated = useEmployeeStore((s) => s._hydrated)
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('2026-03')
  const [detailSlip, setDetailSlip] = useState<(PaySlip & { employeeName: string; department: string; position: string }) | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const monthlyTotal = useMemo(() => getMonthlyTotal(selectedMonth), [selectedMonth, paySlips, getMonthlyTotal])

  const monthSlips = useMemo(() => {
    return paySlips
      .filter((s) => s.year_month === selectedMonth)
      .map((slip) => {
        const emp = employees.find((e) => e.id === slip.employee_id)
        return { ...slip, employeeName: emp?.name || '不明', department: emp?.department || '', position: emp?.position || '' }
      })
      .sort((a, b) => b.gross_pay - a.gross_pay)
  }, [selectedMonth, paySlips, employees])

  const monthIndex = MONTHS.indexOf(selectedMonth)
  const canPrev = monthIndex > 0
  const canNext = monthIndex < MONTHS.length - 1
  const allDraftOrConfirmed = monthSlips.every((s) => s.status !== 'distributed')
  const hasDrafts = monthSlips.some((s) => s.status === 'draft')

  const handleDistribute = () => {
    distributePaySlips(selectedMonth)
    addToast('success', `${MONTH_LABELS[selectedMonth]}の給与明細を一括配布しました`)
  }

  if (!mounted || !hydrated || !empHydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link href="/hr" className="text-text-muted hover:text-text-primary transition-colors">人事・労務</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">給与管理</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">給与管理</h1>
          <p className="text-[13px] text-text-secondary mt-1">給与明細の管理・配布</p>
        </div>
        {allDraftOrConfirmed && monthSlips.length > 0 && (
          <Button icon={Send} onClick={handleDistribute}>
            一括配布
          </Button>
        )}
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => canPrev && setSelectedMonth(MONTHS[monthIndex - 1])}
          disabled={!canPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
        </button>
        <h2 className="text-[17px] font-semibold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
          {MONTH_LABELS[selectedMonth] || selectedMonth}
        </h2>
        <button
          onClick={() => canNext && setSelectedMonth(MONTHS[monthIndex + 1])}
          disabled={!canNext}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
        </button>
      </div>

      {/* Summary cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: '支給総額', value: yen(monthlyTotal.total_gross), icon: Banknote, color: '#3B82F6' },
          { label: '控除総額', value: yen(monthlyTotal.total_deductions), icon: TrendingDown, color: '#EF4444' },
          { label: '差引支給額', value: yen(monthlyTotal.total_net), icon: Wallet, color: '#22C55E' },
          { label: '対象人数', value: `${monthlyTotal.employee_count}名`, icon: Users, color: '#8B5CF6' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.75} />
              </div>
              <span className="text-[12px] text-text-muted">{stat.label}</span>
            </div>
            <p className="text-[22px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pay slip list */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">給与明細一覧</h2>
        <div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border">
          {monthSlips.map((slip) => (
            <button
              key={slip.id}
              className="w-full text-left"
              onClick={() => setDetailSlip(slip)}
            >
              <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                  {slip.employeeName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight">{slip.employeeName}</p>
                  <p className="text-[12px] text-text-muted">{slip.department} / {slip.position}</p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-[15px] font-bold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {yen(slip.net_pay)}
                  </p>
                  <p className="text-[11px] text-text-muted">差引支給額</p>
                </div>
                <Badge variant={STATUS_BADGE_VARIANT[slip.status]} label={STATUS_LABELS[slip.status]} />
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
              </div>
            </button>
          ))}

          {monthSlips.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" strokeWidth={1.25} />
              <p className="text-[15px] font-semibold text-text-secondary mb-1">給与明細はまだありません</p>
              <p className="text-[13px] text-text-muted">新しい給与明細を作成しましょう</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── 給与明細詳細モーダル ── */}
      <Modal
        open={!!detailSlip}
        onClose={() => setDetailSlip(null)}
        title={detailSlip ? `${detailSlip.employeeName} - ${MONTH_LABELS[detailSlip.year_month] || detailSlip.year_month}` : '給与明細'}
        size="md"
        footer={<Button variant="ghost" onClick={() => setDetailSlip(null)}>閉じる</Button>}
      >
        {detailSlip && (() => {
          const emp = employees.find((e) => e.id === detailSlip.employee_id)
          return (
            <div className="space-y-5">
              {/* Employee info */}
              <div className="flex items-center gap-3 p-4 rounded-[12px] bg-bg-base border border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                  {(emp?.name || '?').charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">{emp?.name}</p>
                  <p className="text-[12px] text-text-muted">{emp?.department} / {emp?.position}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant={STATUS_BADGE_VARIANT[detailSlip.status]} label={STATUS_LABELS[detailSlip.status]} />
                </div>
              </div>

              {/* 支給 */}
              <div>
                <h3 className="text-[13px] font-semibold text-text-secondary mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  支給
                </h3>
                <div className="rounded-[12px] bg-bg-base border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {[
                      { label: '基本給', value: detailSlip.base_salary },
                      { label: '残業手当', value: detailSlip.overtime_pay },
                      { label: '通勤手当', value: detailSlip.commuting_allowance },
                      { label: 'その他手当', value: detailSlip.other_allowances },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-[13px] text-text-secondary">{item.label}</span>
                        <span className="text-[13px] font-medium text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                          {yen(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-[rgba(59,130,246,0.04)] border-t border-border">
                    <span className="text-[13px] font-semibold text-text-primary">支給合計</span>
                    <span className="text-[14px] font-bold text-[#3B82F6] tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {yen(detailSlip.gross_pay)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 控除 */}
              <div>
                <h3 className="text-[13px] font-semibold text-text-secondary mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  控除
                </h3>
                <div className="rounded-[12px] bg-bg-base border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {[
                      { label: '健康保険', value: detailSlip.health_insurance },
                      { label: '厚生年金', value: detailSlip.pension_insurance },
                      { label: '雇用保険', value: detailSlip.employment_insurance },
                      { label: '所得税', value: detailSlip.income_tax },
                      { label: '住民税', value: detailSlip.resident_tax },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-[13px] text-text-secondary">{item.label}</span>
                        <span className="text-[13px] font-medium text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                          -{yen(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-[rgba(239,68,68,0.04)] border-t border-border">
                    <span className="text-[13px] font-semibold text-text-primary">控除合計</span>
                    <span className="text-[14px] font-bold text-[#EF4444] tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      -{yen(detailSlip.total_deductions)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 差引支給額 */}
              <div className="p-5 rounded-[12px] bg-gradient-to-r from-[rgba(79,70,229,0.08)] to-[rgba(99,102,241,0.08)] border border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] text-text-muted mb-0.5">差引支給額</p>
                    <p className="text-[11px] text-text-muted">
                      支給合計 {yen(detailSlip.gross_pay)} - 控除合計 {yen(detailSlip.total_deductions)}
                    </p>
                  </div>
                  <p className="text-[28px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
                    {yen(detailSlip.net_pay)}
                  </p>
                </div>
              </div>
            </div>
          )
        })()}
      </Modal>
    </motion.div>
  )
}
