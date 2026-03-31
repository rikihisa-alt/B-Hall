'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Users, UserCog, Shield, Settings, Sparkles,
  ChevronRight, ChevronLeft, Check, Plus, X, GripVertical,
  Globe, Moon, Sun, Bell, BellOff,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useCompanyStore, type CompanyInfo } from '@/stores/company-store'
import { useAuthStore } from '@/stores/auth-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// ── Constants ──

const STEPS = [
  { key: 'company', label: '会社情報', icon: Building2 },
  { key: 'departments', label: '部門設定', icon: Users },
  { key: 'admin', label: '管理者アカウント', icon: UserCog },
  { key: 'permissions', label: '権限設定', icon: Shield },
  { key: 'settings', label: '初期設定', icon: Settings },
  { key: 'complete', label: '完了', icon: Sparkles },
] as const

const INDUSTRIES = [
  'IT', '製造', '小売', 'サービス', '建設',
  '飲食', '医療', '教育', '金融', '不動産', 'その他',
]

const EMPLOYEE_RANGES = [
  { value: '1-10', label: '1〜10名' },
  { value: '11-30', label: '11〜30名' },
  { value: '31-50', label: '31〜50名' },
  { value: '51-100', label: '51〜100名' },
  { value: '101-300', label: '101〜300名' },
  { value: '300+', label: '300名以上' },
] as const

const DEFAULT_DEPARTMENTS = [
  '経営企画', '開発部', '営業部', '人事部', '経理部', '総務部', '法務部',
]

const ROLE_DEFINITIONS = [
  {
    key: 'ceo',
    label: '経営者',
    description: '会社全体の経営判断に関わるすべての情報にアクセスできます',
    defaults: { all_view: true, all_edit: true, approve: true, executive: true, finance: true, settings: true },
  },
  {
    key: 'admin',
    label: '管理者',
    description: '全体統制・承認・設定変更が可能です',
    defaults: { all_view: true, all_edit: true, approve: true, executive: false, finance: true, settings: true },
  },
  {
    key: 'mgr',
    label: '部門責任者',
    description: '自部門の業務管理・承認を行います',
    defaults: { all_view: false, all_edit: false, approve: true, executive: false, finance: false, settings: false },
  },
  {
    key: 'staff',
    label: '一般従業員',
    description: '自身のタスク・申請を操作します',
    defaults: { all_view: false, all_edit: false, approve: false, executive: false, finance: false, settings: false },
  },
  {
    key: 'viewer',
    label: '閲覧専用',
    description: '情報の閲覧のみ可能です',
    defaults: { all_view: true, all_edit: false, approve: false, executive: false, finance: false, settings: false },
  },
] as const

const PERMISSION_LABELS: Record<string, string> = {
  all_view: '全閲覧',
  all_edit: '全操作',
  approve: '承認',
  executive: '経営情報',
  finance: '金額閲覧',
  settings: '設定変更',
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}月`,
}))

// ── Types ──

type PermissionMap = Record<string, Record<string, boolean>>

interface AdminData {
  name: string
  email: string
  department: string
  role: 'ceo' | 'admin'
}

interface SettingsData {
  fiscal_year_start: number
  notifications_email: boolean
  notifications_app: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'ja' | 'en'
}

// ── Select Component ──

function Select({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
}: {
  label?: string
  required?: boolean
  value: string | number
  onChange: (value: string) => void
  options: { value: string | number; label: string }[]
  placeholder?: string
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
          {label}
          {required && <span className="text-accent"> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-bg-base border border-border rounded-[10px] px-4 py-3',
          'text-[15px] text-text-primary w-full transition-all duration-150',
          'focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]',
          'appearance-none cursor-pointer',
          !value && 'text-text-muted',
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Step Indicator ──

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep
        const step = STEPS[i]
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-success text-white',
                  isActive && 'bg-accent text-white shadow-glow',
                  !isCompleted && !isActive && 'bg-bg-elevated text-text-muted border border-border',
                )}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>
              <span
                className={cn(
                  'text-[11px] font-medium hidden md:block',
                  isActive ? 'text-accent' : isCompleted ? 'text-success' : 'text-text-muted',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'w-8 lg:w-12 h-[2px] rounded-full mb-5 hidden md:block',
                  i < currentStep ? 'bg-success' : 'bg-border',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Progress Bar ──

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-[#6366F1] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── Toggle Switch ──

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-accent' : 'bg-bg-elevated border border-border',
        )}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-[14px] text-text-primary">{label}</span>}
    </label>
  )
}

// ── Page Component ──

export default function SetupPage() {
  const router = useRouter()
  const { company, updateCompany, completeSetup } = useCompanyStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Step-local state
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS)
  const [newDept, setNewDept] = useState('')
  const [adminData, setAdminData] = useState<AdminData>({
    name: '',
    email: '',
    department: '',
    role: 'ceo',
  })
  const [permissions, setPermissions] = useState<PermissionMap>(() => {
    const map: PermissionMap = {}
    ROLE_DEFINITIONS.forEach((r) => {
      map[r.key] = { ...r.defaults }
    })
    return map
  })
  const [settings, setSettings] = useState<SettingsData>({
    fiscal_year_start: 4,
    notifications_email: true,
    notifications_app: true,
    theme: 'light',
    language: 'ja',
  })

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    // If setup already completed, redirect
    if (company.setup_completed) {
      router.replace('/')
    }
  }, [company.setup_completed, router])

  // ── Validation ──

  const validateStep = useCallback((): boolean => {
    const errs: Record<string, string> = {}

    if (currentStep === 0) {
      if (!company.name.trim()) errs.name = '会社名は必須です'
    }

    if (currentStep === 1) {
      if (departments.length === 0) errs.departments = '少なくとも1つの部門を設定してください'
    }

    if (currentStep === 2) {
      if (!adminData.name.trim()) errs.admin_name = '管理者名は必須です'
      if (!adminData.email.trim()) errs.admin_email = 'メールアドレスは必須です'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email))
        errs.admin_email = '有効なメールアドレスを入力してください'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [currentStep, company.name, departments.length, adminData])

  // ── Navigation ──

  const goNext = useCallback(() => {
    if (!validateStep()) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
      setErrors({})
    }
  }, [currentStep, validateStep])

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      setErrors({})
    }
  }, [currentStep])

  // ── Complete Setup ──

  const handleComplete = useCallback(() => {
    // Save departments to company store
    updateCompany({
      departments,
      fiscal_year_start: settings.fiscal_year_start,
    })

    // Create the admin user in auth store
    const now = new Date().toISOString()
    const authStore = useAuthStore.getState()
    const newUser = {
      id: 'user-setup-1',
      email: adminData.email,
      name: adminData.name,
      name_kana: '',
      role: adminData.role as 'ceo' | 'admin',
      department: adminData.department || departments[0] || '経営企画',
      position: adminData.role === 'ceo' ? '代表取締役' : '管理者',
      avatar_initial: adminData.name.charAt(0),
      status: 'active' as const,
      created_at: now,
      updated_at: now,
      created_by: 'system',
      updated_by: 'system',
      deleted_at: null,
    }

    // Update auth store with the new admin as the only user
    authStore.switchUser(newUser.id)
    // We set users & currentUser directly via the internal store
    useAuthStore.setState({
      users: [newUser],
      currentUser: newUser,
    })

    // Create employee record
    const empStore = useEmployeeStore.getState()
    empStore.addEmployee({
      user_id: newUser.id,
      name: adminData.name,
      name_kana: '',
      department: adminData.department || departments[0] || '経営企画',
      position: adminData.role === 'ceo' ? '代表取締役' : '管理者',
      employment_type: 'full_time',
      email: adminData.email,
      phone: '',
      created_by: 'system',
      updated_by: 'system',
    })

    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('b-hall-theme', 'dark')
    } else if (settings.theme === 'system') {
      localStorage.setItem('b-hall-theme', 'system')
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      }
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('b-hall-theme', 'light')
    }

    // Complete setup last
    completeSetup()

    // Navigate to welcome / tutorial page
    router.push('/welcome')
  }, [departments, adminData, settings, updateCompany, completeSetup, router])

  if (!mounted) return null

  // ── Animation variants ──

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -80 : 80,
      opacity: 0,
    }),
  }

  // Direction for animation
  const direction = 1

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-6 md:py-8">
        <Image
          src="/logo.png"
          alt="B-Hall"
          width={120}
          height={40}
          className="h-[36px] w-auto object-contain"
          priority
        />
      </header>

      {/* Step Indicator */}
      <div className="px-4 md:px-8 mb-4">
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} />
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto w-full mb-6">
        <ProgressBar current={currentStep} total={STEPS.length} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-32">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6 md:p-8">
                {currentStep === 0 && (
                  <StepCompanyInfo
                    company={company}
                    updateCompany={updateCompany}
                    errors={errors}
                  />
                )}
                {currentStep === 1 && (
                  <StepDepartments
                    departments={departments}
                    setDepartments={setDepartments}
                    newDept={newDept}
                    setNewDept={setNewDept}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <StepAdmin
                    adminData={adminData}
                    setAdminData={setAdminData}
                    departments={departments}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <StepPermissions
                    permissions={permissions}
                    setPermissions={setPermissions}
                  />
                )}
                {currentStep === 4 && (
                  <StepSettings
                    settings={settings}
                    setSettings={setSettings}
                  />
                )}
                {currentStep === 5 && (
                  <StepComplete
                    company={company}
                    departments={departments}
                    adminData={adminData}
                    settings={settings}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface/80 backdrop-blur-xl border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="ghost" onClick={goBack} icon={ChevronLeft}>
                戻る
              </Button>
            )}
          </div>
          <div className="text-[13px] text-text-muted">
            {currentStep + 1} / {STEPS.length}
          </div>
          <div>
            {currentStep < STEPS.length - 1 ? (
              <Button variant="primary" onClick={goNext} icon={ChevronRight}>
                次へ
              </Button>
            ) : (
              <Button variant="primary" onClick={handleComplete} icon={Sparkles}>
                B-Hallを始める
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 1: 会社情報
// ══════════════════════════════════════════

function StepCompanyInfo({
  company,
  updateCompany,
  errors,
}: {
  company: CompanyInfo
  updateCompany: (data: Partial<CompanyInfo>) => void
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-primary">会社情報</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          B-Hallに登録する会社の基本情報を入力してください
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="会社名"
          required
          placeholder="株式会社サンプル"
          value={company.name}
          onChange={(e) => updateCompany({ name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="会社名（カナ）"
          placeholder="カブシキガイシャサンプル"
          value={company.name_kana}
          onChange={(e) => updateCompany({ name_kana: e.target.value })}
        />

        <Input
          label="代表者名"
          placeholder="山田太郎"
          value={company.representative}
          onChange={(e) => updateCompany({ representative: e.target.value })}
        />

        <Select
          label="業種"
          value={company.industry}
          onChange={(v) => updateCompany({ industry: v })}
          options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
          placeholder="業種を選択"
        />

        <Select
          label="従業員数"
          value={company.employee_count_range}
          onChange={(v) => updateCompany({ employee_count_range: v as typeof company.employee_count_range })}
          options={EMPLOYEE_RANGES.map((r) => ({ value: r.value, label: r.label }))}
          placeholder="従業員数を選択"
        />

        <Input
          label="設立日"
          type="date"
          value={company.established_date}
          onChange={(e) => updateCompany({ established_date: e.target.value })}
        />

        <Input
          label="電話番号"
          placeholder="03-1234-5678"
          value={company.phone}
          onChange={(e) => updateCompany({ phone: e.target.value })}
        />

        <Input
          label="メールアドレス"
          type="email"
          placeholder="info@example.com"
          value={company.email}
          onChange={(e) => updateCompany({ email: e.target.value })}
        />

        <Input
          label="ウェブサイト"
          placeholder="https://example.com"
          value={company.website}
          onChange={(e) => updateCompany({ website: e.target.value })}
        />

        <Input
          label="郵便番号"
          placeholder="100-0001"
          value={company.postal_code}
          onChange={(e) => updateCompany({ postal_code: e.target.value })}
        />

        <Input
          label="住所"
          placeholder="東京都千代田区..."
          value={company.address}
          onChange={(e) => updateCompany({ address: e.target.value })}
        />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 2: 部門設定
// ══════════════════════════════════════════

function StepDepartments({
  departments,
  setDepartments,
  newDept,
  setNewDept,
  errors,
}: {
  departments: string[]
  setDepartments: (d: string[]) => void
  newDept: string
  setNewDept: (v: string) => void
  errors: Record<string, string>
}) {
  const addDepartment = () => {
    const trimmed = newDept.trim()
    if (trimmed && !departments.includes(trimmed)) {
      setDepartments([...departments, trimmed])
      setNewDept('')
    }
  }

  const removeDepartment = (name: string) => {
    setDepartments(departments.filter((d) => d !== name))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDepartment()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-primary">部門設定</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          会社の部門を設定してください。後から変更できます。
        </p>
      </div>

      {/* Add department */}
      <div className="flex gap-2">
        <Input
          placeholder="部門名を入力..."
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="secondary"
          onClick={addDepartment}
          icon={Plus}
          className="shrink-0"
        >
          追加
        </Button>
      </div>

      {errors.departments && (
        <p className="text-[12px] text-danger">{errors.departments}</p>
      )}

      {/* Department list */}
      <div className="space-y-2">
        {departments.map((dept, index) => (
          <motion.div
            key={dept}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              'flex items-center justify-between',
              'bg-bg-base border border-border rounded-[12px] px-4 py-3',
              'group hover:border-accent/30 transition-colors',
            )}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-8 h-8 rounded-full bg-accent-muted flex items-center justify-center">
                <span className="text-[13px] font-semibold text-accent">{dept.charAt(0)}</span>
              </div>
              <span className="text-[15px] text-text-primary font-medium">{dept}</span>
            </div>
            <button
              type="button"
              onClick={() => removeDepartment(dept)}
              className="p-1.5 rounded-full text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-8 text-text-muted text-[14px]">
          部門を追加してください
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 3: 管理者アカウント
// ══════════════════════════════════════════

function StepAdmin({
  adminData,
  setAdminData,
  departments,
  errors,
}: {
  adminData: AdminData
  setAdminData: (d: AdminData) => void
  departments: string[]
  errors: Record<string, string>
}) {
  const update = (key: keyof AdminData, value: string) => {
    setAdminData({ ...adminData, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-primary">管理者アカウント</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          最初の管理者アカウントを設定してください
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="管理者名"
          required
          placeholder="山田太郎"
          value={adminData.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.admin_name}
        />

        <Input
          label="メールアドレス"
          required
          type="email"
          placeholder="admin@example.com"
          value={adminData.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.admin_email}
        />

        <Select
          label="所属部門"
          value={adminData.department}
          onChange={(v) => update('department', v)}
          options={departments.map((d) => ({ value: d, label: d }))}
          placeholder="部門を選択"
        />

        {/* Role selection */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-2">
            ロール <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'ceo', label: '経営者', desc: '全権限を持ちます' },
              { value: 'admin', label: '管理者', desc: '設定・管理権限を持ちます' },
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => update('role', role.value)}
                className={cn(
                  'p-4 rounded-[12px] border text-left transition-all duration-200',
                  adminData.role === role.value
                    ? 'border-accent bg-accent-muted shadow-[0_0_0_2px_rgba(79,70,229,0.2)]'
                    : 'border-border bg-bg-base hover:border-accent/30',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      adminData.role === role.value
                        ? 'border-accent'
                        : 'border-text-muted',
                    )}
                  >
                    {adminData.role === role.value && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <span className="text-[14px] font-semibold text-text-primary">
                    {role.label}
                  </span>
                </div>
                <p className="text-[12px] text-text-muted ml-6">{role.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mock password display */}
        <div className="bg-bg-elevated border border-border rounded-[12px] p-4">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            初期パスワード（自動生成）
          </label>
          <div className="flex items-center gap-2">
            <code className="text-[15px] font-mono text-text-primary bg-bg-base px-3 py-2 rounded-[8px] border border-border flex-1">
              Bhall2024!Setup
            </code>
          </div>
          <p className="text-[11px] text-text-muted mt-2">
            初回ログイン後にパスワードを変更してください
          </p>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 4: 権限設定
// ══════════════════════════════════════════

function StepPermissions({
  permissions,
  setPermissions,
}: {
  permissions: PermissionMap
  setPermissions: (p: PermissionMap) => void
}) {
  const togglePermission = (roleKey: string, permKey: string) => {
    setPermissions({
      ...permissions,
      [roleKey]: {
        ...permissions[roleKey],
        [permKey]: !permissions[roleKey][permKey],
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-primary">権限設定</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          各ロールの権限を確認・カスタマイズしてください
        </p>
      </div>

      <div className="space-y-4">
        {ROLE_DEFINITIONS.map((role) => (
          <div
            key={role.key}
            className="bg-bg-base border border-border rounded-[12px] p-4"
          >
            <div className="mb-3">
              <h3 className="text-[15px] font-semibold text-text-primary">{role.label}</h3>
              <p className="text-[12px] text-text-muted">{role.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PERMISSION_LABELS).map((permKey) => {
                const isOn = permissions[role.key]?.[permKey] ?? false
                return (
                  <button
                    key={permKey}
                    type="button"
                    onClick={() => togglePermission(role.key, permKey)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200',
                      'border',
                      isOn
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : 'bg-bg-surface border-border text-text-muted',
                    )}
                  >
                    {isOn && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {PERMISSION_LABELS[permKey]}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 5: 初期設定
// ══════════════════════════════════════════

function StepSettings({
  settings,
  setSettings,
}: {
  settings: SettingsData
  setSettings: (s: SettingsData) => void
}) {
  const update = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-primary">初期設定</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          B-Hallの基本設定を行います。後から変更できます。
        </p>
      </div>

      {/* Fiscal Year Start */}
      <div className="bg-bg-base border border-border rounded-[12px] p-4">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-accent" />
          会計年度
        </h3>
        <Select
          label="会計年度の開始月"
          value={settings.fiscal_year_start}
          onChange={(v) => update('fiscal_year_start', parseInt(v))}
          options={MONTHS}
        />
      </div>

      {/* Notifications */}
      <div className="bg-bg-base border border-border rounded-[12px] p-4">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          通知設定
        </h3>
        <div className="space-y-3">
          <Toggle
            checked={settings.notifications_app}
            onChange={(v) => update('notifications_app', v)}
            label="アプリ内通知"
          />
          <Toggle
            checked={settings.notifications_email}
            onChange={(v) => update('notifications_email', v)}
            label="メール通知"
          />
        </div>
      </div>

      {/* Theme */}
      <div className="bg-bg-base border border-border rounded-[12px] p-4">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-accent" />
          テーマ
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'light', label: 'ライト', icon: Sun },
            { value: 'dark', label: 'ダーク', icon: Moon },
            { value: 'system', label: 'システム', icon: Settings },
          ].map((theme) => {
            const Icon = theme.icon
            return (
              <button
                key={theme.value}
                type="button"
                onClick={() => update('theme', theme.value as SettingsData['theme'])}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-[10px] border transition-all',
                  settings.theme === theme.value
                    ? 'border-accent bg-accent-muted'
                    : 'border-border bg-bg-surface hover:border-accent/30',
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    settings.theme === theme.value ? 'text-accent' : 'text-text-muted',
                  )}
                />
                <span
                  className={cn(
                    'text-[12px] font-medium',
                    settings.theme === theme.value ? 'text-accent' : 'text-text-muted',
                  )}
                >
                  {theme.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Language */}
      <div className="bg-bg-base border border-border rounded-[12px] p-4">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" />
          言語
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'ja', label: '日本語', flag: '🇯🇵' },
            { value: 'en', label: 'English', flag: '🇺🇸' },
          ].map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => update('language', lang.value as 'ja' | 'en')}
              className={cn(
                'flex items-center gap-2 p-3 rounded-[10px] border transition-all',
                settings.language === lang.value
                  ? 'border-accent bg-accent-muted'
                  : 'border-border bg-bg-surface hover:border-accent/30',
              )}
            >
              <span className="text-[18px]">{lang.flag}</span>
              <span
                className={cn(
                  'text-[13px] font-medium',
                  settings.language === lang.value ? 'text-accent' : 'text-text-muted',
                )}
              >
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  STEP 6: 完了
// ══════════════════════════════════════════

function StepComplete({
  company,
  departments,
  adminData,
  settings,
}: {
  company: CompanyInfo
  departments: string[]
  adminData: AdminData
  settings: SettingsData
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-success" />
        </motion.div>
        <h2 className="text-[22px] font-bold text-text-primary">セットアップ完了</h2>
        <p className="text-[14px] text-text-secondary mt-1">
          以下の内容で初期設定を行います
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-3">
        <SummaryCard
          icon={Building2}
          title="会社情報"
          items={[
            company.name || '未設定',
            company.industry ? `業種: ${company.industry}` : '',
            company.employee_count_range ? `従業員: ${EMPLOYEE_RANGES.find(r => r.value === company.employee_count_range)?.label}` : '',
          ].filter(Boolean)}
        />

        <SummaryCard
          icon={Users}
          title="部門"
          items={[`${departments.length}部門: ${departments.join('、')}`]}
        />

        <SummaryCard
          icon={UserCog}
          title="管理者"
          items={[
            adminData.name || '未設定',
            adminData.email,
            `ロール: ${adminData.role === 'ceo' ? '経営者' : '管理者'}`,
          ].filter(Boolean)}
        />

        <SummaryCard
          icon={Settings}
          title="設定"
          items={[
            `会計年度: ${settings.fiscal_year_start}月開始`,
            `テーマ: ${settings.theme === 'light' ? 'ライト' : settings.theme === 'dark' ? 'ダーク' : 'システム'}`,
            `言語: ${settings.language === 'ja' ? '日本語' : 'English'}`,
          ]}
        />
      </div>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Building2
  title: string
  items: string[]
}) {
  return (
    <div className="bg-bg-base border border-border rounded-[12px] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-accent" />
        <h4 className="text-[13px] font-semibold text-text-secondary">{title}</h4>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <p key={i} className="text-[14px] text-text-primary">{item}</p>
        ))}
      </div>
    </div>
  )
}
