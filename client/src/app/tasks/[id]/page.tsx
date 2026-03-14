'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Clock,
  Edit3,
  MessageSquare,
  Paperclip,
  Plus,
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
import type { TaskStatus } from '@/types'

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
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [newChecklistText, setNewChecklistText] = useState('')

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
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
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
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight mb-3">
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-[13px] font-medium bg-bg-base border border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all cursor-pointer"
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

          {/* Comments (placeholder) */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  コメント
                </h2>
              </div>
              <p className="text-[14px] text-text-muted italic">
                コメント機能は準備中です
              </p>
            </Card>
          </motion.div>

          {/* Attachments (placeholder) */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  添付ファイル
                </h2>
              </div>
              <p className="text-[14px] text-text-muted italic">
                添付ファイル機能は準備中です
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right column: meta sidebar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-8">
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
