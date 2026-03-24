'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  User,
  Stamp,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
  Circle,
  Paperclip,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useRingiStore } from '@/stores/ringi-store'
import { useAuthStore } from '@/stores/auth-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { CommentList } from '@/features/comments/components/comment-list'
import {
  RINGI_STATUS_LABELS,
  RINGI_STATUS_COLORS,
} from '@/lib/constants'
import { formatDate, formatRelative } from '@/lib/date'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import type { ApprovalStep } from '@/types'

export default function RingiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ringiId = params.id as string

  const getRingi = useRingiStore((s) => s.getRingi)
  const approveRingi = useRingiStore((s) => s.approveRingi)
  const rejectRingi = useRingiStore((s) => s.rejectRingi)
  const submitRingi = useRingiStore((s) => s.submitRingi)
  const hydrated = useRingiStore((s) => s._hydrated)
  const users = useAuthStore((s) => s.users)
  const { currentUser, getUserName } = useAuth()
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const [approveComment, setApproveComment] = useState('')
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null)
  const [showApproveInput, setShowApproveInput] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const ringi = getRingi(ringiId)

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

  if (!ringi) {
    return (
      <div className="py-20">
        <EmptyState
          icon={Stamp}
          title="稟議が見つかりません"
          description="指定された稟議は存在しないか、削除された可能性があります。"
          actionLabel="稟議一覧に戻る"
          onAction={() => router.push('/ringi')}
        />
      </div>
    )
  }

  const creator = users.find((u) => u.id === ringi.created_by)

  // 現在のユーザーがこの稟議で承認可能なステップを取得
  const getPendingStepForCurrentUser = (): ApprovalStep | null => {
    if (!currentUser) return null
    if (ringi.status !== 'submitted' && ringi.status !== 'approving') return null

    for (const step of ringi.approval_steps) {
      if (step.approver_id === currentUser.id && step.status === 'pending') {
        // 前のステップがすべて承認済みか確認
        const previousSteps = ringi.approval_steps.filter(
          (s) => s.order < step.order
        )
        if (previousSteps.every((s) => s.status === 'approved')) {
          return step
        }
      }
    }
    return null
  }

  const pendingStep = getPendingStepForCurrentUser()

  const handleApprove = (stepId: string) => {
    approveRingi(ringiId, stepId, approveComment || undefined)
    addToast('success', '稟議を承認しました')
    setApproveComment('')
    setShowApproveInput(null)
  }

  const handleReject = (stepId: string) => {
    if (!rejectComment.trim()) {
      addToast('error', '却下理由を入力してください')
      return
    }
    rejectRingi(ringiId, stepId, rejectComment)
    addToast('success', '稟議を却下しました')
    setRejectComment('')
    setShowRejectInput(null)
  }

  const handleSubmit = () => {
    submitRingi(ringiId)
    addToast('success', '稟議を提出しました')
  }

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return '未設定'
    return `¥${amount.toLocaleString()}`
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Back button */}
      <Link
        href="/ringi"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        稟議一覧
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
          {/* Title + Status + Amount */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight mb-3">
              {ringi.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={RINGI_STATUS_COLORS[ringi.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral'}
                label={RINGI_STATUS_LABELS[ringi.status]}
              />
              {ringi.amount !== null && (
                <Badge
                  variant="info"
                  label={formatAmount(ringi.amount)}
                />
              )}
            </div>
          </motion.div>

          {/* Submit button for draft */}
          {ringi.status === 'draft' && currentUser?.id === ringi.created_by && (
            <motion.div variants={fadeUp}>
              <Card>
                <p className="text-[13px] text-text-secondary mb-3">
                  この稟議はまだ下書きです。提出して承認プロセスを開始できます。
                </p>
                <Button variant="primary" size="sm" onClick={handleSubmit}>
                  稟議を提出
                </Button>
              </Card>
            </motion.div>
          )}

          {/* 背景 */}
          {ringi.background && (
            <motion.div variants={fadeUp}>
              <Card>
                <h2 className="text-[15px] font-bold text-text-primary mb-3">
                  背景
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {ringi.background}
                </p>
              </Card>
            </motion.div>
          )}

          {/* 目的 */}
          {ringi.purpose && (
            <motion.div variants={fadeUp}>
              <Card>
                <h2 className="text-[15px] font-bold text-text-primary mb-3">
                  目的
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {ringi.purpose}
                </p>
              </Card>
            </motion.div>
          )}

          {/* 内容 */}
          {ringi.content && (
            <motion.div variants={fadeUp}>
              <Card>
                <h2 className="text-[15px] font-bold text-text-primary mb-3">
                  内容
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {ringi.content}
                </p>
              </Card>
            </motion.div>
          )}

          {/* ROI / リスク / 期待効果 */}
          {(ringi.roi_estimate || ringi.risk || ringi.effect) && (
            <motion.div variants={fadeUp}>
              <Card>
                <div className="space-y-5">
                  {ringi.roi_estimate && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-success" strokeWidth={1.75} />
                        <h3 className="text-[13px] font-semibold text-text-primary">
                          投資回収見込み
                        </h3>
                      </div>
                      <p className="text-[14px] text-text-secondary leading-relaxed pl-6">
                        {ringi.roi_estimate}
                      </p>
                    </div>
                  )}
                  {ringi.risk && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-warning" strokeWidth={1.75} />
                        <h3 className="text-[13px] font-semibold text-text-primary">
                          リスク
                        </h3>
                      </div>
                      <p className="text-[14px] text-text-secondary leading-relaxed pl-6">
                        {ringi.risk}
                      </p>
                    </div>
                  )}
                  {ringi.effect && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.75} />
                        <h3 className="text-[13px] font-semibold text-text-primary">
                          期待効果
                        </h3>
                      </div>
                      <p className="text-[14px] text-text-secondary leading-relaxed pl-6">
                        {ringi.effect}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 承認タイムライン */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <Stamp className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  承認プロセス
                </h2>
              </div>

              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border" />

                <div className="space-y-6">
                  {ringi.approval_steps.map((step, index) => {
                    const isCurrentStep = pendingStep?.id === step.id
                    return (
                      <div key={step.id} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-6 top-0.5">
                          {step.status === 'approved' ? (
                            <CheckCircle2 className="w-[22px] h-[22px] text-success" strokeWidth={2} />
                          ) : step.status === 'rejected' ? (
                            <XCircle className="w-[22px] h-[22px] text-danger" strokeWidth={2} />
                          ) : isCurrentStep ? (
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-accent bg-[rgba(79,70,229,0.1)] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            </div>
                          ) : (
                            <Circle className="w-[22px] h-[22px] text-text-muted" strokeWidth={1.5} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="ml-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[14px] font-semibold text-text-primary">
                              {step.approver_name}
                            </span>
                            <Badge
                              variant={
                                step.status === 'approved'
                                  ? 'success'
                                  : step.status === 'rejected'
                                  ? 'danger'
                                  : isCurrentStep
                                  ? 'processing'
                                  : 'neutral'
                              }
                              label={
                                step.status === 'approved'
                                  ? '承認済み'
                                  : step.status === 'rejected'
                                  ? '却下'
                                  : isCurrentStep
                                  ? '承認待ち'
                                  : '未処理'
                              }
                            />
                            <span
                              className="text-[11px] text-text-muted tabular-nums"
                              style={{ fontFamily: 'var(--font-inter)' }}
                            >
                              ステップ {step.order}
                            </span>
                          </div>

                          {step.comment && (
                            <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed bg-bg-base rounded-[8px] px-3 py-2">
                              {step.comment}
                            </p>
                          )}

                          {step.decided_at && (
                            <p className="text-[11px] text-text-muted mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                              {formatRelative(step.decided_at)}
                            </p>
                          )}

                          {/* Approve/Reject buttons for current user */}
                          {isCurrentStep && (
                            <div className="mt-3 space-y-3">
                              {/* Approve section */}
                              {showApproveInput === step.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    placeholder="承認コメント（任意）"
                                    value={approveComment}
                                    onChange={(e) => setApproveComment(e.target.value)}
                                    rows={2}
                                    className="w-full bg-bg-base border border-border rounded-[10px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      icon={CheckCircle2}
                                      onClick={() => handleApprove(step.id)}
                                    >
                                      承認する
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setShowApproveInput(null)
                                        setApproveComment('')
                                      }}
                                    >
                                      キャンセル
                                    </Button>
                                  </div>
                                </div>
                              ) : showRejectInput === step.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    placeholder="却下理由（必須）"
                                    value={rejectComment}
                                    onChange={(e) => setRejectComment(e.target.value)}
                                    rows={2}
                                    className="w-full bg-bg-base border border-[rgba(239,68,68,0.3)] rounded-[10px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger transition-all"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      icon={XCircle}
                                      onClick={() => handleReject(step.id)}
                                    >
                                      却下する
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setShowRejectInput(null)
                                        setRejectComment('')
                                      }}
                                    >
                                      キャンセル
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    icon={CheckCircle2}
                                    onClick={() => setShowApproveInput(step.id)}
                                  >
                                    承認
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    icon={XCircle}
                                    onClick={() => setShowRejectInput(step.id)}
                                  >
                                    却下
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
              </div>
            </Card>
          </motion.div>

          {/* 実行タスク連携 */}
          {ringi.status === 'approved' && ringi.execution_task_id && (
            <motion.div variants={fadeUp}>
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  <h2 className="text-[15px] font-bold text-text-primary">
                    実行タスク
                  </h2>
                </div>
                <Link
                  href={`/tasks/${ringi.execution_task_id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-bg-base hover:bg-bg-elevated transition-all group"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-[rgba(79,70,229,0.1)] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary truncate">
                      稟議実行: {ringi.title}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      決裁完了により自動生成されたタスク
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                </Link>
              </Card>
            </motion.div>
          )}

          {/* コメント */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                <h2 className="text-[15px] font-bold text-text-primary">
                  コメント
                </h2>
              </div>
              <CommentList parentType="ringi" parentId={ringiId} />
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
              {/* 起票者 */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  起票者
                </div>
                <p className="text-[14px] text-text-primary font-medium">
                  {creator?.name || '不明'}
                </p>
              </div>

              {/* 金額 */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <CircleDollarSign className="w-3.5 h-3.5" strokeWidth={1.75} />
                  金額
                </div>
                <p
                  className="text-[18px] font-bold text-text-primary"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {formatAmount(ringi.amount)}
                </p>
              </div>

              {/* 関連部門 */}
              {ringi.departments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                    <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    関連部門
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ringi.departments.map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-bg-base border border-border text-text-secondary"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ステータス */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Stamp className="w-3.5 h-3.5" strokeWidth={1.75} />
                  ステータス
                </div>
                <Badge
                  variant={RINGI_STATUS_COLORS[ringi.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral'}
                  label={RINGI_STATUS_LABELS[ringi.status]}
                />
              </div>

              {/* 決裁日 */}
              {ringi.decision_date && (
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                    決裁日
                  </div>
                  <p className="text-[14px] text-text-primary font-medium">
                    {formatDate(ringi.decision_date)}
                  </p>
                </div>
              )}

              {/* 起票日 */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  起票日
                </div>
                <p className="text-[14px] text-text-muted">
                  {formatRelative(ringi.created_at)}
                </p>
              </div>

              {/* 添付資料 */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5">
                  <Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />
                  添付資料
                </div>
                {ringi.attachments.length > 0 ? (
                  <div className="space-y-1.5">
                    {ringi.attachments.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 text-[13px] text-text-secondary"
                      >
                        <FileText className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.75} />
                        {a.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-text-muted">
                    添付資料はありません
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
