'use client'

import { useState } from 'react'
import {
  Building2,
  Plus,
  Filter,
  Package,
  Laptop,
  Key,
  Printer,
  Mail,
  Monitor,
  User,
  Calendar,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'

type AssetCategory = 'equipment' | 'device' | 'account' | 'facility' | 'supply'
type AssetStatus = 'active' | 'returning' | 'maintenance' | 'disposed'

interface Asset {
  id: string
  name: string
  category: AssetCategory
  status: AssetStatus
  assignee: string
  department: string
  assignedDate: string
  note?: string
}

const categoryConfig: Record<AssetCategory, { label: string; icon: typeof Package; color: string }> = {
  equipment: { label: '備品', icon: Package, color: 'from-blue-500 to-blue-600' },
  device: { label: '端末・PC', icon: Laptop, color: 'from-violet-500 to-violet-600' },
  account: { label: 'アカウント', icon: Key, color: 'from-emerald-500 to-emerald-600' },
  facility: { label: '設備', icon: Monitor, color: 'from-amber-500 to-amber-600' },
  supply: { label: '消耗品', icon: Printer, color: 'from-gray-500 to-gray-600' },
}

const statusConfig: Record<AssetStatus, { label: string; color: string }> = {
  active: { label: '使用中', color: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  returning: { label: '返却予定', color: 'text-[#F5A524] bg-[#F5A524]/10' },
  maintenance: { label: 'メンテナンス中', color: 'text-[#60A5FA] bg-[#60A5FA]/10' },
  disposed: { label: '廃棄済', color: 'text-[#6B7280] bg-white/[0.04]' },
}

const demoAssets: Asset[] = [
  { id: 'AST-001', name: 'MacBook Pro 14" M3', category: 'device', status: 'active', assignee: '田中太郎', department: '開発部', assignedDate: '2025-04-01' },
  { id: 'AST-002', name: 'Dell 27" 4Kモニター', category: 'equipment', status: 'active', assignee: '佐藤花子', department: '営業部', assignedDate: '2025-06-15' },
  { id: 'AST-003', name: 'Slack Business+', category: 'account', status: 'active', assignee: '全社員', department: '全社', assignedDate: '2025-01-01' },
  { id: 'AST-004', name: 'セキュリティカード #047', category: 'equipment', status: 'returning', assignee: '山田健太', department: '開発部', assignedDate: '2024-10-01', note: '3/15 退社予定' },
  { id: 'AST-005', name: 'iPhone 16 Pro', category: 'device', status: 'active', assignee: '鈴木一郎', department: '営業部', assignedDate: '2025-09-20' },
  { id: 'AST-006', name: 'キヤノン複合機 MF750', category: 'facility', status: 'maintenance', assignee: '3F共有', department: '総務部', assignedDate: '2024-01-10', note: 'トナー交換中' },
  { id: 'AST-007', name: 'Adobe Creative Cloud', category: 'account', status: 'active', assignee: 'デザインチーム', department: '開発部', assignedDate: '2025-03-01' },
  { id: 'AST-008', name: 'エルゴヒューマン チェア', category: 'equipment', status: 'disposed', assignee: '-', department: '総務部', assignedDate: '2021-04-01', note: '2026-02-28 廃棄' },
]

const summaryStats = [
  { label: '管理資産', value: '234', icon: Package, color: 'text-[#60A5FA]' },
  { label: '端末・PC', value: '48', icon: Laptop, color: 'text-[#7C8CFF]' },
  { label: 'アカウント', value: '15', icon: Key, color: 'text-[#2FBF71]' },
  { label: '返却・要対応', value: '3', icon: AlertCircle, color: 'text-[#F5A524]' },
]

export default function GeneralAffairsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'device' | 'account'>('all')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">総務</h1>
          <p className="text-sm text-[#5A6070] mt-1">備品・貸与物・アカウント管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8D9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            新規登録
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-[#5A6070]">{stat.label}</p>
            <p className="text-2xl font-bold text-white/90 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'device' as const, label: '端末・PC' },
          { key: 'account' as const, label: 'アカウント' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white/[0.08] text-white'
                : 'text-[#5A6070] hover:text-[#A8B0BD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04]">
        {demoAssets
          .filter(a => {
            if (activeTab === 'device') return a.category === 'device'
            if (activeTab === 'account') return a.category === 'account'
            return true
          })
          .map((asset) => {
            const cat = categoryConfig[asset.category]
            const status = statusConfig[asset.status]
            const CatIcon = cat.icon
            return (
              <div
                key={asset.id}
                className="px-5 py-4 hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <CatIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-[#4B5263] font-mono">{asset.id}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white/90 group-hover:text-[#7C8CFF] transition-colors">
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#5A6070]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {asset.assignee}
                        </span>
                        <span>{asset.department}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {asset.assignedDate}
                        </span>
                        {asset.note && (
                          <span className="text-[#F5A524]">{asset.note}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#4B5263] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
