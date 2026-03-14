'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  UserCheck,
  ClipboardList,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import { useTaskStore } from '@/stores/task-store'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import { formatDateCompact } from '@/lib/date'

export default function HRPage() {
  const employees = useEmployeeStore((s) => s.employees)
  const empHydrated = useEmployeeStore((s) => s._hydrated)
  const tasks = useTaskStore((s) => s.tasks)
  const taskHydrated = useTaskStore((s) => s._hydrated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 従業員統計
  const empStats = useMemo(() => {
    const active = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
    const recentHires = active
      .filter((e) => {
        const hireDate = new Date(e.hire_date)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return hireDate >= threeMonthsAgo
      })
      .sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())

    return {
      total: active.length,
      recentHires,
    }
  }, [employees])

  // HR関連の未完了タスク
  const hrTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        !t.deleted_at &&
        t.status !== 'done' &&
        t.status !== 'cancelled' &&
        (t.category === '人事' || t.category === '労務')
    )
  }, [tasks])

  // ── 今日の処理（実データ連動） ──
  const todayItems = useMemo(() => {
    const onboardingTasks = hrTasks.filter((t) => t.source_event.includes('入社'))
    const procedureTasks = hrTasks.filter(
      (t) => t.category === '労務' || t.sub_category === '社保' || t.title.includes('社保') || t.title.includes('保険')
    )
    const attendanceTasks = hrTasks.filter((t) => t.sub_category === '勤怠' || t.title.includes('勤怠'))
    const transferTasks = hrTasks.filter(
      (t) => t.sub_category === '異動' || t.sub_category === '評価' || t.title.includes('異動') || t.title.includes('昇格')
    )

    return [
      {
        name: '入退社手続き',
        desc: onboardingTasks.length > 0
          ? `${onboardingTasks.length}件の入退社タスク`
          : '未処理の入退社タスクなし',
        icon: UserPlus,
        count: onboardingTasks.length,
        href: '/hr/employees',
      },
      {
        name: '届出・申請',
        desc: '社保届出・雇保手続き',
        icon: FileText,
        count: procedureTasks.length,
        href: '/hr',
      },
      {
        name: '勤怠確認',
        desc: '月次勤怠の確認・承認',
        icon: Calendar,
        count: attendanceTasks.length,
        href: '/hr',
      },
      {
        name: '異動・評価',
        desc: '人事異動・昇格管理',
        icon: UserCheck,
        count: transferTasks.length,
        href: '/hr',
      },
    ]
  }, [hrTasks])

  // ── 管理メニュー（実データ連動） ──
  const manageItems = useMemo(() => [
    { name: '従業員一覧', meta: `${empStats.total}名 在籍`, icon: Users, href: '/hr/employees' },
    { name: '組織図', meta: '部署・チーム構成', icon: ClipboardList, href: '/hr' },
    { name: '雇用契約', meta: '契約更新 1件期限近', icon: FileText, href: '/hr' },
  ], [empStats.total])

  const systems = [
    { name: '社会保険', meta: '加入・喪失管理', icon: Shield, href: '/hr' },
    { name: '年末調整', meta: '次回 12月', icon: Calendar, href: '/hr' },
    { name: '健康診断', meta: '4月実施 未受診5名', icon: Heart, href: '/hr' },
    { name: '就業規則', meta: 'v3.2 最新', icon: FileText, href: '/hr' },
  ]

  // ローディング
  if (!mounted || !empHydrated || !taskHydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="space-y-3 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-elevated rounded-[16px]" />
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
        <span className="text-text-secondary font-medium">人事・労務</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">人事・労務</h1>
        <p className="text-[13px] text-text-secondary mt-1">従業員・入退社・社保・手続き</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {todayItems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {manageItems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 未完了の人事タスク */}
      {hrTasks.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            未完了の人事・労務タスク
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {hrTasks.slice(0, 5).map((task) => {
              const statusLabel = TASK_STATUS_LABELS[task.status] || task.status
              const isDone = task.status === 'done'
              return (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          task.status === 'in_progress'
                            ? '#3B82F6'
                            : task.status === 'reviewing' || task.status === 'approving'
                            ? '#F59E0B'
                            : 'rgba(28,25,23,0.2)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{task.title}</p>
                      <p className="text-[12px] text-text-secondary mt-0.5">
                        {task.category} / {task.source_event || '手動'}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-muted shrink-0">{statusLabel}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                  </div>
                </Link>
              )
            })}
          </motion.div>
        </motion.section>
      )}

      {/* 最近の入社 */}
      {empStats.recentHires.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            最近の入社
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {empStats.recentHires.map((emp) => (
              <Link key={emp.id} href={`/hr/employees/${emp.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{emp.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{emp.department} / {emp.position}</p>
                  </div>
                  <span className="text-[12px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatDateCompact(emp.hire_date)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 制度・法定 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">制度・法定</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {systems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <p className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
                  <span className="text-[12px] text-text-secondary">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
