'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Lightbulb,
  Plus,
  ChevronRight,
  Heart,
  Inbox,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useImprovementStore } from '@/stores/improvement-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  IMPROVEMENT_CATEGORY_LABELS,
  IMPROVEMENT_CATEGORY_COLORS,
  IMPROVEMENT_STATUS_LABELS,
  IMPROVEMENT_STATUS_COLORS,
  DEPARTMENTS,
} from '@/lib/constants'
import { formatRelative } from '@/lib/date'
import type { ImprovementCategory, Improvement } from '@/types'

const CATEGORY_TABS: { value: ImprovementCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'process', label: '業務プロセス' },
  { value: 'cost', label: 'コスト削減' },
  { value: 'quality', label: '品質向上' },
  { value: 'safety', label: '安全衛生' },
  { value: 'environment', label: '環境改善' },
  { value: 'other', label: 'その他' },
]

const STATUS_TABS: { value: Improvement['status'] | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'proposed', label: '提案中' },
  { value: 'reviewing', label: '検討中' },
  { value: 'approved', label: '承認済' },
  { value: 'in_progress', label: '実施中' },
  { value: 'completed', label: '完了' },
]

export default function ImprovementsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ImprovementCategory | 'all'>('all')
  const [activeStatus, setActiveStatus] = useState<Improvement['status'] | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailImp, setDetailImp] = useState<Improvement | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState<ImprovementCategory>('process')
  const [editExpectedEffect, setEditExpectedEffect] = useState('')

  const { currentUser, getUserName } = useAuth()
  const { addToast } = useToast()
  const getImprovements = useImprovementStore((s) => s.getImprovements)
  const getImprovementsByCategory = useImprovementStore((s) => s.getImprovementsByCategory)
  const addImprovement = useImprovementStore((s) => s.addImprovement)
  const updateImprovement = useImprovementStore((s) => s.updateImprovement)
  const deleteImprovement = useImprovementStore((s) => s.deleteImprovement)
  const updateStatus = useImprovementStore((s) => s.updateStatus)
  const vote = useImprovementStore((s) => s.vote)
  const hydrated = useImprovementStore((s) => s._hydrated)

  // Create form state
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState<ImprovementCategory>('process')
  const [formDescription, setFormDescription] = useState('')
  const [formExpectedEffect, setFormExpectedEffect] = useState('')
  const [formAnonymous, setFormAnonymous] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredImprovements = useMemo(() => {
    let items = activeCategory === 'all' ? getImprovements() : getImprovementsByCategory(activeCategory)
    if (activeStatus !== 'all') {
      items = items.filter((imp) => imp.status === activeStatus)
    }
    return items
  }, [activeCategory, activeStatus, getImprovements, getImprovementsByCategory])

  const sortedImprovements = useMemo(() => {
    return [...filteredImprovements].sort((a, b) => b.votes - a.votes)
  }, [filteredImprovements])

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

  const allImprovements = getImprovements()
  const proposedCount = allImprovements.filter((i) => i.status === 'proposed').length
  const inProgressCount = allImprovements.filter((i) => i.status === 'in_progress' || i.status === 'reviewing').length
  const completedCount = allImprovements.filter((i) => i.status === 'completed' || i.status === 'approved').length
  const totalVotes = allImprovements.reduce((sum, i) => sum + i.votes, 0)

  const handleCreate = () => {
    if (!formTitle.trim() || !currentUser) return
    addImprovement({
      title: formTitle,
      category: formCategory,
      description: formDescription,
      expected_effect: formExpectedEffect,
      author_id: currentUser.id,
      department: currentUser.department,
      is_anonymous: formAnonymous,
      created_by: currentUser.id,
      updated_by: currentUser.id,
    })
    addToast('success', '改善提案を登録しました')
    setCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormCategory('process')
    setFormDescription('')
    setFormExpectedEffect('')
    setFormAnonymous(false)
  }

  const handleVote = (e: React.MouseEvent, impId: string) => {
    e.stopPropagation()
    if (!currentUser) return
    vote(impId, currentUser.id)
  }

  const startEditing = (imp: Improvement) => {
    setEditTitle(imp.title)
    setEditDescription(imp.description)
    setEditCategory(imp.category)
    setEditExpectedEffect(imp.expected_effect)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!detailImp || !editTitle.trim()) return
    updateImprovement(detailImp.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      expected_effect: editExpectedEffect,
    })
    setDetailImp({ ...detailImp, title: editTitle, description: editDescription, category: editCategory, expected_effect: editExpectedEffect })
    setIsEditing(false)
    addToast('success', '改善提案を更新しました')
  }

  const handleDeleteImprovement = () => {
    if (!detailImp) return
    deleteImprovement(detailImp.id)
    setDetailImp(null)
    setDeleteConfirm(false)
    setIsEditing(false)
    addToast('success', '改善提案を削除しました')
  }

  const handleStatusChange = (newStatus: Improvement['status']) => {
    if (!detailImp) return
    updateStatus(detailImp.id, newStatus)
    setDetailImp({ ...detailImp, status: newStatus })
    addToast('success', `ステータスを「${IMPROVEMENT_STATUS_LABELS[newStatus]}」に変更しました`)
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">改善提案</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">改善</h1>
          <p className="text-[13px] text-text-secondary mt-1">提案・目安箱・フィードバック</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)} className="min-h-[44px] md:min-h-0">
          改善提案
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3" strokeWidth={2} />
            提案中
          </p>
          <p className="text-[24px] font-bold text-info" style={{ fontFamily: 'var(--font-inter)' }}>{proposedCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" strokeWidth={2} />
            対応中
          </p>
          <p className="text-[24px] font-bold text-warning" style={{ fontFamily: 'var(--font-inter)' }}>{inProgressCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
            承認・完了
          </p>
          <p className="text-[24px] font-bold text-success" style={{ fontFamily: 'var(--font-inter)' }}>{completedCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" strokeWidth={2} />
            総投票数
          </p>
          <p className="text-[24px] font-bold text-accent" style={{ fontFamily: 'var(--font-inter)' }}>{totalVotes}</p>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer flex-shrink-0 min-h-[36px] md:min-h-0 ${
                activeCategory === tab.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer flex-shrink-0 min-h-[36px] md:min-h-0 ${
                activeStatus === tab.value
                  ? 'bg-text-primary text-white'
                  : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-primary/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Improvement Cards */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        {sortedImprovements.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">改善提案はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しい提案を作成して始めましょう</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                改善提案
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedImprovements.map((imp, i) => {
              const hasVoted = currentUser ? imp.voted_by.includes(currentUser.id) : false
              return (
                <motion.div
                  key={imp.id}
                  variants={fadeUp}
                  custom={i}
                  onClick={() => setDetailImp(imp)}
                  className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={IMPROVEMENT_CATEGORY_COLORS[imp.category] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                        label={IMPROVEMENT_CATEGORY_LABELS[imp.category]}
                      />
                      <Badge
                        variant={IMPROVEMENT_STATUS_COLORS[imp.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                        label={IMPROVEMENT_STATUS_LABELS[imp.status]}
                      />
                    </div>
                    <button
                      onClick={(e) => handleVote(e, imp.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] md:min-h-0 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-[rgba(239,68,68,0.12)] text-danger'
                          : 'bg-bg-elevated text-text-muted hover:bg-[rgba(239,68,68,0.08)] hover:text-danger'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} strokeWidth={2} />
                      <span style={{ fontFamily: 'var(--font-inter)' }}>{imp.votes}</span>
                    </button>
                  </div>

                  <h3 className="text-[15px] font-semibold text-text-primary tracking-tight mb-2 group-hover:text-accent transition-colors">
                    {imp.title}
                  </h3>
                  <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 mb-3">
                    {imp.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-text-muted">
                      {imp.is_anonymous ? (
                        <span className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3" strokeWidth={2} />
                          匿名
                        </span>
                      ) : (
                        getUserName(imp.author_id)
                      )}
                    </p>
                    <p className="text-[12px] text-text-muted">{formatRelative(imp.created_at)}</p>
                  </div>

                  {imp.related_task_id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[12px] text-accent flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" strokeWidth={2} />
                        タスクに紐付け済み
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.section>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); resetForm() }}
        title="改善提案"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); resetForm() }}>キャンセル</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!formTitle.trim()}>提案する</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="タイトル"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="改善提案のタイトル"
          />
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              カテゴリ <span className="text-accent">*</span>
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ImprovementCategory)}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
            >
              {Object.entries(IMPROVEMENT_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              提案内容 <span className="text-accent">*</span>
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="現状の課題と改善案を具体的に記載..."
              rows={4}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">期待される効果</label>
            <textarea
              value={formExpectedEffect}
              onChange={(e) => setFormExpectedEffect(e.target.value)}
              placeholder="この改善により期待される効果..."
              rows={3}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formAnonymous}
              onChange={(e) => setFormAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-[14px] text-text-secondary flex items-center gap-1.5">
              <EyeOff className="w-4 h-4" strokeWidth={1.75} />
              匿名で投稿する
            </span>
          </label>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!detailImp}
        onClose={() => { setDetailImp(null); setIsEditing(false); setDeleteConfirm(false) }}
        title="提案詳細"
        size="lg"
        footer={
          isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>キャンセル</Button>
              <Button variant="primary" onClick={handleSaveEdit} disabled={!editTitle.trim()}>保存</Button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={Pencil} onClick={() => detailImp && startEditing(detailImp)}>
                  編集
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setDeleteConfirm(true)}
                  className="text-danger hover:bg-danger/10"
                >
                  削除
                </Button>
              </div>
              <div className="flex-1" />
              <Button variant="ghost" onClick={() => { setDetailImp(null); setIsEditing(false); setDeleteConfirm(false) }}>閉じる</Button>
            </div>
          )
        }
      >
        {detailImp && !isEditing && (
          <div className="space-y-5">
            {deleteConfirm && (
              <div className="bg-danger/5 border border-danger/20 rounded-[12px] p-4">
                <p className="text-[14px] text-danger font-medium mb-3">この改善提案を削除しますか？</p>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={handleDeleteImprovement} className="!bg-danger hover:!bg-danger/90">削除する</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(false)}>キャンセル</Button>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-[18px] font-bold text-text-primary mb-2">{detailImp.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={IMPROVEMENT_CATEGORY_COLORS[detailImp.category] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={IMPROVEMENT_CATEGORY_LABELS[detailImp.category]}
                />
                <Badge
                  variant={IMPROVEMENT_STATUS_COLORS[detailImp.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={IMPROVEMENT_STATUS_LABELS[detailImp.status]}
                />
                <span className="flex items-center gap-1 text-[13px] text-danger font-semibold ml-2">
                  <Heart className="w-4 h-4 fill-current" strokeWidth={2} />
                  <span style={{ fontFamily: 'var(--font-inter)' }}>{detailImp.votes}票</span>
                </span>
              </div>
            </div>

            {/* Status change dropdown */}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">ステータス変更</label>
              <select
                value={detailImp.status}
                onChange={(e) => handleStatusChange(e.target.value as Improvement['status'])}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-2.5 text-[14px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
              >
                <option value="proposed">提案中</option>
                <option value="reviewing">検討中</option>
                <option value="approved">承認</option>
                <option value="in_progress">実施中</option>
                <option value="completed">完了</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">提案者</p>
                <p className="text-[14px] text-text-primary">
                  {detailImp.is_anonymous ? (
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5" strokeWidth={2} />
                      匿名
                    </span>
                  ) : (
                    getUserName(detailImp.author_id)
                  )}
                </p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">部署</p>
                <p className="text-[14px] text-text-primary">{detailImp.department || '未設定'}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">提案内容</p>
              <div className="bg-bg-base rounded-[12px] p-4">
                <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{detailImp.description}</p>
              </div>
            </div>

            {detailImp.expected_effect && (
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-2">期待される効果</p>
                <div className="bg-bg-base rounded-[12px] p-4">
                  <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{detailImp.expected_effect}</p>
                </div>
              </div>
            )}

            {detailImp.related_task_id && (
              <div className="bg-accent/5 border border-accent/20 rounded-[12px] p-4">
                <p className="text-[13px] text-accent font-medium flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" strokeWidth={2} />
                  関連タスクに紐付け済み
                </p>
              </div>
            )}

            <p className="text-[12px] text-text-muted">{formatRelative(detailImp.created_at)}</p>
          </div>
        )}
        {detailImp && isEditing && (
          <div className="space-y-4">
            <Input
              label="タイトル"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="改善提案のタイトル"
            />
            <div>
              <label className="block text-[14px] font-medium text-text-secondary mb-1.5">
                カテゴリ <span className="text-accent">*</span>
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as ImprovementCategory)}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
              >
                {Object.entries(IMPROVEMENT_CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-text-secondary mb-1.5">
                提案内容 <span className="text-accent">*</span>
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="現状の課題と改善案を具体的に記載..."
                rows={5}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-text-secondary mb-1.5">期待される効果</label>
              <textarea
                value={editExpectedEffect}
                onChange={(e) => setEditExpectedEffect(e.target.value)}
                placeholder="この改善により期待される効果..."
                rows={3}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
