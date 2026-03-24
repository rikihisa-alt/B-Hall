'use client'

import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccountingStore } from '@/stores/accounting-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { TRANSACTION_CATEGORIES, ACCOUNT_NAMES, DEPARTMENTS } from '@/lib/constants'
import type { TransactionType } from '@/types'
import { cn } from '@/lib/cn'

interface TransactionCreateModalProps {
  open: boolean
  onClose: () => void
}

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: 'income', label: '収入' },
  { value: 'expense', label: '支出' },
  { value: 'transfer', label: '振替' },
]

export function TransactionCreateModal({ open, onClose }: TransactionCreateModalProps) {
  const addTransaction = useAccountingStore((s) => s.addTransaction)
  const currentUser = useAuthStore((s) => s.currentUser)
  const { addToast } = useToast()

  const [type, setType] = useState<TransactionType>('expense')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(TRANSACTION_CATEGORIES[0])
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0])
  const [counterparty, setCounterparty] = useState('')
  const [account, setAccount] = useState<string>(ACCOUNT_NAMES[0])
  const [memo, setMemo] = useState('')
  const [descError, setDescError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setType('expense')
    setDate('')
    setDescription('')
    setAmount('')
    setCategory(TRANSACTION_CATEGORIES[0])
    setDepartment(DEPARTMENTS[0])
    setCounterparty('')
    setAccount(ACCOUNT_NAMES[0])
    setMemo('')
    setDescError('')
    setAmountError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    let hasError = false

    if (!description.trim()) {
      setDescError('摘要は必須です')
      hasError = true
    }

    const numAmount = Number(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setAmountError('正しい金額を入力してください')
      hasError = true
    }

    if (hasError) return

    setLoading(true)

    try {
      addTransaction({
        type,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        description: description.trim(),
        amount: numAmount,
        category,
        department,
        counterparty: counterparty.trim(),
        account,
        memo: memo.trim(),
        created_by: currentUser?.id || 'user-3',
        updated_by: currentUser?.id || 'user-3',
      })

      addToast('success', '取引を登録しました')
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none appearance-none cursor-pointer'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="取引登録"
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            登録
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 取引種別 */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-2">
            取引種別 <span className="text-accent">*</span>
          </label>
          <div className="flex gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={cn(
                  'flex-1 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-150 cursor-pointer',
                  type === opt.value
                    ? 'bg-accent text-white shadow-[0_0_12px_rgba(79,70,229,0.3)]'
                    : 'bg-bg-base border border-border text-text-secondary hover:border-accent/40'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 日付 + 金額 */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="金額"
            required
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^0-9]/g, ''))
              if (amountError) setAmountError('')
            }}
            error={amountError}
          />
        </div>

        {/* 摘要 */}
        <Input
          label="摘要"
          required
          placeholder="取引の内容を入力"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (descError) setDescError('')
          }}
          error={descError}
        />

        {/* カテゴリ + 部署 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              勘定科目
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {TRANSACTION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              部署
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={selectClass}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 取引先 + 口座 */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="取引先"
            placeholder="取引先名を入力"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
          />
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              口座
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className={selectClass}
            >
              {ACCOUNT_NAMES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* メモ */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            メモ
          </label>
          <textarea
            placeholder="補足メモを入力"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
            className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
          />
        </div>
      </form>
    </Modal>
  )
}
