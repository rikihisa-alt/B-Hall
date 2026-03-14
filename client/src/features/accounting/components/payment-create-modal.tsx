'use client'

import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccountingStore } from '@/stores/accounting-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import type { Payment } from '@/types'

interface PaymentCreateModalProps {
  open: boolean
  onClose: () => void
}

const methodOptions: { value: Payment['method']; label: string }[] = [
  { value: 'bank_transfer', label: '銀行振込' },
  { value: 'cash', label: '現金' },
  { value: 'credit_card', label: 'クレジットカード' },
  { value: 'other', label: 'その他' },
]

export function PaymentCreateModal({ open, onClose }: PaymentCreateModalProps) {
  const addPayment = useAccountingStore((s) => s.addPayment)
  const currentUser = useAuthStore((s) => s.currentUser)
  const { addToast } = useToast()

  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [method, setMethod] = useState<Payment['method']>('bank_transfer')
  const [description, setDescription] = useState('')
  const [payeeError, setPayeeError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setPayee('')
    setAmount('')
    setDueDate('')
    setMethod('bank_transfer')
    setDescription('')
    setPayeeError('')
    setAmountError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    let hasError = false

    if (!payee.trim()) {
      setPayeeError('支払先は必須です')
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
      addPayment({
        payee: payee.trim(),
        amount: numAmount,
        due_date: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        method,
        description: description.trim(),
        created_by: currentUser?.id || 'user-3',
        updated_by: currentUser?.id || 'user-3',
      })

      addToast('success', '支払を登録しました')
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none appearance-none cursor-pointer'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="支払登録"
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
        {/* 支払先 */}
        <Input
          label="支払先"
          required
          placeholder="支払先名を入力"
          value={payee}
          onChange={(e) => {
            setPayee(e.target.value)
            if (payeeError) setPayeeError('')
          }}
          error={payeeError}
        />

        {/* 金額 + 支払期限 */}
        <div className="grid grid-cols-2 gap-4">
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
          <Input
            label="支払期限"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* 支払方法 */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            支払方法
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Payment['method'])}
            className={selectClass}
          >
            {methodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 概要 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            概要
          </label>
          <textarea
            placeholder="支払の内容を入力"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>
      </form>
    </Modal>
  )
}
