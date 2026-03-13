'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Plus,
  Filter,
  ThumbsUp,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Target,
  User,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react'

type ProposalStatus = 'new' | 'reviewing' | 'approved' | 'in_progress' | 'completed' | 'rejected'
type ProposalCategory = 'process' | 'system' | 'workplace' | 'cost' | 'safety' | 'other'

interface Proposal {
  id: string
  title: string
  description: string
  category: ProposalCategory
  status: ProposalStatus
  author: string | null
  anonymous: boolean
  department: string
  date: string
  likes: number
  comments: number
  impact?: string
}

const statusConfig: Record<ProposalStatus, { label: string; color: string }> = {
  new: { label: '新規', color: 'text-blue-400 bg-blue-500/10' },
  reviewing: { label: '検討中', color: 'text-amber-400 bg-amber-500/10' },
  approved: { label: '承認済', color: 'text-emerald-400 bg-emerald-500/10' },
  in_progress: { label: '実行中', color: 'text-violet-400 bg-violet-500/10' },
  completed: { label: '完了', color: 'text-[#6B7280] bg-white/[0.05]' },
  rejected: { label: '見送り', color: 'text-red-400 bg-red-500/10' },
}

const categoryConfig: Record<ProposalCategory, { label: string; color: string }> = {
  process: { label: '業務プロセス', color: 'from-blue-500 to-blue-600' },
  system: { label: 'システム・IT', color: 'from-violet-500 to-violet-600' },
  workplace: { label: '職場環境', color: 'from-emerald-500 to-emerald-600' },
  cost: { label: 'コスト削減', color: 'from-amber-500 to-amber-600' },
  safety: { label: '安全・衛生', color: 'from-red-500 to-red-600' },
  other: { label: 'その他', color: 'from-gray-500 to-gray-600' },
}

const demoProposals: Proposal[] = [
  {
    id: 'IMP-001',
    title: '経費精算の自動仕訳機能',
    description: '経費申請承認後に自動で会計仕訳を生成する機能を追加。手動入力を削減し、経理部の月次締め作業を効率化。',
    category: 'process',
    status: 'in_progress',
    author: '高橋美咲',
    anonymous: false,
    department: '経理部',
    date: '2026-03-10',
    likes: 24,
    comments: 8,
    impact: '月間作業時間 10時間削減見込み',
  },
  {
    id: 'IMP-002',
    title: '会議室予約システムの改善',
    description: '現在のGoogleカレンダーベースの予約ではダブルブッキングが頻発。専用の予約画面を設け、空き状況のリアルタイム表示を実現したい。',
    category: 'system',
    status: 'approved',
    author: '田中太郎',
    anonymous: false,
    department: '開発部',
    date: '2026-03-08',
    likes: 31,
    comments: 12,
    impact: 'ダブルブッキング解消',
  },
  {
    id: 'IMP-003',
    title: 'リモートワーク時のコミュニケーション改善',
    description: '週2回のリモートワーク日に、チーム内の情報共有が滞りがち。短時間の朝会やチャットルールの整備を提案。',
    category: 'workplace',
    status: 'reviewing',
    author: null,
    anonymous: true,
    department: '匿名',
    date: '2026-03-07',
    likes: 18,
    comments: 5,
  },
  {
    id: 'IMP-004',
    title: '印刷コスト削減のためのペーパーレス推進',
    description: 'モノクロ印刷の月間枚数が5,000枚超。社内文書のデジタル化と承認電子化でコスト30%削減を目指す。',
    category: 'cost',
    status: 'approved',
    author: '渡辺美咲',
    anonymous: false,
    department: '総務部',
    date: '2026-03-05',
    likes: 15,
    comments: 6,
    impact: '年間¥360,000削減見込み',
  },
  {
    id: 'IMP-005',
    title: 'サーバールームの温度管理強化',
    description: '先日のヒヤリハット(温度上昇)を受けた再発防止策。温度センサー追加とアラート自動通知の導入を提案。',
    category: 'safety',
    status: 'in_progress',
    author: '山田健太',
    anonymous: false,
    department: '情報システム部',
    date: '2026-03-04',
    likes: 22,
    comments: 7,
    impact: 'インシデント再発防止',
  },
  {
    id: 'IMP-006',
    title: '有給取得率向上のための施策',
    description: '現在の有給取得率は65%。部門別の取得率可視化と、四半期ごとの計画取得推奨を提案。',
    category: 'workplace',
    status: 'new',
    author: null,
    anonymous: true,
    department: '匿名',
    date: '2026-03-02',
    likes: 28,
    comments: 3,
  },
  {
    id: 'IMP-007',
    title: 'オンボーディング手順の動画マニュアル化',
    description: 'テキストベースの手順書を動画化。新入社員の理解度向上と、教育担当の負荷軽減を目指す。',
    category: 'process',
    status: 'completed',
    author: '佐藤花子',
    anonymous: false,
    department: '人事部',
    date: '2026-02-20',
    likes: 19,
    comments: 4,
    impact: 'オンボーディング期間 50%短縮',
  },
]

const stats = [
  { label: '今月の提案', value: '12件', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
  { label: '実行中', value: '4件', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
  { label: '完了', value: '8件', icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
  { label: '効果合計', value: '¥1.2M/年', icon: Target, color: 'from-violet-500 to-violet-600' },
]

export default function ImprovementsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'mine'>('all')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">改善・目安箱</h1>
          <p className="text-sm text-[#6B7280] mt-1">改善提案・匿名投稿で会社をより良くする</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8D9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            提案する
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-[#5A6070]">{stat.label}</p>
                <p className="text-xl font-bold text-white/90">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-[#6B7280] hover:bg-white/[0.08] hover:border-white/[0.10] transition-all"
          >
            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${config.color}`} />
            {config.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'popular' as const, label: '人気順' },
          { key: 'mine' as const, label: '自分の提案' },
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

      {/* Proposal Cards */}
      <div className="space-y-4">
        {demoProposals
          .sort((a, b) => activeTab === 'popular' ? b.likes - a.likes : 0)
          .map((proposal) => {
            const status = statusConfig[proposal.status]
            const category = categoryConfig[proposal.category]

            return (
              <div
                key={proposal.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5A6070] font-mono">{proposal.id}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.05] text-[#6B7280]">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${category.color}`} />
                      {category.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#4B5263] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-sm font-semibold text-white/90 group-hover:text-[#7C8CFF] transition-colors mb-2">
                  {proposal.title}
                </h3>
                <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{proposal.description}</p>

                {proposal.impact && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-xs text-emerald-400 mb-3">
                    <Target className="w-3 h-3" />
                    {proposal.impact}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#5A6070]">
                    {proposal.anonymous ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        匿名
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {proposal.author}
                      </span>
                    )}
                    <span>{proposal.department}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proposal.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#5A6070]">
                    <button className="flex items-center gap-1 hover:text-[#7C8CFF] transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {proposal.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {proposal.comments}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
