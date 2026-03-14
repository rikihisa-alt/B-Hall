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

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    type: 'income',
    date: daysAgo(3),
    description: '株式会社ABC コンサルティング報酬',
    amount: 1500000,
    category: '売上',
    department: '営業部',
    counterparty: '株式会社ABC',
    account: '普通預金（三菱UFJ）',
    sub_account: '',
    memo: '3月度コンサルティング契約',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-2',
    type: 'expense',
    date: daysAgo(5),
    description: 'オフィス家賃 3月分',
    amount: 450000,
    category: '家賃',
    department: '総務部',
    counterparty: '三井不動産株式会社',
    account: '普通預金（三菱UFJ）',
    sub_account: '',
    memo: '毎月27日引落',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-3',
    type: 'expense',
    date: daysAgo(7),
    description: '従業員給与 2月分',
    amount: 3200000,
    category: '給与',
    department: '人事部',
    counterparty: '',
    account: '普通預金（三菱UFJ）',
    sub_account: '',
    memo: '正社員12名分',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-4',
    type: 'income',
    date: daysAgo(10),
    description: 'DEF株式会社 システム開発費',
    amount: 2800000,
    category: '売上',
    department: '開発部',
    counterparty: 'DEF株式会社',
    account: '普通預金（みずほ）',
    sub_account: '',
    memo: 'フェーズ2納品分',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-5',
    type: 'expense',
    date: daysAgo(12),
    description: 'AWS利用料 2月分',
    amount: 185000,
    category: '通信費',
    department: '開発部',
    counterparty: 'Amazon Web Services',
    account: 'クレジットカード',
    sub_account: '',
    memo: 'EC2, RDS, S3',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(12),
    updated_at: daysAgo(12),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-6',
    type: 'expense',
    date: daysAgo(2),
    description: '取引先接待 会食費',
    amount: 45000,
    category: '接待交際費',
    department: '営業部',
    counterparty: '銀座 和食処 雅',
    account: '現金',
    sub_account: '',
    memo: 'GHI商事との会食',
    receipt_id: '',
    status: 'pending',
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
  {
    id: 'txn-7',
    type: 'income',
    date: daysAgo(30),
    description: 'GHI商事 業務委託報酬',
    amount: 980000,
    category: '売上',
    department: '営業部',
    counterparty: 'GHI商事株式会社',
    account: '普通預金（三菱UFJ）',
    sub_account: '',
    memo: '2月度業務委託',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-8',
    type: 'expense',
    date: daysAgo(35),
    description: 'オフィス家賃 2月分',
    amount: 450000,
    category: '家賃',
    department: '総務部',
    counterparty: '三井不動産株式会社',
    account: '普通預金（三菱UFJ）',
    sub_account: '',
    memo: '毎月27日引落',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(35),
    updated_at: daysAgo(35),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'txn-9',
    type: 'expense',
    date: daysAgo(1),
    description: 'タクシー代 営業移動',
    amount: 8500,
    category: '交通費',
    department: '営業部',
    counterparty: '',
    account: '現金',
    sub_account: '',
    memo: '品川→六本木',
    receipt_id: '',
    status: 'pending',
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
  {
    id: 'txn-10',
    type: 'transfer',
    date: daysAgo(15),
    description: '口座間振替',
    amount: 5000000,
    category: 'その他',
    department: '経理部',
    counterparty: '',
    account: '普通預金（三菱UFJ）',
    sub_account: '普通預金（みずほ）',
    memo: '資金移動',
    receipt_id: '',
    status: 'confirmed',
    created_at: daysAgo(15),
    updated_at: daysAgo(15),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
]

const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-2026-001',
    counterparty: '株式会社ABC',
    issue_date: daysAgo(30),
    due_date: daysAgo(0),
    amount: 1500000,
    tax_amount: 150000,
    total_amount: 1650000,
    status: 'paid',
    items: [
      { id: 'inv-item-1', description: 'コンサルティング報酬 3月分', quantity: 1, unit_price: 1500000, amount: 1500000 },
    ],
    memo: '入金確認済み',
    created_at: daysAgo(30),
    updated_at: daysAgo(3),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-2026-002',
    counterparty: 'DEF株式会社',
    issue_date: daysAgo(20),
    due_date: daysAgo(0),
    amount: 2800000,
    tax_amount: 280000,
    total_amount: 3080000,
    status: 'paid',
    items: [
      { id: 'inv-item-2', description: 'システム開発 フェーズ2', quantity: 1, unit_price: 2800000, amount: 2800000 },
    ],
    memo: '入金確認済み',
    created_at: daysAgo(20),
    updated_at: daysAgo(10),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'inv-3',
    invoice_number: 'INV-2026-003',
    counterparty: 'JKL株式会社',
    issue_date: daysAgo(5),
    due_date: daysFromNow(25),
    amount: 1200000,
    tax_amount: 120000,
    total_amount: 1320000,
    status: 'sent',
    items: [
      { id: 'inv-item-3', description: 'Webサイトリニューアル設計費', quantity: 1, unit_price: 800000, amount: 800000 },
      { id: 'inv-item-4', description: 'デザイン制作費', quantity: 1, unit_price: 400000, amount: 400000 },
    ],
    memo: '4月10日支払予定',
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'inv-4',
    invoice_number: 'INV-2026-004',
    counterparty: 'MNO株式会社',
    issue_date: daysAgo(60),
    due_date: daysAgo(15),
    amount: 650000,
    tax_amount: 65000,
    total_amount: 715000,
    status: 'overdue',
    items: [
      { id: 'inv-item-5', description: '保守運用サポート 1-2月分', quantity: 2, unit_price: 325000, amount: 650000 },
    ],
    memo: '督促中：3回目の連絡済み',
    created_at: daysAgo(60),
    updated_at: daysAgo(2),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
]

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    payee: 'PQR株式会社',
    amount: 330000,
    payment_date: daysAgo(10),
    due_date: daysAgo(5),
    method: 'bank_transfer',
    status: 'completed',
    description: '外注開発費 2月分',
    related_invoice_id: '',
    approved_by: 'user-5',
    created_at: daysAgo(15),
    updated_at: daysAgo(10),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'pay-2',
    payee: 'STU株式会社',
    amount: 165000,
    payment_date: '',
    due_date: daysFromNow(5),
    method: 'bank_transfer',
    status: 'approved',
    description: 'デザイン制作費',
    related_invoice_id: '',
    approved_by: 'user-5',
    created_at: daysAgo(5),
    updated_at: daysAgo(3),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'pay-3',
    payee: 'VWX株式会社',
    amount: 880000,
    payment_date: '',
    due_date: daysFromNow(10),
    method: 'bank_transfer',
    status: 'pending',
    description: 'サーバー移行作業費',
    related_invoice_id: '',
    approved_by: '',
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
]

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
