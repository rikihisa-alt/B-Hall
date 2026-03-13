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
    iconColor: 'text-[#2FBF71]',
    iconBg: 'bg-[#2FBF71]/10',
  },
  {
    title: '月次収入',
    value: '¥12,800,000',
    change: '+5.1%',
    trend: 'up' as const,
    icon: TrendingUp,
    iconColor: 'text-[#7C8CFF]',
    iconBg: 'bg-[#7C8CFF]/10',
  },
  {
    title: '月次支出',
    value: '¥9,200,000',
    change: '+1.8%',
    trend: 'up' as const,
    icon: TrendingDown,
    iconColor: 'text-[#FF5D5D]',
    iconBg: 'bg-[#FF5D5D]/10',
  },
  {
    title: '未収金',
    value: '¥3,600,000',
    change: '4件',
    trend: 'neutral' as const,
    icon: AlertCircle,
    iconColor: 'text-[#F5A524]',
    iconBg: 'bg-[#F5A524]/10',
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
  confirmed: { label: '確認済', color: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  pending: { label: '未確認', color: 'text-[#F5A524] bg-[#F5A524]/10' },
  unmatched: { label: '未消込', color: 'text-[#FF5D5D] bg-[#FF5D5D]/10' },
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
          <h1 className="text-2xl font-bold text-white/90">経理・財務</h1>
          <p className="text-sm text-[#6B7280] mt-1">取引・請求・支払・資金管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8E9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Receipt className="w-4 h-4" />
            取引登録
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              {card.trend === 'up' && (
                <span className="flex items-center gap-0.5 text-xs text-[#2FBF71]">
                  <ArrowUpRight className="w-3 h-3" />
                  {card.change}
                </span>
              )}
              {card.trend === 'neutral' && (
                <span className="text-xs text-[#F5A524]">{card.change}</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">{card.title}</p>
            <p className="text-xl font-bold text-white/90 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
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
                ? 'bg-white/[0.08] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#A8B0BD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'transactions') && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.06]">
          <div className="px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#A8B0BD]">最近の取引</h3>
            <button className="text-xs text-[#7C8CFF] hover:text-[#8E9BFF] font-medium">すべて表示</button>
          </div>
          {recentTransactions.map((txn) => {
            const status = statusConfig[txn.status]
            return (
              <div
                key={txn.id}
                className="px-5 py-4 hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      txn.type === 'income' ? 'bg-[#2FBF71]/10' : 'bg-white/[0.06]'
                    }`}>
                      {txn.type === 'income' ? (
                        <ArrowDownRight className="w-4 h-4 text-[#2FBF71]" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-[#5A6070]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/90">{txn.description}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5A6070]">
                        <span>{txn.counterparty}</span>
                        <span>{txn.category}</span>
                        <span>{txn.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      txn.type === 'income' ? 'text-[#2FBF71]' : 'text-[#A8B0BD]'
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
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#A8B0BD] mb-4">月別キャッシュフロー（単位: 万円）</h3>
          <div className="space-y-3">
            {cashFlowMonths.map((month) => {
              const maxVal = 15000
              return (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="text-xs text-[#6B7280] w-8 text-right">{month.month}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 rounded-lg bg-gradient-to-r from-[#2FBF71]/80 to-[#2FBF71] transition-all"
                        style={{ width: `${(month.income / maxVal) * 100}%` }}
                      />
                      <span className="text-xs text-[#6B7280]">{(month.income / 10).toFixed(0)}万</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 rounded-lg bg-gradient-to-r from-[#FF5D5D]/60 to-[#FF5D5D]/80 transition-all"
                        style={{ width: `${(month.expense / maxVal) * 100}%` }}
                      />
                      <span className="text-xs text-[#6B7280]">{(month.expense / 10).toFixed(0)}万</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#2FBF71]" />
              <span className="text-xs text-[#6B7280]">収入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#FF5D5D]/80" />
              <span className="text-xs text-[#6B7280]">支出</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
