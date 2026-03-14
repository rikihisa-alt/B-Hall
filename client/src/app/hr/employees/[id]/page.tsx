'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  Shield,
  Heart,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Edit3,
  ClipboardList,
  User,
  FolderOpen,
} from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import { useTaskStore } from '@/stores/task-store'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { EMPLOYMENT_TYPE_LABELS, DEPARTMENTS, TASK_STATUS_LABELS } from '@/lib/constants'
import { formatDate, formatDateShort } from '@/lib/date'
import type { EmploymentType } from '@/types'

// ── ステータス表示設定 ──

const statusDisplay: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  active: { label: '在籍', variant: 'success' },
  on_leave: { label: '休職中', variant: 'warning' },
  terminated: { label: '退職済', variant: 'neutral' },
}

const insuranceLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  enrolled: { label: '加入済', variant: 'success' },
  not_enrolled: { label: '未加入', variant: 'warning' },
  lost: { label: '喪失', variant: 'neutral' },
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id as string
  const { addToast } = useToast()

  const getEmployee = useEmployeeStore((s) => s.getEmployee)
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee)
  const triggerOnboarding = useEmployeeStore((s) => s.triggerOnboarding)
  const triggerOffboarding = useEmployeeStore((s) => s.triggerOffboarding)
  const hydrated = useEmployeeStore((s) => s._hydrated)

  const tasks = useTaskStore((s) => s.tasks)
  const users = useAuthStore((s) => s.users)

  const [mounted, setMounted] = useState(false)
  const [confirmOffboarding, setConfirmOffboarding] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const employee = getEmployee(employeeId)

  // 関連タスク: source_event にこの従業員の名前を含むタスク
  const relatedTasks = useMemo(() => {
    if (!employee) return []
    return tasks.filter(
      (t) => !t.deleted_at && t.source_event.includes(employee.name)
    )
  }, [tasks, employee])

  // ── 編集フォーム ──
  const [editForm, setEditForm] = useState({
    name: '',
    name_kana: '',
    department: '',
    position: '',
    employment_type: 'full_time' as EmploymentType,
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (employee) {
      setEditForm({
        name: employee.name,
        name_kana: employee.name_kana,
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        email: employee.email,
        phone: employee.phone,
      })
    }
  }, [employee])

  const handleEdit = () => {
    if (!employee) return
    updateEmployee(employee.id, {
      name: editForm.name,
      name_kana: editForm.name_kana,
      department: editForm.department,
      position: editForm.position,
      employment_type: editForm.employment_type,
      email: editForm.email,
      phone: editForm.phone,
    })
    setEditOpen(false)
    addToast('success', '従業員情報を更新しました')
  }

  const handleOnboarding = () => {
    if (!employee) return
    triggerOnboarding(employee.id)
    addToast('success', `入社タスク5件を生成しました`)
  }

  const handleOffboarding = () => {
    if (!employee) return
    triggerOffboarding(employee.id)
    setConfirmOffboarding(false)
    addToast('success', `退社タスク5件を生成しました`)
  }

  // ── ローディング / 未ハイドレーション ──
  if (!mounted || !hydrated) {
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

  // ── 従業員が見つからない ──
  if (!employee) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FolderOpen}
          title="従業員が見つかりません"
          description="指定された従業員は存在しないか、削除された可能性があります。"
          actionLabel="従業員一覧に戻る"
          onAction={() => router.push('/hr/employees')}
        />
      </div>
    )
  }

  const empStatus = statusDisplay[employee.status] || statusDisplay.active
  const socialIns = insuranceLabels[employee.social_insurance_status] || insuranceLabels.not_enrolled
  const employmentIns = insuranceLabels[employee.employment_insurance_status] || insuranceLabels.not_enrolled

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* 戻るボタン */}
      <Link
        href="/hr/employees"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        従業員一覧
      </Link>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム: メインコンテンツ */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* ヘッダー: 名前・部署・役職 */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[22px] font-bold shrink-0">
                {employee.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-[24px] font-bold text-text-primary tracking-tight">
                  {employee.name}
                </h1>
                <p className="text-[14px] text-text-secondary">
                  {employee.department} / {employee.position}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={empStatus.variant} label={empStatus.label} />
              <Badge
                variant="info"
                label={EMPLOYMENT_TYPE_LABELS[employee.employment_type]}
              />
            </div>
          </motion.div>

          {/* 個人情報 */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-[15px] font-bold text-text-primary mb-4">
                連絡先情報
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} />
                  <span className="text-[14px] text-text-primary">
                    {employee.email || '未設定'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} />
                  <span className="text-[14px] text-text-primary">
                    {employee.phone || '未設定'}
                  </span>
                </div>
                {employee.emergency_contact && (
                  <div className="flex items-start gap-3 pt-2 border-t border-border">
                    <AlertTriangle className="w-4 h-4 text-text-muted shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                        緊急連絡先
                      </p>
                      <p className="text-[14px] text-text-primary">
                        {employee.emergency_contact.name}（{employee.emergency_contact.relationship}）
                      </p>
                      <p className="text-[13px] text-text-secondary">
                        {employee.emergency_contact.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* 雇用・保険情報 */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-[15px] font-bold text-text-primary mb-4">
                雇用・保険情報
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                    雇用形態
                  </p>
                  <p className="text-[14px] text-text-primary font-medium">
                    {EMPLOYMENT_TYPE_LABELS[employee.employment_type]}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                    入社日
                  </p>
                  <p className="text-[14px] text-text-primary font-medium">
                    {formatDate(employee.hire_date)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                    社会保険
                  </p>
                  <Badge variant={socialIns.variant} label={socialIns.label} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                    雇用保険
                  </p>
                  <Badge variant={employmentIns.variant} label={employmentIns.label} />
                </div>
                {employee.health_check_date && (
                  <div>
                    <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                      最終健康診断
                    </p>
                    <p className="text-[14px] text-text-primary font-medium">
                      {formatDate(employee.health_check_date)}
                    </p>
                  </div>
                )}
                {employee.termination_date && (
                  <div>
                    <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">
                      退職日
                    </p>
                    <p className="text-[14px] text-danger font-medium">
                      {formatDate(employee.termination_date)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* イベントアクション（在籍中のみ表示） */}
          {employee.status === 'active' && (
            <motion.div variants={fadeUp}>
              <Card>
                <h2 className="text-[15px] font-bold text-text-primary mb-4">
                  イベントアクション
                </h2>
                <p className="text-[13px] text-text-secondary mb-4">
                  手続き開始ボタンを押すと、関連タスクが自動生成されます。
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={UserPlus}
                    onClick={handleOnboarding}
                  >
                    入社手続き開始
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    icon={UserMinus}
                    onClick={() => setConfirmOffboarding(true)}
                  >
                    退社手続き開始
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* 関連タスク */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  関連タスク
                </h2>
                {relatedTasks.length > 0 && (
                  <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                    {relatedTasks.length}件
                  </span>
                )}
              </div>
              {relatedTasks.length === 0 ? (
                <p className="text-[14px] text-text-muted">
                  この従業員に関連するタスクはありません
                </p>
              ) : (
                <div className="space-y-1">
                  {relatedTasks.map((task) => {
                    const assignee = users.find((u) => u.id === task.assignee_id)
                    const statusLabel = TASK_STATUS_LABELS[task.status] || task.status
                    const isDone = task.status === 'done'
                    return (
                      <Link
                        key={task.id}
                        href={`/tasks/${task.id}`}
                        className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-[10px] hover:bg-bg-base transition-colors group"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isDone ? '#22C55E' : task.status === 'in_progress' ? '#3B82F6' : 'rgba(28,25,23,0.2)',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-medium truncate ${isDone ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {task.title}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {task.category} / {assignee?.name || '未割当'}
                          </p>
                        </div>
                        <span className="text-[11px] text-text-muted shrink-0">
                          {statusLabel}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>

        {/* 右カラム: サイドバー */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-8">
            <div className="space-y-5">
              {/* ステータス（大きめ） */}
              <div className="text-center pb-4 border-b border-border">
                <Badge
                  variant={empStatus.variant}
                  label={empStatus.label}
                  className="text-[14px] px-4 py-1"
                />
                <p className="text-[22px] font-bold text-text-primary mt-3">
                  {employee.name}
                </p>
                <p className="text-[13px] text-text-secondary mt-1">
                  {employee.name_kana}
                </p>
              </div>

              {/* クイック情報 */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  部署
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {employee.department}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />
                  役職
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {employee.position}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                  入社日
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {formatDate(employee.hire_date)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                  <Shield className="w-3.5 h-3.5" strokeWidth={1.75} />
                  社会保険
                </div>
                <Badge variant={socialIns.variant} label={socialIns.label} />
              </div>

              {/* アクション */}
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
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 退社確認ダイアログ */}
      <Modal
        open={confirmOffboarding}
        onClose={() => setConfirmOffboarding(false)}
        title="退社手続きの確認"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOffboarding(false)}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleOffboarding}>
              退社手続きを開始
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-[14px] text-text-primary">
            <span className="font-bold">{employee.name}</span> さんの退社手続きを開始しますか？
          </p>
          <p className="text-[13px] text-text-secondary">
            この操作により以下が実行されます：
          </p>
          <ul className="text-[13px] text-text-secondary space-y-1 list-disc pl-5">
            <li>退社関連タスク5件が自動生成されます</li>
            <li>従業員ステータスが「退職済」に変更されます</li>
            <li>退職日が本日に設定されます</li>
          </ul>
        </div>
      </Modal>

      {/* 編集モーダル */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="従業員情報の編集"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              保存する
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="氏名"
              required
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="フリガナ"
              value={editForm.name_kana}
              onChange={(e) => setEditForm((f) => ({ ...f, name_kana: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                部署
              </label>
              <select
                value={editForm.department}
                onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <Input
              label="役職"
              value={editForm.position}
              onChange={(e) => setEditForm((f) => ({ ...f, position: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                雇用形態
              </label>
              <select
                value={editForm.employment_type}
                onChange={(e) => setEditForm((f) => ({ ...f, employment_type: e.target.value as EmploymentType }))}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all cursor-pointer"
              >
                {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="メールアドレス"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="電話番号"
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
