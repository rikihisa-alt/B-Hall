'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Timer,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowRight,
  Briefcase,
  Coffee,
  AlertCircle,
  Laptop,
  Moon,
} from 'lucide-react'
import { useAttendanceStore, EMPLOYEE_NAMES } from '@/stores/attendance-store'
import { useAuthStore } from '@/stores/auth-store'
import type { AttendanceRecord } from '@/stores/attendance-store'

// ── Status config ──

const STATUS_CONFIG: Record<AttendanceRecord['status'], { label: string; color: string; dot: string; icon: typeof Clock }> = {
  present:  { label: '出勤',     color: 'text-emerald-400', dot: 'bg-emerald-400', icon: Briefcase },
  absent:   { label: '欠勤',     color: 'text-red-400',     dot: 'bg-red-400',     icon: Moon },
  late:     { label: '遅刻',     color: 'text-amber-400',   dot: 'bg-amber-400',   icon: AlertCircle },
  half_day: { label: '半休',     color: 'text-orange-400',  dot: 'bg-orange-400',  icon: Coffee },
  remote:   { label: 'リモート', color: 'text-blue-400',    dot: 'bg-blue-400',    icon: Laptop },
}

// ── Helper ──

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function currentYearMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getDaysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

function getFirstDayOfWeek(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m - 1, 1).getDay()
}

function formatYearMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  return `${y}年${m}月`
}

function shiftMonth(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

// ── Component ──

export default function AttendancePage() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const hydrated = useAttendanceStore((s) => s._hydrated)
  const records = useAttendanceStore((s) => s.records)
  const clockIn = useAttendanceStore((s) => s.clockIn)
  const clockOut = useAttendanceStore((s) => s.clockOut)
  const getTodayRecord = useAttendanceStore((s) => s.getTodayRecord)
  const getRecordsByDate = useAttendanceStore((s) => s.getRecordsByDate)
  const getRecordsByEmployee = useAttendanceStore((s) => s.getRecordsByEmployee)
  const getMonthlyStats = useAttendanceStore((s) => s.getMonthlyStats)

  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [viewMonth, setViewMonth] = useState(currentYearMonth())
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const userId = currentUser?.id || 'user-1'
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'hr'

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const d = new Date()
      setCurrentTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      )
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  // Today's record for current user
  const todayRecord = useMemo(() => {
    if (!mounted || !hydrated) return undefined
    return getTodayRecord(userId)
  }, [mounted, hydrated, records, userId, getTodayRecord])

  const isClockedIn = !!todayRecord?.clock_in && !todayRecord?.clock_out
  const isClockedOut = !!todayRecord?.clock_out

  // Working time counter
  const workingTime = useMemo(() => {
    if (!todayRecord?.clock_in) return null
    const endTime = todayRecord.clock_out || currentTime.slice(0, 5)
    if (!endTime) return null
    const [inH, inM] = todayRecord.clock_in.split(':').map(Number)
    const [outH, outM] = endTime.split(':').map(Number)
    const totalMin = (outH * 60 + outM) - (inH * 60 + inM)
    if (totalMin < 0) return null
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return `${h}時間${m}分`
  }, [todayRecord, currentTime])

  // Target employee for calendar view
  const targetEmployeeId = selectedEmployee || userId

  // Monthly records for calendar
  const monthRecords = useMemo(() => {
    if (!mounted || !hydrated) return new Map<string, AttendanceRecord>()
    const recs = getRecordsByEmployee(targetEmployeeId, viewMonth)
    const map = new Map<string, AttendanceRecord>()
    for (const r of recs) map.set(r.date, r)
    return map
  }, [mounted, hydrated, records, targetEmployeeId, viewMonth, getRecordsByEmployee])

  // Stats
  const stats = useMemo(() => {
    if (!mounted || !hydrated) return { workDays: 0, totalHours: 0, overtimeHours: 0, lateCount: 0, absentCount: 0 }
    return getMonthlyStats(targetEmployeeId, viewMonth)
  }, [mounted, hydrated, records, targetEmployeeId, viewMonth, getMonthlyStats])

  // Today's employee list (manager view)
  const todayEmployeeRecords = useMemo(() => {
    if (!mounted || !hydrated || !isManager) return []
    const today = todayStr()
    const dateRecords = getRecordsByDate(today)
    const empIds = Object.keys(EMPLOYEE_NAMES)
    return empIds.map((empId) => {
      const rec = dateRecords.find((r) => r.employee_id === empId)
      return {
        id: empId,
        name: EMPLOYEE_NAMES[empId] || empId,
        record: rec || null,
      }
    })
  }, [mounted, hydrated, records, isManager, getRecordsByDate])

  // Calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewMonth)
    const firstDay = getFirstDayOfWeek(viewMonth)
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    // Fill rest of last week
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewMonth])

  const handleClockIn = useCallback(() => {
    clockIn(userId)
  }, [clockIn, userId])

  const handleClockOut = useCallback(() => {
    clockOut(userId)
  }, [clockOut, userId])

  if (!mounted || !hydrated) {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-surface rounded-[16px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const today = todayStr()
  const [, todayM, todayD] = today.split('-').map(Number)

  return (
    <motion.div
      className="flex-1 p-6 space-y-6 overflow-y-auto"
      {...pageTransition}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
        <Home className="w-3.5 h-3.5" />
        <span>ホーム</span>
        <ArrowRight className="w-3 h-3" />
        <span>人事・労務</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-text-primary font-medium">勤怠管理</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-text-primary">勤怠管理</h1>
        <div className="flex items-center gap-2 text-[14px] text-text-secondary">
          <Calendar className="w-4 h-4" />
          <span>{todayM}月{todayD}日</span>
        </div>
      </div>

      {/* Punch Card Section */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-accent" />
          <h2 className="text-[16px] font-semibold text-text-primary">打刻</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Current Time */}
          <div className="text-center sm:text-left">
            <div className="text-[40px] font-light text-text-primary tracking-wider font-mono">
              {currentTime}
            </div>
            <div className="text-[12px] text-text-tertiary mt-1">
              {isClockedIn ? (
                <span className="text-emerald-400">出勤中 {todayRecord?.clock_in}〜 ({workingTime})</span>
              ) : isClockedOut ? (
                <span className="text-text-secondary">退勤済 {todayRecord?.clock_in}〜{todayRecord?.clock_out}</span>
              ) : (
                <span className="text-text-tertiary">未出勤</span>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClockIn}
              disabled={!!todayRecord}
              className={[
                'h-20 w-40 rounded-[16px] flex flex-col items-center justify-center gap-1.5 transition-all duration-200 font-semibold',
                !todayRecord
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:-translate-y-[2px] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)] active:translate-y-0'
                  : 'bg-[rgba(255,255,255,0.04)] text-text-tertiary border border-border cursor-not-allowed',
              ].join(' ')}
            >
              <LogIn className="w-6 h-6" />
              <span className="text-[14px]">出勤</span>
            </button>

            <button
              onClick={handleClockOut}
              disabled={!isClockedIn}
              className={[
                'h-20 w-40 rounded-[16px] flex flex-col items-center justify-center gap-1.5 transition-all duration-200 font-semibold',
                isClockedIn
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_0_24px_rgba(239,68,68,0.35)] hover:-translate-y-[2px] hover:shadow-[0_0_32px_rgba(239,68,68,0.5)] active:translate-y-0'
                  : 'bg-[rgba(255,255,255,0.04)] text-text-tertiary border border-border cursor-not-allowed',
              ].join(' ')}
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[14px]">退勤</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {[
          { label: '出勤日数', value: `${stats.workDays}日`, icon: Calendar, accent: 'text-emerald-400' },
          { label: '総労働時間', value: `${stats.totalHours}h`, icon: Timer, accent: 'text-blue-400' },
          { label: '残業時間', value: `${stats.overtimeHours}h`, icon: Clock, accent: 'text-amber-400' },
          { label: '遅刻回数', value: `${stats.lateCount}回`, icon: AlertCircle, accent: 'text-red-400' },
        ].map((item) => (
          <motion.div
            key={item.label}
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-4"
            variants={fadeUp}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.accent}`} />
              <span className="text-[12px] text-text-tertiary">{item.label}</span>
            </div>
            <div className={`text-[22px] font-semibold text-text-primary`}>
              {item.value}
            </div>
            <div className="text-[11px] text-text-tertiary mt-1">
              {formatYearMonth(viewMonth)}
              {selectedEmployee && EMPLOYEE_NAMES[selectedEmployee]
                ? ` - ${EMPLOYEE_NAMES[selectedEmployee]}`
                : ''}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          className="lg:col-span-2 bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <h2 className="text-[16px] font-semibold text-text-primary">月別カレンダー</h2>
              {selectedEmployee && EMPLOYEE_NAMES[selectedEmployee] && (
                <span className="text-[12px] text-text-tertiary ml-2">
                  ({EMPLOYEE_NAMES[selectedEmployee]})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMonth(shiftMonth(viewMonth, -1))}
                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-text-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[14px] font-medium text-text-primary min-w-[100px] text-center">
                {formatYearMonth(viewMonth)}
              </span>
              <button
                onClick={() => setViewMonth(shiftMonth(viewMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-text-secondary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className={`text-center text-[11px] font-medium py-1.5 ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-text-tertiary'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16" />
              }

              const dateStr = `${viewMonth}-${String(day).padStart(2, '0')}`
              const record = monthRecords.get(dateStr)
              const isToday = dateStr === todayStr()
              const dayOfWeek = new Date(
                Number(viewMonth.split('-')[0]),
                Number(viewMonth.split('-')[1]) - 1,
                day
              ).getDay()
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

              return (
                <div
                  key={dateStr}
                  className={[
                    'h-16 rounded-lg p-1.5 text-left transition-colors relative',
                    isToday
                      ? 'bg-accent/10 border border-accent/30'
                      : isWeekend
                        ? 'bg-[rgba(255,255,255,0.02)]'
                        : 'hover:bg-[rgba(255,255,255,0.04)]',
                  ].join(' ')}
                >
                  <div className={`text-[11px] font-medium ${
                    dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-text-secondary'
                  }`}>
                    {day}
                  </div>
                  {record && (
                    <div className="mt-0.5">
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[record.status].dot}`} />
                        <span className={`text-[9px] ${STATUS_CONFIG[record.status].color}`}>
                          {STATUS_CONFIG[record.status].label}
                        </span>
                      </div>
                      {record.clock_in && (
                        <div className="text-[9px] text-text-tertiary mt-0.5 leading-tight">
                          {record.clock_in}
                          {record.clock_out ? `〜${record.clock_out}` : '〜'}
                        </div>
                      )}
                    </div>
                  )}
                  {!record && !isWeekend && dateStr <= todayStr() && (
                    <div className="mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-[11px] text-text-tertiary">{cfg.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Employee List (manager) or Info panel */}
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-accent" />
            <h2 className="text-[16px] font-semibold text-text-primary">
              {isManager ? '本日の出勤状況' : '勤怠サマリー'}
            </h2>
          </div>

          {isManager ? (
            <div className="space-y-2">
              {todayEmployeeRecords.map((emp) => {
                const rec = emp.record
                const statusCfg = rec ? STATUS_CONFIG[rec.status] : null
                const isSelected = selectedEmployee === emp.id

                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployee(isSelected ? null : emp.id)}
                    className={[
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      isSelected
                        ? 'bg-accent/10 border border-accent/30'
                        : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent',
                    ].join(' ')}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[12px] font-semibold text-accent shrink-0">
                      {emp.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-text-primary truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        {rec?.clock_in ? `${rec.clock_in}${rec.clock_out ? `〜${rec.clock_out}` : '〜 勤務中'}` : '未出勤'}
                      </div>
                    </div>

                    {/* Status dot */}
                    {statusCfg ? (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-[11px] ${statusCfg.color}`}>{statusCfg.label}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.15)]" />
                        <span className="text-[11px] text-text-tertiary">未出勤</span>
                      </div>
                    )}
                  </button>
                )
              })}

              {selectedEmployee && (
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-full text-center text-[12px] text-accent hover:underline mt-2"
                >
                  自分の勤怠に戻る
                </button>
              )}
            </div>
          ) : (
            /* Non-manager: show summary */
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: '出勤日数', value: `${stats.workDays}日` },
                  { label: '総労働時間', value: `${stats.totalHours}時間` },
                  { label: '残業時間', value: `${stats.overtimeHours}時間` },
                  { label: '遅刻', value: `${stats.lateCount}回` },
                  { label: '欠勤', value: `${stats.absentCount}回` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-[13px] text-text-secondary">{row.label}</span>
                    <span className="text-[14px] font-medium text-text-primary">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-text-tertiary text-center pt-2">
                {formatYearMonth(viewMonth)}の勤怠データ
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
