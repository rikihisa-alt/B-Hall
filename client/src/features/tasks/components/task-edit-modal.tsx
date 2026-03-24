'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { TASK_CATEGORIES, DEPARTMENTS } from '@/lib/constants'
import type { Task, TaskPriority } from '@/types'

interface TaskEditModalProps {
  open: boolean
  onClose: () => void
  task: Task
}

export function TaskEditModal({ open, onClose, task }: TaskEditModalProps) {
  const updateTask = useTaskStore((s) => s.updateTask)
  const currentUser = useAuthStore((s) => s.currentUser)
  const users = useAuthStore((s) => s.users)
  const { addToast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('')
  const [department, setDepartment] = useState<string>('')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [titleError, setTitleError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pre-populate with existing task data
  useEffect(() => {
    if (open && task) {
      setTitle(task.title)
      setDescription(task.description)
      setCategory(task.category)
      setDepartment(task.department)
      setAssigneeId(task.assignee_id)
      setPriority(task.priority)
      setTitleError('')

      if (task.due_date) {
        // Extract the date portion from ISO string for the date input
        const d = new Date(task.due_date)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        setDueDate(`${yyyy}-${mm}-${dd}`)
      } else {
        setDueDate('')
      }
    }
  }, [open, task])

  const handleClose = () => {
    setTitleError('')
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
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        department,
        assignee_id: assigneeId,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        updated_by: currentUser?.id || 'user-1',
      })

      addToast('success', 'タスクを更新しました')
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none appearance-none cursor-pointer'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="タスクを編集"
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
            更新
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
            className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
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
