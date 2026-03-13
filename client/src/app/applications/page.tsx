'use client'

import { useState } from 'react'
import {
  FileText,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plane,
  Receipt,
  Calendar,
  ShoppingCart,
  UserPlus,
  Laptop,
} from 'lucide-react'

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'draft'

interface Application {
  id: string
  title: string
  type: string
  applicant: string
  date: string
  amount?: string
  status: ApplicationStatus
  approver: string
  icon: typeof FileText
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '承認待ち', color: 'text-amber-600 bg-amber-50', icon: Clock },
  approved: { label: '承認済み', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  rejected: { label: '差戻し', color: 'text-red-600 bg-red-50', icon: XCircle },
  draft: { label: '下書き', color: 'text-gray-500 bg-gray-50', icon: AlertCircle },
}

const demoApplications: Application[] = [
  {
    id: 'APP-001',
    title: '3月度交通費精算',
    type: '経費申請',
    applicant: '田中太郎',
    date: '2026-03-12',
    amount: '¥32,450',
    status: 'pending',
    approver: '佐藤部長',
    icon: Receipt,
  },
  {
    id: 'APP-002',
    title: '有給休暇申請（3/20-3/21）',
    type: '休暇申請',
    applicant: '鈴木花子',
    date: '2026-03-11',
    status: 'approved',
    approver: '高橋課長',
    icon: Calendar,
  },
  {
    id: 'APP-003',
    title: '出張申請 - 大阪支社訪問',
    type: '出張申請',
    applicant: '山田一郎',
    date: '2026-03-10',
    amount: '¥85,000',
    status: 'pending',
    approver: '佐藤部長',
    icon: Plane,
  },
  {
    id: 'APP-004',
    title: 'ノートPC購入申請',
    type: '購買申請',
    applicant: '高橋美咲',
    date: '2026-03-09',
    amount: '¥198,000',
    status: 'rejected',
    approver: '田中取締役',
    icon: ShoppingCart,
  },
  {
    id: 'APP-005',
    title: '中途採用申請 - エンジニア1名',
    type: '採用申請',
    applicant: '佐藤部長',
    date: '2026-03-08',
    status: 'approved',
    approver: '代表取締役',
    icon: UserPlus,
  },
  {
    id: 'APP-006',
    title: 'リモートワーク端末貸与申請',
    type: '端末・アカウント申請',
    applicant: '伊藤健太',
    date: '2026-03-07',
    status: 'draft',
    approver: '情報システム部',
    icon: Laptop,
  },
]

const applicationTypes = [
  { name: '経費申請', icon: Receipt, count: 12, color: 'from-emerald-500 to-emerald-600' },
  { name: '休暇申請', icon: Calendar, count: 8, color: 'from-blue-500 to-blue-600' },
  { name: '出張申請', icon: Plane, count: 3, color: 'from-violet-500 to-violet-600' },
  { name: '購買申請', icon: ShoppingCart, count: 5, color: 'from-amber-500 to-amber-600' },
  { name: '採用申請', icon: UserPlus, count: 2, color: 'from-pink-500 to-pink-600' },
  { name: '端末申請', icon: Laptop, count: 4, color: 'from-sky-500 to-sky-600' },
]

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'approve'>('all')

  const pendingCount = demoApplications.filter(a => a.status === 'pending').length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">申請・承認</h1>
          <p className="text-sm text-gray-500 mt-1">
            承認待ちが <span className="text-amber-600 font-semibold">{pendingCount}件</span> あります
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            新規申請
          </button>
        </div>
      </div>

      {/* Application Type Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {applicationTypes.map((type) => (
          <button
            key={type.name}
            className="glass rounded-2xl p-4 hover:bg-white/80 transition-all group text-left"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
              <type.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-800">{type.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{type.count}件</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'mine' as const, label: '自分の申請' },
          { key: 'approve' as const, label: '承認依頼' },
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

      {/* Application Cards */}
      <div className="space-y-3">
        {demoApplications.map((app) => {
          const status = statusConfig[app.status]
          const StatusIcon = status.icon

          return (
            <div
              key={app.id}
              className="glass rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <app.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">{app.id}</span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-500">{app.type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {app.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>申請者: {app.applicant}</span>
                      <span>承認者: {app.approver}</span>
                      <span>{app.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {app.amount && (
                    <span className="text-sm font-semibold text-gray-700">{app.amount}</span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
