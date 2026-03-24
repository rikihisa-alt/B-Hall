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
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import { useTaskStore } from '@/stores/task-store'
import { useToast } from '@/components/ui/toast-provider'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import { formatDateCompact, today } from '@/lib/date'

export default function HRPage() {
  const employees = useEmployeeStore((s) => s.employees)
  const empHydrated = useEmployeeStore((s) => s._hydrated)
  const tasks = useTaskStore((s) => s.tasks)
  const taskHydrated = useTaskStore((s) => s._hydrated)
  const addTask = useTaskStore((s) => s.addTask)
  const { addToast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // 届出管理 state
  const [filings, setFilings] = useState([
    { id: '1', type: '社保取得届', employee: '田中太郎', status: 'done', deadline: '2026-03-15', submitted: '2026-03-12' },
    { id: '2', type: '雇用保険資格取得届', employee: '田中太郎', status: 'done', deadline: '2026-03-20', submitted: '2026-03-18' },
    { id: '3', type: '社保喪失届', employee: '木村七海', status: 'pending', deadline: '2026-04-10', submitted: '' },
    { id: '4', type: '住民税特別徴収切替届', employee: '佐藤花子', status: 'pending', deadline: '2026-04-15', submitted: '' },
  ])

  // 勤怠 state
  const [attendanceMonths] = useState([
    { month: '2026年3月', status: '集計中', submitted: 0, total: 8, issues: 2 },
    { month: '2026年2月', status: '確定済', submitted: 8, total: 8, issues: 0 },
    { month: '2026年1月', status: '確定済', submitted: 8, total: 8, issues: 0 },
  ])

  // 異動・評価 state
  const [transfers] = useState([
    { id: '1', employee: '鈴木一郎', type: '昇格', from: '主任', to: 'チームリーダー', effectiveDate: '2026-04-01', status: '承認済' },
    { id: '2', employee: '高橋美咲', type: '異動', from: '営業部', to: '企画部', effectiveDate: '2026-04-01', status: '申請中' },
  ])

  // 組織図 state
  const orgChart = useMemo(() => {
    const activeEmps = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
    const depts = new Map<string, { count: number; members: string[] }>()
    activeEmps.forEach((e) => {
      const dept = depts.get(e.department) || { count: 0, members: [] }
      dept.count++
      dept.members.push(e.name)
      depts.set(e.department, dept)
    })
    return depts
  }, [employees])

  // 雇用契約 state
  const contracts = useMemo(() => {
    const activeEmps = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
    return activeEmps.map((e) => ({
      id: e.id,
      name: e.name,
      type: e.employment_type === 'full_time' ? '正社員' : e.employment_type === 'contract' ? '契約社員' : 'パート',
      department: e.department,
      hireDate: e.hire_date,
      renewalDate: e.employment_type === 'contract' ? '2026-09-30' : null,
    }))
  }, [employees])

  // 社保 state
  const insuranceRecords = useMemo(() => {
    const activeEmps = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
    return activeEmps.map((e) => ({
      id: e.id,
      name: e.name,
      healthInsurance: e.social_insurance_enrolled,
      pensionInsurance: e.social_insurance_enrolled,
      employmentInsurance: e.employment_insurance_enrolled,
    }))
  }, [employees])

  // 健康診断 state
  const [healthChecks] = useState([
    { id: '1', name: '田中太郎', lastCheck: '2025-10-15', nextDue: '2026-04-15', status: '予定' },
    { id: '2', name: '佐藤花子', lastCheck: '2025-10-15', nextDue: '2026-04-15', status: '予定' },
    { id: '3', name: '鈴木一郎', lastCheck: '2025-06-20', nextDue: '2026-04-15', status: '未受診' },
    { id: '4', name: '高橋美咲', lastCheck: '2025-10-15', nextDue: '2026-04-15', status: '予定' },
  ])

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
    return { total: active.length, recentHires }
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

  // ── 今日の処理 ──
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
      { name: '入退社手続き', desc: onboardingTasks.length > 0 ? `${onboardingTasks.length}件の入退社タスク` : '未処理の入退社タスクなし', icon: UserPlus, count: onboardingTasks.length, action: '/hr/employees' },
      { name: '届出・申請', desc: '社保届出・雇保手続き', icon: FileText, count: procedureTasks.length, action: '届出・申請' },
      { name: '勤怠確認', desc: '月次勤怠の確認・承認', icon: Calendar, count: attendanceTasks.length, action: '勤怠確認' },
      { name: '異動・評価', desc: '人事異動・昇格管理', icon: UserCheck, count: transferTasks.length, action: '異動・評価' },
    ]
  }, [hrTasks])

  // ── 管理メニュー ──
  const manageItems = useMemo(() => [
    { name: '従業員一覧', meta: `${empStats.total}名 在籍`, icon: Users, action: '/hr/employees' },
    { name: '組織図', meta: '部署・チーム構成', icon: ClipboardList, action: '組織図' },
    { name: '雇用契約', meta: `${contracts.filter(c => c.renewalDate).length}件更新予定`, icon: FileText, action: '雇用契約' },
  ], [empStats.total, contracts])

  const systems = [
    { name: '社会保険', meta: '加入・喪失管理', icon: Shield, action: '社会保険' },
    { name: '年末調整', meta: '次回 12月', icon: Calendar, action: '年末調整' },
    { name: '健康診断', meta: `未受診${healthChecks.filter(h => h.status === '未受診').length}名`, icon: Heart, action: '健康診断' },
    { name: '就業規則', meta: 'v3.2 最新', icon: FileText, action: '就業規則' },
  ]

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

  const handleItemClick = (action: string) => {
    if (action.startsWith('/')) return // Link handles navigation
    setActiveModal(action)
  }

  const renderMenuSection = (items: { name: string; desc?: string; meta?: string; icon: typeof Users; count?: number; action: string }[]) => (
    <>
      {items.map(item => {
        const Icon = item.icon
        const isLink = item.action.startsWith('/')
        const content = (
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
            <Icon className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">{item.name}</p>
              {item.desc && <p className="text-[12px] text-text-secondary mt-0.5">{item.desc}</p>}
            </div>
            {item.meta && <span className="text-[12px] text-text-secondary">{item.meta}</span>}
            {item.count !== undefined && item.count > 0 && (
              <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{item.count}</span>
            )}
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
          </div>
        )
        return isLink ? (
          <Link key={item.name} href={item.action}>{content}</Link>
        ) : (
          <button key={item.name} className="w-full text-left" onClick={() => handleItemClick(item.action)}>{content}</button>
        )
      })}
    </>
  )

  return (
    <motion.div {...pageTransition}>
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">人事・労務</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">人事・労務</h1>
        <p className="text-[13px] text-text-secondary mt-1">従業員・入退社・社保・手続き</p>
      </div>

      {/* 今日の処理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border" variants={fadeUp}>
          {renderMenuSection(todayItems)}
        </motion.div>
      </motion.section>

      {/* 管理 */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border" variants={fadeUp}>
          {renderMenuSection(manageItems)}
        </motion.div>
      </motion.section>

      {/* 未完了の人事タスク */}
      {hrTasks.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">未完了の人事・労務タスク</h2>
          <motion.div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border" variants={fadeUp}>
            {hrTasks.slice(0, 5).map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: task.status === 'in_progress' ? '#3B82F6' : task.status === 'reviewing' || task.status === 'approving' ? '#F59E0B' : 'rgba(28,25,23,0.2)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{task.title}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{task.category} / {task.source_event || '手動'}</p>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0">{TASK_STATUS_LABELS[task.status] || task.status}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 最近の入社 */}
      {empStats.recentHires.length > 0 && (
        <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">最近の入社</h2>
          <motion.div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border" variants={fadeUp}>
            {empStats.recentHires.map((emp) => (
              <Link key={emp.id} href={`/hr/employees/${emp.id}`}>
                <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[12px] font-bold shrink-0">{emp.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{emp.name}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{emp.department} / {emp.position}</p>
                  </div>
                  <span className="text-[12px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>{formatDateCompact(emp.hire_date)}</span>
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
        <motion.div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border" variants={fadeUp}>
          {renderMenuSection(systems)}
        </motion.div>
      </motion.section>

      {/* ── 届出・申請モーダル ── */}
      <Modal open={activeModal === '届出・申請'} onClose={() => setActiveModal(null)} title="届出・申請管理" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {filings.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-4 rounded-[12px] bg-bg-base border border-border">
              {f.status === 'done' ? (
                <Check className="w-4 h-4 text-[#22C55E] shrink-0" strokeWidth={2} />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0" strokeWidth={1.75} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">{f.type}</p>
                <p className="text-[12px] text-text-muted">{f.employee} &middot; 期限: {f.deadline}</p>
              </div>
              {f.status === 'done' ? (
                <span className="text-[11px] font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)] px-2 py-0.5 rounded-md">提出済</span>
              ) : (
                <button
                  onClick={() => {
                    setFilings(prev => prev.map(fi => fi.id === f.id ? { ...fi, status: 'done', submitted: today() } : fi))
                    addTask({ title: `${f.type} 提出完了確認`, description: `${f.employee}の${f.type}が提出されました`, category: '労務', sub_category: '届出', department: '人事部', priority: 'medium', status: 'todo', source_event: '届出提出', created_by: 'system', updated_by: 'system' })
                    addToast('success', `${f.type}を提出済みにしました`)
                  }}
                  className="text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  提出済にする
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setFilings(prev => [...prev, { id: String(Date.now()), type: '新規届出', employee: '未選択', status: 'pending', deadline: '2026-05-01', submitted: '' }])
              addToast('success', '新しい届出を追加しました')
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-[10px] border border-dashed border-border text-[13px] font-semibold text-text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            新規届出追加
          </button>
        </div>
      </Modal>

      {/* ── 勤怠確認モーダル ── */}
      <Modal open={activeModal === '勤怠確認'} onClose={() => setActiveModal(null)} title="勤怠確認" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {attendanceMonths.map((m) => (
            <div key={m.month} className="p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">{m.month}</h4>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${m.status === '確定済' ? 'text-[#22C55E] bg-[rgba(34,197,94,0.08)]' : 'text-[#F59E0B] bg-[rgba(245,158,11,0.08)]'}`}>{m.status}</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[12px] text-text-muted">提出: {m.submitted}/{m.total}名</p>
                {m.issues > 0 && <p className="text-[12px] text-[#EF4444]">要確認: {m.issues}件</p>}
              </div>
              {m.status === '集計中' && (
                <button
                  onClick={() => addToast('success', `${m.month}の勤怠を確定しました`)}
                  className="mt-2 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  確定する
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* ── 異動・評価モーダル ── */}
      <Modal open={activeModal === '異動・評価'} onClose={() => setActiveModal(null)} title="異動・評価管理" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {transfers.map((t) => (
            <div key={t.id} className="p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">{t.employee}</h4>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${t.status === '承認済' ? 'text-[#22C55E] bg-[rgba(34,197,94,0.08)]' : 'text-[#3B82F6] bg-[rgba(59,130,246,0.08)]'}`}>{t.status}</span>
              </div>
              <p className="text-[12px] text-text-secondary">{t.type}: {t.from} → {t.to}</p>
              <p className="text-[12px] text-text-muted">発効日: {t.effectiveDate}</p>
            </div>
          ))}
          <button
            onClick={() => addToast('success', '異動申請を作成しました')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-[10px] border border-dashed border-border text-[13px] font-semibold text-text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            新規異動・昇格申請
          </button>
        </div>
      </Modal>

      {/* ── 組織図モーダル ── */}
      <Modal open={activeModal === '組織図'} onClose={() => setActiveModal(null)} title="組織図" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {Array.from(orgChart.entries()).map(([dept, data]) => (
            <div key={dept} className="p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">{dept}</h4>
                <span className="text-[12px] text-text-muted">{data.count}名</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.members.map((name) => (
                  <span key={name} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-text-secondary bg-bg-elevated border border-border">{name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── 雇用契約モーダル ── */}
      <Modal open={activeModal === '雇用契約'} onClose={() => setActiveModal(null)} title="雇用契約管理" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {contracts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">{c.name}</p>
                <p className="text-[12px] text-text-muted">{c.department} &middot; {c.type} &middot; 入社: {formatDateCompact(c.hireDate)}</p>
              </div>
              {c.renewalDate && (
                <span className="text-[11px] font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.08)] px-2 py-0.5 rounded-md shrink-0">更新: {c.renewalDate}</span>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* ── 社会保険モーダル ── */}
      <Modal open={activeModal === '社会保険'} onClose={() => setActiveModal(null)} title="社会保険管理" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {insuranceRecords.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">{r.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.healthInsurance ? 'text-[#22C55E] bg-[rgba(34,197,94,0.08)]' : 'text-text-muted bg-bg-elevated'}`}>健保</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.pensionInsurance ? 'text-[#22C55E] bg-[rgba(34,197,94,0.08)]' : 'text-text-muted bg-bg-elevated'}`}>年金</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.employmentInsurance ? 'text-[#22C55E] bg-[rgba(34,197,94,0.08)]' : 'text-text-muted bg-bg-elevated'}`}>雇保</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── 年末調整モーダル ── */}
      <Modal open={activeModal === '年末調整'} onClose={() => setActiveModal(null)} title="年末調整" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-4">
          <div className="p-4 rounded-[12px] bg-bg-base border border-border">
            <h4 className="text-[14px] font-semibold text-text-primary tracking-tight mb-1">2025年度 年末調整</h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)]"><Check className="w-3 h-3" />完了</span>
            <p className="text-[12px] text-text-muted mt-2">対象者: {empStats.total}名 &middot; 提出率: 100%</p>
          </div>
          <div className="p-4 rounded-[12px] bg-bg-base border border-border">
            <h4 className="text-[14px] font-semibold text-text-primary tracking-tight mb-1">2026年度 年末調整</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-text-muted bg-bg-elevated">12月開始予定</span>
            <p className="text-[12px] text-text-muted mt-2">対象見込: {empStats.total}名</p>
          </div>
        </div>
      </Modal>

      {/* ── 健康診断モーダル ── */}
      <Modal open={activeModal === '健康診断'} onClose={() => setActiveModal(null)} title="健康診断管理" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          <div className="p-3 rounded-[10px] bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.15)]">
            <p className="text-[13px] font-semibold text-[#3B82F6]">次回実施: 2026年4月15日</p>
            <p className="text-[12px] text-text-muted">対象: {healthChecks.length}名 &middot; 未受診: {healthChecks.filter(h => h.status === '未受診').length}名</p>
          </div>
          {healthChecks.map((h) => (
            <div key={h.id} className="flex items-center gap-3 p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary tracking-tight">{h.name}</p>
                <p className="text-[12px] text-text-muted">前回: {h.lastCheck}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${h.status === '未受診' ? 'text-[#EF4444] bg-[rgba(239,68,68,0.08)]' : 'text-[#3B82F6] bg-[rgba(59,130,246,0.08)]'}`}>{h.status}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── 就業規則モーダル ── */}
      <Modal open={activeModal === '就業規則'} onClose={() => setActiveModal(null)} title="就業規則" footer={<Button variant="ghost" onClick={() => setActiveModal(null)}>閉じる</Button>}>
        <div className="space-y-3">
          {[
            { name: '就業規則 v3.2', date: '2026-01-15', status: '現行', desc: '最新の就業規則（全社適用）' },
            { name: '給与規程 v2.1', date: '2025-10-01', status: '現行', desc: '給与計算・手当に関する規程' },
            { name: 'テレワーク規程 v1.3', date: '2025-07-01', status: '現行', desc: 'リモートワークに関する規程' },
            { name: '育児介護休業規程 v1.1', date: '2025-04-01', status: '現行', desc: '育児・介護休業に関する規程' },
          ].map((doc) => (
            <div key={doc.name} className="p-4 rounded-[12px] bg-bg-base border border-border">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">{doc.name}</h4>
                <span className="text-[11px] font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)] px-2 py-0.5 rounded-md">{doc.status}</span>
              </div>
              <p className="text-[12px] text-text-muted">{doc.desc}</p>
              <p className="text-[11px] text-text-muted mt-1">最終更新: {doc.date}</p>
            </div>
          ))}
        </div>
      </Modal>
    </motion.div>
  )
}
