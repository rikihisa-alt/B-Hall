'use client'

import { useState } from 'react'
import {
  Receipt,
  Calendar,
  Plane,
  ShoppingCart,
  Clock,
  FileCheck,
  CreditCard,
  UserPlus,
  Laptop,
  Stamp,
  Heart,
  FileText,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApplicationStore } from '@/stores/application-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { generateId } from '@/lib/id'
import { APPLICATION_TYPE_LABELS } from '@/lib/constants'
import type { ApplicationType, ApprovalStep } from '@/types'

interface ApplicationCreateModalProps {
  open: boolean
  onClose: () => void
}

const TYPE_ICONS: Record<ApplicationType, typeof Receipt> = {
  expense: Receipt,
  leave: Calendar,
  travel: Plane,
  purchase: ShoppingCart,
  overtime: Clock,
  contract_review: FileCheck,
  payment_request: CreditCard,
  hiring: UserPlus,
  device_account: Laptop,
  ringi: Stamp,
  welfare: Heart,
  custom: FileText,
}

const EXPENSE_CATEGORIES = ['交通費', '飲食', '事務用品', '会議費', 'その他'] as const
const LEAVE_TYPES = ['有給', '病欠', '慶弔', 'その他'] as const

export function ApplicationCreateModal({ open, onClose }: ApplicationCreateModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedType, setSelectedType] = useState<ApplicationType | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])

  const { currentUser, users } = useAuth()
  const createApplication = useApplicationStore((s) => s.createApplication)
  const submitApplication = useApplicationStore((s) => s.submitApplication)
  const { addToast } = useToast()

  const resetAndClose = () => {
    setStep(1)
    setSelectedType(null)
    setFormData({})
    setSelectedApprovers([])
    onClose()
  }

  const handleSelectType = (type: ApplicationType) => {
    setSelectedType(type)
    setFormData({})
    setStep(2)
  }

  const updateField = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleApprover = (userId: string) => {
    setSelectedApprovers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const getTitle = (): string => {
    if (!selectedType) return ''
    const label = APPLICATION_TYPE_LABELS[selectedType]
    switch (selectedType) {
      case 'expense':
        return `${formData.description || label}`
      case 'leave':
        return `${formData.leave_type || ''}休暇申請${formData.start_date ? `（${formData.start_date}）` : ''}`
      case 'travel':
        return `出張申請 - ${formData.destination || ''}`
      case 'purchase':
        return `購買申請 - ${formData.item_name || ''}`
      default:
        return formData.title as string || label
    }
  }

  const getAmount = (): number | null => {
    switch (selectedType) {
      case 'expense':
        return formData.amount ? Number(formData.amount) : null
      case 'travel':
        return formData.estimated_cost ? Number(formData.estimated_cost) : null
      case 'purchase': {
        const qty = Number(formData.quantity) || 0
        const price = Number(formData.unit_price) || 0
        return qty * price || null
      }
      default:
        return formData.amount ? Number(formData.amount) : null
    }
  }

  const isStep2Valid = (): boolean => {
    if (!selectedType) return false
    switch (selectedType) {
      case 'expense':
        return !!(formData.date && formData.description && formData.amount && formData.category)
      case 'leave':
        return !!(formData.start_date && formData.end_date && formData.leave_type)
      case 'travel':
        return !!(formData.destination && formData.start_date && formData.end_date && formData.purpose)
      case 'purchase':
        return !!(formData.item_name && formData.quantity && formData.unit_price)
      default:
        return !!(formData.title && formData.description)
    }
  }

  const handleSubmit = () => {
    if (!currentUser || !selectedType || selectedApprovers.length === 0) return

    const approvalSteps: ApprovalStep[] = selectedApprovers.map((approverId, idx) => {
      const approver = users.find((u) => u.id === approverId)
      return {
        id: generateId(),
        approver_id: approverId,
        approver_name: approver?.name || '不明',
        status: 'pending' as const,
        comment: '',
        decided_at: '',
        order: idx + 1,
      }
    })

    const app = createApplication({
      type: selectedType,
      type_label: APPLICATION_TYPE_LABELS[selectedType],
      applicant_id: currentUser.id,
      title: getTitle(),
      description: (formData.description as string) || (formData.reason as string) || (formData.purpose as string) || '',
      amount: getAmount(),
      form_data: { ...formData },
      approval_steps: approvalSteps,
    })

    // Auto-submit the application
    submitApplication(app.id)

    addToast('success', '申請を作成しました')
    resetAndClose()
  }

  const modalTitle =
    step === 1
      ? '新規申請'
      : step === 2
        ? APPLICATION_TYPE_LABELS[selectedType!]
        : '承認者を選択'

  const otherUsers = users.filter((u) => u.id !== currentUser?.id)

  return (
    <Modal open={open} onClose={resetAndClose} title={modalTitle} size="lg">
      {/* Step 1: Type selection */}
      {step === 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {(Object.keys(APPLICATION_TYPE_LABELS) as ApplicationType[]).map((type) => {
            const Icon = TYPE_ICONS[type]
            return (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-[12px] border border-border bg-bg-base hover:bg-bg-elevated hover:border-accent/30 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center group-hover:bg-[rgba(79,70,229,0.15)] transition-colors">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
                </div>
                <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-primary transition-colors text-center leading-tight">
                  {APPLICATION_TYPE_LABELS[type]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Step 2: Form */}
      {step === 2 && selectedType && (
        <div className="space-y-4">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            申請種別を変更
          </button>

          {selectedType === 'expense' && (
            <>
              <Input
                label="日付"
                type="date"
                required
                value={(formData.date as string) || ''}
                onChange={(e) => updateField('date', e.target.value)}
              />
              <Input
                label="内容"
                required
                placeholder="例: 取引先との会食費"
                value={(formData.description as string) || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
              <Input
                label="金額"
                type="number"
                required
                placeholder="例: 15000"
                value={(formData.amount as string) || ''}
                onChange={(e) => updateField('amount', e.target.value)}
              />
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  カテゴリ <span className="text-accent">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateField('category', cat)}
                      className={`px-3.5 py-1.5 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                        formData.category === cat
                          ? 'bg-accent text-white border-accent'
                          : 'bg-bg-base border-border text-text-secondary hover:bg-bg-elevated'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedType === 'leave' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="開始日"
                  type="date"
                  required
                  value={(formData.start_date as string) || ''}
                  onChange={(e) => updateField('start_date', e.target.value)}
                />
                <Input
                  label="終了日"
                  type="date"
                  required
                  value={(formData.end_date as string) || ''}
                  onChange={(e) => updateField('end_date', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  休暇種別 <span className="text-accent">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEAVE_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateField('leave_type', type)}
                      className={`px-3.5 py-1.5 rounded-[10px] text-[13px] font-medium border transition-all cursor-pointer ${
                        formData.leave_type === type
                          ? 'bg-accent text-white border-accent'
                          : 'bg-bg-base border-border text-text-secondary hover:bg-bg-elevated'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="理由"
                placeholder="休暇の理由を入力..."
                value={(formData.reason as string) || ''}
                onChange={(e) => updateField('reason', e.target.value)}
              />
            </>
          )}

          {selectedType === 'travel' && (
            <>
              <Input
                label="出張先"
                required
                placeholder="例: 大阪支社"
                value={(formData.destination as string) || ''}
                onChange={(e) => updateField('destination', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="出発日"
                  type="date"
                  required
                  value={(formData.start_date as string) || ''}
                  onChange={(e) => updateField('start_date', e.target.value)}
                />
                <Input
                  label="帰着日"
                  type="date"
                  required
                  value={(formData.end_date as string) || ''}
                  onChange={(e) => updateField('end_date', e.target.value)}
                />
              </div>
              <Input
                label="目的"
                required
                placeholder="出張の目的を入力..."
                value={(formData.purpose as string) || ''}
                onChange={(e) => updateField('purpose', e.target.value)}
              />
              <Input
                label="見積費用"
                type="number"
                placeholder="例: 80000"
                value={(formData.estimated_cost as string) || ''}
                onChange={(e) => updateField('estimated_cost', e.target.value)}
              />
            </>
          )}

          {selectedType === 'purchase' && (
            <>
              <Input
                label="品名"
                required
                placeholder="例: ノートPC"
                value={(formData.item_name as string) || ''}
                onChange={(e) => updateField('item_name', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="数量"
                  type="number"
                  required
                  placeholder="例: 3"
                  value={(formData.quantity as string) || ''}
                  onChange={(e) => updateField('quantity', e.target.value)}
                />
                <Input
                  label="単価"
                  type="number"
                  required
                  placeholder="例: 150000"
                  value={(formData.unit_price as string) || ''}
                  onChange={(e) => updateField('unit_price', e.target.value)}
                />
              </div>
              <Input
                label="取引先"
                placeholder="例: 株式会社ABC"
                value={(formData.vendor as string) || ''}
                onChange={(e) => updateField('vendor', e.target.value)}
              />
              <Input
                label="購入理由"
                placeholder="購入理由を入力..."
                value={(formData.reason as string) || ''}
                onChange={(e) => updateField('reason', e.target.value)}
              />
            </>
          )}

          {/* Generic form for other types */}
          {!['expense', 'leave', 'travel', 'purchase'].includes(selectedType) && (
            <>
              <Input
                label="タイトル"
                required
                placeholder="申請タイトルを入力..."
                value={(formData.title as string) || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  説明 <span className="text-accent">*</span>
                </label>
                <textarea
                  placeholder="申請内容の詳細を入力..."
                  value={(formData.description as string) || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
                />
              </div>
              <Input
                label="金額（任意）"
                type="number"
                placeholder="例: 50000"
                value={(formData.amount as string) || ''}
                onChange={(e) => updateField('amount', e.target.value)}
              />
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={!isStep2Valid()}
            >
              次へ：承認者選択
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select approvers */}
      {step === 3 && (
        <div className="space-y-4">
          <button
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            フォームに戻る
          </button>

          <p className="text-[13px] text-text-secondary">
            承認者を選択してください（複数選択可、選択順が承認順になります）
          </p>

          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {otherUsers.map((user) => {
              const isSelected = selectedApprovers.includes(user.id)
              const order = selectedApprovers.indexOf(user.id) + 1

              return (
                <button
                  key={user.id}
                  onClick={() => toggleApprover(user.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-[rgba(79,70,229,0.06)]'
                      : 'border-border bg-bg-base hover:bg-bg-elevated'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-accent text-white' : 'bg-[rgba(79,70,229,0.1)] text-accent'
                  }`}>
                    {isSelected ? (
                      <span className="text-[12px] font-bold">{order}</span>
                    ) : (
                      <span className="text-[12px] font-bold">{user.avatar_initial}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-medium text-text-primary">{user.name}</p>
                    <p className="text-[12px] text-text-muted">{user.department} / {user.position}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-[13px] text-text-muted">
              {selectedApprovers.length}名選択中
            </p>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedApprovers.length === 0}
            >
              申請を作成
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
