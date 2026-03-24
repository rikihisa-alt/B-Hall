'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  FileText,
  Plus,
  Search,
  ChevronRight,
  FolderOpen,
  Download,
  Calendar,
  AlertTriangle,
  Tag,
  X,
  Inbox,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useDocumentStore } from '@/stores/document-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_COLORS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DEPARTMENTS,
} from '@/lib/constants'
import { formatDateCompact, formatRelative, isDeadlineSoon } from '@/lib/date'
import type { DocumentCategory, Document } from '@/types'

const CATEGORY_TABS: { value: DocumentCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'contract', label: '契約書' },
  { value: 'nda', label: 'NDA' },
  { value: 'regulation', label: '規程' },
  { value: 'manual', label: 'マニュアル' },
  { value: 'form', label: 'テンプレート' },
  { value: 'certificate', label: '証明書' },
  { value: 'report', label: '報告書' },
  { value: 'other', label: 'その他' },
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function DocumentsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<DocumentCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailDoc, setDetailDoc] = useState<Document | null>(null)

  const { currentUser } = useAuth()
  const { addToast } = useToast()
  const getDocuments = useDocumentStore((s) => s.getDocuments)
  const getDocumentsByCategory = useDocumentStore((s) => s.getDocumentsByCategory)
  const searchDocuments = useDocumentStore((s) => s.searchDocuments)
  const addDocument = useDocumentStore((s) => s.addDocument)
  const updateDocument = useDocumentStore((s) => s.updateDocument)
  const deleteDocument = useDocumentStore((s) => s.deleteDocument)
  const hydrated = useDocumentStore((s) => s._hydrated)

  // Create form state
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState<DocumentCategory>('contract')
  const [formDepartment, setFormDepartment] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formTags, setFormTags] = useState('')
  const [formFileName, setFormFileName] = useState('')

  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState<DocumentCategory>('contract')
  const [editStatus, setEditStatus] = useState<'active' | 'expired' | 'archived'>('active')
  const [editVersion, setEditVersion] = useState(1)
  const [editExpiryDate, setEditExpiryDate] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close status dropdown when clicking outside
  useEffect(() => {
    if (!statusDropdownId) return
    const handler = () => setStatusDropdownId(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [statusDropdownId])

  const filteredDocuments = useMemo(() => {
    if (searchQuery.trim()) {
      const results = searchDocuments(searchQuery)
      if (activeTab === 'all') return results
      return results.filter((d) => d.category === activeTab)
    }
    if (activeTab === 'all') return getDocuments()
    return getDocumentsByCategory(activeTab)
  }, [activeTab, searchQuery, getDocuments, getDocumentsByCategory, searchDocuments])

  const sortedDocuments = useMemo(() => {
    return [...filteredDocuments].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [filteredDocuments])

  const expiringDocs = useMemo(() => {
    return getDocuments().filter((d) => d.expiry_date && isDeadlineSoon(d.expiry_date, 30))
  }, [getDocuments])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-bg-elevated rounded-[16px]" />)}
        </div>
        <div className="h-96 bg-bg-elevated rounded-[16px]" />
      </div>
    )
  }

  const handleCreate = () => {
    if (!formTitle.trim() || !currentUser) return
    addDocument({
      title: formTitle,
      category: formCategory,
      department: formDepartment,
      description: formDescription,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      file_name: formFileName || `${formTitle}.pdf`,
      file_size: 1024000,
      file_type: 'application/pdf',
      file_url: `/files/${formTitle}.pdf`,
      created_by: currentUser.id,
      updated_by: currentUser.id,
    })
    addToast('success', '文書を登録しました')
    setCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormCategory('contract')
    setFormDepartment('')
    setFormDescription('')
    setFormTags('')
    setFormFileName('')
  }

  const enterEditMode = (doc: Document) => {
    setEditTitle(doc.title)
    setEditDescription(doc.description)
    setEditCategory(doc.category)
    setEditStatus(doc.status)
    setEditVersion(doc.version)
    setEditExpiryDate(doc.expiry_date || '')
    setEditMode(true)
    setDeleteConfirm(false)
  }

  const handleSaveEdit = () => {
    if (!detailDoc || !editTitle.trim()) return
    updateDocument(detailDoc.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      status: editStatus,
      version: editVersion,
      expiry_date: editExpiryDate || null,
      updated_by: currentUser?.id || '',
    })
    // Refresh detailDoc with updated data
    const updated = getDocuments().find((d) => d.id === detailDoc.id)
    if (updated) setDetailDoc(updated)
    setEditMode(false)
    addToast('success', '文書を更新しました')
  }

  const handleDelete = () => {
    if (!detailDoc) return
    deleteDocument(detailDoc.id)
    setDetailDoc(null)
    setEditMode(false)
    setDeleteConfirm(false)
    addToast('success', '文書を削除しました')
  }

  const handleQuickStatusChange = (docId: string, newStatus: 'active' | 'expired' | 'archived') => {
    updateDocument(docId, {
      status: newStatus,
      updated_by: currentUser?.id || '',
    })
    setStatusDropdownId(null)
    addToast('success', `ステータスを「${DOCUMENT_STATUS_LABELS[newStatus]}」に変更しました`)
  }

  const allDocs = getDocuments()

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">文書管理</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">文書管理</h1>
          <p className="text-[13px] text-text-secondary mt-1">契約書・規程・法定文書の管理</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)} className="min-h-[44px] md:min-h-0">
          新規文書
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">全文書</p>
          <p className="text-[24px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>{allDocs.length}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <FolderOpen className="w-3 h-3" strokeWidth={2} />
            契約書
          </p>
          <p className="text-[24px] font-bold text-info" style={{ fontFamily: 'var(--font-inter)' }}>
            {allDocs.filter((d) => d.category === 'contract' || d.category === 'nda').length}
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <FileText className="w-3 h-3" strokeWidth={2} />
            規程
          </p>
          <p className="text-[24px] font-bold text-success" style={{ fontFamily: 'var(--font-inter)' }}>
            {allDocs.filter((d) => d.category === 'regulation').length}
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-5">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
            期限間近
          </p>
          <p className="text-[24px] font-bold text-warning" style={{ fontFamily: 'var(--font-inter)' }}>{expiringDocs.length}</p>
        </motion.div>
      </motion.div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="文書を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-surface border border-border rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] transition-all"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
          {CATEGORY_TABS.map((tab) => (
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

      {/* Document List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        {sortedDocuments.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">文書はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しい文書を作成しましょう</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                新規文書
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {sortedDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setDetailDoc(doc)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group relative"
              >
                <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                  <FileText className="w-[18px] h-[18px] text-text-muted" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{doc.title}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{doc.department}</span>
                    <span className="text-text-muted">v{doc.version}</span>
                    {doc.expiry_date && isDeadlineSoon(doc.expiry_date, 30) && (
                      <span className="flex items-center gap-1 text-warning">
                        <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                        期限間近
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-elevated text-[11px] text-text-muted"
                    >
                      <Tag className="w-2.5 h-2.5" strokeWidth={2} />
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Status badge with quick-change dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setStatusDropdownId(statusDropdownId === doc.id ? null : doc.id)
                    }}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={DOCUMENT_STATUS_COLORS[doc.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                      label={DOCUMENT_STATUS_LABELS[doc.status]}
                    />
                  </button>
                  {statusDropdownId === doc.id && (
                    <div
                      className="absolute right-0 top-full mt-1 z-50 bg-bg-surface border border-border rounded-[10px] shadow-lg py-1 min-w-[120px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(['active', 'expired', 'archived'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickStatusChange(doc.id, s)
                          }}
                          className={`w-full text-left px-3 py-2 text-[13px] hover:bg-bg-elevated transition-colors cursor-pointer ${
                            doc.status === s ? 'text-accent font-semibold' : 'text-text-secondary'
                          }`}
                        >
                          {DOCUMENT_STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Badge
                  variant={DOCUMENT_CATEGORY_COLORS[doc.category] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={DOCUMENT_CATEGORY_LABELS[doc.category]}
                />
                {/* Edit / Delete hover actions */}
                <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDetailDoc(doc)
                      setTimeout(() => enterEditMode(doc), 0)
                    }}
                    className="p-1.5 rounded-[8px] hover:bg-bg-elevated text-text-muted hover:text-accent transition-colors cursor-pointer"
                    title="編集"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDetailDoc(doc)
                      setDeleteConfirm(true)
                    }}
                    className="p-1.5 rounded-[8px] hover:bg-red-50 text-text-muted hover:text-danger transition-colors cursor-pointer"
                    title="削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
                <span className="text-[12px] text-text-muted tabular-nums shrink-0 hidden sm:block" style={{ fontFamily: 'var(--font-inter)' }}>
                  {formatDateCompact(doc.updated_at)}
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
        title="文書を登録"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); resetForm() }}>キャンセル</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!formTitle.trim()}>登録</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="タイトル"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="文書のタイトル"
          />
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              カテゴリ <span className="text-accent">*</span>
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as DocumentCategory)}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all"
            >
              {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([key, label]) => (
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
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all"
            >
              <option value="">選択してください</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">説明</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="文書の説明"
              rows={3}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all resize-none"
            />
          </div>
          <Input
            label="タグ（カンマ区切り）"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
            placeholder="契約, 法務, 重要"
          />
          <Input
            label="ファイル名"
            value={formFileName}
            onChange={(e) => setFormFileName(e.target.value)}
            placeholder="document.pdf"
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!detailDoc}
        onClose={() => { setDetailDoc(null); setEditMode(false); setDeleteConfirm(false) }}
        title={editMode ? '文書を編集' : '文書詳細'}
        size="lg"
        footer={
          editMode ? (
            <>
              <Button variant="ghost" onClick={() => setEditMode(false)}>キャンセル</Button>
              <Button variant="primary" onClick={handleSaveEdit} disabled={!editTitle.trim()}>保存</Button>
            </>
          ) : deleteConfirm ? (
            <>
              <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>キャンセル</Button>
              <Button variant="danger" onClick={handleDelete}>削除する</Button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteConfirm(true)}>
                削除
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => { setDetailDoc(null); setEditMode(false) }}>閉じる</Button>
                <Button variant="secondary" size="sm" icon={Pencil} onClick={() => detailDoc && enterEditMode(detailDoc)}>
                  編集
                </Button>
              </div>
            </div>
          )
        }
      >
        {detailDoc && deleteConfirm && !editMode && (
          <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-danger" strokeWidth={1.75} />
            </div>
            <p className="text-[16px] font-semibold text-text-primary mb-2">この文書を削除しますか？</p>
            <p className="text-[13px] text-text-secondary text-center max-w-[320px]">
              「{detailDoc.title}」を削除します。この操作は取り消せません。
            </p>
          </div>
        )}
        {detailDoc && editMode && (
          <div className="space-y-4">
            <Input
              label="タイトル"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="文書のタイトル"
            />
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">説明</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="文書の説明"
                rows={3}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">カテゴリ</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as DocumentCategory)}
                  className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all"
                >
                  {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">ステータス</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'expired' | 'archived')}
                  className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none transition-all"
                >
                  {Object.entries(DOCUMENT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-base rounded-[12px] p-3">
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">バージョン</label>
                <input
                  type="number"
                  min={1}
                  value={editVersion}
                  onChange={(e) => setEditVersion(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-transparent text-[14px] text-text-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  有効期限
                </label>
                <input
                  type="date"
                  value={editExpiryDate ? editExpiryDate.split('T')[0] : ''}
                  onChange={(e) => setEditExpiryDate(e.target.value ? `${e.target.value}T00:00:00` : '')}
                  className="w-full bg-transparent text-[14px] text-text-primary focus:outline-none"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
              </div>
            </div>
          </div>
        )}
        {detailDoc && !editMode && !deleteConfirm && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[18px] font-bold text-text-primary mb-2">{detailDoc.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={DOCUMENT_CATEGORY_COLORS[detailDoc.category] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={DOCUMENT_CATEGORY_LABELS[detailDoc.category]}
                />
                <Badge
                  variant={DOCUMENT_STATUS_COLORS[detailDoc.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={DOCUMENT_STATUS_LABELS[detailDoc.status]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">部署</p>
                <p className="text-[14px] text-text-primary">{detailDoc.department || '未設定'}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">バージョン</p>
                <p className="text-[14px] text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>v{detailDoc.version}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">ファイル</p>
                <p className="text-[14px] text-text-primary truncate">{detailDoc.file_name}</p>
                <p className="text-[12px] text-text-muted">{formatFileSize(detailDoc.file_size)}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  有効期限
                </p>
                <p className={`text-[14px] ${detailDoc.expiry_date && isDeadlineSoon(detailDoc.expiry_date, 30) ? 'text-warning font-semibold' : 'text-text-primary'}`}>
                  {detailDoc.expiry_date ? formatDateCompact(detailDoc.expiry_date) : 'なし'}
                </p>
              </div>
            </div>

            {detailDoc.description && (
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">説明</p>
                <p className="text-[14px] text-text-secondary leading-relaxed">{detailDoc.description}</p>
              </div>
            )}

            {detailDoc.tags.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">タグ</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailDoc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-elevated text-[12px] text-text-secondary"
                    >
                      <Tag className="w-3 h-3" strokeWidth={2} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <p className="text-[12px] text-text-muted">
                更新: {formatRelative(detailDoc.updated_at)}
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => {
                  const content = `B-Hall 文書管理システム\n\n文書名: ${detailDoc.title}\nファイル名: ${detailDoc.file_name}\nカテゴリ: ${detailDoc.category}\nバージョン: ${detailDoc.version}\n作成日: ${detailDoc.created_at}\n更新日: ${detailDoc.updated_at}\n\nこのファイルはB-Hallからエクスポートされました。`
                  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = detailDoc.file_name
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                  addToast('success', `ダウンロード完了: ${detailDoc.file_name}`)
                }}
              >
                ダウンロード
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
