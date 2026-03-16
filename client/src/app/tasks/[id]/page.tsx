'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Download,
  Edit3,
  FileImage,
  FileSpreadsheet,
  FileText,
  File,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Square,
  Tag,
  Trash2,
  User,
  Users,
  FolderOpen,
  Building2,
  AlertCircle,
  X,
} from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import { useCommentStore } from '@/stores/comment-store'
import { useToast } from '@/components/ui/toast-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { TaskEditModal } from '@/features/tasks/components/task-edit-modal'
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_TRANSITIONS,
} from '@/lib/constants'
import { formatDate, formatRelative, isOverdue, isDeadlineSoon } from '@/lib/date'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import { generateId } from '@/lib/id'
import type { TaskStatus } from '@/types'

// ── Attachment types for simulated file storage ──

interface SimulatedAttachment {
  id: string
  name: string
  size: string
  fileType: 'pdf' | 'excel' | 'word' | 'image' | 'other'
  addedAt: string
}

const FILE_TYPE_LABELS: Record<SimulatedAttachment['fileType'], string> = {
  pdf: 'PDF',
  excel: 'Excel',
  word: 'Word',
  image: '画像',
  other: 'その他',
}

const FILE_TYPE_ICONS: Record<SimulatedAttachment['fileType'], typeof FileText> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  word: FileText,
  image: FileImage,
  other: File,
}

const FILE_TYPE_COLORS: Record<SimulatedAttachment['fileType'], string> = {
  pdf: 'text-red-500',
  excel: 'text-green-600',
  word: 'text-blue-500',
  image: 'text-purple-500',
  other: 'text-text-muted',
}

function generateFileSize(): string {
  const sizes = ['12 KB', '45 KB', '128 KB', '245 KB', '512 KB', '1.2 MB', '2.4 MB', '3.8 MB']
  return sizes[Math.floor(Math.random() * sizes.length)]
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const getTask = useTaskStore((s) => s.getTask)
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const addChecklistItem = useTaskStore((s) => s.addChecklistItem)
  const toggleChecklistItem = useTaskStore((s) => s.toggleChecklistItem)
  const removeChecklistItem = useTaskStore((s) => s.removeChecklistItem)
  const hydrated = useTaskStore((s) => s._hydrated)
  const users = useAuthStore((s) => s.users)
  const currentUser = useAuthStore((s) => s.currentUser)
  const getComments = useCommentStore((s) => s.getComments)
  const addComment = useCommentStore((s) => s.addComment)
  const deleteComment = useCommentStore((s) => s.deleteComment)
  const allComments = useCommentStore((s) => s.comments) // subscribe to changes
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [newChecklistText, setNewChecklistText] = useState('')

  // Comment state
  const [newCommentText, setNewCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  // Attachment state
  const [attachments, setAttachments] = useState<SimulatedAttachment[]>([])
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<SimulatedAttachment['fileType']>('pdf')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Re-read task on every render to stay fresh
  const task = getTask(taskId)

  if (!mounted || !hydrated) {
    // Skeleton loading
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-bg-elevated rounded" />
        <div className="h-10 w-2/3 bg-bg-elevated rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-bg-elevated rounded-[16px]" />
            <div className="h-60 bg-bg-elevated rounded-[16px]" />
          </div>
          <div className="h-80 bg-bg-elevated rounded-[16px]" />
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FolderOpen}
          title="タスクが見つかりません"
          description="指定されたタスクは存在しないか、削除された可能性があります。"
          actionLabel="タスク一覧に戻る"
          onAction={() => router.push('/tasks')}
        />
      </div>
    )
  }

  const assignee = users.find((u) => u.id === task.assignee_id)
  const creator = users.find((u) => u.id === task.created_by)
  const validTransitions = TASK_STATUS_TRANSITIONS[task.status] || []
  const overdue = isOverdue(task.due_date)
  const deadlineSoon = isDeadlineSoon(task.due_date)
  const checklistTotal = task.checklist.length
  const checklistDone = task.checklist.filter((c) => c.completed).length

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus)
    addToast('success', `ステータスを「${TASK_STATUS_LABELS[newStatus]}」に変更しました`)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    addToast('success', 'タスクを削除しました')
    router.push('/tasks')
  }

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return
    addChecklistItem(task.id, newChecklistText.trim())
    setNewChecklistText('')
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Back button */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        タスク一覧
      </Link>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Title + Status + Priority */}
          <motion.div variants={fadeUp}>
            <h1 className="text-xl md:text-[24px] font-bold text-text-primary tracking-tight mb-3">
              {task.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={TASK_STATUS_COLORS[task.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                label={TASK_STATUS_LABELS[task.status]}
              />
              <Badge
                variant={TASK_PRIORITY_COLORS[task.priority] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                label={TASK_PRIORITY_LABELS[task.priority]}
              />
              {overdue && (
                <Badge variant="danger" label="期限超過" />
              )}
              {deadlineSoon && !overdue && (
                <Badge variant="warning" label="期限間近" />
              )}
            </div>
          </motion.div>

          {/* Status Transition Buttons */}
          {validTransitions.length > 0 && (
            <motion.div variants={fadeUp}>
              <Card>
                <p className="text-[13px] font-medium text-text-secondary mb-3">
                  ステータスを変更
                </p>
                <div className="flex flex-wrap gap-2">
                  {validTransitions.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusChange(nextStatus)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 md:py-1.5 rounded-[10px] text-[13px] font-medium bg-bg-base border border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all cursor-pointer min-h-[44px] md:min-h-0"
                    >
                      {TASK_STATUS_LABELS[nextStatus]}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Description */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-[15px] font-bold text-text-primary mb-3">
                説明
              </h2>
              {task.description ? (
                <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-[14px] text-text-muted italic">
                  説明はありません
                </p>
              )}
            </Card>
          </motion.div>

          {/* Checklist */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                  <h2 className="text-[15px] font-bold text-text-primary">
                    チェックリスト
                  </h2>
                  {checklistTotal > 0 && (
                    <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                      {checklistDone}/{checklistTotal}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {checklistTotal > 0 && (
                <div className="w-full h-1.5 bg-bg-elevated rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
                  />
                </div>
              )}

              {/* Items */}
              <div className="space-y-1">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 group py-1.5 px-2 -mx-2 rounded-[8px] hover:bg-bg-base transition-colors"
                  >
                    <button
                      onClick={() => toggleChecklistItem(task.id, item.id)}
                      className="shrink-0 cursor-pointer"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 text-accent" strokeWidth={1.75} />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-text-muted" strokeWidth={1.75} />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-[14px] ${
                        item.completed
                          ? 'text-text-muted line-through'
                          : 'text-text-primary'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeChecklistItem(task.id, item.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new item */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <input
                  type="text"
                  placeholder="新しい項目を追加..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddChecklist()
                    }
                  }}
                  className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-muted outline-none"
                />
                <button
                  onClick={handleAddChecklist}
                  disabled={!newChecklistText.trim()}
                  className="text-accent hover:text-accent-hover disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Comments */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  コメント
                </h2>
                {(() => {
                  const comments = getComments('task', taskId)
                  return comments.length > 0 ? (
                    <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                      {comments.length}
                    </span>
                  ) : null
                })()}
              </div>

              {/* Comment list */}
              <div className="space-y-4 mb-4">
                {(() => {
                  const comments = getComments('task', taskId)
                  if (comments.length === 0) {
                    return (
                      <p className="text-[14px] text-text-muted italic py-2">
                        まだコメントはありません
                      </p>
                    )
                  }
                  return comments.map((comment) => {
                    const author = users.find((u) => u.id === comment.author_id)
                    const authorName = author?.name ?? '不明'
                    const authorInitial = author?.avatar_initial ?? authorName.charAt(0)
                    const isOwn = currentUser?.id === comment.author_id
                    const isEditing = editingCommentId === comment.id

                    return (
                      <div key={comment.id} className="flex gap-3 group">
                        {/* Avatar */}
                        <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                          <span className="text-[12px] font-bold text-accent">
                            {authorInitial}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {authorName}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {formatRelative(comment.created_at)}
                            </span>
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                className="w-full bg-bg-base border border-border rounded-[10px] px-3 py-2 text-[14px] text-text-primary placeholder-text-muted outline-none focus:border-accent/40 transition-colors resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (editingCommentText.trim()) {
                                      useCommentStore.setState((state) => ({
                                        comments: state.comments.map((c) =>
                                          c.id === comment.id
                                            ? { ...c, content: editingCommentText.trim(), updated_at: new Date().toISOString() }
                                            : c
                                        ),
                                      }))
                                      addToast('success', 'コメントを更新しました')
                                    }
                                    setEditingCommentId(null)
                                    setEditingCommentText('')
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-[8px] text-[12px] font-medium bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  保存
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null)
                                    setEditingCommentText('')
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-[8px] text-[12px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                                >
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          )}
                        </div>

                        {/* Actions (own comments only) */}
                        {isOwn && !isEditing && (
                          <div className="shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id)
                                setEditingCommentText(comment.content)
                              }}
                              className="p-1 rounded-[6px] text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                              title="編集"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('このコメントを削除しますか？')) {
                                  deleteComment(comment.id)
                                  addToast('success', 'コメントを削除しました')
                                }
                              }}
                              className="p-1 rounded-[6px] text-text-muted hover:text-danger hover:bg-bg-elevated transition-colors cursor-pointer"
                              title="削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })
                })()}
              </div>

              {/* New comment input */}
              <div className="flex gap-3 pt-4 border-t border-border">
                {currentUser && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-accent">
                      {currentUser.avatar_initial || currentUser.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 flex gap-2">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="コメントを入力..."
                    className="flex-1 bg-bg-base border border-border rounded-[10px] px-3 py-2 text-[14px] text-text-primary placeholder-text-muted outline-none focus:border-accent/40 transition-colors resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        if (newCommentText.trim() && currentUser) {
                          addComment('task', taskId, currentUser.id, newCommentText.trim())
                          setNewCommentText('')
                          addToast('success', 'コメントを投稿しました')
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newCommentText.trim() && currentUser) {
                        addComment('task', taskId, currentUser.id, newCommentText.trim())
                        setNewCommentText('')
                        addToast('success', 'コメントを投稿しました')
                      }
                    }}
                    disabled={!newCommentText.trim()}
                    className="self-end shrink-0 inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] md:min-h-0 rounded-[10px] text-[13px] font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    送信
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Attachments */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                  <h2 className="text-[15px] font-bold text-text-primary">
                    添付ファイル
                  </h2>
                  {attachments.length > 0 && (
                    <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                      {attachments.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setAttachmentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-medium text-accent hover:bg-accent/8 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ファイルを追加
                </button>
              </div>

              {/* File list */}
              {attachments.length === 0 ? (
                <p className="text-[14px] text-text-muted italic py-2">
                  添付ファイルはありません
                </p>
              ) : (
                <div className="space-y-2">
                  {attachments.map((file) => {
                    const IconComponent = FILE_TYPE_ICONS[file.fileType]
                    const iconColor = FILE_TYPE_COLORS[file.fileType]
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 py-2.5 px-3 -mx-1 rounded-[10px] hover:bg-bg-base transition-colors group"
                      >
                        <div className={`shrink-0 ${iconColor}`}>
                          <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-text-primary truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {FILE_TYPE_LABELS[file.fileType]} · {file.size} · {formatRelative(file.addedAt)}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => addToast('info', 'ダウンロードを開始しました')}
                            className="p-1.5 rounded-[6px] text-text-muted hover:text-accent hover:bg-bg-elevated transition-colors cursor-pointer"
                            title="ダウンロード"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setAttachments((prev) => prev.filter((a) => a.id !== file.id))
                              addToast('success', 'ファイルを削除しました')
                            }}
                            className="p-1.5 rounded-[6px] text-text-muted hover:text-danger hover:bg-bg-elevated transition-colors cursor-pointer"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Attachment Add Modal */}
          {attachmentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => {
                  setAttachmentModalOpen(false)
                  setNewFileName('')
                  setNewFileType('pdf')
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="relative bg-bg-surface border border-border rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 w-full max-w-[400px] mx-4"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[16px] font-bold text-text-primary">
                    ファイルを追加
                  </h3>
                  <button
                    onClick={() => {
                      setAttachmentModalOpen(false)
                      setNewFileName('')
                      setNewFileType('pdf')
                    }}
                    className="p-1 rounded-[6px] text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                      ファイル名
                    </label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="例: 見積書_2024年3月.pdf"
                      className="w-full bg-bg-base border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary placeholder-text-muted outline-none focus:border-accent/40 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newFileName.trim()) {
                          e.preventDefault()
                          const newAttachment: SimulatedAttachment = {
                            id: generateId(),
                            name: newFileName.trim(),
                            size: generateFileSize(),
                            fileType: newFileType,
                            addedAt: new Date().toISOString(),
                          }
                          setAttachments((prev) => [...prev, newAttachment])
                          setNewFileName('')
                          setNewFileType('pdf')
                          setAttachmentModalOpen(false)
                          addToast('success', 'ファイルを追加しました')
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                      ファイル種別
                    </label>
                    <select
                      value={newFileType}
                      onChange={(e) => setNewFileType(e.target.value as SimulatedAttachment['fileType'])}
                      className="w-full bg-bg-base border border-border rounded-[10px] px-3 py-2.5 text-[14px] text-text-primary outline-none focus:border-accent/40 transition-colors cursor-pointer"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="word">Word</option>
                      <option value="image">画像</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setAttachmentModalOpen(false)
                      setNewFileName('')
                      setNewFileType('pdf')
                    }}
                    className="px-4 py-2 rounded-[10px] text-[13px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      if (!newFileName.trim()) return
                      const newAttachment: SimulatedAttachment = {
                        id: generateId(),
                        name: newFileName.trim(),
                        size: generateFileSize(),
                        fileType: newFileType,
                        addedAt: new Date().toISOString(),
                      }
                      setAttachments((prev) => [...prev, newAttachment])
                      setNewFileName('')
                      setNewFileType('pdf')
                      setAttachmentModalOpen(false)
                      addToast('success', 'ファイルを追加しました')
                    }}
                    disabled={!newFileName.trim()}
                    className="px-4 py-2 rounded-[10px] text-[13px] font-medium bg-accent text-white hover:bg-accent-hover disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    追加
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Right column: meta sidebar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <Card className="lg:sticky lg:top-8">
            <div className="space-y-5">
              {/* Assignee */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  担当者
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {assignee?.name || '未割当'}
                </p>
              </div>

              {/* Creator */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
                  起票者
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {creator?.name || '不明'}
                </p>
              </div>

              {/* Department */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  部署
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {task.department || '未設定'}
                </p>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <FolderOpen className="w-3.5 h-3.5" strokeWidth={1.75} />
                  カテゴリ
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {task.category}
                </p>
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                  期限
                </div>
                {task.due_date ? (
                  <div className="flex items-center gap-2">
                    <p className={`text-[14px] font-medium ${overdue ? 'text-danger' : deadlineSoon ? 'text-warning' : 'text-text-primary'}`}>
                      {formatDate(task.due_date)}
                    </p>
                    {overdue && (
                      <AlertCircle className="w-4 h-4 text-danger" />
                    )}
                  </div>
                ) : (
                  <p className="text-[14px] text-text-muted">未設定</p>
                )}
              </div>

              {/* Created at */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  作成日
                </div>
                <p className="text-[14px] text-text-muted">
                  {formatRelative(task.created_at)}
                </p>
              </div>

              {/* Updated at */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  更新日
                </div>
                <p className="text-[14px] text-text-muted">
                  {formatRelative(task.updated_at)}
                </p>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                    <Tag className="w-3.5 h-3.5" strokeWidth={1.75} />
                    タグ
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-bg-base border border-border text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setEditOpen(true)}
                  className="w-full"
                >
                  編集
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={handleDelete}
                  className="w-full"
                >
                  削除
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {task && (
        <TaskEditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          task={task}
        />
      )}
    </motion.div>
  )
}
