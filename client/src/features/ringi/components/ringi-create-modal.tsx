'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRingiStore } from '@/stores/ringi-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { generateId } from '@/lib/id'
import { Save, Send, X, Plus } from 'lucide-react'
import type { ApprovalStep, RingiTemplate } from '@/types'

interface RingiCreateModalProps {
  open: boolean
  onClose: () => void
  templateData?: RingiTemplate | null
}

export function RingiCreateModal({ open, onClose, templateData }: RingiCreateModalProps) {
  const { currentUser, users } = useAuth()
  const createRingi = useRingiStore((s) => s.createRingi)
  const submitRingi = useRingiStore((s) => s.submitRingi)
  const { addToast } = useToast()

  const [title, setTitle] = useState('')
  const [background, setBackground] = useState('')
  const [purpose, setPurpose] = useState('')
  const [content, setContent] = useState('')
  const [amount, setAmount] = useState('')
  const [roiEstimate, setRoiEstimate] = useState('')
  const [risk, setRisk] = useState('')
  const [effect, setEffect] = useState('')
  const [departments, setDepartments] = useState('')
  const [approverIds, setApproverIds] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill from template when templateData changes
  useEffect(() => {
    if (templateData && open) {
      setTitle(templateData.fields.title || '')
      setBackground(templateData.fields.background || '')
      setPurpose(templateData.fields.purpose || '')
      setContent(templateData.fields.content || '')
      if (templateData.fields.amount !== null) {
        setAmount(templateData.fields.amount.toLocaleString())
      }
      setDepartments(templateData.fields.departments.join(', '))
    }
  }, [templateData, open])

  const resetForm = () => {
    setTitle('')
    setBackground('')
    setPurpose('')
    setContent('')
    setAmount('')
    setRoiEstimate('')
    setRisk('')
    setEffect('')
    setDepartments('')
    setApproverIds([])
    setErrors({})
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = '件名は必須です'
    }
    if (approverIds.length === 0) {
      newErrors.approvers = '承認者を1名以上選択してください'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildRingiData = () => {
    const parsedAmount = amount ? Number(amount.replace(/,/g, '')) : null
    const deptList = departments
      .split(/[,、，]/)
      .map((d) => d.trim())
      .filter(Boolean)

    const approvalSteps: ApprovalStep[] = approverIds.map((approverId, index) => {
      const approver = users.find((u) => u.id === approverId)
      return {
        id: generateId(),
        approver_id: approverId,
        approver_name: approver?.name || '不明',
        status: 'pending' as const,
        comment: '',
        decided_at: '',
        order: index + 1,
      }
    })

    return {
      title: title.trim(),
      background: background.trim(),
      purpose: purpose.trim(),
      content: content.trim(),
      amount: parsedAmount,
      roi_estimate: roiEstimate.trim(),
      risk: risk.trim(),
      effect: effect.trim(),
      departments: deptList,
      approval_steps: approvalSteps,
      created_by: currentUser?.id || '',
      updated_by: currentUser?.id || '',
    }
  }

  const handleSaveDraft = () => {
    if (!title.trim()) {
      setErrors({ title: '件名は必須です' })
      return
    }
    const data = buildRingiData()
    createRingi({ ...data, status: 'draft' })
    addToast('success', '稟議を下書き保存しました')
    resetForm()
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    const data = buildRingiData()
    const ringi = createRingi({ ...data, status: 'draft' })
    submitRingi(ringi.id)
    addToast('success', '稟議を提出しました')
    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const toggleApprover = (userId: string) => {
    setApproverIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
    // Clear error if at least one is selected
    if (errors.approvers) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.approvers
        return next
      })
    }
  }

  // Exclude current user from approver list
  const availableApprovers = users.filter(
    (u) => u.id !== currentUser?.id && u.status === 'active'
  )

  const modalTitle = templateData ? `新規稟議（${templateData.name}）` : '新規稟議'

  const footer = (
    <>
      <Button variant="ghost" size="sm" onClick={handleClose}>
        キャンセル
      </Button>
      <Button variant="secondary" size="sm" icon={Save} onClick={handleSaveDraft}>
        下書き保存
      </Button>
      <Button variant="primary" size="sm" icon={Send} onClick={handleSubmit}>
        提出
      </Button>
    </>
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
        {templateData && (
          <div className="px-3 py-2 bg-accent-muted border border-accent/20 rounded-[10px]">
            <p className="text-[12px] text-accent font-medium">
              テンプレート「{templateData.name}」からフィールドが自動入力されています。必要に応じて編集してください。
            </p>
          </div>
        )}

        {/* 件名 */}
        <Input
          label="件名"
          required
          placeholder="稟議の件名を入力"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) {
              setErrors((prev) => {
                const next = { ...prev }
                delete next.title
                return next
              })
            }
          }}
          error={errors.title}
        />

        {/* 背景 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            背景
          </label>
          <textarea
            placeholder="稟議の背景・経緯"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            rows={3}
            className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* 目的 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            目的
          </label>
          <textarea
            placeholder="この稟議の目的"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={2}
            className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* 内容 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            内容
          </label>
          <textarea
            placeholder="具体的な内容・実施事項"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* 金額 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            金額
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-text-muted font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
              ¥
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '')
                setAmount(raw ? Number(raw).toLocaleString() : '')
              }}
              className="w-full bg-bg-base border border-border rounded-[10px] pl-8 pr-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
              style={{ fontFamily: 'var(--font-inter)' }}
            />
          </div>
        </div>

        {/* 投資回収見込み */}
        <Input
          label="投資回収見込み"
          placeholder="ROI・回収見込みの概要"
          value={roiEstimate}
          onChange={(e) => setRoiEstimate(e.target.value)}
        />

        {/* リスク */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            リスク
          </label>
          <textarea
            placeholder="想定されるリスク"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            rows={2}
            className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* 期待効果 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            期待効果
          </label>
          <textarea
            placeholder="期待される効果・メリット"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            rows={2}
            className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none resize-none"
          />
        </div>

        {/* 関連部門 */}
        <Input
          label="関連部門"
          placeholder="部門名をカンマ区切りで入力（例: 開発部, 経理部）"
          value={departments}
          onChange={(e) => setDepartments(e.target.value)}
        />

        {/* 承認者 */}
        <div className="w-full">
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            承認者 <span className="text-accent">*</span>
          </label>
          <p className="text-[11px] text-text-muted mb-2">
            選択した順に承認ルートが設定されます
          </p>
          <div className="flex flex-wrap gap-2">
            {availableApprovers.map((user) => {
              const selected = approverIds.includes(user.id)
              const order = approverIds.indexOf(user.id) + 1
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleApprover(user.id)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium
                    transition-all cursor-pointer border
                    ${
                      selected
                        ? 'bg-[rgba(79,70,229,0.1)] border-accent text-accent'
                        : 'bg-bg-base border-border text-text-secondary hover:bg-bg-elevated hover:border-[rgba(0,0,0,0.12)]'
                    }
                  `}
                >
                  {selected && (
                    <span
                      className="w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {order}
                    </span>
                  )}
                  <span className="w-6 h-6 rounded-full bg-[rgba(79,70,229,0.1)] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-accent">
                      {user.avatar_initial}
                    </span>
                  </span>
                  {user.name}
                  <span className="text-[11px] text-text-muted">
                    {user.position}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.approvers && (
            <p className="text-[12px] text-danger mt-1">{errors.approvers}</p>
          )}
          {approverIds.length > 0 && (
            <div className="mt-3 px-3 py-2 bg-bg-base rounded-[10px] border border-border">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-1.5">
                承認ルート
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {approverIds.map((id, index) => {
                  const user = users.find((u) => u.id === id)
                  return (
                    <span key={id} className="flex items-center gap-1">
                      <span className="text-[12px] font-medium text-text-primary">
                        {user?.name || '不明'}
                      </span>
                      {index < approverIds.length - 1 && (
                        <span className="text-[11px] text-text-muted mx-1">→</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
