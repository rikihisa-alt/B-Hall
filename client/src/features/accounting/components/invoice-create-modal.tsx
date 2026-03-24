'use client'

import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccountingStore } from '@/stores/accounting-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { generateId } from '@/lib/id'
import { Plus, Trash2 } from 'lucide-react'
import type { InvoiceItem } from '@/types'

interface InvoiceCreateModalProps {
  open: boolean
  onClose: () => void
}

interface FormItem {
  id: string
  description: string
  quantity: string
  unit_price: string
}

export function InvoiceCreateModal({ open, onClose }: InvoiceCreateModalProps) {
  const addInvoice = useAccountingStore((s) => s.addInvoice)
  const invoices = useAccountingStore((s) => s.invoices)
  const currentUser = useAuthStore((s) => s.currentUser)
  const { addToast } = useToast()

  const [counterparty, setCounterparty] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [memo, setMemo] = useState('')
  const [items, setItems] = useState<FormItem[]>([
    { id: generateId(), description: '', quantity: '1', unit_price: '' },
  ])
  const [counterpartyError, setCounterpartyError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setCounterparty('')
    setIssueDate('')
    setDueDate('')
    setMemo('')
    setItems([{ id: generateId(), description: '', quantity: '1', unit_price: '' }])
    setCounterpartyError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const addItem = () => {
    setItems([...items, { id: generateId(), description: '', quantity: '1', unit_price: '' }])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems(items.filter((i) => i.id !== id))
  }

  const updateItem = (id: string, field: keyof FormItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const calcItemAmount = (item: FormItem): number => {
    const q = Number(item.quantity) || 0
    const p = Number(item.unit_price) || 0
    return q * p
  }

  const subtotal = items.reduce((sum, item) => sum + calcItemAmount(item), 0)
  const taxAmount = Math.floor(subtotal * 0.1)
  const totalAmount = subtotal + taxAmount

  const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear()
    const count = invoices.filter((inv) => inv.invoice_number.includes(`${year}`)).length + 1
    return `INV-${year}-${String(count).padStart(3, '0')}`
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!counterparty.trim()) {
      setCounterpartyError('取引先は必須です')
      return
    }

    setLoading(true)

    try {
      const invoiceItems: InvoiceItem[] = items
        .filter((i) => i.description.trim() && Number(i.unit_price) > 0)
        .map((i) => ({
          id: i.id,
          description: i.description.trim(),
          quantity: Number(i.quantity) || 1,
          unit_price: Number(i.unit_price) || 0,
          amount: calcItemAmount(i),
        }))

      addInvoice({
        invoice_number: generateInvoiceNumber(),
        counterparty: counterparty.trim(),
        issue_date: issueDate ? new Date(issueDate).toISOString() : new Date().toISOString(),
        due_date: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        amount: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'draft',
        items: invoiceItems,
        memo: memo.trim(),
        created_by: currentUser?.id || 'user-3',
        updated_by: currentUser?.id || 'user-3',
      })

      addToast('success', '請求書を作成しました')
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="請求書作成"
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
            作成
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 取引先 */}
        <Input
          label="取引先"
          required
          placeholder="取引先名を入力"
          value={counterparty}
          onChange={(e) => {
            setCounterparty(e.target.value)
            if (counterpartyError) setCounterpartyError('')
          }}
          error={counterpartyError}
        />

        {/* 発行日 + 支払期限 */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="発行日"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <Input
            label="支払期限"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* 明細 */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-2">
            明細
          </label>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    placeholder="品目・サービス名"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="bg-bg-base border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none"
                  />
                </div>
                <div className="w-20">
                  <input
                    placeholder="数量"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-bg-base border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none text-right"
                  />
                </div>
                <div className="w-32">
                  <input
                    placeholder="単価"
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.id, 'unit_price', e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-bg-base border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none text-right"
                  />
                </div>
                <div className="w-28 flex items-center justify-end gap-2">
                  <span className="text-[14px] text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {calcItemAmount(item).toLocaleString()}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center gap-1.5 text-[13px] text-accent hover:text-accent/80 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            明細を追加
          </button>
        </div>

        {/* 合計 */}
        <div className="bg-bg-base rounded-[12px] p-4 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">小計</span>
            <span className="text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {subtotal.toLocaleString()}円
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">消費税（10%）</span>
            <span className="text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {taxAmount.toLocaleString()}円
            </span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-[14px] font-semibold text-text-primary">合計</span>
            <span className="text-[16px] font-bold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {totalAmount.toLocaleString()}円
            </span>
          </div>
        </div>

        {/* メモ */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            メモ
          </label>
          <textarea
            placeholder="備考を入力"
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
