'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, staggerContainer, fadeUp } from '@/lib/animation'
import {
  ChevronRight,
  Plus,
  ClipboardList,
  BarChart3,
  Star,
  Users,
  Send,
  Eye,
  Trash2,
  X,
} from 'lucide-react'
import { useSurveyStore } from '@/stores/survey-store'
import type { Survey, SurveyQuestion, SurveyStats } from '@/stores/survey-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { useToast } from '@/components/ui/toast-provider'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { generateId } from '@/lib/id'

// ── 定数 ──

const TYPE_LABELS: Record<Survey['type'], string> = {
  engagement: 'エンゲージメント',
  satisfaction: '満足度調査',
  pulse: 'パルス',
  custom: 'カスタム',
}

const TYPE_BADGE_VARIANT: Record<Survey['type'], 'info' | 'success' | 'warning' | 'neutral'> = {
  engagement: 'info',
  satisfaction: 'success',
  pulse: 'warning',
  custom: 'neutral',
}

const STATUS_LABELS: Record<Survey['status'], string> = {
  draft: '下書き',
  active: '実施中',
  closed: '終了',
}

const STATUS_BADGE_VARIANT: Record<Survey['status'], 'neutral' | 'processing' | 'success'> = {
  draft: 'neutral',
  active: 'processing',
  closed: 'success',
}

// ── コンポーネント ──

function RatingStars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(value) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-text-muted'}`}
          strokeWidth={1.75}
        />
      ))}
    </div>
  )
}

function RatingInput({ value, onChange, max = 5 }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="p-0.5 cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${i < value ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-text-muted hover:text-[#F59E0B]/50'}`}
            strokeWidth={1.75}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-[13px] font-semibold text-text-secondary ml-2" style={{ fontFamily: 'var(--font-inter)' }}>
          {value} / {max}
        </span>
      )}
    </div>
  )
}

function BarChart({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = value >= 4 ? '#22C55E' : value >= 3 ? '#F59E0B' : '#EF4444'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary leading-tight">{label}</span>
        <div className="flex items-center gap-2">
          <RatingStars value={value} />
          <span className="text-[13px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
            {value.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-bg-base overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function SurveyPage() {
  const surveys = useSurveyStore((s) => s.getSurveys())
  const createSurvey = useSurveyStore((s) => s.createSurvey)
  const deleteSurvey = useSurveyStore((s) => s.deleteSurvey)
  const submitResponse = useSurveyStore((s) => s.submitResponse)
  const getSurveyStats = useSurveyStore((s) => s.getSurveyStats)
  const getResponses = useSurveyStore((s) => s.getResponses)
  const hydrated = useSurveyStore((s) => s._hydrated)
  const employees = useEmployeeStore((s) => s.employees)
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [responseModal, setResponseModal] = useState<Survey | null>(null)
  const [resultsModal, setResultsModal] = useState<Survey | null>(null)
  const [createModal, setCreateModal] = useState(false)

  // Response form state
  const [responseAnswers, setResponseAnswers] = useState<Record<string, string | number>>({})

  // Create form state
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState<Survey['type']>('engagement')
  const [newAnonymous, setNewAnonymous] = useState(true)
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [newQuestions, setNewQuestions] = useState<SurveyQuestion[]>([
    { id: generateId(), text: '', type: 'rating', required: true },
  ])

  useEffect(() => { setMounted(true) }, [])

  // ── 統計 ──
  const stats = useMemo(() => {
    const activeSurveys = surveys.filter((s) => s.status === 'active')
    const allResponses = surveys.reduce((sum, s) => sum + s.response_count, 0)
    const allTargets = surveys.reduce((sum, s) => sum + s.total_targets, 0)
    const overallRate = allTargets > 0 ? Math.round((allResponses / allTargets) * 100) : 0

    // 全サーベイの平均スコア
    let totalScore = 0
    let scoreCount = 0
    surveys.forEach((s) => {
      const st = getSurveyStats(s.id)
      st.question_averages.forEach((qa) => {
        if (qa.count > 0) {
          totalScore += qa.average
          scoreCount++
        }
      })
    })
    const avgScore = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0

    return { activeSurveys: activeSurveys.length, overallRate, avgScore }
  }, [surveys, getSurveyStats])

  // ── ハンドラー ──

  const handleSubmitResponse = () => {
    if (!responseModal) return
    const answers = responseModal.questions.map((q) => ({
      question_id: q.id,
      value: responseAnswers[q.id] ?? (q.type === 'rating' ? 0 : ''),
    }))

    // バリデーション
    const missing = responseModal.questions.filter(
      (q) => q.required && !responseAnswers[q.id]
    )
    if (missing.length > 0) {
      addToast('warning', '必須項目に回答してください')
      return
    }

    submitResponse(responseModal.id, 'emp-1', answers)
    addToast('success', '回答を送信しました')
    setResponseModal(null)
    setResponseAnswers({})
  }

  const handleCreateSurvey = () => {
    if (!newTitle.trim()) {
      addToast('warning', 'タイトルを入力してください')
      return
    }
    if (newQuestions.some((q) => !q.text.trim())) {
      addToast('warning', '全ての質問項目を入力してください')
      return
    }

    createSurvey({
      title: newTitle,
      description: newDescription,
      type: newType,
      status: 'draft',
      questions: newQuestions,
      target_departments: [],
      anonymous: newAnonymous,
      start_date: newStartDate || new Date().toISOString().split('T')[0],
      end_date: newEndDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      total_targets: employees.filter((e) => !e.deleted_at && e.status !== 'terminated').length,
    })

    addToast('success', 'サーベイを作成しました')
    setCreateModal(false)
    resetCreateForm()
  }

  const resetCreateForm = () => {
    setNewTitle('')
    setNewDescription('')
    setNewType('engagement')
    setNewAnonymous(true)
    setNewStartDate('')
    setNewEndDate('')
    setNewQuestions([{ id: generateId(), text: '', type: 'rating', required: true }])
  }

  const addQuestion = () => {
    setNewQuestions((prev) => [
      ...prev,
      { id: generateId(), text: '', type: 'rating', required: true },
    ])
  }

  const removeQuestion = (qId: string) => {
    if (newQuestions.length <= 1) return
    setNewQuestions((prev) => prev.filter((q) => q.id !== qId))
  }

  const updateQuestion = (qId: string, updates: Partial<SurveyQuestion>) => {
    setNewQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, ...updates } : q)))
  }

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link href="/hr" className="text-text-muted hover:text-text-primary transition-colors">人事・労務</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">サーベイ</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">従業員サーベイ</h1>
          <p className="text-[13px] text-text-secondary mt-1">従業員サーベイの実施・分析</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateModal(true)}>
          新規サーベイ
        </Button>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: '回答率', value: `${stats.overallRate}%`, icon: Users, color: '#3B82F6' },
          { label: '平均スコア', value: `${stats.avgScore}`, icon: Star, color: '#F59E0B' },
          { label: '実施中サーベイ', value: `${stats.activeSurveys}`, icon: ClipboardList, color: '#22C55E' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.75} />
              </div>
              <span className="text-[13px] text-text-muted">{stat.label}</span>
            </div>
            <p className="text-[28px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Survey List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">サーベイ一覧</h2>
        <div className="space-y-3">
          {surveys.map((survey) => {
            const rate = survey.total_targets > 0 ? Math.round((survey.response_count / survey.total_targets) * 100) : 0
            const surveyStats = getSurveyStats(survey.id)

            return (
              <motion.div
                key={survey.id}
                variants={fadeUp}
                className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5 hover:border-accent/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-semibold text-text-primary tracking-tight truncate">
                        {survey.title}
                      </h3>
                    </div>
                    <p className="text-[12px] text-text-muted line-clamp-1">{survey.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={TYPE_BADGE_VARIANT[survey.type]} label={TYPE_LABELS[survey.type]} />
                    <Badge variant={STATUS_BADGE_VARIANT[survey.status]} label={STATUS_LABELS[survey.status]} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-text-muted">
                      回答率: {survey.response_count} / {survey.total_targets}名
                    </span>
                    <span className="text-[12px] font-semibold text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {rate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-base overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rate}%`,
                        backgroundColor: rate >= 80 ? '#22C55E' : rate >= 50 ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                </div>

                {/* Date + Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">
                    {survey.start_date} 〜 {survey.end_date}
                    {survey.anonymous && ' / 匿名'}
                  </span>
                  <div className="flex items-center gap-2">
                    {survey.status === 'active' && (
                      <button
                        onClick={() => {
                          setResponseModal(survey)
                          setResponseAnswers({})
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-accent hover:bg-accent-muted transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                        回答する
                      </button>
                    )}
                    {(survey.status === 'closed' || (survey.status === 'active' && survey.response_count > 0)) && (
                      <button
                        onClick={() => setResultsModal(survey)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-text-secondary hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                        結果を見る
                      </button>
                    )}
                    {survey.status === 'draft' && (
                      <button
                        onClick={() => {
                          deleteSurvey(survey.id)
                          addToast('success', 'サーベイを削除しました')
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-danger hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        削除
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}

          {surveys.length === 0 && (
            <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12 text-center">
              <ClipboardList className="w-10 h-10 text-text-muted mx-auto mb-3" strokeWidth={1.25} />
              <p className="text-[15px] font-semibold text-text-secondary mb-1">サーベイはまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しいサーベイを作成しましょう</p>
              <Button size="sm" icon={Plus} onClick={() => setCreateModal(true)}>
                新規サーベイ作成
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── 回答モーダル ── */}
      <Modal
        open={!!responseModal}
        onClose={() => { setResponseModal(null); setResponseAnswers({}) }}
        title={responseModal?.title || 'サーベイ回答'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setResponseModal(null); setResponseAnswers({}) }}>キャンセル</Button>
            <Button icon={Send} onClick={handleSubmitResponse}>回答を送信</Button>
          </>
        }
      >
        {responseModal && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-[13px] text-text-muted">{responseModal.description}</p>
            {responseModal.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-[12px] bg-bg-base border border-border">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-[12px] font-semibold text-accent shrink-0 mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                    Q{idx + 1}
                  </span>
                  <p className="text-[14px] font-semibold text-text-primary">
                    {q.text}
                    {q.required && <span className="text-accent ml-1">*</span>}
                  </p>
                </div>

                {q.type === 'rating' && (
                  <RatingInput
                    value={(responseAnswers[q.id] as number) || 0}
                    onChange={(v) => setResponseAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  />
                )}

                {q.type === 'text' && (
                  <textarea
                    className="w-full bg-bg-surface border border-border rounded-[10px] px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted resize-none focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] transition-all"
                    rows={3}
                    placeholder="自由に記入してください..."
                    value={(responseAnswers[q.id] as string) || ''}
                    onChange={(e) => setResponseAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  />
                )}

                {q.type === 'choice' && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setResponseAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`w-full text-left px-4 py-3 rounded-[10px] border text-[14px] transition-all cursor-pointer ${
                          responseAnswers[q.id] === opt
                            ? 'border-accent bg-accent-muted text-accent font-semibold'
                            : 'border-border bg-bg-surface text-text-secondary hover:border-accent/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── 結果モーダル ── */}
      <Modal
        open={!!resultsModal}
        onClose={() => setResultsModal(null)}
        title={resultsModal ? `${resultsModal.title} - 結果` : '結果'}
        size="lg"
        footer={<Button variant="ghost" onClick={() => setResultsModal(null)}>閉じる</Button>}
      >
        {resultsModal && (() => {
          const surveyStats = getSurveyStats(resultsModal.id)
          const responses = getResponses(resultsModal.id)
          const textQuestions = resultsModal.questions.filter((q) => q.type === 'text')

          return (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-[12px] bg-bg-base border border-border text-center">
                  <p className="text-[28px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>
                    {surveyStats.response_rate}%
                  </p>
                  <p className="text-[12px] text-text-muted mt-1">回答率</p>
                </div>
                <div className="p-4 rounded-[12px] bg-bg-base border border-border text-center">
                  <p className="text-[28px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>
                    {surveyStats.total_responses}
                  </p>
                  <p className="text-[12px] text-text-muted mt-1">回答数</p>
                </div>
              </div>

              {/* Rating bar charts */}
              {surveyStats.question_averages.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-semibold text-text-secondary mb-3">設問別スコア</h3>
                  <div className="p-4 rounded-[12px] bg-bg-base border border-border space-y-4">
                    {surveyStats.question_averages.map((qa) => (
                      <BarChart
                        key={qa.question_id}
                        label={qa.question_text}
                        value={qa.average}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Text responses */}
              {textQuestions.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-semibold text-text-secondary mb-3">自由回答</h3>
                  {textQuestions.map((q) => {
                    const textAnswers = responses
                      .map((r) => r.answers.find((a) => a.question_id === q.id))
                      .filter((a) => a && typeof a.value === 'string' && a.value.trim())

                    return (
                      <div key={q.id} className="mb-3">
                        <p className="text-[13px] font-medium text-text-primary mb-2">{q.text}</p>
                        <div className="space-y-2">
                          {textAnswers.map((a, idx) => (
                            <div key={idx} className="px-4 py-3 rounded-[10px] bg-bg-base border border-border">
                              <p className="text-[13px] text-text-secondary">{String(a!.value)}</p>
                            </div>
                          ))}
                          {textAnswers.length === 0 && (
                            <p className="text-[12px] text-text-muted">回答なし</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </Modal>

      {/* ── 新規作成モーダル ── */}
      <Modal
        open={createModal}
        onClose={() => { setCreateModal(false); resetCreateForm() }}
        title="新規サーベイ作成"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreateModal(false); resetCreateForm() }}>キャンセル</Button>
            <Button icon={Plus} onClick={handleCreateSurvey}>作成</Button>
          </>
        }
      >
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          <Input
            label="タイトル"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="例: 2026年度 Q2 エンゲージメントサーベイ"
          />

          <div className="w-full">
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              説明
            </label>
            <textarea
              className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted resize-none focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] transition-all"
              rows={2}
              placeholder="サーベイの概要を入力..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">種類</label>
              <select
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:outline-none transition-all"
                value={newType}
                onChange={(e) => setNewType(e.target.value as Survey['type'])}
              >
                <option value="engagement">エンゲージメント</option>
                <option value="satisfaction">満足度調査</option>
                <option value="pulse">パルス</option>
                <option value="custom">カスタム</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">匿名回答</label>
              <button
                type="button"
                onClick={() => setNewAnonymous(!newAnonymous)}
                className={`w-full px-4 py-3 rounded-[10px] border text-[15px] text-left transition-all cursor-pointer ${
                  newAnonymous ? 'border-accent bg-accent-muted text-accent font-semibold' : 'border-border bg-bg-base text-text-secondary'
                }`}
              >
                {newAnonymous ? '匿名: ON' : '匿名: OFF'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="開始日"
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
            <Input
              label="終了日"
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>

          {/* Questions builder */}
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-3">
              質問項目 <span className="text-accent">*</span>
            </label>
            <div className="space-y-3">
              {newQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-[12px] bg-bg-base border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-accent" style={{ fontFamily: 'var(--font-inter)' }}>
                      Q{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-bg-surface border border-border rounded-[8px] px-2 py-1 text-[12px] text-text-secondary focus:outline-none"
                        value={q.type}
                        onChange={(e) => updateQuestion(q.id, { type: e.target.value as SurveyQuestion['type'] })}
                      >
                        <option value="rating">5段階評価</option>
                        <option value="text">テキスト</option>
                        <option value="choice">選択肢</option>
                      </select>
                      {newQuestions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[rgba(239,68,68,0.08)] text-text-muted hover:text-danger transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none"
                    placeholder="質問を入力..."
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  />
                  {q.type === 'choice' && (
                    <div className="mt-2">
                      <input
                        className="w-full bg-bg-surface border border-border rounded-[8px] px-3 py-2 text-[12px] text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent"
                        placeholder="選択肢をカンマ区切りで入力 (例: 良い,普通,悪い)"
                        value={q.options?.join(',') || ''}
                        onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-[10px] border border-dashed border-border text-[13px] font-semibold text-text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" strokeWidth={1.75} />
                質問を追加
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
