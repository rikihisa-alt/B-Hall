import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, Invoice, InvoiceItem, Payment } from '@/types'
import { generateId } from '@/lib/id'
import { today } from '@/lib/date'

// ── ヘルパー: N日前のISO文字列 ──

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

// ── シードデータ ──

const now = new Date().toISOString()

const SEED_TRANSACTIONS: Transaction[] = []

const SEED_INVOICES: Invoice[] = []

const SEED_PAYMENTS: Payment[] = []

// ── Store 型定義 ──

interface AccountingState {
  transactions: Transaction[]
  invoices: Invoice[]
  payments: Payment[]
  _hydrated: boolean
}

interface AccountingActions {
  // Transactions
  addTransaction: (data: Partial<Transaction>) => Transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  getTransactions: () => Transaction[]
  getTransactionsByMonth: (year: number, month: number) => Transaction[]

  // Invoices
  addInvoice: (data: Partial<Invoice>) => Invoice
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  getInvoices: () => Invoice[]
  getOverdueInvoices: () => Invoice[]

  // Payments
  addPayment: (data: Partial<Payment>) => Payment
  approvePayment: (id: string, approvedBy: string) => void
  completePayment: (id: string) => void
  getPayments: () => Payment[]
  getPendingPayments: () => Payment[]

  setHydrated: () => void
}

type AccountingStore = AccountingState & AccountingActions

// ── Store ──

export const useAccountingStore = create<AccountingStore>()(
  persist(
    (set, get) => ({
      transactions: SEED_TRANSACTIONS,
      invoices: SEED_INVOICES,
      payments: SEED_PAYMENTS,
      _hydrated: false,

      // ── Transactions ──

      addTransaction: (data: Partial<Transaction>) => {
        const now = today()
        const newTxn: Transaction = {
          id: generateId(),
          type: data.type || 'expense',
          date: data.date || now,
          description: data.description || '',
          amount: data.amount || 0,
          category: data.category || 'その他',
          department: data.department || '',
          counterparty: data.counterparty || '',
          account: data.account || '',
          sub_account: data.sub_account || '',
          memo: data.memo || '',
          receipt_id: data.receipt_id || '',
          status: data.status || 'pending',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ transactions: [...state.transactions, newTxn] }))
        return newTxn
      },

      updateTransaction: (id: string, updates: Partial<Transaction>) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updated_at: today() } : t
          ),
        }))
      },

      getTransactions: () => {
        return get().transactions.filter((t) => !t.deleted_at)
      },

      getTransactionsByMonth: (year: number, month: number) => {
        return get().transactions.filter((t) => {
          if (t.deleted_at) return false
          const d = new Date(t.date)
          return d.getFullYear() === year && d.getMonth() + 1 === month
        })
      },

      // ── Invoices ──

      addInvoice: (data: Partial<Invoice>) => {
        const now = today()
        const newInv: Invoice = {
          id: generateId(),
          invoice_number: data.invoice_number || '',
          counterparty: data.counterparty || '',
          issue_date: data.issue_date || now,
          due_date: data.due_date || now,
          amount: data.amount || 0,
          tax_amount: data.tax_amount || 0,
          total_amount: data.total_amount || 0,
          status: data.status || 'draft',
          items: data.items || [],
          memo: data.memo || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ invoices: [...state.invoices, newInv] }))
        return newInv
      },

      updateInvoice: (id: string, updates: Partial<Invoice>) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates, updated_at: today() } : inv
          ),
        }))
      },

      getInvoices: () => {
        return get().invoices.filter((inv) => !inv.deleted_at)
      },

      getOverdueInvoices: () => {
        return get().invoices.filter(
          (inv) => !inv.deleted_at && inv.status === 'overdue'
        )
      },

      // ── Payments ──

      addPayment: (data: Partial<Payment>) => {
        const now = today()
        const newPay: Payment = {
          id: generateId(),
          payee: data.payee || '',
          amount: data.amount || 0,
          payment_date: data.payment_date || '',
          due_date: data.due_date || now,
          method: data.method || 'bank_transfer',
          status: data.status || 'pending',
          description: data.description || '',
          related_invoice_id: data.related_invoice_id || '',
          approved_by: data.approved_by || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ payments: [...state.payments, newPay] }))
        return newPay
      },

      approvePayment: (id: string, approvedBy: string) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id
              ? { ...p, status: 'approved' as const, approved_by: approvedBy, updated_at: today() }
              : p
          ),
        }))
      },

      completePayment: (id: string) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id
              ? { ...p, status: 'completed' as const, payment_date: today(), updated_at: today() }
              : p
          ),
        }))
      },

      getPayments: () => {
        return get().payments.filter((p) => !p.deleted_at)
      },

      getPendingPayments: () => {
        return get().payments.filter(
          (p) => !p.deleted_at && p.status === 'pending'
        )
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-accounting',
      partialize: (state) => ({
        transactions: state.transactions,
        invoices: state.invoices,
        payments: state.payments,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
