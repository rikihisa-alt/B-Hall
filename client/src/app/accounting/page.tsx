'use client'

import { useState } from 'react'
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Banknote,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  BarChart3,
  Wallet,
  FileText,
  Filter,
} from 'lucide-react'

const summaryCards = [
  {
    title: '現預金残高',
    value: '¥28,450,000',
    change: '+2.3%',
    trend: 'up' as const,
    icon: Wallet,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: '月次収入',
    value: '¥12,800,000',
    change: '+5.1%',
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '月次支出',
    value: '¥9,200,000',
    change: '+1.8%',
    trend: 'up' as const,
    icon: TrendingDown,
    color: 'from-rose-500 to-rose-600',
  },
  {
    title: '未収金',
    value: '¥3,600,000',
    change: '4件',
    trend: 'neutral' as const,
    icon: AlertCircle,
    color: 'from-amber-500 to-amber-600',
  },
]

interface Transaction {
  id: string
  date: string
  description: string
  counterparty: string
  category: string
  amount: number
  type: 'income' | 'expense'
  status: 'confirmed' | 'pending' | 'unmatched'
}

const recentTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-03-13', description: 'コンサルティング報酬', counterparty: '株式会社ABC', category: '売上', amount: 2500000, type: 'income', status: 'confirmed' },
  { id: 'TXN-002', date: '2026-03-12', description: 'オフィス賃料 3月分', counterparty: 'ビル管理会社', category: '地代家賃', amount: 850000, type: 'expense', status: 'confirmed' },
  { id: 'TXN-003', date: '2026-03-12', description: 'AWS利用料', counterparty: 'Amazon Web Services', category: '通信費', amount: 234000, type: 'expense', status: 'confirmed' },
  { id: 'TXN-004', date: '2026-03-11', description: 'SaaS月額利用料', counterparty: '株式会社XYZ', category: 'ソフトウェア', amount: 180000, type: 'expense', status: 'pending' },
  { id: 'TXN-005', date: '2026-03-10', description: 'システム開発費', counterparty: '株式会社DEF', category: '売上', amount: 4800000, type: 'income', status: 'pending' },
  { id: 'TXN-006', date: '2026-03-10', description: '交通費精算（田中）', counterparty: '田中太郎', category: '旅費交通費', amount: 32450, type: 'expense', status: 'unmatched' },
  { id: 'TXN-007', date: '2026-03-09', description: '消耗品購入', counterparty: 'Amazon', category: '消耗品費', amount: 15800, type: 'expense', status: 'confirmed' },
]

const statusConfig = {
  confirmed: { label: '確認済', color: 'text-emerald-600 bg-emerald-50' },
  pending: { label: '未確認', color: 'text-amber-600 bg-amber-50' },
  unmatched: { label: '未消込', color: 'text-red-600 bg-red-50' },
}

const cashFlowMonths = [
  { month: '1月', income: 11200, expense: 8900 },
  { month: '2月', income: 10800, expense: 9100 },
  { month: '3月', income: 12800, expense: 9200 },
  { month: '4月', income: 13200, expense: 9500 },
  { month: '5月', income: 11900, expense: 9300 },
  { month: '6月', income: 14100, expense: 9800 },
]

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'cashflow'>('overview')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">経理・財務</h1>
          <p className="text-sm text-gray-500 mt-1">取引・請求・支払・資金管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Receipt className="w-4 h-4" />
            取引登録
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.trend === 'up' && (
                <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                  <ArrowUpRight className="w-3 h-3" />
                  {card.change}
                </span>
              )}
              {card.trend === 'neutral' && (
                <span className="text-xs text-amber-600">{card.change}</span>
              )}
            </div>
            <p className="text-xs text-gray-400">{card.title}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'overview' as const, label: '概要' },
          { key: 'transactions' as const, label: '取引一覧' },
          { key: 'cashflow' as const, label: '資金繰り' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white shadow-sm text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'transactions') && (
        <div className="glass rounded-2xl divide-y divide-gray-100/50">
          <div className="px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">最近の取引</h3>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">すべて表示</button>
          </div>
          {recentTransactions.map((txn) => {
            const status = statusConfig[txn.status]
            return (
              <div
                key={txn.id}
                className="px-5 py-4 hover:bg-white/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      txn.type === 'income' ? 'bg-emerald-50' : 'bg-gray-50'
                    }`}>
                      {txn.type === 'income' ? (
                        <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{txn.description}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        <span>{txn.counterparty}</span>
                        <span>{txn.category}</span>
                        <span>{txn.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      txn.type === 'income' ? 'text-emerald-600' : 'text-gray-700'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}
                      {txn.amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">月別キャッシュフロー（単位: 万円）</h3>
          <div className="space-y-3">
            {cashFlowMonths.map((month) => {
              const maxVal = 15000
              return (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-8 text-right">{month.month}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                        style={{ width: `${(month.income / maxVal) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500">{(month.income / 10).toFixed(0)}万</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 rounded-lg bg-gradient-to-r from-rose-300 to-rose-400 transition-all"
                        style={{ width: `${(month.expense / maxVal) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500">{(month.expense / 10).toFixed(0)}万</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs text-gray-500">収入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-400" />
              <span className="text-xs text-gray-500">支出</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
