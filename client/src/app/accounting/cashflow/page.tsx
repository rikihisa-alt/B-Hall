'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAccountingStore } from '@/stores/accounting-store'
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface MonthlyData {
  year: number
  month: number
  label: string
  income: number
  expense: number
  net: number
  balance: number
}

interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
  isFixed: boolean
}

const FIXED_CATEGORIES = ['家賃', '給与', '通信費']

export default function CashflowPage() {
  const [mounted, setMounted] = useState(false)

  const transactions = useAccountingStore((s) => s.transactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  // -- 月別データ計算 (過去6ヶ月) --
  const monthlyData = useMemo((): MonthlyData[] => {
    if (!mounted) return []

    const activeTxns = transactions.filter((t) => !t.deleted_at)
    const now = new Date()
    const months: MonthlyData[] = []
    let runningBalance = 28400000 // 基準残高

    // 過去6ヶ月分を計算
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth()

      const monthTxns = activeTxns.filter((t) => {
        const td = new Date(t.date)
        return td.getFullYear() === year && td.getMonth() === month
      })

      const income = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expense = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      const net = income - expense
      runningBalance += net

      months.push({
        year,
        month: month + 1,
        label: `${year}/${String(month + 1).padStart(2, '0')}`,
        income,
        expense,
        net,
        balance: runningBalance,
      })
    }

    return months
  }, [mounted, transactions])

  // -- 費目別内訳 (今月) --
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    if (!mounted) return []

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const activeTxns = transactions.filter((t) => !t.deleted_at)

    // 過去3ヶ月の支出を集計（今月だけだとデータが少ない場合があるため）
    const recentExpenses = activeTxns.filter((t) => {
      if (t.type !== 'expense') return false
      const td = new Date(t.date)
      const monthDiff = (year - td.getFullYear()) * 12 + (month - td.getMonth())
      return monthDiff >= 0 && monthDiff < 3
    })

    const byCategory: Record<string, number> = {}
    recentExpenses.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })

    const totalExpense = Object.values(byCategory).reduce((s, v) => s + v, 0)

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        isFixed: FIXED_CATEGORIES.includes(category),
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [mounted, transactions])

  const fixedTotal = categoryBreakdown.filter((c) => c.isFixed).reduce((s, c) => s + c.amount, 0)
  const variableTotal = categoryBreakdown.filter((c) => !c.isFixed).reduce((s, c) => s + c.amount, 0)

  // バーチャートの最大値
  const maxAmount = useMemo(() => {
    if (monthlyData.length === 0) return 1
    return Math.max(...monthlyData.map((m) => Math.max(m.income, m.expense)))
  }, [monthlyData])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] animate-pulse w-48" />
        <div className="h-64 bg-bg-elevated rounded-[16px] animate-pulse" />
        <div className="h-48 bg-bg-elevated rounded-[16px] animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link href="/accounting" className="text-text-muted hover:text-text-primary transition-colors">経理・財務</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">キャッシュフロー</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">キャッシュフロー</h1>
        <p className="text-[13px] text-text-secondary mt-1">資金繰り・キャッシュフロー分析</p>
      </div>

      {/* Monthly Income vs Expense Bar Chart */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">月別収支推移</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
          variants={fadeUp}
        >
          {/* Legend */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success/70" />
              <span className="text-[12px] text-text-muted">収入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-danger/70" />
              <span className="text-[12px] text-text-muted">支出</span>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            {monthlyData.map((m) => (
              <div key={m.label} className="flex items-center gap-4">
                <div className="w-16 shrink-0">
                  <p className="text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {m.month}月
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {/* Income bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-5 bg-bg-elevated rounded-[6px] overflow-hidden">
                      <div
                        className="h-full bg-success/60 rounded-[6px] transition-all duration-500"
                        style={{ width: `${maxAmount > 0 ? (m.income / maxAmount) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-success font-medium tabular-nums w-24 text-right" style={{ fontFamily: 'var(--font-inter)' }}>
                      {m.income > 0 ? `+${m.income.toLocaleString()}` : '0'}
                    </span>
                  </div>
                  {/* Expense bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-5 bg-bg-elevated rounded-[6px] overflow-hidden">
                      <div
                        className="h-full bg-danger/60 rounded-[6px] transition-all duration-500"
                        style={{ width: `${maxAmount > 0 ? (m.expense / maxAmount) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-danger font-medium tabular-nums w-24 text-right" style={{ fontFamily: 'var(--font-inter)' }}>
                      {m.expense > 0 ? `-${m.expense.toLocaleString()}` : '0'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Running Balance Table */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">月次残高推移</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
        >
          {/* Table header */}
          <div className="flex items-center px-5 py-3 bg-bg-elevated/50 text-[12px] font-medium text-text-muted border-b border-border">
            <div className="w-20">月</div>
            <div className="flex-1 text-right">収入</div>
            <div className="flex-1 text-right">支出</div>
            <div className="flex-1 text-right">純収支</div>
            <div className="flex-1 text-right">月末残高</div>
          </div>

          <div className="divide-y divide-border">
            {monthlyData.map((m) => (
              <div key={m.label} className="flex items-center px-5 py-3.5 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="w-20">
                  <p className="text-[14px] font-medium text-text-primary">{m.label}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[14px] text-success tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {m.income > 0 ? `+${m.income.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[14px] text-danger tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {m.expense > 0 ? `-${m.expense.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className={cn(
                    'text-[14px] font-medium tabular-nums',
                    m.net >= 0 ? 'text-success' : 'text-danger'
                  )} style={{ fontFamily: 'var(--font-inter)' }}>
                    {m.net >= 0 ? '+' : ''}{m.net.toLocaleString()}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[14px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {m.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Cost Breakdown */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">費目別内訳（過去3ヶ月）</h2>
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fixed costs */}
          <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-[8px] bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-warning" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-text-primary">固定費</p>
                <p className="text-[12px] text-text-muted">
                  合計: <span className="font-medium tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{fixedTotal.toLocaleString()}円</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {categoryBreakdown.filter((c) => c.isFixed).map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-text-secondary">{item.category}</span>
                    <span className="text-[13px] font-medium text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.amount.toLocaleString()}円
                    </span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning/50 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 text-right" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.percentage}%
                  </p>
                </div>
              ))}
              {categoryBreakdown.filter((c) => c.isFixed).length === 0 && (
                <p className="text-[13px] text-text-muted text-center py-4">データなし</p>
              )}
            </div>
          </div>

          {/* Variable costs */}
          <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-[8px] bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-info" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-text-primary">変動費</p>
                <p className="text-[12px] text-text-muted">
                  合計: <span className="font-medium tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{variableTotal.toLocaleString()}円</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {categoryBreakdown.filter((c) => !c.isFixed).map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-text-secondary">{item.category}</span>
                    <span className="text-[13px] font-medium text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.amount.toLocaleString()}円
                    </span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-info/50 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 text-right" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.percentage}%
                  </p>
                </div>
              ))}
              {categoryBreakdown.filter((c) => !c.isFixed).length === 0 && (
                <p className="text-[13px] text-text-muted text-center py-4">データなし</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Fixed vs Variable Summary */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5"
          variants={fadeUp}
        >
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">固定費 vs 変動費 構成</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-6 rounded-full overflow-hidden flex">
                {fixedTotal + variableTotal > 0 ? (
                  <>
                    <div
                      className="h-full bg-warning/60 transition-all duration-500"
                      style={{ width: `${(fixedTotal / (fixedTotal + variableTotal)) * 100}%` }}
                    />
                    <div
                      className="h-full bg-info/60 transition-all duration-500"
                      style={{ width: `${(variableTotal / (fixedTotal + variableTotal)) * 100}%` }}
                    />
                  </>
                ) : (
                  <div className="h-full bg-bg-elevated w-full" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-warning/60" />
              <span className="text-[12px] text-text-muted">
                固定費 {fixedTotal + variableTotal > 0 ? Math.round((fixedTotal / (fixedTotal + variableTotal)) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-info/60" />
              <span className="text-[12px] text-text-muted">
                変動費 {fixedTotal + variableTotal > 0 ? Math.round((variableTotal / (fixedTotal + variableTotal)) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
