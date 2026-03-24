'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition, cardStagger } from '@/lib/animation'
import {
  Users,
  UserPlus,
  Search,
  ChevronRight,
  Briefcase,
  Building2,
} from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import { EMPLOYMENT_TYPE_LABELS, DEPARTMENTS } from '@/lib/constants'
import { formatDateShort } from '@/lib/date'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast-provider'
import type { EmploymentType } from '@/types'

// ── ステータスバッジ ──

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  active: {
    label: '在籍',
    bg: 'rgba(34,197,94,0.08)',
    text: '#22C55E',
    border: 'rgba(34,197,94,0.18)',
  },
  on_leave: {
    label: '休職中',
    bg: 'rgba(245,158,11,0.08)',
    text: '#F59E0B',
    border: 'rgba(245,158,11,0.18)',
  },
  terminated: {
    label: '退職済',
    bg: 'rgba(28,25,23,0.04)',
    text: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
}

const employmentBadgeConfig: Record<EmploymentType, { label: string; bg: string; text: string; border: string }> = {
  full_time: {
    label: '正社員',
    bg: 'rgba(59,130,246,0.08)',
    text: '#3B82F6',
    border: 'rgba(59,130,246,0.18)',
  },
  part_time: {
    label: 'パート',
    bg: 'rgba(168,162,158,0.12)',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
  },
  contract: {
    label: '契約社員',
    bg: 'rgba(245,158,11,0.08)',
    text: '#F59E0B',
    border: 'rgba(245,158,11,0.18)',
  },
  temporary: {
    label: '派遣社員',
    bg: 'rgba(168,162,158,0.12)',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
  },
}

export default function EmployeeListPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const employees = useEmployeeStore((s) => s.employees)
  const addEmployee = useEmployeeStore((s) => s.addEmployee)
  const hydrated = useEmployeeStore((s) => s._hydrated)

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState<string>('すべて')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 表示対象従業員（削除済・退職済は除外）
  const activeEmployees = useMemo(() => {
    return employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
  }, [employees])

  // フィルタリング
  const filtered = useMemo(() => {
    return activeEmployees.filter((e) => {
      const matchesSearch =
        !search ||
        e.name.includes(search) ||
        e.name_kana.includes(search) ||
        e.email.includes(search)
      const matchesDept = deptFilter === 'すべて' || e.department === deptFilter
      return matchesSearch && matchesDept
    })
  }, [activeEmployees, search, deptFilter])

  // 統計
  const stats = useMemo(() => {
    const total = activeEmployees.length
    const fullTime = activeEmployees.filter((e) => e.employment_type === 'full_time').length
    const active = activeEmployees.filter((e) => e.status === 'active').length
    return { total, fullTime, active }
  }, [activeEmployees])

  // 部署一覧（フィルタ用）
  const departments = useMemo(() => {
    const depts = new Set(activeEmployees.map((e) => e.department))
    return ['すべて', ...Array.from(depts).sort()]
  }, [activeEmployees])

  // ── 新規従業員フォーム ──
  const [form, setForm] = useState({
    name: '',
    name_kana: '',
    department: '開発部',
    position: '',
    employment_type: 'full_time' as EmploymentType,
    hire_date: '',
    email: '',
    phone: '',
  })

  const handleCreateEmployee = () => {
    if (!form.name || !form.department || !form.hire_date) {
      addToast('error', '必須項目を入力してください')
      return
    }

    addEmployee({
      name: form.name,
      name_kana: form.name_kana,
      department: form.department,
      position: form.position,
      employment_type: form.employment_type,
      hire_date: form.hire_date,
      email: form.email,
      phone: form.phone,
      created_by: 'user-1',
      updated_by: 'user-1',
    })

    setShowCreateModal(false)
    setForm({
      name: '',
      name_kana: '',
      department: '開発部',
      position: '',
      employment_type: 'full_time',
      hire_date: '',
      email: '',
      phone: '',
    })
    addToast('success', `${form.name}さんを従業員に追加しました`)
  }

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="h-4 bg-bg-elevated rounded-[10px] w-32" />
        <div className="space-y-3 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      <PageHeader
        title="従業員一覧"
        description={`${stats.total}名が在籍中`}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '人事・労務', href: '/hr' },
          { label: '従業員一覧' },
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={UserPlus}
            onClick={() => setShowCreateModal(true)}
          >
            従業員追加
          </Button>
        }
      />

      {/* 統計カード */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {[
          { label: '総従業員数', value: stats.total, suffix: '名' },
          { label: '正社員', value: stats.fullTime, suffix: '名' },
          { label: 'アクティブ', value: stats.active, suffix: '名' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-bg-surface border border-border rounded-[16px] shadow-card px-4 md:px-5 py-3 md:py-4"
            variants={fadeUp}
          >
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em]">
              {stat.label}
            </p>
            <p className="text-xl md:text-[28px] font-bold text-text-primary mt-1 tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {stat.value}
              <span className="text-[14px] font-normal text-text-muted ml-0.5">{stat.suffix}</span>
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 検索・フィルタ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-[360px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="名前・メールで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-base border border-border rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-bg-base border border-border rounded-[10px] px-4 py-2.5 text-[14px] text-text-primary focus:border-accent focus:outline-none transition-all cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* 従業員リスト */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="従業員が見つかりません"
          description="検索条件に一致する従業員はいません。条件を変更してお試しください。"
        />
      ) : (
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {filtered.map((employee, i) => {
            const empStatus = statusConfig[employee.status] || statusConfig.active
            const empType = employmentBadgeConfig[employee.employment_type]
            const initial = employee.name.charAt(0)

            return (
              <motion.div
                key={employee.id}
                variants={fadeUp}
                onClick={() => router.push(`/hr/employees/${employee.id}`)}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer group"
              >
                {/* アバター */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                  {initial}
                </div>

                {/* 名前・部署 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">
                    {employee.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-text-secondary">{employee.department}</span>
                    <span className="text-[10px] text-text-muted">|</span>
                    <span className="text-[12px] text-text-muted">{employee.position}</span>
                  </div>
                </div>

                {/* 雇用形態バッジ */}
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shrink-0 hidden sm:inline-flex"
                  style={{
                    backgroundColor: empType.bg,
                    color: empType.text,
                    borderColor: empType.border,
                  }}
                >
                  {empType.label}
                </span>

                {/* ステータスバッジ */}
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shrink-0"
                  style={{
                    backgroundColor: empStatus.bg,
                    color: empStatus.text,
                    borderColor: empStatus.border,
                  }}
                >
                  {empStatus.label}
                </span>

                {/* 入社日 */}
                <span className="text-[12px] text-text-muted tabular-nums shrink-0 w-[88px] text-right hidden md:block" style={{ fontFamily: 'var(--font-inter)' }}>
                  {formatDateShort(employee.hire_date)}
                </span>

                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors shrink-0" strokeWidth={1.75} />
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* 従業員追加モーダル */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="従業員を追加"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleCreateEmployee}>
              追加する
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="氏名"
              required
              placeholder="山田太郎"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="フリガナ"
              placeholder="ヤマダタロウ"
              value={form.name_kana}
              onChange={(e) => setForm((f) => ({ ...f, name_kana: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                部署 <span className="text-accent">*</span>
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <Input
              label="役職"
              placeholder="一般従業員"
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                雇用形態 <span className="text-accent">*</span>
              </label>
              <select
                value={form.employment_type}
                onChange={(e) => setForm((f) => ({ ...f, employment_type: e.target.value as EmploymentType }))}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none transition-all cursor-pointer"
              >
                {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <Input
              label="入社日"
              required
              type="date"
              value={form.hire_date}
              onChange={(e) => setForm((f) => ({ ...f, hire_date: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@bhall.jp"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="電話番号"
              type="tel"
              placeholder="090-1234-5678"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
