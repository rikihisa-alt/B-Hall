'use client'

import { useState } from 'react'
import {
  Lightbulb,
  Plus,
  Search,
  BookOpen,
  FileText,
  CheckSquare,
  HelpCircle,
  Bookmark,
  Clock,
  Eye,
  User,
  Tag,
  ChevronRight,
  Star,
} from 'lucide-react'

type KnowledgeType = 'manual' | 'procedure' | 'checklist' | 'faq' | 'template' | 'guide'

interface KnowledgeItem {
  id: string
  title: string
  type: KnowledgeType
  department: string
  author: string
  updatedAt: string
  views: number
  bookmarks: number
  tags: string[]
  summary: string
}

const typeConfig: Record<KnowledgeType, { label: string; icon: typeof BookOpen; color: string }> = {
  manual: { label: 'マニュアル', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  procedure: { label: '手順書', icon: FileText, color: 'from-violet-500 to-violet-600' },
  checklist: { label: 'チェックリスト', icon: CheckSquare, color: 'from-emerald-500 to-emerald-600' },
  faq: { label: 'FAQ', icon: HelpCircle, color: 'from-amber-500 to-amber-600' },
  template: { label: 'テンプレート', icon: FileText, color: 'from-rose-500 to-rose-600' },
  guide: { label: 'ガイド', icon: Lightbulb, color: 'from-sky-500 to-sky-600' },
}

const demoItems: KnowledgeItem[] = [
  {
    id: 'KNW-001',
    title: '新入社員オンボーディング手順書',
    type: 'procedure',
    department: '人事部',
    author: '佐藤花子',
    updatedAt: '2026-03-10',
    views: 234,
    bookmarks: 18,
    tags: ['入社', 'オンボーディング', '必読'],
    summary: '新入社員の初日から1ヶ月目までの受入手順。総務・IT・人事の各部門がやるべきことをステップ別に記載。',
  },
  {
    id: 'KNW-002',
    title: '経費精算マニュアル',
    type: 'manual',
    department: '経理部',
    author: '高橋美咲',
    updatedAt: '2026-02-28',
    views: 567,
    bookmarks: 42,
    tags: ['経費', '精算', '全社員'],
    summary: '経費精算の申請方法、領収書の扱い、承認フロー、よくある差戻し理由について解説。',
  },
  {
    id: 'KNW-003',
    title: '月次決算チェックリスト',
    type: 'checklist',
    department: '経理部',
    author: '高橋美咲',
    updatedAt: '2026-03-01',
    views: 89,
    bookmarks: 12,
    tags: ['月次', '決算', '経理'],
    summary: '月次決算で確認すべき項目一覧。証憑回収、残高確認、仕訳チェックなど。',
  },
  {
    id: 'KNW-004',
    title: '有給休暇に関するFAQ',
    type: 'faq',
    department: '人事部',
    author: '佐藤花子',
    updatedAt: '2026-01-15',
    views: 1203,
    bookmarks: 56,
    tags: ['有休', '休暇', '全社員'],
    summary: '有給休暇の付与日数、取得方法、時季変更権、計画年休について。',
  },
  {
    id: 'KNW-005',
    title: '契約書レビューガイドライン',
    type: 'guide',
    department: '法務部',
    author: '鈴木一郎',
    updatedAt: '2026-02-20',
    views: 145,
    bookmarks: 23,
    tags: ['契約', '法務', 'レビュー'],
    summary: '契約書を確認する際のチェックポイント、よくあるリスク条項、修正すべき文言について。',
  },
  {
    id: 'KNW-006',
    title: '稟議起票テンプレート集',
    type: 'template',
    department: '総務部',
    author: '渡辺翔',
    updatedAt: '2026-03-05',
    views: 312,
    bookmarks: 35,
    tags: ['稟議', 'テンプレート', '全社員'],
    summary: '各種稟議のテンプレート。設備投資、システム導入、採用関連、その他。',
  },
]

const categoryQuickAccess = [
  { type: 'manual' as const, count: 24 },
  { type: 'procedure' as const, count: 18 },
  { type: 'checklist' as const, count: 15 },
  { type: 'faq' as const, count: 32 },
  { type: 'template' as const, count: 28 },
  { type: 'guide' as const, count: 11 },
]

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ナレッジ</h1>
          <p className="text-sm text-gray-500 mt-1">マニュアル・手順書・テンプレート</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="マニュアル・手順書・テンプレートを検索..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Category Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categoryQuickAccess.map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon
          return (
            <button
              key={item.type}
              className="glass rounded-2xl p-4 hover:bg-white/80 transition-all group text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-800">{config.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.count}件</p>
            </button>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'popular' as const, label: '人気' },
          { key: 'recent' as const, label: '最近更新' },
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

      {/* Knowledge Items */}
      <div className="space-y-3">
        {demoItems.map((item) => {
          const type = typeConfig[item.type]
          const TypeIcon = type.icon
          return (
            <div
              key={item.id}
              className="glass rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <TypeIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500">
                        {type.label}
                      </span>
                      <span className="text-xs text-gray-400">{item.department}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.updatedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      {item.bookmarks}
                    </span>
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
