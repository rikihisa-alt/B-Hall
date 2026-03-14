'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAccountingStore } from '@/stores/accounting-store'
import { useAuthStore } from '@/stores/auth-store'
import { PaymentCreateModal } from '@/features/accounting/components/payment-create-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-provider'
import { formatDateShort } from '@/lib/date'
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
} from '@/lib/constants'
import {
  Plus,
  Search,
  ChevronRight,
  CreditCard,
  Check,
  CheckCheck,
} from 'lucide-react'
import type { Payment } from '@/types'
import { cn } from '@/lib/cn'

type TabFilter = 'all' | 'pending' | 'approved' | 'completed'

export default function PaymentsPage() {
  const [mounted, setMounted] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [tabFilter, setTabFilter] = useState<TabFilter>('all')

  const payments = useAccountingStore((s) => s.payments)
  const approvePayment = useAccountingStore((s) => s.approvePayment)
  const completePayment = useAccountingStore((s) => s.completePayment)
  const currentUser = useAuthStore((s) => s.currentUser)
  const { addToast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const activePayments = useMemo(() => {
    return payments
      .filter((p) => !p.deleted_at)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [payments])

  const filtered = useMemo(() => {
    return activePayments.filter((p) => {
      if (tabFilter !== 'all' && p.status !== tabFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.payee.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activePayments, tabFilter, search])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activePayments.length }
    activePayments.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1
    })
    return counts
  }, [activePayments])

  const handleApprove = (id: string) => {
    approvePayment(id, currentUser?.id || 'user-5')
    addToast('success', '支払を承認しました')
  }

  const handleComplete = (id: string) => {
    completePayment(id)
    addToast('success', '支払を完了しました')
  }

  const filterTabs: { value: TabFilter; label: string }[] = [
    { value: 'all', label: `すべて (${statusCounts['all'] || 0})` },
    { value: 'pending', label: `承認待ち (${statusCounts['pending'] || 0})` },
    { value: 'approved', label: `承認済み (${statusCounts['approved'] || 0})` },
    { value: 'completed', label: `支払済み (${statusCounts['completed'] || 0})` },
  ]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] animate-pulse w-48" />
        <div className="h-96 bg-bg-elevated rounded-[16px] animate-pulse" />
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
        <span className="text-text-secondary font-medium">支払管理</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">支払管理</h1>
          <p className="text-[13px] text-text-secondary mt-1">支払の登録・承認・実行管理</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>
          支払登録
        </Button>
      </div>

      {/* Filters */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-6">
        <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="支払を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-surface border border-border rounded-[10px] pl-9 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
            />
          </div>

          {/* Tab filter */}
          <div className="flex gap-1 bg-bg-elevated rounded-[10px] p-1 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTabFilter(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap',
                  tabFilter === tab.value
                    ? 'bg-bg-surface text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Payment List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-16 h-16 text-accent opacity-30 mb-4" />
              <p className="text-[15px] font-semibold text-text-primary mb-1">支払が見つかりません</p>
              <p className="text-[13px] text-text-muted">検索条件を変更するか、新しい支払を登録してください</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-text-muted" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary">{pay.payee}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-text-muted">{pay.description}</span>
                      <span className="text-[12px] text-text-muted">·</span>
                      <span className="text-[12px] text-text-muted">{PAYMENT_METHOD_LABELS[pay.method]}</span>
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="w-24 shrink-0">
                    <p className="text-[11px] text-text-muted mb-0.5">支払期限</p>
                    <p className="text-[13px] text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {formatDateShort(pay.due_date)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="w-20 shrink-0">
                    <Badge
                      variant={PAYMENT_STATUS_COLORS[pay.status] as 'success' | 'warning' | 'info' | 'neutral'}
                      label={PAYMENT_STATUS_LABELS[pay.status]}
                    />
                  </div>

                  {/* Amount */}
                  <div className="w-28 text-right shrink-0">
                    <p className="text-[15px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {pay.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-24 flex justify-end shrink-0">
                    {pay.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(pay.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-accent bg-[rgba(79,70,229,0.08)] hover:bg-[rgba(79,70,229,0.15)] transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        承認
                      </button>
                    )}
                    {pay.status === 'approved' && (
                      <button
                        onClick={() => handleComplete(pay.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-success bg-[rgba(34,197,94,0.08)] hover:bg-[rgba(34,197,94,0.15)] transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        完了
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        <p className="text-[12px] text-text-muted mt-3 text-right">
          {filtered.length}件 / {activePayments.length}件
        </p>
      </motion.section>

      <PaymentCreateModal open={showCreate} onClose={() => setShowCreate(false)} />
    </motion.div>
  )
}
