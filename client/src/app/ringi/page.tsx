'use client'

import { useState } from 'react'
import {
  Stamp,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Banknote,
} from 'lucide-react'

type RingiStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'executing'

interface Ringi {
  id: string
  title: string
  purpose: string
  amount: string
  applicant: string
  department: string
  date: string
  status: RingiStatus
  approvers: { name: string; status: 'approved' | 'pending' | 'rejected' }[]
  priority: 'high' | 'medium' | 'low'
}

const statusConfig: Record<RingiStatus, { label: string; color: string }> = {
  draft: { label: '下書き', color: 'text-[#6B7280] bg-white/[0.06]' },
  pending: { label: '決裁待ち', color: 'text-[#F5A524] bg-[#F5A524]/10' },
  approved: { label: '決裁済み', color: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  rejected: { label: '差戻し', color: 'text-[#FF5D5D] bg-[#FF5D5D]/10' },
  executing: { label: '実行中', color: 'text-[#7C8CFF] bg-[#7C8CFF]/10' },
}

const priorityConfig = {
  high: { label: '高', color: 'text-[#FF5D5D] bg-[#FF5D5D]/10' },
  medium: { label: '中', color: 'text-[#F5A524] bg-[#F5A524]/10' },
  low: { label: '低', color: 'text-[#6B7280] bg-white/[0.06]' },
}

const demoRingis: Ringi[] = [
  {
    id: 'RNG-2026-001',
    title: 'クラウドサービス導入（年間契約）',
    purpose: '業務効率化のためSaaS導入。月間工数20%削減見込み。',
    amount: '¥3,600,000',
    applicant: '佐藤太郎',
    department: '情報システム部',
    date: '2026-03-12',
    status: 'pending',
    approvers: [
      { name: '高橋課長', status: 'approved' },
      { name: '田中部長', status: 'pending' },
      { name: '代表取締役', status: 'pending' },
    ],
    priority: 'high',
  },
  {
    id: 'RNG-2026-002',
    title: 'オフィス移転プロジェクト',
    purpose: '人員増加に伴うオフィス拡張。現在のスペースでは2026年Q3に限界。',
    amount: '¥15,000,000',
    applicant: '山田花子',
    department: '総務部',
    date: '2026-03-10',
    status: 'pending',
    approvers: [
      { name: '佐藤部長', status: 'approved' },
      { name: '取締役会', status: 'pending' },
    ],
    priority: 'high',
  },
  {
    id: 'RNG-2026-003',
    title: '新規採用枠追加（エンジニア3名）',
    purpose: '開発体制強化。現在のリソースではQ2のロードマップ達成が困難。',
    amount: '¥18,000,000',
    applicant: '鈴木一郎',
    department: '開発部',
    date: '2026-03-08',
    status: 'approved',
    approvers: [
      { name: '高橋CTO', status: 'approved' },
      { name: '代表取締役', status: 'approved' },
    ],
    priority: 'high',
  },
  {
    id: 'RNG-2026-004',
    title: '社内研修プログラム導入',
    purpose: 'マネジメント研修を全管理職に実施。離職率改善目標5%。',
    amount: '¥1,200,000',
    applicant: '伊藤健太',
    department: '人事部',
    date: '2026-03-05',
    status: 'executing',
    approvers: [
      { name: '佐藤部長', status: 'approved' },
      { name: '代表取締役', status: 'approved' },
    ],
    priority: 'medium',
  },
  {
    id: 'RNG-2026-005',
    title: '営業車両リース契約更新',
    purpose: '現行リース満了に伴う更新。EV車両への切り替えを提案。',
    amount: '¥4,800,000',
    applicant: '渡辺美咲',
    department: '営業部',
    date: '2026-03-03',
    status: 'rejected',
    approvers: [
      { name: '田中部長', status: 'rejected' },
    ],
    priority: 'low',
  },
]

export default function RingiPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all')

  const pendingCount = demoRingis.filter(r => r.status === 'pending').length
  const totalAmount = '¥42,600,000'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">稟議</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            決裁待ちが <span className="text-[#F5A524] font-semibold">{pendingCount}件</span> あります
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8D9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            新規稟議
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5A524]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F5A524]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">決裁待ち</p>
              <p className="text-xl font-bold text-[#F5F7FA]">{pendingCount}件</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C8CFF]/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-[#7C8CFF]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">今月の稟議総額</p>
              <p className="text-xl font-bold text-[#F5F7FA]">{totalAmount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2FBF71]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#2FBF71]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">今月承認率</p>
              <p className="text-xl font-bold text-[#F5F7FA]">75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'pending' as const, label: '決裁待ち' },
          { key: 'approved' as const, label: '決裁済み' },
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

      {/* Ringi Cards */}
      <div className="space-y-4">
        {demoRingis.map((ringi) => {
          const status = statusConfig[ringi.status]
          const priority = priorityConfig[ringi.priority]

          return (
            <div
              key={ringi.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Stamp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#5A6070] font-mono">{ringi.id}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${priority.color}`}>
                        {priority.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F5F7FA] group-hover:text-[#7C8CFF] transition-colors">
                      {ringi.title}
                    </h3>
                    <p className="text-xs text-[#5A6070] mt-1 line-clamp-1">{ringi.purpose}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#A8B0BD]">{ringi.amount}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Approval Flow */}
              <div className="flex items-center gap-2 ml-15 pl-15">
                <span className="text-xs text-[#5A6070] mr-2">承認フロー:</span>
                {ringi.approvers.map((approver, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    {idx > 0 && <ArrowRight className="w-3 h-3 text-[#4B5263] mx-1" />}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                      approver.status === 'approved'
                        ? 'bg-[#2FBF71]/10 text-[#2FBF71]'
                        : approver.status === 'rejected'
                        ? 'bg-[#FF5D5D]/10 text-[#FF5D5D]'
                        : 'bg-white/[0.06] text-[#6B7280]'
                    }`}>
                      {approver.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {approver.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {approver.status === 'pending' && <Clock className="w-3 h-3" />}
                      {approver.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-[#5A6070] ml-15 pl-15">
                <span>申請者: {ringi.applicant}</span>
                <span>{ringi.department}</span>
                <span>{ringi.date}</span>
                {ringi.status === 'executing' && (
                  <span className="flex items-center gap-1 text-[#7C8CFF]">
                    <FileText className="w-3 h-3" />
                    実行タスクあり
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
