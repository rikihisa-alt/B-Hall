'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  BookOpen,
  Plus,
  Search,
  ChevronRight,
  Eye,
  Tag,
  Inbox,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import { useKnowledgeStore } from '@/stores/knowledge-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  KNOWLEDGE_TYPE_LABELS,
  KNOWLEDGE_TYPE_COLORS,
  DEPARTMENTS,
} from '@/lib/constants'
import { formatRelative } from '@/lib/date'
import type { KnowledgeType, KnowledgeArticle } from '@/types'

const TYPE_TABS: { value: KnowledgeType | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'manual', label: 'マニュアル' },
  { value: 'procedure', label: '手順書' },
  { value: 'faq', label: 'FAQ' },
  { value: 'guide', label: 'ガイド' },
  { value: 'template', label: 'テンプレート' },
  { value: 'column', label: 'コラム' },
]

export default function KnowledgePage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<KnowledgeType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailArticle, setDetailArticle] = useState<KnowledgeArticle | null>(null)

  const { currentUser, getUserName } = useAuth()
  const { addToast } = useToast()
  const getArticles = useKnowledgeStore((s) => s.getArticles)
  const getArticlesByType = useKnowledgeStore((s) => s.getArticlesByType)
  const searchArticles = useKnowledgeStore((s) => s.searchArticles)
  const addArticle = useKnowledgeStore((s) => s.addArticle)
  const incrementViewCount = useKnowledgeStore((s) => s.incrementViewCount)
  const hydrated = useKnowledgeStore((s) => s._hydrated)

  // Create form state
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState<KnowledgeType>('manual')
  const [formContent, setFormContent] = useState('')
  const [formDepartment, setFormDepartment] = useState('')
  const [formTags, setFormTags] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredArticles = useMemo(() => {
    if (searchQuery.trim()) {
      const results = searchArticles(searchQuery)
      if (activeTab === 'all') return results
      return results.filter((a) => a.type === activeTab)
    }
    if (activeTab === 'all') return getArticles()
    return getArticlesByType(activeTab)
  }, [activeTab, searchQuery, getArticles, getArticlesByType, searchArticles])

  const sortedArticles = useMemo(() => {
    return [...filteredArticles]
      .filter((a) => a.is_published || a.author_id === currentUser?.id)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }, [filteredArticles, currentUser])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 bg-bg-elevated rounded" />
        <div className="h-10 w-1/3 bg-bg-elevated rounded" />
        <div className="h-12 w-full bg-bg-elevated rounded-[16px]" />
        <div className="h-48 bg-bg-elevated rounded-[16px]" />
      </div>
    )
  }

  const allArticles = getArticles()
  const publishedCount = allArticles.filter((a) => a.is_published).length
  const totalViews = allArticles.reduce((sum, a) => sum + a.view_count, 0)

  const handleCreate = () => {
    if (!formTitle.trim() || !currentUser) return
    addArticle({
      title: formTitle,
      type: formType,
      content: formContent,
      department: formDepartment,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      author_id: currentUser.id,
      is_published: true,
      created_by: currentUser.id,
      updated_by: currentUser.id,
    })
    addToast('success', 'ナレッジを作成しました')
    setCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormType('manual')
    setFormContent('')
    setFormDepartment('')
    setFormTags('')
  }

  const handleOpenDetail = (article: KnowledgeArticle) => {
    incrementViewCount(article.id)
    setDetailArticle(article)
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-[16px] font-bold text-text-primary mt-4 mb-2">{line.replace('## ', '')}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-[14px] font-semibold text-text-primary mt-3 mb-1.5">{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('- [ ] ')) {
        return (
          <p key={i} className="text-[14px] text-text-secondary flex items-center gap-2 ml-4">
            <span className="w-4 h-4 rounded border border-border inline-block shrink-0" />
            {line.replace('- [ ] ', '')}
          </p>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <p key={i} className="text-[14px] text-text-secondary ml-4">
            <span className="text-text-muted mr-2">-</span>{line.replace('- ', '')}
          </p>
        )
      }
      if (line.match(/^\d+\. /)) {
        return (
          <p key={i} className="text-[14px] text-text-secondary ml-4">{line}</p>
        )
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />
      }
      // Handle **bold**
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} className="text-[14px] text-text-secondary leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold text-text-primary">{part}</strong> : part
          )}
        </p>
      )
    })
  }

  // If viewing a detail article, show inline
  if (detailArticle) {
    return (
      <motion.div {...pageTransition}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] mb-4">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <button onClick={() => setDetailArticle(null)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">ナレッジ</button>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-secondary font-medium truncate max-w-[200px]">{detailArticle.title}</span>
        </nav>

        <div className="mb-6">
          <button
            onClick={() => setDetailArticle(null)}
            className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            一覧に戻る
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-text-primary tracking-tight mb-2">{detailArticle.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant={KNOWLEDGE_TYPE_COLORS[detailArticle.type] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={KNOWLEDGE_TYPE_LABELS[detailArticle.type]}
                />
                {!detailArticle.is_published && (
                  <Badge variant="warning" label="下書き" />
                )}
                <span className="flex items-center gap-1 text-[12px] text-text-muted">
                  <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                  <span style={{ fontFamily: 'var(--font-inter)' }}>{detailArticle.view_count}</span>
                </span>
                <span className="text-[12px] text-text-muted">
                  {getUserName(detailArticle.author_id)} · {detailArticle.department}
                </span>
                <span className="text-[12px] text-text-muted">
                  v{detailArticle.version} · {formatRelative(detailArticle.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {detailArticle.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {detailArticle.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-elevated text-[12px] text-text-secondary"
              >
                <Tag className="w-3 h-3" strokeWidth={2} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6 sm:p-8"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          {renderContent(detailArticle.content)}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">ナレッジ</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">ナレッジ</h1>
          <p className="text-[13px] text-text-secondary mt-1">テンプレート・手順書・FAQ</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)} className="min-h-[44px] md:min-h-0">
          新規作成
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" strokeWidth={2} />
            全記事
          </p>
          <p className="text-[24px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>{allArticles.length}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <FileText className="w-3 h-3" strokeWidth={2} />
            公開中
          </p>
          <p className="text-[24px] font-bold text-success" style={{ fontFamily: 'var(--font-inter)' }}>{publishedCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <Eye className="w-3 h-3" strokeWidth={2} />
            総閲覧数
          </p>
          <p className="text-[24px] font-bold text-accent" style={{ fontFamily: 'var(--font-inter)' }}>{totalViews}</p>
        </motion.div>
      </motion.div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="ナレッジを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-surface border border-border rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer flex-shrink-0 min-h-[36px] md:min-h-0 ${
                activeTab === tab.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        {sortedArticles.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">ナレッジが見つかりません</p>
              <p className="text-[13px] text-text-muted mb-4">新しいナレッジを作成して始めましょう</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                新規作成
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {sortedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleOpenDetail(article)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                  <BookOpen className="w-[18px] h-[18px] text-text-muted" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{article.title}</p>
                    {!article.is_published && (
                      <Badge variant="warning" label="下書き" />
                    )}
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {getUserName(article.author_id)} · {article.department}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-elevated text-[11px] text-text-muted"
                    >
                      <Tag className="w-2.5 h-2.5" strokeWidth={2} />
                      {tag}
                    </span>
                  ))}
                </div>
                <Badge
                  variant={KNOWLEDGE_TYPE_COLORS[article.type] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={KNOWLEDGE_TYPE_LABELS[article.type]}
                />
                <span className="flex items-center gap-1 text-[12px] text-text-muted shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                  <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                  {article.view_count}
                </span>
                <span className="text-[12px] text-text-muted shrink-0 hidden sm:block">
                  {formatRelative(article.updated_at)}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors shrink-0" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); resetForm() }}
        title="ナレッジを作成"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); resetForm() }}>キャンセル</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!formTitle.trim()}>作成</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="タイトル"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="ナレッジのタイトル"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                種別 <span className="text-accent">*</span>
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as KnowledgeType)}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
              >
                {Object.entries(KNOWLEDGE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                部署
              </label>
              <select
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
              >
                <option value="">選択してください</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              内容 <span className="text-accent">*</span>
            </label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Markdown形式で記述できます（## 見出し、- リスト、**太字** など）"
              rows={10}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none font-mono text-[13px]"
            />
          </div>
          <Input
            label="タグ（カンマ区切り）"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
            placeholder="手順, 経費, マニュアル"
          />
        </div>
      </Modal>
    </motion.div>
  )
}
