'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAccountingStore } from '@/stores/accounting-store'
import { TransactionCreateModal } from '@/features/accounting/components/transaction-create-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast-provider'
import { formatDateShort } from '@/lib/date'
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
  TRANSACTION_TYPE_LABELS,
} from '@/lib/constants'
import {
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Edit3,
  Trash2,
} from 'lucide-react'
import type { TransactionType, Transaction } from '@/types'
import { cn } from '@/lib/cn'

type TypeFilter = 'all' | TransactionType

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [editTxn, setEditTxn] = useState<Transaction | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editCounterparty, setEditCounterparty] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editType, setEditType] = useState<TransactionType>('expense')

  const transactions = useAccountingStore((s) => s.transactions)
  const updateTransaction = useAccountingStore((s) => s.updateTransaction)
  const { addToast } = useToast()

  const openEdit = (txn: Transaction) => {
    setEditTxn(txn)
    setEditDesc(txn.description)
    setEditAmount(String(txn.amount))
    setEditCategory(txn.category)
    setEditCounterparty(txn.counterparty)
    setEditDate(txn.date)
    setEditType(txn.type)
  }

  const handleSaveEdit = () => {
    if (!editTxn || !editDesc.trim()) return
    updateTransaction(editTxn.id, {
      description: editDesc.trim(),
      amount: Number(editAmount) || 0,
      category: editCategory.trim(),
      counterparty: editCounterparty.trim(),
      date: editDate,
      type: editType,
    })
    setEditTxn(null)
    addToast('success', '取引を更新しました')
  }

  const handleDeleteTxn = () => {
    if (!editTxn) return
    updateTransaction(editTxn.id, { deleted_at: new Date().toISOString() })
    setEditTxn(null)
    addToast('success', '取引を削除しました')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTransactions = useMemo(() => {
    return transactions
      .filter((t) => !t.deleted_at)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions])

  const filtered = useMemo(() => {
    return activeTransactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          t.description.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeTransactions, typeFilter, search])

  // 今月のサマリー
  const monthlySummary = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const thisMonth = activeTransactions.filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

    const income = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    return { income, expense, net: income - expense, count: thisMonth.length }
  }, [activeTransactions])

  const typeIcon = (type: TransactionType) => {
    switch (type) {
      case 'income': return <TrendingUp className="w-4 h-4 text-success" />
      case 'expense': return <TrendingDown className="w-4 h-4 text-danger" />
      case 'transfer': return <ArrowLeftRight className="w-4 h-4 text-info" />
    }
  }

  const filterTabs: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'income', label: '収入' },
    { value: 'expense', label: '支出' },
    { value: 'transfer', label: '振替' },
  ]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] animate-pulse w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px] animate-pulse" />
          ))}
        </div>
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
        <span className="text-text-secondary font-medium">取引一覧</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">取引一覧</h1>
          <p className="text-[13px] text-text-secondary mt-1">取引の記録・管理</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>
          新規取引
        </Button>
      </div>

      {/* Monthly Summary */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今月のサマリー</h2>
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          <div className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <p className="text-[12px] text-text-muted mb-1">収入</p>
            <p className="text-[20px] font-bold text-success tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              +{monthlySummary.income.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <p className="text-[12px] text-text-muted mb-1">支出</p>
            <p className="text-[20px] font-bold text-danger tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              -{monthlySummary.expense.toLocaleString()}
            </p>
          </div>
          <div className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card">
            <p className="text-[12px] text-text-muted mb-1">純収支</p>
            <p className={cn(
              'text-[20px] font-bold tabular-nums',
              monthlySummary.net >= 0 ? 'text-success' : 'text-danger'
            )} style={{ fontFamily: 'var(--font-inter)' }}>
              {monthlySummary.net >= 0 ? '+' : ''}{monthlySummary.net.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Filters */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-6">
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="取引を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-surface border border-border rounded-[10px] pl-9 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-1 bg-bg-elevated rounded-[10px] p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTypeFilter(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer',
                  typeFilter === tab.value
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

      {/* Transaction List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-16 h-16 text-accent opacity-30 mb-4" />
              <p className="text-[15px] font-semibold text-text-primary mb-1">取引が見つかりません</p>
              <p className="text-[13px] text-text-muted">検索条件を変更するか、新しい取引を登録してください</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((txn) => (
                <button
                  key={txn.id}
                  onClick={() => openEdit(txn)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors text-left cursor-pointer"
                >
                  {/* Type icon */}
                  <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                    {typeIcon(txn.type)}
                  </div>

                  {/* Date */}
                  <div className="w-24 shrink-0">
                    <p className="text-[13px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {formatDateShort(txn.date)}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary truncate">{txn.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-text-muted">{txn.category}</span>
                      {txn.counterparty && (
                        <>
                          <span className="text-[12px] text-text-muted">·</span>
                          <span className="text-[12px] text-text-muted truncate">{txn.counterparty}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <Badge
                    variant={TRANSACTION_STATUS_COLORS[txn.status] as 'success' | 'warning' | 'neutral'}
                    label={TRANSACTION_STATUS_LABELS[txn.status]}
                  />

                  {/* Amount */}
                  <div className="w-32 text-right shrink-0">
                    <p className={cn(
                      'text-[15px] font-semibold tabular-nums',
                      txn.type === 'income' ? 'text-success' : txn.type === 'expense' ? 'text-danger' : 'text-text-primary'
                    )} style={{ fontFamily: 'var(--font-inter)' }}>
                      {txn.type === 'income' ? '+' : txn.type === 'expense' ? '-' : ''}
                      {txn.amount.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <p className="text-[12px] text-text-muted mt-3 text-right">
          {filtered.length}件 / {activeTransactions.length}件
        </p>
      </motion.section>

      <TransactionCreateModal open={showCreate} onClose={() => setShowCreate(false)} />

      {/* Edit Modal */}
      <Modal
        open={!!editTxn}
        onClose={() => setEditTxn(null)}
        title="取引を編集"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleDeleteTxn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-danger bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.12)] transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              削除
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setEditTxn(null)}>キャンセル</Button>
              <Button variant="primary" onClick={handleSaveEdit}>保存</Button>
            </div>
          </div>
        }
      >
        {editTxn && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">種別</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as TransactionType)}
                className="w-full bg-bg-surface border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
              >
                <option value="income">収入</option>
                <option value="expense">支出</option>
                <option value="transfer">振替</option>
              </select>
            </div>
            <Input label="内容" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} required />
            <Input label="金額" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} required />
            <Input label="日付" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            <Input label="勘定科目" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            <Input label="取引先" value={editCounterparty} onChange={(e) => setEditCounterparty(e.target.value)} />
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
