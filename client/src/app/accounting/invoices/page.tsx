'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAccountingStore } from '@/stores/accounting-store'
import { InvoiceCreateModal } from '@/features/accounting/components/invoice-create-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast-provider'
import { formatDateShort } from '@/lib/date'
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
} from '@/lib/constants'
import {
  Plus,
  Search,
  ChevronRight,
  FileText,
  Trash2,
} from 'lucide-react'
import type { Invoice } from '@/types'
import { cn } from '@/lib/cn'

type StatusFilter = 'all' | Invoice['status']

export default function InvoicesPage() {
  const [mounted, setMounted] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [editInv, setEditInv] = useState<Invoice | null>(null)
  const [editStatus, setEditStatus] = useState<Invoice['status']>('draft')

  const invoices = useAccountingStore((s) => s.invoices)
  const updateInvoice = useAccountingStore((s) => s.updateInvoice)
  const { addToast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeInvoices = useMemo(() => {
    return invoices
      .filter((inv) => !inv.deleted_at)
      .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
  }, [invoices])

  const filtered = useMemo(() => {
    return activeInvoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          inv.invoice_number.toLowerCase().includes(q) ||
          inv.counterparty.toLowerCase().includes(q) ||
          inv.memo.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeInvoices, statusFilter, search])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeInvoices.length }
    activeInvoices.forEach((inv) => {
      counts[inv.status] = (counts[inv.status] || 0) + 1
    })
    return counts
  }, [activeInvoices])

  const filterTabs: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: `すべて (${statusCounts['all'] || 0})` },
    { value: 'draft', label: `下書き (${statusCounts['draft'] || 0})` },
    { value: 'sent', label: `送付済み (${statusCounts['sent'] || 0})` },
    { value: 'paid', label: `入金済み (${statusCounts['paid'] || 0})` },
    { value: 'overdue', label: `期限超過 (${statusCounts['overdue'] || 0})` },
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
        <span className="text-text-secondary font-medium">請求管理</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">請求管理</h1>
          <p className="text-[13px] text-text-secondary mt-1">請求書の発行・管理</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>
          新規請求書
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
              placeholder="請求書を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-surface border border-border rounded-[10px] pl-9 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-bg-elevated rounded-[10px] p-1 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap',
                  statusFilter === tab.value
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

      {/* Invoice List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-16 h-16 text-accent opacity-30 mb-4" />
              <p className="text-[15px] font-semibold text-text-primary mb-1">請求書が見つかりません</p>
              <p className="text-[13px] text-text-muted">検索条件を変更するか、新しい請求書を作成してください</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Header row */}
              <div className="flex items-center gap-4 px-5 py-3 bg-bg-elevated/50 text-[12px] font-medium text-text-muted">
                <div className="w-28">請求番号</div>
                <div className="flex-1">取引先</div>
                <div className="w-24">発行日</div>
                <div className="w-24">支払期限</div>
                <div className="w-20">ステータス</div>
                <div className="w-32 text-right">合計金額</div>
              </div>

              {filtered.map((inv) => {
                const isOverdue = inv.status === 'overdue'

                return (
                  <button
                    key={inv.id}
                    onClick={() => { setEditInv(inv); setEditStatus(inv.status) }}
                    className={cn(
                      'w-full flex items-center gap-4 px-5 py-4 transition-colors text-left cursor-pointer',
                      isOverdue
                        ? 'bg-[rgba(239,68,68,0.03)] hover:bg-[rgba(239,68,68,0.06)]'
                        : 'hover:bg-[rgba(0,0,0,0.02)]'
                    )}
                  >
                    {/* Invoice number */}
                    <div className="w-28 shrink-0">
                      <p className="text-[13px] font-mono text-accent" style={{ fontFamily: 'var(--font-inter)' }}>
                        {inv.invoice_number}
                      </p>
                    </div>

                    {/* Counterparty */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">{inv.counterparty}</p>
                      {inv.items.length > 0 && (
                        <p className="text-[12px] text-text-muted mt-0.5 truncate">
                          {inv.items.map((i) => i.description).join('、')}
                        </p>
                      )}
                    </div>

                    {/* Issue date */}
                    <div className="w-24 shrink-0">
                      <p className="text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatDateShort(inv.issue_date)}
                      </p>
                    </div>

                    {/* Due date */}
                    <div className="w-24 shrink-0">
                      <p className={cn(
                        'text-[13px] tabular-nums',
                        isOverdue ? 'text-danger font-medium' : 'text-text-muted'
                      )} style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatDateShort(inv.due_date)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="w-20 shrink-0">
                      <Badge
                        variant={INVOICE_STATUS_COLORS[inv.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                        label={INVOICE_STATUS_LABELS[inv.status]}
                      />
                    </div>

                    {/* Amount */}
                    <div className="w-32 text-right shrink-0">
                      <p className="text-[15px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                        {inv.total_amount.toLocaleString()}
                      </p>
                      {inv.tax_amount > 0 && (
                        <p className="text-[11px] text-text-muted mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                          (税{inv.tax_amount.toLocaleString()})
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>
        <p className="text-[12px] text-text-muted mt-3 text-right">
          {filtered.length}件 / {activeInvoices.length}件
        </p>
      </motion.section>

      <InvoiceCreateModal open={showCreate} onClose={() => setShowCreate(false)} />

      {/* Edit Modal */}
      <Modal
        open={!!editInv}
        onClose={() => setEditInv(null)}
        title={`請求書 ${editInv?.invoice_number || ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                if (!editInv) return
                updateInvoice(editInv.id, { deleted_at: new Date().toISOString() })
                setEditInv(null)
                addToast('success', '請求書を削除しました')
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-danger bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.12)] transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              削除
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setEditInv(null)}>閉じる</Button>
              <Button variant="primary" onClick={() => {
                if (!editInv) return
                updateInvoice(editInv.id, { status: editStatus })
                setEditInv(null)
                addToast('success', 'ステータスを更新しました')
              }}>保存</Button>
            </div>
          </div>
        }
      >
        {editInv && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">取引先</p>
                <p className="text-[14px] text-text-primary font-medium">{editInv.counterparty}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">合計金額</p>
                <p className="text-[18px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>
                  ¥{editInv.total_amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">発行日</p>
                <p className="text-[14px] text-text-primary">{formatDateShort(editInv.issue_date)}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">支払期限</p>
                <p className="text-[14px] text-text-primary">{formatDateShort(editInv.due_date)}</p>
              </div>
            </div>
            {editInv.items.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">明細</p>
                <div className="space-y-1.5">
                  {editInv.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-bg-base rounded-[10px] px-3 py-2">
                      <span className="text-[13px] text-text-primary">{item.description}</span>
                      <span className="text-[13px] font-medium text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                        ¥{item.amount.toLocaleString()} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">ステータス変更</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as Invoice['status'])}
                className="w-full bg-bg-surface border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
              >
                <option value="draft">下書き</option>
                <option value="sent">送付済み</option>
                <option value="paid">入金済み</option>
                <option value="overdue">期限超過</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
