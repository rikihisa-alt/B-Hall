'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  FileText,
  Clock,
  XCircle,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react'
import { useApplicationStore } from '@/stores/application-store'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ApplicationCreateModal } from '@/features/applications/components/application-create-modal'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_TYPE_LABELS,
} from '@/lib/constants'
import { formatDateCompact } from '@/lib/date'

export default function ApplicationsPage() {
  const [mounted, setMounted] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const router = useRouter()

  const { currentUser, getUserName } = useAuth()
  const getApplications = useApplicationStore((s) => s.getApplications)
  const getPendingApprovals = useApplicationStore((s) => s.getPendingApprovals)
  const hydrated = useApplicationStore((s) => s._hydrated)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 bg-bg-elevated rounded" />
        <div className="h-10 w-1/3 bg-bg-elevated rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
        <div className="h-48 bg-bg-elevated rounded-[16px]" />
        <div className="h-48 bg-bg-elevated rounded-[16px]" />
      </div>
    )
  }

  const allApplications = getApplications()
  const pendingApprovals = currentUser ? getPendingApprovals(currentUser.id) : []
  const rejectedApps = allApplications.filter((app) => app.status === 'rejected')
  const recentApps = [...allApplications]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  // Stats
  const totalCount = allApplications.length
  const pendingCount = allApplications.filter((app) => app.status === 'approving' || app.status === 'submitted').length
  const approvedCount = allApplications.filter((app) => app.status === 'approved').length
  const rejectedCount = rejectedApps.length

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return ''
    return `\u00A5${amount.toLocaleString()}`
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">申請・承認</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">申請・承認</h1>
          <p className="text-[13px] text-text-secondary mt-1">ワークフロー・承認処理</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setCreateOpen(true)}
        >
          新規申請
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
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">全申請</p>
          <p className="text-[24px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>{totalCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" strokeWidth={2} />
            承認待ち
          </p>
          <p className="text-[24px] font-bold text-warning" style={{ fontFamily: 'var(--font-inter)' }}>{pendingCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
            承認済み
          </p>
          <p className="text-[24px] font-bold text-success" style={{ fontFamily: 'var(--font-inter)' }}>{approvedCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <XCircle className="w-3 h-3" strokeWidth={2} />
            却下
          </p>
          <p className="text-[24px] font-bold text-danger" style={{ fontFamily: 'var(--font-inter)' }}>{rejectedCount}</p>
        </motion.div>
      </motion.div>

      {/* 承認待ち（自分宛て） */}
      {pendingApprovals.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-warning" strokeWidth={1.75} />
            <span>あなたの承認待ち</span>
            <span className="text-[12px] font-semibold text-warning tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{pendingApprovals.length}</span>
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {pendingApprovals.map((app) => (
              <div
                key={app.id}
                onClick={() => router.push(`/applications/${app.id}`)}
                className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight">{app.title}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {APPLICATION_TYPE_LABELS[app.type]} · {getUserName(app.applicant_id)}
                  </p>
                </div>
                {app.amount !== null && (
                  <span className="text-[13px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatAmount(app.amount)}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 却下済み */}
      {rejectedApps.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>却下</span>
            <span className="text-[12px] font-semibold text-danger tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{rejectedApps.length}</span>
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {rejectedApps.map((app) => {
              const rejectedStep = app.approval_steps.find((s) => s.status === 'rejected')
              return (
                <div
                  key={app.id}
                  onClick={() => router.push(`/applications/${app.id}`)}
                  className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{app.title}</p>
                    {rejectedStep?.comment && (
                      <p className="text-[12px] text-danger/70 mt-0.5">{rejectedStep.comment}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              )
            })}
          </motion.div>
        </motion.section>
      )}

      {/* 全申請一覧 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">全申請</h2>
        {recentApps.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">申請はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新規申請を作成して始めましょう</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                新規申請
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {recentApps.map((app) => (
              <div
                key={app.id}
                onClick={() => router.push(`/applications/${app.id}`)}
                className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <p className="flex-1 text-[14px] text-text-secondary group-hover:text-text-primary transition-colors truncate font-medium tracking-tight">
                    {app.title}
                  </p>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {APPLICATION_TYPE_LABELS[app.type]} · {getUserName(app.applicant_id)}
                  </p>
                </div>
                <Badge
                  variant={APPLICATION_STATUS_COLORS[app.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={APPLICATION_STATUS_LABELS[app.status]}
                />
                {app.amount !== null && (
                  <span className="text-[13px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatAmount(app.amount)}
                  </span>
                )}
                <span className="text-[12px] text-text-muted tabular-nums shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                  {formatDateCompact(app.updated_at)}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors shrink-0" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Create Modal */}
      <ApplicationCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </motion.div>
  )
}
