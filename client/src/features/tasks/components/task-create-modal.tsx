'use client'

import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { TASK_CATEGORIES, DEPARTMENTS } from '@/lib/constants'
import type { TaskPriority } from '@/types'

interface TaskCreateModalProps {
  open: boolean
  onClose: () => void
}

export function TaskCreateModal({ open, onClose }: TaskCreateModalProps) {
  const addTask = useTaskStore((s) => s.addTask)
  const currentUser = useAuthStore((s) => s.currentUser)
  const users = useAuthStore((s) => s.users)
  const { addToast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(TASK_CATEGORIES[0])
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0])
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [titleError, setTitleError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory(TASK_CATEGORIES[0])
    setDepartment(DEPARTMENTS[0])
    setAssigneeId('')
    setDueDate('')
    setPriority('medium')
    setTitleError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setTitleError('タイトルは必須です')
      return
    }

    setLoading(true)

    try {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        department,
        assignee_id: assigneeId,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        created_by: currentUser?.id || 'user-1',
        updated_by: currentUser?.id || 'user-1',
      })

      addToast('success', 'タスクを作成しました')
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none appearance-none cursor-pointer'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="新規タスク作成"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            作成
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* タイトル */}
        <Input
          label="タイトル"
          required
          placeholder="タスクのタイトルを入力"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError('')
          }}
          error={titleError}
        />

        {/* 説明 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            説明
          </label>
          <textarea
            placeholder="タスクの詳細を入力"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* カテゴリ + 部署 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              部署
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={selectClass}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 担当者 + 優先度 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              担当者
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={selectClass}
            >
              <option value="">未割当</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              優先度
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className={selectClass}
            >
              <option value="urgent">緊急</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>

        {/* 期限 */}
        <Input
          label="期限"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </form>
    </Modal>
  )
}
