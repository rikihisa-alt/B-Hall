'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  User,
  Banknote,
  Tag,
  CheckCircle2,
  XCircle,
  Circle,
  Send,
  FolderOpen,
} from 'lucide-react'
import { useApplicationStore } from '@/stores/application-store'
import { useAuthStore } from '@/stores/auth-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { CommentList } from '@/features/comments/components/comment-list'
import { AttachmentList } from '@/features/attachments/components/attachment-list'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_TYPE_LABELS,
} from '@/lib/constants'
import { formatDate, formatRelative, today } from '@/lib/date'
import { generateId } from '@/lib/id'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import type { ApplicationStatus, ApprovalStep } from '@/types'

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const appId = params.id as string

  const getApplication = useApplicationStore((s) => s.getApplication)
  const approveStep = useApplicationStore((s) => s.approveStep)
  const rejectStep = useApplicationStore((s) => s.rejectStep)
  const withdrawApplication = useApplicationStore((s) => s.withdrawApplication)
  const addAttachment = useApplicationStore((s) => s.addAttachment)
  const removeAttachment = useApplicationStore((s) => s.removeAttachment)
  const hydrated = useApplicationStore((s) => s._hydrated)
  const users = useAuthStore((s) => s.users)
  const { currentUser, getUserName, mounted } = useAuth()
  const { addToast } = useToast()

  const [approvalComment, setApprovalComment] = useState('')
  const [rejectComment, setRejectComment] = useState('')
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null)

  const application = getApplication(appId)

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

  if (!application) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FolderOpen}
          title="申請が見つかりません"
          description="指定された申請は存在しないか、削除された可能性があります。"
          actionLabel="申請一覧に戻る"
          onAction={() => router.push('/applications')}
        />
      </div>
    )
  }

  const applicant = users.find((u) => u.id === application.applicant_id)
  const isApplicant = currentUser?.id === application.applicant_id
  const canWithdraw = isApplicant && ['draft', 'approving', 'submitted'].includes(application.status)

  // Find the current step that needs approval from the current user
  const myPendingStep = application.approval_steps.find(
    (step) => step.approver_id === currentUser?.id && step.status === 'pending'
  )

  const handleApprove = (stepId: string) => {
    approveStep(application.id, stepId, approvalComment)
    setApprovalComment('')
    addToast('success', '承認しました')
  }

  const handleReject = (stepId: string) => {
    if (!rejectComment.trim()) {
      addToast('error', '却下理由を入力してください')
      return
    }
    rejectStep(application.id, stepId, rejectComment.trim())
    setRejectComment('')
    setShowRejectInput(null)
    addToast('success', '却下しました')
  }

  const handleWithdraw = () => {
    withdrawApplication(application.id)
    addToast('success', '申請を取り下げました')
  }

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return '-'
    return `\u00A5${amount.toLocaleString()}`
  }

  // Render form data based on type
  const renderFormData = () => {
    const data = application.form_data

    switch (application.type) {
      case 'expense':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="日付" value={data.date ? formatDate(data.date as string) : '-'} />
            <FormField label="カテゴリ" value={(data.category as string) || '-'} />
            <FormField label="内容" value={(data.description as string) || '-'} fullWidth />
            <FormField label="金額" value={formatAmount(data.amount as number)} />
          </div>
        )
      case 'leave':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="開始日" value={data.start_date ? formatDate(data.start_date as string) : '-'} />
            <FormField label="終了日" value={data.end_date ? formatDate(data.end_date as string) : '-'} />
            <FormField label="休暇種別" value={(data.leave_type as string) || '-'} />
            <FormField label="理由" value={(data.reason as string) || '-'} fullWidth />
          </div>
        )
      case 'travel':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="出張先" value={(data.destination as string) || '-'} />
            <FormField label="見積費用" value={formatAmount(data.estimated_cost as number)} />
            <FormField label="出発日" value={data.start_date ? formatDate(data.start_date as string) : '-'} />
            <FormField label="帰着日" value={data.end_date ? formatDate(data.end_date as string) : '-'} />
            <FormField label="目的" value={(data.purpose as string) || '-'} fullWidth />
          </div>
        )
      case 'purchase':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="品名" value={(data.item_name as string) || '-'} />
            <FormField label="取引先" value={(data.vendor as string) || '-'} />
            <FormField label="数量" value={String(data.quantity ?? '-')} />
            <FormField label="単価" value={formatAmount(data.unit_price as number)} />
            <FormField label="購入理由" value={(data.reason as string) || '-'} fullWidth />
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <FormField key={key} label={key} value={String(value ?? '-')} />
            ))}
          </div>
        )
    }
  }

  // Approval step icon
  const getStepIcon = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-danger" strokeWidth={2} />
      case 'pending':
        return <Circle className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
    }
  }

  const getStepLineColor = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-success'
      case 'rejected':
        return 'bg-danger'
      case 'pending':
        return 'bg-border'
    }
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Back button */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        申請一覧
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
          {/* Title + Type + Status */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight mb-3">
              {application.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="info"
                label={APPLICATION_TYPE_LABELS[application.type]}
              />
              <Badge
                variant={APPLICATION_STATUS_COLORS[application.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                label={APPLICATION_STATUS_LABELS[application.status]}
              />
            </div>
          </motion.div>

          {/* Form Data */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-[15px] font-bold text-text-primary mb-4">
                申請内容
              </h2>
              {renderFormData()}
              {application.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {application.description}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Approval Timeline */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 className="text-[15px] font-bold text-text-primary mb-4">
                承認フロー
              </h2>
              <div className="space-y-0">
                {application.approval_steps.map((step, idx) => {
                  const isLast = idx === application.approval_steps.length - 1
                  const isMyStep = step.approver_id === currentUser?.id && step.status === 'pending'

                  return (
                    <div key={step.id} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        {getStepIcon(step.status)}
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${getStepLineColor(step.status)}`} />
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[14px] font-semibold text-text-primary">
                            {step.approver_name}
                          </p>
                          <span className="text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                            第{step.order}承認
                          </span>
                        </div>

                        {step.status === 'approved' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-success font-medium">承認済み</span>
                            {step.decided_at && (
                              <span className="text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                                {formatRelative(step.decided_at)}
                              </span>
                            )}
                          </div>
                        )}

                        {step.status === 'rejected' && (
                          <div>
                            <span className="text-[12px] text-danger font-medium">却下</span>
                            {step.decided_at && (
                              <span className="text-[11px] text-text-muted ml-2" style={{ fontFamily: 'var(--font-inter)' }}>
                                {formatRelative(step.decided_at)}
                              </span>
                            )}
                          </div>
                        )}

                        {step.status === 'pending' && (
                          <span className="text-[12px] text-text-muted font-medium">承認待ち</span>
                        )}

                        {step.comment && (
                          <p className="text-[13px] text-text-secondary mt-1 bg-bg-base rounded-[8px] px-3 py-2">
                            {step.comment}
                          </p>
                        )}

                        {/* Approve / Reject buttons for current user */}
                        {isMyStep && (
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="コメント（任意）"
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                className="flex-1 bg-bg-base border border-border rounded-[10px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] transition-all"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApprove(step.id)}
                              >
                                承認する
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setShowRejectInput(showRejectInput === step.id ? null : step.id)}
                              >
                                却下する
                              </Button>
                            </div>

                            {showRejectInput === step.id && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="却下理由を入力..."
                                  value={rejectComment}
                                  onChange={(e) => setRejectComment(e.target.value)}
                                  className="flex-1 bg-bg-base border border-danger/30 rounded-[10px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] transition-all"
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReject(step.id)}
                                  disabled={!rejectComment.trim()}
                                >
                                  確定
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Comments */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  コメント
                </h2>
              </div>
              <CommentList parentType="application" parentId={application.id} />
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
              {/* Applicant */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  申請者
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {applicant?.name || '不明'}
                </p>
                {applicant && (
                  <p className="text-[12px] text-text-muted">
                    {applicant.department} / {applicant.position}
                  </p>
                )}
              </div>

              {/* Application type */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Tag className="w-3.5 h-3.5" strokeWidth={1.75} />
                  申請種別
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {APPLICATION_TYPE_LABELS[application.type]}
                </p>
              </div>

              {/* Amount */}
              {application.amount !== null && (
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                    <Banknote className="w-3.5 h-3.5" strokeWidth={1.75} />
                    金額
                  </div>
                  <p className="text-[18px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatAmount(application.amount)}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                  ステータス
                </div>
                <Badge
                  variant={APPLICATION_STATUS_COLORS[application.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={APPLICATION_STATUS_LABELS[application.status]}
                />
              </div>

              {/* Created at */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                  申請日
                </div>
                <p className="text-[14px] text-text-muted">
                  {formatDate(application.created_at)}
                </p>
              </div>

              {/* Updated at */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  最終更新
                </div>
                <p className="text-[14px] text-text-muted">
                  {formatRelative(application.updated_at)}
                </p>
              </div>

              {/* Attachments */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-3">
                  <Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />
                  添付ファイル
                </div>
                <AttachmentList
                  attachments={application.attachments}
                  onAdd={(file: File) => {
                    const url = URL.createObjectURL(file)
                    const attachment = {
                      id: generateId(),
                      name: file.name,
                      url,
                      type: file.type || 'application/octet-stream',
                      size: file.size,
                      uploaded_at: today(),
                      uploaded_by: currentUser?.id || '',
                    }
                    addAttachment(application.id, attachment)
                    addToast('success', `${file.name}を添付しました`)
                  }}
                  onRemove={(attachmentId: string) => {
                    removeAttachment(application.id, attachmentId)
                    addToast('success', 'ファイルを削除しました')
                  }}
                />
              </div>

              {/* Withdraw action */}
              {canWithdraw && (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleWithdraw}
                    className="w-full"
                  >
                    申請を取り下げる
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Helper component ──

function FormField({
  label,
  value,
  fullWidth = false,
}: {
  label: string
  value: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1">
        {label}
      </p>
      <p className="text-[14px] text-text-primary font-medium">
        {value}
      </p>
    </div>
  )
}
