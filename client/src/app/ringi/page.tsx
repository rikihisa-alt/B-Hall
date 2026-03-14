'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useRingiStore } from '@/stores/ringi-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { RingiCreateModal } from '@/features/ringi/components/ringi-create-modal'
import { Badge } from '@/components/ui/badge'
import {
  RINGI_STATUS_LABELS,
  RINGI_STATUS_COLORS,
} from '@/lib/constants'
import {
  Stamp,
  Clock,
  Plus,
  RotateCcw,
  CheckCircle2,
  Search,
  GitBranch,
  FileText,
  ChevronRight,
  XCircle,
  Edit3,
} from 'lucide-react'

export default function RingiPage() {
  const [mounted, setMounted] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const getRingis = useRingiStore((s) => s.getRingis)
  const getPendingApprovals = useRingiStore((s) => s.getPendingApprovals)
  const hydrated = useRingiStore((s) => s._hydrated)
  const { currentUser } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 bg-bg-elevated rounded" />
        <div className="h-10 w-1/3 bg-bg-elevated rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  const allRingis = getRingis()
  const pendingApprovals = currentUser ? getPendingApprovals(currentUser.id) : []
  const rejectedRingis = allRingis.filter(
    (r) => r.status === 'rejected' && r.created_by === currentUser?.id
  )
  const approvedRingis = allRingis.filter((r) => r.status === 'approved')
  const draftRingis = allRingis.filter(
    (r) => r.status === 'draft' && r.created_by === currentUser?.id
  )

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return ''
    return `¥${amount.toLocaleString()}`
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">稟議</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">稟議</h1>
        <p className="text-[13px] text-text-secondary mt-1">決裁プロセス管理</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {/* 承認待ち */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <Clock className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">承認待ち</p>
              <p className="text-[12px] text-text-secondary">未決裁の稟議を確認</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {pendingApprovals.length}
            </span>
          </div>

          {/* 差戻し対応 */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <RotateCcw className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">差戻し対応</p>
              <p className="text-[12px] text-text-secondary">修正が必要な稟議</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {rejectedRingis.length}
            </span>
          </div>

          {/* 新規起票 */}
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group text-left"
          >
            <Plus className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">新規起票</p>
              <p className="text-[12px] text-text-secondary">稟議書を作成する</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
          </button>

          {/* 決裁済確認 */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <CheckCircle2 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">決裁済確認</p>
              <p className="text-[12px] text-text-secondary">決裁完了の稟議を確認</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {approvedRingis.length}
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* 承認待ち稟議（自分が承認者の場合） */}
      {pendingApprovals.length > 0 && (
        <motion.section
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            あなたの承認待ち
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {pendingApprovals.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Clock className="w-[18px] h-[18px] text-warning" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="processing"
                    label="承認待ち"
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 下書き（自分の） */}
      {draftRingis.length > 0 && (
        <motion.section
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            あなたの下書き
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {draftRingis.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Edit3 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="neutral"
                    label="下書き"
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 管理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {/* 稟議一覧 scrolls to the list below */}
          <button
            onClick={() => {
              const el = document.getElementById('all-ringi-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <Search className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">稟議一覧</span>
              <span className="text-[12px] font-semibold text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                {allRingis.length}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
          <button
            onClick={() => addToast('info', 'この機能は準備中です')}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <GitBranch className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">承認ルート設定</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
          <button
            onClick={() => addToast('info', 'この機能は準備中です')}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">テンプレート</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
        </motion.div>
      </motion.section>

      {/* すべての稟議 */}
      <motion.section
        id="all-ringi-section"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">すべての稟議</h2>
        {allRingis.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Stamp className="w-12 h-12 text-text-muted opacity-40 mb-4" strokeWidth={1.5} />
              <p className="text-[15px] font-semibold text-text-primary mb-1">稟議はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しい稟議を起票して承認プロセスを開始しましょう</p>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-all"
              >
                <Plus className="w-4 h-4" />
                新規稟議
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {allRingis.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Stamp className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={RINGI_STATUS_COLORS[ringi.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral'}
                    label={RINGI_STATUS_LABELS[ringi.status]}
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Create Modal */}
      <RingiCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </motion.div>
  )
}
