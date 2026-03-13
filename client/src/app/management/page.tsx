'use client'

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Banknote,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  FileText,
  CheckCircle2,
  Target,
} from 'lucide-react'

const kpiCards = [
  { title: '月次売上', value: '¥12,800,000', change: '+5.1%', trend: 'up' as const, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
  { title: '月次支出', value: '¥9,200,000', change: '+1.8%', trend: 'up' as const, icon: TrendingDown, color: 'from-rose-500 to-rose-600' },
  { title: '現預金残高', value: '¥28,450,000', change: '+2.3%', trend: 'up' as const, icon: Banknote, color: 'from-blue-500 to-blue-600' },
  { title: '従業員数', value: '42名', change: '+2', trend: 'up' as const, icon: Users, color: 'from-violet-500 to-violet-600' },
]

const criticalItems = [
  { title: '高額稟議（決裁待ち）', detail: 'オフィス移転プロジェクト ¥15,000,000', severity: 'high', icon: FileText },
  { title: '未承認重要案件', detail: 'クラウドサービス導入 ¥3,600,000', severity: 'medium', icon: Clock },
  { title: '契約更新期限間近', detail: 'NDA - 株式会社XYZ（3/31期限）', severity: 'high', icon: AlertTriangle },
  { title: 'インシデント未対応', detail: '来客エリア転倒事故 - 再発防止策未完了', severity: 'high', icon: Shield },
]

const departmentStatus = [
  { name: '開発部', tasks: 15, completed: 11, overdue: 1, load: 73 },
  { name: '営業部', tasks: 8, completed: 5, overdue: 0, load: 62 },
  { name: '人事部', tasks: 12, completed: 9, overdue: 2, load: 85 },
  { name: '経理部', tasks: 10, completed: 8, overdue: 1, load: 80 },
  { name: '総務部', tasks: 7, completed: 4, overdue: 0, load: 57 },
  { name: '法務部', tasks: 5, completed: 4, overdue: 0, load: 45 },
]

const recentImprovements = [
  { title: '経費精算プロセス自動化', proposer: '高橋美咲', status: '実行中', impact: '月間10時間削減' },
  { title: '会議室予約システム改善', proposer: '田中太郎', status: '検討中', impact: 'ダブルブッキング解消' },
  { title: 'オンボーディング手順書改定', proposer: '佐藤花子', status: '完了', impact: '準備期間50%短縮' },
]

export default function ManagementPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white/90">経営管理</h1>
        <p className="text-sm text-[#6B7280] mt-1">会社全体の状況を一画面で把握</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs ${
                card.trend === 'up' && card.title.includes('支出')
                  ? 'text-[#F5A524]'
                  : 'text-[#2FBF71]'
              }`}>
                <ArrowUpRight className="w-3 h-3" />
                {card.change}
              </span>
            </div>
            <p className="text-xs text-[#5A6070]">{card.title}</p>
            <p className="text-xl font-bold text-white/90 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Items */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#A8B0BD]">要対応事項</h2>
            <span className="text-xs text-[#FF5D5D] font-medium">{criticalItems.length}件</span>
          </div>
          <div className="space-y-3">
            {criticalItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.severity === 'high' ? 'bg-[#FF5D5D]/10' : 'bg-[#F5A524]/10'
                }`}>
                  <item.icon className={`w-4 h-4 ${
                    item.severity === 'high' ? 'text-[#FF5D5D]' : 'text-[#F5A524]'
                  }`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A8B0BD] group-hover:text-[#7C8CFF] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#5A6070] mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Status */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#A8B0BD]">部門別業務負荷</h2>
          </div>
          <div className="space-y-4">
            {departmentStatus.map((dept) => (
              <div key={dept.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#A8B0BD] font-medium">{dept.name}</span>
                  <div className="flex items-center gap-2 text-xs text-[#5A6070]">
                    <span>{dept.completed}/{dept.tasks}完了</span>
                    {dept.overdue > 0 && (
                      <span className="text-[#FF5D5D]">{dept.overdue}件超過</span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      dept.load >= 80 ? 'bg-gradient-to-r from-amber-400 to-red-400' :
                      dept.load >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                      'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    }`}
                    style={{ width: `${dept.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Proposals */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#F5A524]" />
            <h2 className="text-sm font-semibold text-[#A8B0BD]">改善提案</h2>
          </div>
          <button className="text-xs text-[#7C8CFF] hover:text-[#9BA6FF] font-medium">すべて表示</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentImprovements.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${
                  item.status === '完了' ? 'text-[#2FBF71] bg-[#2FBF71]/10' :
                  item.status === '実行中' ? 'text-[#7C8CFF] bg-[#7C8CFF]/10' :
                  'text-[#F5A524] bg-[#F5A524]/10'
                }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-medium text-white/90">{item.title}</h4>
              <p className="text-xs text-[#5A6070] mt-1">提案者: {item.proposer}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-[#2FBF71]">
                <Target className="w-3 h-3" />
                {item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
