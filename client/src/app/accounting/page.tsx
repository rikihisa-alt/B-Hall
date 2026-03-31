'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAccountingStore } from '@/stores/accounting-store'
import { TransactionCreateModal } from '@/features/accounting/components/transaction-create-modal'
import { InvoiceCreateModal } from '@/features/accounting/components/invoice-create-modal'
import { PaymentCreateModal } from '@/features/accounting/components/payment-create-modal'
import {
  Receipt,
  CreditCard,
  Banknote,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Plus,
  FileText,
} from 'lucide-react'

export default function AccountingPage() {
  const [mounted, setMounted] = useState(false)
  const [txnModal, setTxnModal] = useState(false)
  const [invModal, setInvModal] = useState(false)
  const [payModal, setPayModal] = useState(false)

  const transactions = useAccountingStore((s) => s.transactions)
  const invoices = useAccountingStore((s) => s.invoices)
  const payments = useAccountingStore((s) => s.payments)

  useEffect(() => {
    setMounted(true)
  }, [])

  // -- 今月の収支計算 --
  const metrics = useMemo(() => {
    if (!mounted) return { balance: 0, monthlyIncome: 0, monthlyExpense: 0, outstanding: 0 }

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const activeTxns = transactions.filter((t) => !t.deleted_at)

    // 今月のトランザクション
    const thisMonthTxns = activeTxns.filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

    const monthlyIncome = thisMonthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpense = thisMonthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // 全体のバランス推定（全収入 - 全支出）
    const totalIncome = activeTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = activeTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = 28400000 + totalIncome - totalExpense // 基準残高 + 純収支

    // 未回収請求額
    const outstanding = invoices
      .filter((inv) => !inv.deleted_at && (inv.status === 'sent' || inv.status === 'issued' || inv.status === 'overdue'))
      .reduce((sum, inv) => sum + inv.total_amount, 0)

    return { balance, monthlyIncome, monthlyExpense, outstanding }
  }, [mounted, transactions, invoices])

  // -- 今日のタスク数 --
  const todayCounts = useMemo(() => {
    if (!mounted) return { pendingPayments: 0, overdueInvoices: 0, pendingTransactions: 0 }

    const pendingPayments = payments.filter(
      (p) => !p.deleted_at && p.status === 'pending'
    ).length

    const overdueInvoices = invoices.filter(
      (inv) => !inv.deleted_at && inv.status === 'overdue'
    ).length

    const pendingTransactions = transactions.filter(
      (t) => !t.deleted_at && t.status === 'pending'
    ).length

    return { pendingPayments, overdueInvoices, pendingTransactions }
  }, [mounted, payments, invoices, transactions])

  const formatAmount = (n: number): string => {
    if (n >= 10000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 10000) return `${(n / 10000).toFixed(0)}万`
    return n.toLocaleString()
  }

  const todayItems = [
    {
      name: '未確認取引',
      desc: '未確認の取引を確認・承認',
      icon: Receipt,
      count: todayCounts.pendingTransactions,
      href: '/accounting/transactions',
    },
    {
      name: '支払承認待ち',
      desc: '支払依頼の承認・実行',
      icon: Banknote,
      count: todayCounts.pendingPayments,
      href: '/accounting/payments',
    },
    {
      name: '期限超過請求',
      desc: '未回収の請求書を確認',
      icon: AlertTriangle,
      count: todayCounts.overdueInvoices,
      href: '/accounting/invoices',
    },
  ]

  const manageItems = [
    {
      name: '取引一覧',
      meta: `${transactions.filter((t) => !t.deleted_at).length}件`,
      icon: BarChart3,
      href: '/accounting/transactions',
    },
    {
      name: '請求管理',
      meta: `${invoices.filter((inv) => !inv.deleted_at).length}件`,
      icon: FileText,
      href: '/accounting/invoices',
    },
    {
      name: '支払管理',
      meta: `${payments.filter((p) => !p.deleted_at).length}件`,
      icon: CreditCard,
      href: '/accounting/payments',
    },
    {
      name: 'キャッシュフロー',
      meta: '月別入出金推移',
      icon: TrendingUp,
      href: '/accounting/cashflow',
    },
  ]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] animate-pulse w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-bg-elevated rounded-[16px] animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-bg-elevated rounded-[16px] animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">経理・財務</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">経理・財務</h1>
          <p className="text-[13px] text-text-secondary mt-1">経理・財務データの管理</p>
        </div>
      </div>

      {/* Metric Cards */}
      <motion.section data-tutorial="accounting-metrics" variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-[rgba(79,70,229,0.1)] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-accent" />
              </div>
            </div>
            <p className="text-[24px] font-bold text-text-primary tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              {formatAmount(metrics.balance)}
            </p>
            <p className="text-[12px] text-text-muted mt-1">現預金残高（推定）</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-[24px] font-bold text-success tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              +{metrics.monthlyIncome.toLocaleString()}
            </p>
            <p className="text-[12px] text-text-muted mt-1">今月の収入</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-danger" />
              </div>
            </div>
            <p className="text-[24px] font-bold text-danger tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              -{metrics.monthlyExpense.toLocaleString()}
            </p>
            <p className="text-[12px] text-text-muted mt-1">今月の支出</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                <FileText className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-[24px] font-bold text-text-primary tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              {metrics.outstanding.toLocaleString()}
            </p>
            <p className="text-[12px] text-text-muted mt-1">未回収請求額</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">クイックアクション</h2>
        <motion.div variants={fadeUp} className="flex overflow-x-auto gap-2 md:gap-3 pb-2 -mx-1 px-1">
          <button
            onClick={() => setTxnModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border rounded-[12px] text-[13px] font-medium text-text-primary hover:border-accent/40 hover:bg-[rgba(79,70,229,0.04)] transition-all cursor-pointer flex-shrink-0 min-h-[44px] md:min-h-0"
          >
            <Plus className="w-4 h-4 text-accent" />
            新規取引
          </button>
          <button
            onClick={() => setInvModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border rounded-[12px] text-[13px] font-medium text-text-primary hover:border-accent/40 hover:bg-[rgba(79,70,229,0.04)] transition-all cursor-pointer flex-shrink-0 min-h-[44px] md:min-h-0"
          >
            <Plus className="w-4 h-4 text-accent" />
            新規請求書
          </button>
          <button
            onClick={() => setPayModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border rounded-[12px] text-[13px] font-medium text-text-primary hover:border-accent/40 hover:bg-[rgba(79,70,229,0.04)] transition-all cursor-pointer flex-shrink-0 min-h-[44px] md:min-h-0"
          >
            <Plus className="w-4 h-4 text-accent" />
            新規支払
          </button>
        </motion.div>
      </motion.section>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">要対応</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {todayItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {manageItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Modals */}
      <TransactionCreateModal open={txnModal} onClose={() => setTxnModal(false)} />
      <InvoiceCreateModal open={invModal} onClose={() => setInvModal(false)} />
      <PaymentCreateModal open={payModal} onClose={() => setPayModal(false)} />
    </motion.div>
  )
}
