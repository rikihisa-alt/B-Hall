'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  FileText,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  EyeOff,
  X,
} from 'lucide-react'
import { useReportStore } from '@/stores/report-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  REPORT_TYPE_LABELS,
  REPORT_TYPE_COLORS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_COLORS,
  DEPARTMENTS,
} from '@/lib/constants'
import { formatDateCompact } from '@/lib/date'
import type { ReportType, Report } from '@/types'

const TYPE_TABS: { value: ReportType | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'daily', label: '日報' },
  { value: 'weekly', label: '週報' },
  { value: 'monthly', label: '月報' },
  { value: 'incident', label: '事故報告' },
  { value: 'improvement', label: '改善報告' },
]

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportType | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailReport, setDetailReport] = useState<Report | null>(null)

  const { currentUser, getUserName } = useAuth()
  const { addToast } = useToast()
  const getReports = useReportStore((s) => s.getReports)
  const getReportsByType = useReportStore((s) => s.getReportsByType)
  const addReport = useReportStore((s) => s.addReport)
  const hydrated = useReportStore((s) => s._hydrated)

  // Create form state
  const [formType, setFormType] = useState<ReportType>('daily')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formPeriodStart, setFormPeriodStart] = useState('')
  const [formPeriodEnd, setFormPeriodEnd] = useState('')
  const [formAnonymous, setFormAnonymous] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredReports = useMemo(() => {
    if (activeTab === 'all') return getReports()
    return getReportsByType(activeTab)
  }, [activeTab, getReports, getReportsByType])

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [filteredReports])

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

  const allReports = getReports()
  const draftCount = allReports.filter((r) => r.status === 'draft').length
  const submittedCount = allReports.filter((r) => r.status === 'submitted').length
  const reviewedCount = allReports.filter((r) => r.status === 'reviewed').length
  const incidentCount = allReports.filter((r) => r.type === 'incident').length

  const handleCreate = () => {
    if (!formTitle.trim() || !currentUser) return
    addReport({
      type: formType,
      title: formTitle,
      content: formContent,
      author_id: currentUser.id,
      department: currentUser.department,
      period_start: formPeriodStart || new Date().toISOString(),
      period_end: formPeriodEnd || new Date().toISOString(),
      status: 'draft',
      is_anonymous: formAnonymous,
      created_by: currentUser.id,
      updated_by: currentUser.id,
    })
    addToast('success', '報告を作成しました')
    setCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormType('daily')
    setFormTitle('')
    setFormContent('')
    setFormPeriodStart('')
    setFormPeriodEnd('')
    setFormAnonymous(false)
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">報告</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">報告</h1>
          <p className="text-[13px] text-text-secondary mt-1">日報・週報・月報・インシデント</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)} className="min-h-[44px] md:min-h-0">
          新規報告
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
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">全報告</p>
          <p className="text-[24px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>{allReports.length}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" strokeWidth={2} />
            下書き
          </p>
          <p className="text-[24px] font-bold text-warning" style={{ fontFamily: 'var(--font-inter)' }}>{draftCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
            提出済み
          </p>
          <p className="text-[24px] font-bold text-info" style={{ fontFamily: 'var(--font-inter)' }}>{submittedCount}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-bg-surface border border-border rounded-[16px] p-4">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
            事故報告
          </p>
          <p className="text-[24px] font-bold text-danger" style={{ fontFamily: 'var(--font-inter)' }}>{incidentCount}</p>
        </motion.div>
      </motion.div>

      {/* Type Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1 mb-6">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer flex-shrink-0 min-h-[36px] md:min-h-0 ${
              activeTab === tab.value
                ? 'bg-accent text-white'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        {sortedReports.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-[12px] bg-bg-elevated flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-text-muted" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary mb-1">報告はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しい報告を作成して始めましょう</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                新規報告
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {sortedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setDetailReport(report)}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                  <FileText className="w-[18px] h-[18px] text-text-muted" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{report.title}</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {report.is_anonymous ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" strokeWidth={2} />
                        匿名
                      </span>
                    ) : (
                      getUserName(report.author_id)
                    )}
                    {' · '}
                    {formatDateCompact(report.period_start)}
                    {report.period_start !== report.period_end && ` - ${formatDateCompact(report.period_end)}`}
                  </p>
                </div>
                <Badge
                  variant={REPORT_TYPE_COLORS[report.type] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={REPORT_TYPE_LABELS[report.type]}
                />
                <Badge
                  variant={REPORT_STATUS_COLORS[report.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={REPORT_STATUS_LABELS[report.status]}
                />
                <span className="text-[12px] text-text-muted tabular-nums shrink-0 hidden sm:block" style={{ fontFamily: 'var(--font-inter)' }}>
                  {formatDateCompact(report.updated_at)}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors shrink-0" strokeWidth={1.75} />
              </div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); resetForm() }}
        title="新規報告"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateOpen(false); resetForm() }}>キャンセル</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!formTitle.trim()}>作成</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              報告種別 <span className="text-accent">*</span>
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as ReportType)}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
            >
              {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <Input
            label="タイトル"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="報告のタイトル"
          />
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              内容 <span className="text-accent">*</span>
            </label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="報告内容を入力..."
              rows={6}
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="期間（開始）"
              type="date"
              value={formPeriodStart}
              onChange={(e) => setFormPeriodStart(e.target.value)}
            />
            <Input
              label="期間（終了）"
              type="date"
              value={formPeriodEnd}
              onChange={(e) => setFormPeriodEnd(e.target.value)}
            />
          </div>
          {(formType === 'incident' || formType === 'improvement') && (
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
          )}
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!detailReport}
        onClose={() => setDetailReport(null)}
        title="報告詳細"
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setDetailReport(null)}>閉じる</Button>
        }
      >
        {detailReport && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[18px] font-bold text-text-primary mb-2">{detailReport.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={REPORT_TYPE_COLORS[detailReport.type] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={REPORT_TYPE_LABELS[detailReport.type]}
                />
                <Badge
                  variant={REPORT_STATUS_COLORS[detailReport.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing'}
                  label={REPORT_STATUS_LABELS[detailReport.status]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">作成者</p>
                <p className="text-[14px] text-text-primary">
                  {detailReport.is_anonymous ? (
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5" strokeWidth={2} />
                      匿名
                    </span>
                  ) : (
                    getUserName(detailReport.author_id)
                  )}
                </p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">部署</p>
                <p className="text-[14px] text-text-primary">{detailReport.department || '未設定'}</p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">期間</p>
                <p className="text-[14px] text-text-primary">
                  {formatDateCompact(detailReport.period_start)}
                  {detailReport.period_start !== detailReport.period_end && ` - ${formatDateCompact(detailReport.period_end)}`}
                </p>
              </div>
              <div className="bg-bg-base rounded-[12px] p-3">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1">レビュアー</p>
                <p className="text-[14px] text-text-primary">
                  {detailReport.reviewer_id ? getUserName(detailReport.reviewer_id) : '未設定'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-2">内容</p>
              <div className="bg-bg-base rounded-[12px] p-4">
                <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{detailReport.content}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
