'use client'

import { useState } from 'react'
import {
  ClipboardList,
  Plus,
  Filter,
  FileText,
  AlertTriangle,
  Calendar,
  Clock,
  MessageSquare,
  User,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react'

type ReportType = 'daily' | 'weekly' | 'monthly' | 'incident' | 'complaint' | 'hiyari'
type ReportStatus = 'submitted' | 'reviewed' | 'action_required' | 'draft'

interface Report {
  id: string
  title: string
  type: ReportType
  status: ReportStatus
  author: string
  department: string
  date: string
  summary: string
  comments: number
}

const typeConfig: Record<ReportType, { label: string; color: string; icon: typeof FileText }> = {
  daily: { label: '日報', color: 'from-blue-500 to-blue-600', icon: Calendar },
  weekly: { label: '週報', color: 'from-indigo-500 to-indigo-600', icon: BookOpen },
  monthly: { label: '月報', color: 'from-violet-500 to-violet-600', icon: ClipboardList },
  incident: { label: '事故報告', color: 'from-red-500 to-red-600', icon: ShieldAlert },
  complaint: { label: 'クレーム報告', color: 'from-amber-500 to-amber-600', icon: AlertTriangle },
  hiyari: { label: 'ヒヤリハット', color: 'from-orange-500 to-orange-600', icon: AlertCircle },
}

const statusConfig: Record<ReportStatus, { label: string; color: string }> = {
  submitted: { label: '提出済', color: 'text-[#7C8CFF] bg-[#7C8CFF]/10' },
  reviewed: { label: '確認済', color: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  action_required: { label: '対応必要', color: 'text-[#FF5D5D] bg-[#FF5D5D]/10' },
  draft: { label: '下書き', color: 'text-[#6B7280] bg-white/[0.05]' },
}

const demoReports: Report[] = [
  {
    id: 'RPT-001',
    title: '3月13日 日報',
    type: 'daily',
    status: 'submitted',
    author: '田中太郎',
    department: '開発部',
    date: '2026-03-13',
    summary: 'B-Hallフロントエンド開発。認証フロー実装完了。明日以降ダッシュボード着手。',
    comments: 2,
  },
  {
    id: 'RPT-002',
    title: '顧客対応クレーム - 請求書発行遅延',
    type: 'complaint',
    status: 'action_required',
    author: '鈴木花子',
    department: '営業部',
    date: '2026-03-12',
    summary: '株式会社ABCより請求書発行の遅延についてクレーム。経理部との連携不足が原因。',
    comments: 5,
  },
  {
    id: 'RPT-003',
    title: 'サーバールーム空調異常 - ヒヤリハット',
    type: 'hiyari',
    status: 'action_required',
    author: '山田健太',
    department: '情報システム部',
    date: '2026-03-11',
    summary: 'サーバールームの温度が35度に上昇。空調フィルター目詰まりが原因。即時対応で復旧。',
    comments: 3,
  },
  {
    id: 'RPT-004',
    title: '第2週 週報',
    type: 'weekly',
    status: 'reviewed',
    author: '佐藤太郎',
    department: '開発部',
    date: '2026-03-10',
    summary: 'スプリント8完了。予定タスクの90%を消化。残課題2件を次週に持ち越し。',
    comments: 1,
  },
  {
    id: 'RPT-005',
    title: '2月度 月報 - 総務部',
    type: 'monthly',
    status: 'reviewed',
    author: '渡辺美咲',
    department: '総務部',
    date: '2026-03-05',
    summary: '備品購入12件処理。オフィス設備点検完了。新入社員受入準備開始。',
    comments: 0,
  },
  {
    id: 'RPT-006',
    title: '来客対応中の転倒事故',
    type: 'incident',
    status: 'action_required',
    author: '伊藤恵',
    department: '総務部',
    date: '2026-03-04',
    summary: '来客対応中、受付エリアで来訪者が転倒。床面のワックス直後だったことが原因。軽傷。',
    comments: 8,
  },
]

const reportTypeQuickAccess = [
  { type: 'daily' as const, count: 156 },
  { type: 'weekly' as const, count: 48 },
  { type: 'monthly' as const, count: 24 },
  { type: 'incident' as const, count: 3 },
  { type: 'complaint' as const, count: 7 },
  { type: 'hiyari' as const, count: 12 },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'incident'>('all')

  const actionRequired = demoReports.filter(r => r.status === 'action_required').length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">報告・改善</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            対応が必要な報告が <span className="text-[#FF5D5D] font-semibold">{actionRequired}件</span> あります
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8E9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            新規報告
          </button>
        </div>
      </div>

      {/* Report Type Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTypeQuickAccess.map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon
          return (
            <button
              key={item.type}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all group text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-[#A8B0BD]">{config.label}</p>
              <p className="text-xs text-[#4B5263] mt-0.5">{item.count}件</p>
            </button>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'daily' as const, label: '日報・週報' },
          { key: 'incident' as const, label: 'インシデント' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white/[0.08] text-white'
                : 'text-[#6B7280] hover:text-[#A8B0BD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="space-y-3">
        {demoReports.map((report) => {
          const type = typeConfig[report.type]
          const status = statusConfig[report.status]
          const TypeIcon = type.icon

          return (
            <div
              key={report.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <TypeIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#4B5263] font-mono">{report.id}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#4B5263] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 group-hover:text-[#7C8CFF] transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{report.summary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#4B5263]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.author}
                    </span>
                    <span>{report.department}</span>
                    <span>{report.date}</span>
                    {report.comments > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {report.comments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
