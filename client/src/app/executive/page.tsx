'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Bot,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Users,
  AlertTriangle,
  Target,
  Sparkles,
  BookOpen,
  PieChart,
  Activity,
} from 'lucide-react'

const modules = [
  {
    name: '経営管理',
    description: '経営状況の可視化・投資判断・分析',
    icon: BarChart3,
    href: '/management',
    color: 'from-indigo-500 to-indigo-600',
    stats: [
      { label: '月間売上', value: '¥8.4M' },
      { label: '営業利益率', value: '18.2%' },
      { label: '従業員数', value: 48 },
      { label: 'リスク件数', value: 3 },
    ],
    highlights: [
      { icon: DollarSign, text: '今月の売上は前月比 +12.3%', positive: true },
      { icon: Users, text: '離職率 2.1%（業界平均以下）', positive: true },
      { icon: AlertTriangle, text: '高額稟議1件が未決裁', positive: false },
    ],
  },
  {
    name: 'ナレッジ',
    description: 'テンプレート・手順書・FAQ・社内知識',
    icon: Lightbulb,
    href: '/knowledge',
    color: 'from-yellow-500 to-yellow-600',
    stats: [
      { label: '記事数', value: 128 },
      { label: 'テンプレート', value: 34 },
      { label: '今月追加', value: 6 },
      { label: '閲覧数', value: '1.2K' },
    ],
    categories: [
      { name: '業務マニュアル', count: 24 },
      { name: 'テンプレート', count: 34 },
      { name: 'FAQ', count: 45 },
      { name: '規程・ガイド', count: 25 },
    ],
  },
  {
    name: '改善・目安箱',
    description: '改善提案・匿名投稿・フィードバック',
    icon: MessageSquare,
    href: '/improvements',
    color: 'from-pink-500 to-pink-600',
    stats: [
      { label: '今月の提案', value: 7 },
      { label: '対応中', value: 3 },
      { label: '実施済', value: 12 },
      { label: '匿名投稿', value: 4 },
    ],
    recentProposals: [
      { title: 'リモートワーク申請フローの簡素化', status: '検討中', votes: 8 },
      { title: '社内勉強会の月次開催', status: '実施決定', votes: 15 },
      { title: '経費精算のモバイル対応', status: '対応中', votes: 12 },
    ],
  },
  {
    name: 'ジジロボ',
    description: 'AIアシスタントに業務を相談',
    icon: Bot,
    href: '/assistant',
    color: 'from-cyan-500 to-cyan-600',
    isAI: true,
    capabilities: [
      '業務手順の確認・ガイド',
      '申請書類の作成サポート',
      '社内ルール・規程の質問応答',
      'レポート・報告書の下書き',
    ],
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case '検討中': return 'text-[#F5A524] bg-[#F5A524]/10'
    case '実施決定': return 'text-[#2FBF71] bg-[#2FBF71]/10'
    case '対応中': return 'text-[#60A5FA] bg-[#60A5FA]/10'
    default: return 'text-[#6B7280] bg-white/[0.06]'
  }
}

export default function ExecutivePage() {
  const router = useRouter()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white/90">経営・ナレッジ</h1>
            <p className="text-sm text-[#6B7280]">経営判断・知識共有・改善活動を推進</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-[10px] font-semibold text-[#4B5263] uppercase tracking-[0.1em] mb-4">
          経営サマリー
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-[#5A6070]">月間売上</span>
            </div>
            <p className="text-xl font-bold text-white/90">¥8.4M</p>
            <p className="text-xs text-[#2FBF71] mt-0.5">↑ 12.3% 前月比</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-[#5A6070]">営業利益</span>
            </div>
            <p className="text-xl font-bold text-white/90">¥1.53M</p>
            <p className="text-xs text-[#2FBF71] mt-0.5">利益率 18.2%</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-[#5A6070]">改善提案</span>
            </div>
            <p className="text-xl font-bold text-white/90">7件</p>
            <p className="text-xs text-[#60A5FA] mt-0.5">3件対応中</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-[#5A6070]">ナレッジ活用</span>
            </div>
            <p className="text-xl font-bold text-white/90">1.2K</p>
            <p className="text-xs text-[#5A6070] mt-0.5">今月の閲覧数</p>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-5">
        {modules.map((mod) => {
          const ModIcon = mod.icon
          return (
            <div key={mod.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-sm`}>
                      <ModIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white/90">{mod.name}</h3>
                      <p className="text-sm text-[#6B7280]">{mod.description}</p>
                    </div>
                  </div>
                  <Link
                    href={mod.href}
                    className="flex items-center gap-1 text-sm font-medium text-[#7C8CFF] hover:text-[#929FFF] transition-colors"
                  >
                    開く <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Stats (for non-AI modules) */}
                {'stats' in mod && mod.stats && (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {mod.stats.map((stat) => (
                      <div key={stat.label} className="bg-white/[0.04] rounded-lg px-3 py-2 text-center">
                        <p className="text-lg font-bold text-white/90">{stat.value}</p>
                        <p className="text-[11px] text-[#5A6070]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights (経営管理) */}
                {'highlights' in mod && mod.highlights && (
                  <div className="space-y-2">
                    {mod.highlights.map((h, idx) => {
                      const HIcon = h.icon
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                            h.positive
                              ? 'bg-[#2FBF71]/10 text-[#2FBF71] border-[#2FBF71]/20'
                              : 'bg-[#F5A524]/10 text-[#F5A524] border-[#F5A524]/20'
                          }`}
                        >
                          <HIcon className={`w-3.5 h-3.5 shrink-0 ${h.positive ? 'text-[#2FBF71]' : 'text-[#F5A524]'}`} />
                          <span>{h.text}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Categories (ナレッジ) */}
                {'categories' in mod && mod.categories && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {mod.categories.map((cat) => (
                      <Link key={cat.name} href={mod.href}>
                        <div className="bg-white/[0.04] rounded-lg px-3 py-3 hover:bg-white/[0.06] transition-colors cursor-pointer text-center">
                          <BookOpen className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                          <p className="text-sm font-medium text-[#A8B0BD]">{cat.name}</p>
                          <p className="text-xs text-[#5A6070]">{cat.count}件</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recent Proposals (改善・目安箱) */}
                {'recentProposals' in mod && mod.recentProposals && (
                  <div className="space-y-1">
                    {mod.recentProposals.map((p, idx) => (
                      <Link key={idx} href={mod.href}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                          <span className="flex-1 text-sm text-[#A8B0BD] truncate">{p.title}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(p.status)}`}>
                            {p.status}
                          </span>
                          <span className="text-xs text-[#5A6070]">👍 {p.votes}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* AI Capabilities (ジジロボ) */}
                {'isAI' in mod && mod.isAI && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {'capabilities' in mod && mod.capabilities && mod.capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <Sparkles className="w-4 h-4 text-[#5A6070] shrink-0" />
                          <span className="text-sm text-[#A8B0BD]">{cap}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={mod.href}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-sm hover:shadow-md"
                    >
                      <Bot className="w-4 h-4" />
                      ジジロボに相談する
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
