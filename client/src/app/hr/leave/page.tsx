'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  X,
  Calendar,
  Clock,
  Users,
} from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import {
  useLeaveStore,
  LEAVE_TYPE_LABELS,
  type LeaveType,
  type LeaveRequestStatus,
} from '@/stores/leave-store'
import { useToast } from '@/components/ui/toast-provider'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { formatDateCompact } from '@/lib/date'

// ── 円形プログレス ──

function CircleProgress({
  used,
  pending,
  total,
}: {
  used: number
  pending: number
  total: number
}) {
  const remaining = Math.max(0, total - used - pending)
  const usedPct = (used / total) * 100
  const pendingPct = (pending / total) * 100
  const circumference = 2 * Math.PI * 54
  const usedDash = (usedPct / 100) * circumference
  const pendingDash = (pendingPct / 100) * circumference
  const remainingDash = circumference - usedDash - pendingDash

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        {/* 背景円 */}
        <circle
          cx="60" cy="60" r="54"
          fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10"
        />
        {/* 残り (緑) */}
        <circle
          cx="60" cy="60" r="54"
          fill="none" stroke="#22C55E" strokeWidth="10"
          strokeDasharray={`${remainingDash} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        {/* 申請中 (黄) */}
        <circle
          cx="60" cy="60" r="54"
          fill="none" stroke="#F59E0B" strokeWidth="10"
          strokeDasharray={`${pendingDash} ${circumference}`}
          strokeDashoffset={`${-remainingDash}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        {/* 使用済み (アクセント) */}
        <circle
          cx="60" cy="60" r="54"
          fill="none" stroke="#4F46E5" strokeWidth="10"
          strokeDasharray={`${usedDash} ${circumference}`}
          strokeDashoffset={`${-(remainingDash + pendingDash)}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[28px] font-bold text-text-primary tabular-nums"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {remaining}
        </span>
        <span className="text-[11px] text-text-muted -mt-0.5">/ {total}日</span>
      </div>
    </div>
  )
}

// ── ステータスタブ ──

const STATUS_TABS: { key: LeaveRequestStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'pending', label: '申請中' },
  { key: 'approved', label: '承認済' },
  { key: 'rejected', label: '却下' },
]

const STATUS_STYLES: Record<LeaveRequestStatus, { text: string; bg: string; label: string }> = {
  pending: { text: 'text-[#F59E0B]', bg: 'bg-[rgba(245,158,11,0.08)]', label: '申請中' },
  approved: { text: 'text-[#22C55E]', bg: 'bg-[rgba(34,197,94,0.08)]', label: '承認済' },
  rejected: { text: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.08)]', label: '却下' },
}

// ── カレンダーヘルパー ──

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// ── 従業員カラー ──

const EMPLOYEE_COLORS: Record<string, string> = {
  'emp-1': '#4F46E5',
  'emp-2': '#EC4899',
  'emp-3': '#F59E0B',
  'emp-4': '#22C55E',
  'emp-5': '#8B5CF6',
  'emp-6': '#06B6D4',
}

// ── ページ ──

export default function LeavePage() {
  const employees = useEmployeeStore((s) => s.employees)
  const empHydrated = useEmployeeStore((s) => s._hydrated)
  const balances = useLeaveStore((s) => s.balances)
  const requests = useLeaveStore((s) => s.requests)
  const leaveHydrated = useLeaveStore((s) => s._hydrated)
  const requestLeave = useLeaveStore((s) => s.requestLeave)
  const approveLeave = useLeaveStore((s) => s.approveLeave)
  const rejectLeave = useLeaveStore((s) => s.rejectLeave)
  const { addToast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<LeaveRequestStatus | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  // フォーム state
  const [formEmployee, setFormEmployee] = useState('emp-1')
  const [formType, setFormType] = useState<LeaveType>('paid')
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formReason, setFormReason] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // 現在のユーザー（管理者: user-1 / emp-1 = 田中太郎）
  const currentUserId = 'user-1'
  const currentEmployee = employees.find((e) => e.user_id === currentUserId)
  const currentBalance = balances.find(
    (b) => b.employee_id === currentEmployee?.id && b.year === 2026
  )

  // フィルタ済みリクエスト
  const filteredRequests = useMemo(() => {
    const active = requests.filter((r) => !r.deleted_at)
    if (activeTab === 'all') return active
    return active.filter((r) => r.status === activeTab)
  }, [requests, activeTab])

  // 承認待ちリクエスト
  const pendingRequests = useMemo(() => {
    return requests.filter((r) => !r.deleted_at && r.status === 'pending')
  }, [requests])

  // 従業員名マップ
  const empNameMap = useMemo(() => {
    const map = new Map<string, string>()
    employees.forEach((e) => map.set(e.id, e.name))
    return map
  }, [employees])

  // カレンダーデータ
  const calendarData = useMemo(() => {
    const { year, month } = calMonth
    const daysCount = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month)

    const approvedRequests = requests.filter(
      (r) => !r.deleted_at && r.status === 'approved'
    )

    // 各日に休暇を取っている従業員を割り当て
    const dayMap = new Map<number, { employee_id: string; name: string; color: string }[]>()

    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayEntries: { employee_id: string; name: string; color: string }[] = []

      approvedRequests.forEach((r) => {
        if (r.start_date <= dateStr && r.end_date >= dateStr) {
          dayEntries.push({
            employee_id: r.employee_id,
            name: empNameMap.get(r.employee_id) || '',
            color: EMPLOYEE_COLORS[r.employee_id] || '#64748B',
          })
        }
      })

      if (dayEntries.length > 0) {
        dayMap.set(d, dayEntries)
      }
    }

    return { daysCount, firstDay, dayMap }
  }, [calMonth, requests, empNameMap])

  // 日数計算
  const calcDays = useCallback((start: string, end: string): number => {
    if (!start || !end) return 0
    const s = new Date(start)
    const e = new Date(end)
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(0, diff)
  }, [])

  // 申請送信
  const handleSubmit = () => {
    const days = calcDays(formStartDate, formEndDate)
    if (!formStartDate || !formEndDate || days <= 0) {
      addToast('error', '日付を正しく入力してください')
      return
    }
    if (!formReason.trim()) {
      addToast('error', '理由を入力してください')
      return
    }

    requestLeave({
      employee_id: formEmployee,
      type: formType,
      start_date: formStartDate,
      end_date: formEndDate,
      days,
      reason: formReason.trim(),
    })

    addToast('success', '休暇申請を送信しました')
    setShowModal(false)
    setFormStartDate('')
    setFormEndDate('')
    setFormReason('')
  }

  if (!mounted || !empHydrated || !leaveHydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="h-40 bg-bg-elevated rounded-[16px]" />
        <div className="space-y-3 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
  const monthLabel = `${calMonth.year}年${calMonth.month + 1}月`

  return (
    <motion.div {...pageTransition}>
      {/* パンくず */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link href="/hr" className="text-text-muted hover:text-text-primary transition-colors">人事・労務</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">有給管理</span>
      </nav>

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">有給休暇管理</h1>
          <p className="text-[13px] text-text-secondary mt-1">休暇残高・申請・承認の管理</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          休暇申請
        </Button>
      </div>

      {/* 残高カード */}
      {currentBalance && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            あなたの有給残高
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
            variants={fadeUp}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <CircleProgress
                used={currentBalance.used_days}
                pending={currentBalance.pending_days}
                total={currentBalance.granted_days}
              />
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="text-center sm:text-left">
                  <p className="text-[11px] text-text-muted mb-1">付与日数</p>
                  <p className="text-[20px] font-bold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {currentBalance.granted_days}<span className="text-[12px] font-normal text-text-muted ml-0.5">日</span>
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] text-text-muted mb-1">使用済み</p>
                  <p className="text-[20px] font-bold text-[#4F46E5] tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {currentBalance.used_days}<span className="text-[12px] font-normal text-text-muted ml-0.5">日</span>
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] text-text-muted mb-1">申請中</p>
                  <p className="text-[20px] font-bold text-[#F59E0B] tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {currentBalance.pending_days}<span className="text-[12px] font-normal text-text-muted ml-0.5">日</span>
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] text-text-muted mb-1">残り</p>
                  <p className="text-[20px] font-bold text-[#22C55E] tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {currentBalance.granted_days - currentBalance.used_days - currentBalance.pending_days}
                    <span className="text-[12px] font-normal text-text-muted ml-0.5">日</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-text-muted mt-4">
              有効期限: {currentBalance.expiry_date}
            </p>
          </motion.div>
        </motion.section>
      )}

      {/* 承認セクション（管理者向け） */}
      {pendingRequests.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            承認待ち ({pendingRequests.length}件)
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {pendingRequests.map((req) => {
              const emp = employees.find((e) => e.id === req.employee_id)
              return (
                <div key={req.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${EMPLOYEE_COLORS[req.employee_id] || '#64748B'}, ${EMPLOYEE_COLORS[req.employee_id] || '#94A3B8'}dd)`,
                    }}
                  >
                    {emp?.name.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">
                      {emp?.name || '不明'} - {LEAVE_TYPE_LABELS[req.type]}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {req.start_date} ~ {req.end_date} ({req.days}日) / {req.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        approveLeave(req.id, currentUserId)
                        addToast('success', `${emp?.name || ''}の休暇申請を承認しました`)
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(34,197,94,0.1)] text-[#22C55E] hover:bg-[rgba(34,197,94,0.2)] transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => {
                        rejectLeave(req.id, currentUserId)
                        addToast('success', `${emp?.name || ''}の休暇申請を却下しました`)
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(239,68,68,0.1)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)] transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.section>
      )}

      {/* 申請履歴 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
          休暇申請一覧
        </h2>

        {/* タブ */}
        <div className="flex gap-1 mb-4 bg-bg-base border border-border rounded-[10px] p-1 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer',
                activeTab === tab.key
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden"
          variants={fadeUp}
        >
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-10 h-10 text-text-muted mb-3" strokeWidth={1.5} />
              <p className="text-[14px] text-text-secondary font-medium">申請がありません</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredRequests.map((req) => {
                const emp = employees.find((e) => e.id === req.employee_id)
                const style = STATUS_STYLES[req.status]
                return (
                  <div key={req.id} className="flex items-center gap-4 px-5 py-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${EMPLOYEE_COLORS[req.employee_id] || '#64748B'}, ${EMPLOYEE_COLORS[req.employee_id] || '#94A3B8'}dd)`,
                      }}
                    >
                      {emp?.name.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">
                        {emp?.name || '不明'} - {LEAVE_TYPE_LABELS[req.type]}
                      </p>
                      <p className="text-[12px] text-text-muted truncate">
                        {req.start_date} ~ {req.end_date} ({req.days}日) / {req.reason}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0',
                        style.text,
                        style.bg
                      )}
                    >
                      {style.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* 月間カレンダー */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
          休暇カレンダー
        </h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5"
          variants={fadeUp}
        >
          {/* 月切替 */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() =>
                setCalMonth((prev) => {
                  const d = new Date(prev.year, prev.month - 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })
              }
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            </button>
            <h3 className="text-[15px] font-semibold text-text-primary">{monthLabel}</h3>
            <button
              onClick={() =>
                setCalMonth((prev) => {
                  const d = new Date(prev.year, prev.month + 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })
              }
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className={cn(
                  'text-center text-[11px] font-medium py-1',
                  i === 0 ? 'text-[#EF4444]' : i === 6 ? 'text-[#3B82F6]' : 'text-text-muted'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7">
            {/* 空セル */}
            {Array.from({ length: calendarData.firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20" />
            ))}

            {/* 日付 */}
            {Array.from({ length: calendarData.daysCount }).map((_, i) => {
              const day = i + 1
              const dayOfWeek = (calendarData.firstDay + i) % 7
              const entries = calendarData.dayMap.get(day)
              const isToday = (() => {
                const now = new Date()
                return now.getFullYear() === calMonth.year && now.getMonth() === calMonth.month && now.getDate() === day
              })()

              return (
                <div
                  key={day}
                  className={cn(
                    'h-16 sm:h-20 border-t border-border/50 p-1 relative',
                    isToday && 'bg-[rgba(79,70,229,0.04)]'
                  )}
                >
                  <span
                    className={cn(
                      'text-[12px] tabular-nums',
                      isToday ? 'font-bold text-accent' : dayOfWeek === 0 ? 'text-[#EF4444]' : dayOfWeek === 6 ? 'text-[#3B82F6]' : 'text-text-secondary'
                    )}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {day}
                  </span>

                  {entries && (
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {entries.slice(0, 3).map((entry) => (
                        <div
                          key={entry.employee_id}
                          className="w-full rounded-[3px] px-1 py-px text-[9px] sm:text-[10px] text-white font-medium truncate"
                          style={{ backgroundColor: entry.color }}
                          title={entry.name}
                        >
                          <span className="hidden sm:inline">{entry.name}</span>
                          <span className="sm:hidden">{entry.name.charAt(0)}</span>
                        </div>
                      ))}
                      {entries.length > 3 && (
                        <span className="text-[9px] text-text-muted">+{entries.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 凡例 */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {employees
              .filter((e) => !e.deleted_at && e.status !== 'terminated')
              .map((e) => (
                <div key={e.id} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: EMPLOYEE_COLORS[e.id] || '#64748B' }}
                  />
                  <span className="text-[11px] text-text-muted">{e.name}</span>
                </div>
              ))}
          </div>
        </motion.div>
      </motion.section>

      {/* 全従業員残高 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
          全従業員の有給残高
        </h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {balances.map((bal) => {
            const emp = employees.find((e) => e.id === bal.employee_id)
            if (!emp || emp.deleted_at || emp.status === 'terminated') return null
            const remaining = bal.granted_days - bal.used_days - bal.pending_days
            const usagePct = ((bal.used_days + bal.pending_days) / bal.granted_days) * 100

            return (
              <div key={bal.id} className="flex items-center gap-4 px-5 py-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${EMPLOYEE_COLORS[emp.id] || '#64748B'}, ${EMPLOYEE_COLORS[emp.id] || '#94A3B8'}dd)`,
                  }}
                >
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight">{emp.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-[rgba(148,163,184,0.15)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${usagePct}%`,
                          background: usagePct > 80 ? '#EF4444' : usagePct > 60 ? '#F59E0B' : '#4F46E5',
                        }}
                      />
                    </div>
                    <span className="text-[12px] text-text-muted tabular-nums shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                      {bal.used_days}/{bal.granted_days}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      'text-[16px] font-bold tabular-nums',
                      remaining <= 3 ? 'text-[#EF4444]' : 'text-[#22C55E]'
                    )}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {remaining}<span className="text-[11px] font-normal text-text-muted ml-0.5">日残</span>
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 休暇申請モーダル */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="休暇申請"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>キャンセル</Button>
            <Button onClick={handleSubmit}>申請する</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* 従業員選択 */}
          <div className="w-full">
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              申請者 <span className="text-accent">*</span>
            </label>
            <select
              value={formEmployee}
              onChange={(e) => setFormEmployee(e.target.value)}
              className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
            >
              {employees
                .filter((e) => !e.deleted_at && e.status !== 'terminated')
                .map((e) => (
                  <option key={e.id} value={e.id}>{e.name}（{e.department}）</option>
                ))}
            </select>
          </div>

          {/* 種別 */}
          <div className="w-full">
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              休暇種別 <span className="text-accent">*</span>
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as LeaveType)}
              className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
            >
              {(Object.entries(LEAVE_TYPE_LABELS) as [LeaveType, string][]).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* 日付 */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="開始日"
              type="date"
              required
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
            />
            <Input
              label="終了日"
              type="date"
              required
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
            />
          </div>

          {formStartDate && formEndDate && (
            <p className="text-[13px] text-accent font-medium">
              {calcDays(formStartDate, formEndDate)}日間
            </p>
          )}

          {/* 理由 */}
          <div className="w-full">
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              理由 <span className="text-accent">*</span>
            </label>
            <textarea
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
              rows={3}
              placeholder="休暇の理由を入力..."
              className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted w-full transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
