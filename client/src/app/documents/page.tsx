'use client'

import { useState } from 'react'
import {
  FolderOpen,
  Plus,
  Filter,
  Search,
  FileText,
  FileCheck,
  FileLock2,
  FileWarning,
  Clock,
  Download,
  MoreHorizontal,
  Folder,
  Tag,
  Calendar,
  Shield,
} from 'lucide-react'

type DocumentStatus = 'active' | 'expiring' | 'expired' | 'draft'
type DocumentCategory = 'contract' | 'regulation' | 'nda' | 'certificate' | 'manual' | 'form'

interface Document {
  id: string
  title: string
  category: DocumentCategory
  status: DocumentStatus
  owner: string
  department: string
  updatedAt: string
  expiresAt?: string
  version: string
  tags: string[]
}

const categoryConfig: Record<DocumentCategory, { label: string; icon: typeof FileText; color: string }> = {
  contract: { label: '契約書', icon: FileCheck, color: 'from-blue-500 to-blue-600' },
  regulation: { label: '規程', icon: FileLock2, color: 'from-violet-500 to-violet-600' },
  nda: { label: 'NDA', icon: Shield, color: 'from-rose-500 to-rose-600' },
  certificate: { label: '証憑', icon: FileText, color: 'from-emerald-500 to-emerald-600' },
  manual: { label: 'マニュアル', icon: FileText, color: 'from-amber-500 to-amber-600' },
  form: { label: '届出書', icon: FileText, color: 'from-sky-500 to-sky-600' },
}

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  active: { label: '有効', color: 'text-emerald-600 bg-emerald-50' },
  expiring: { label: '期限間近', color: 'text-amber-600 bg-amber-50' },
  expired: { label: '期限切れ', color: 'text-red-600 bg-red-50' },
  draft: { label: '下書き', color: 'text-gray-500 bg-gray-50' },
}

const demoDocuments: Document[] = [
  {
    id: 'DOC-001',
    title: '業務委託基本契約書 - 株式会社ABC',
    category: 'contract',
    status: 'active',
    owner: '鈴木一郎',
    department: '法務部',
    updatedAt: '2026-03-10',
    expiresAt: '2027-03-31',
    version: 'v2.1',
    tags: ['業務委託', '取引先'],
  },
  {
    id: 'DOC-002',
    title: '就業規則（2026年改定版）',
    category: 'regulation',
    status: 'active',
    owner: '佐藤花子',
    department: '人事部',
    updatedAt: '2026-02-15',
    version: 'v5.0',
    tags: ['就業規則', '全社'],
  },
  {
    id: 'DOC-003',
    title: '秘密保持契約書 - 株式会社XYZ',
    category: 'nda',
    status: 'expiring',
    owner: '鈴木一郎',
    department: '法務部',
    updatedAt: '2025-04-01',
    expiresAt: '2026-03-31',
    version: 'v1.0',
    tags: ['NDA', '取引先'],
  },
  {
    id: 'DOC-004',
    title: '経理処理マニュアル',
    category: 'manual',
    status: 'active',
    owner: '高橋美咲',
    department: '経理部',
    updatedAt: '2026-01-20',
    version: 'v3.2',
    tags: ['経理', 'マニュアル'],
  },
  {
    id: 'DOC-005',
    title: '雇用契約書テンプレート（正社員）',
    category: 'contract',
    status: 'active',
    owner: '佐藤花子',
    department: '人事部',
    updatedAt: '2026-03-01',
    version: 'v4.0',
    tags: ['雇用契約', 'テンプレート'],
  },
  {
    id: 'DOC-006',
    title: '取引先登録届出書',
    category: 'form',
    status: 'draft',
    owner: '田中太郎',
    department: '総務部',
    updatedAt: '2026-03-12',
    version: 'v1.0',
    tags: ['届出', '取引先'],
  },
  {
    id: 'DOC-007',
    title: 'リース契約書 - DEFリース',
    category: 'contract',
    status: 'expired',
    owner: '渡辺翔',
    department: '総務部',
    updatedAt: '2025-12-01',
    expiresAt: '2026-02-28',
    version: 'v1.0',
    tags: ['リース', '設備'],
  },
]

const folders = [
  { name: '契約書', count: 45, icon: FileCheck, color: 'from-blue-500 to-blue-600' },
  { name: '規程・規則', count: 12, icon: FileLock2, color: 'from-violet-500 to-violet-600' },
  { name: 'NDA', count: 23, icon: Shield, color: 'from-rose-500 to-rose-600' },
  { name: '証憑・領収書', count: 156, icon: FileText, color: 'from-emerald-500 to-emerald-600' },
  { name: 'マニュアル', count: 18, icon: FileText, color: 'from-amber-500 to-amber-600' },
  { name: '届出書', count: 8, icon: FileText, color: 'from-sky-500 to-sky-600' },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'folders' | 'expiring'>('all')

  const expiringCount = demoDocuments.filter(d => d.status === 'expiring' || d.status === 'expired').length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">法務・文書</h1>
          <p className="text-sm text-gray-500 mt-1">
            期限注意が <span className="text-amber-600 font-semibold">{expiringCount}件</span> あります
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            アップロード
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="文書名・タグ・部署で検索..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: '全て' },
          { key: 'folders' as const, label: 'フォルダ' },
          { key: 'expiring' as const, label: '期限管理' },
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

      {activeTab === 'folders' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <button
              key={folder.name}
              className="glass rounded-2xl p-5 hover:bg-white/80 transition-all group text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                <folder.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{folder.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{folder.count}件</p>
            </button>
          ))}
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'expiring') && (
        <div className="space-y-3">
          {demoDocuments
            .filter(d => activeTab === 'all' || d.status === 'expiring' || d.status === 'expired')
            .map((doc) => {
              const cat = categoryConfig[doc.category]
              const status = statusConfig[doc.status]
              const CatIcon = cat.icon

              return (
                <div
                  key={doc.id}
                  className="glass rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <CatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 font-mono">{doc.id}</span>
                          <span className="text-xs text-gray-300">{doc.version}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          {doc.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500">
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{doc.owner}</span>
                          <span>{doc.department}</span>
                          <span>更新: {doc.updatedAt}</span>
                          {doc.expiresAt && (
                            <span className={doc.status === 'expired' ? 'text-red-500' : doc.status === 'expiring' ? 'text-amber-500' : ''}>
                              期限: {doc.expiresAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
