'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useRingiStore } from '@/stores/ringi-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { RingiCreateModal } from '@/features/ringi/components/ringi-create-modal'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  RINGI_STATUS_LABELS,
  RINGI_STATUS_COLORS,
} from '@/lib/constants'
import {
  Stamp,
  Clock,
  Plus,
  RotateCcw,
  CheckCircle2,
  Search,
  GitBranch,
  FileText,
  ChevronRight,
  XCircle,
  Edit3,
  Trash2,
  Copy,
  ArrowRight,
} from 'lucide-react'
import type { ApprovalRoute, ApprovalRouteStep, RingiTemplate, RingiTemplateFields } from '@/types'

// ── 承認ルート設定モーダル ──

function ApprovalRouteModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const approvalRoutes = useRingiStore((s) => s.approvalRoutes)
  const addApprovalRoute = useRingiStore((s) => s.addApprovalRoute)
  const updateApprovalRoute = useRingiStore((s) => s.updateApprovalRoute)
  const deleteApprovalRoute = useRingiStore((s) => s.deleteApprovalRoute)
  const { addToast } = useToast()

  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<ApprovalRouteStep[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const ROLE_OPTIONS = ['経営者', '部門長', '経理部長', '人事部長', '総務部長', '法務部長', '管理者']

  const resetForm = () => {
    setName('')
    setDescription('')
    setSteps([])
    setErrors({})
    setEditingId(null)
  }

  const handleCreate = () => {
    resetForm()
    setMode('create')
  }

  const handleEdit = (route: ApprovalRoute) => {
    setEditingId(route.id)
    setName(route.name)
    setDescription(route.description)
    setSteps([...route.steps])
    setMode('edit')
  }

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { order: prev.length + 1, role: ROLE_OPTIONS[0], approver_name: '' },
    ])
  }

  const handleRemoveStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i + 1 }))
    )
  }

  const handleStepChange = (
    index: number,
    field: 'role' | 'approver_name',
    value: string
  ) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'ルート名は必須です'
    if (steps.length === 0) newErrors.steps = '承認ステップを1つ以上追加してください'
    const emptyStep = steps.find((s) => !s.approver_name.trim())
    if (emptyStep) newErrors.steps = 'すべてのステップに承認者名を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    if (mode === 'edit' && editingId) {
      updateApprovalRoute(editingId, { name, description, steps })
      addToast('success', '承認ルートを更新しました')
    } else {
      addApprovalRoute({ name, description, steps })
      addToast('success', '承認ルートを作成しました')
    }
    resetForm()
    setMode('list')
  }

  const handleDelete = (id: string) => {
    deleteApprovalRoute(id)
    addToast('success', '承認ルートを削除しました')
  }

  const handleBack = () => {
    resetForm()
    setMode('list')
  }

  const handleClose = () => {
    resetForm()
    setMode('list')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="承認ルート設定" size="lg">
      <div className="max-h-[60vh] overflow-y-auto pr-1">
        {mode === 'list' ? (
          <div className="space-y-3">
            {approvalRoutes.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-center">
                <GitBranch className="w-10 h-10 text-text-muted opacity-40 mb-3" strokeWidth={1.5} />
                <p className="text-[14px] font-semibold text-text-primary mb-1">承認ルートがありません</p>
                <p className="text-[12px] text-text-muted mb-4">承認ルートを作成して稟議の承認フローを管理しましょう</p>
              </div>
            ) : (
              approvalRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-bg-elevated border border-border rounded-[12px] p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text-primary tracking-tight">
                        {route.name}
                      </p>
                      <p className="text-[12px] text-text-secondary mt-0.5">
                        {route.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(route)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent-muted transition-all cursor-pointer"
                      >
                        <Edit3 className="w-[14px] h-[14px]" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-all cursor-pointer"
                      >
                        <Trash2 className="w-[14px] h-[14px]" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap mt-2">
                    {route.steps.map((step, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-base border border-border rounded-[8px]">
                          <span className="text-[11px] text-text-muted">{step.role}</span>
                          <span className="text-[12px] font-medium text-text-primary">{step.approver_name}</span>
                        </span>
                        {i < route.steps.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-text-muted mx-0.5" strokeWidth={1.75} />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleCreate}
              className="w-full mt-2"
            >
              新規作成
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <button
              onClick={handleBack}
              className="text-[13px] text-accent hover:underline cursor-pointer"
            >
              &larr; 一覧に戻る
            </button>

            <Input
              label="ルート名"
              required
              placeholder="例: 標準承認ルート"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((p) => { const n = { ...p }; delete n.name; return n })
              }}
              error={errors.name}
            />

            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                説明
              </label>
              <textarea
                placeholder="このルートの用途や条件"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
              />
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                承認ステップ <span className="text-accent">*</span>
              </label>
              {errors.steps && (
                <p className="text-[12px] text-danger mb-2">{errors.steps}</p>
              )}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-bg-elevated border border-border rounded-[10px] p-3"
                  >
                    <span
                      className="w-6 h-6 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {step.order}
                    </span>
                    <select
                      value={step.role}
                      onChange={(e) => handleStepChange(index, 'role', e.target.value)}
                      className="bg-bg-base border border-border rounded-[8px] px-3 py-2 text-[13px] text-text-primary focus:border-accent focus:outline-none cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="承認者名"
                      value={step.approver_name}
                      onChange={(e) => handleStepChange(index, 'approver_name', e.target.value)}
                      className="flex-1 bg-bg-base border border-border rounded-[8px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-all cursor-pointer shrink-0"
                    >
                      <XCircle className="w-[14px] h-[14px]" strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddStep}
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                ステップを追加
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                キャンセル
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                {mode === 'edit' ? '更新' : '作成'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── テンプレートモーダル ──

function TemplateModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const ringiTemplates = useRingiStore((s) => s.ringiTemplates)
  const approvalRoutes = useRingiStore((s) => s.approvalRoutes)
  const addTemplate = useRingiStore((s) => s.addTemplate)
  const updateTemplate = useRingiStore((s) => s.updateTemplate)
  const deleteTemplate = useRingiStore((s) => s.deleteTemplate)
  const { addToast } = useToast()

  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tmplName, setTmplName] = useState('')
  const [tmplDescription, setTmplDescription] = useState('')
  const [tmplRouteId, setTmplRouteId] = useState('')
  const [fields, setFields] = useState<RingiTemplateFields>({
    title: '',
    background: '',
    purpose: '',
    content: '',
    amount: null,
    departments: [],
  })
  const [deptInput, setDeptInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setTmplName('')
    setTmplDescription('')
    setTmplRouteId('')
    setFields({ title: '', background: '', purpose: '', content: '', amount: null, departments: [] })
    setDeptInput('')
    setErrors({})
    setEditingId(null)
  }

  const handleCreate = () => {
    resetForm()
    setMode('create')
  }

  const handleEdit = (tmpl: RingiTemplate) => {
    setEditingId(tmpl.id)
    setTmplName(tmpl.name)
    setTmplDescription(tmpl.description)
    setTmplRouteId(tmpl.approval_route_id)
    setFields({ ...tmpl.fields })
    setDeptInput(tmpl.fields.departments.join(', '))
    setMode('edit')
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!tmplName.trim()) newErrors.name = 'テンプレート名は必須です'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const deptList = deptInput.split(/[,、，]/).map((d) => d.trim()).filter(Boolean)
    const data = {
      name: tmplName.trim(),
      description: tmplDescription.trim(),
      fields: { ...fields, departments: deptList },
      approval_route_id: tmplRouteId,
    }
    if (mode === 'edit' && editingId) {
      updateTemplate(editingId, data)
      addToast('success', 'テンプレートを更新しました')
    } else {
      addTemplate(data)
      addToast('success', 'テンプレートを作成しました')
    }
    resetForm()
    setMode('list')
  }

  const handleDelete = (id: string) => {
    deleteTemplate(id)
    addToast('success', 'テンプレートを削除しました')
  }

  const handleBack = () => {
    resetForm()
    setMode('list')
  }

  const handleClose = () => {
    resetForm()
    setMode('list')
    onClose()
  }

  const getRouteName = (routeId: string) => {
    return approvalRoutes.find((r) => r.id === routeId)?.name || '未設定'
  }

  return (
    <Modal open={open} onClose={handleClose} title="稟議テンプレート" size="lg">
      <div className="max-h-[60vh] overflow-y-auto pr-1">
        {mode === 'list' ? (
          <div className="space-y-3">
            {ringiTemplates.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-center">
                <FileText className="w-10 h-10 text-text-muted opacity-40 mb-3" strokeWidth={1.5} />
                <p className="text-[14px] font-semibold text-text-primary mb-1">テンプレートがありません</p>
                <p className="text-[12px] text-text-muted mb-4">よく使う稟議のテンプレートを作成しましょう</p>
              </div>
            ) : (
              ringiTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-bg-elevated border border-border rounded-[12px] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text-primary tracking-tight">
                        {tmpl.name}
                      </p>
                      <p className="text-[12px] text-text-secondary mt-0.5">
                        {tmpl.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-base border border-border rounded-[6px] text-[11px] text-text-muted">
                          <GitBranch className="w-3 h-3" strokeWidth={1.75} />
                          {getRouteName(tmpl.approval_route_id)}
                        </span>
                        {tmpl.fields.departments.map((dept) => (
                          <span
                            key={dept}
                            className="px-2 py-0.5 bg-bg-base border border-border rounded-[6px] text-[11px] text-text-muted"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(tmpl)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent-muted transition-all cursor-pointer"
                      >
                        <Edit3 className="w-[14px] h-[14px]" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleDelete(tmpl.id)}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-all cursor-pointer"
                      >
                        <Trash2 className="w-[14px] h-[14px]" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleCreate}
              className="w-full mt-2"
            >
              新規作成
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <button
              onClick={handleBack}
              className="text-[13px] text-accent hover:underline cursor-pointer"
            >
              &larr; 一覧に戻る
            </button>

            <Input
              label="テンプレート名"
              required
              placeholder="例: ツール導入稟議"
              value={tmplName}
              onChange={(e) => {
                setTmplName(e.target.value)
                if (errors.name) setErrors((p) => { const n = { ...p }; delete n.name; return n })
              }}
              error={errors.name}
            />

            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                説明
              </label>
              <textarea
                placeholder="テンプレートの概要"
                value={tmplDescription}
                onChange={(e) => setTmplDescription(e.target.value)}
                rows={2}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
              />
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                承認ルート
              </label>
              <select
                value={tmplRouteId}
                onChange={(e) => setTmplRouteId(e.target.value)}
                className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none cursor-pointer"
              >
                <option value="">未設定</option>
                {approvalRoutes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-3">
                稟議フィールド（プリセット）
              </p>

              <div className="space-y-4">
                <Input
                  label="件名プリセット"
                  placeholder="例: 【ツール導入】"
                  value={fields.title}
                  onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
                />

                <div className="w-full">
                  <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    背景
                  </label>
                  <textarea
                    placeholder="テンプレートの背景文"
                    value={fields.background}
                    onChange={(e) => setFields((f) => ({ ...f, background: e.target.value }))}
                    rows={2}
                    className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    目的
                  </label>
                  <textarea
                    placeholder="テンプレートの目的文"
                    value={fields.purpose}
                    onChange={(e) => setFields((f) => ({ ...f, purpose: e.target.value }))}
                    rows={2}
                    className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    内容
                  </label>
                  <textarea
                    placeholder="テンプレートの内容文"
                    value={fields.content}
                    onChange={(e) => setFields((f) => ({ ...f, content: e.target.value }))}
                    rows={2}
                    className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] focus:outline-none resize-none"
                  />
                </div>

                <Input
                  label="関連部門"
                  placeholder="部門名をカンマ区切りで入力"
                  value={deptInput}
                  onChange={(e) => setDeptInput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                キャンセル
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                {mode === 'edit' ? '更新' : '作成'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── テンプレートから作成モーダル ──

function TemplateSelectModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (tmpl: RingiTemplate) => void
}) {
  const ringiTemplates = useRingiStore((s) => s.ringiTemplates)
  const approvalRoutes = useRingiStore((s) => s.approvalRoutes)

  const getRouteName = (routeId: string) => {
    return approvalRoutes.find((r) => r.id === routeId)?.name || '未設定'
  }

  return (
    <Modal open={open} onClose={onClose} title="テンプレートから作成" size="md">
      <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
        {ringiTemplates.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-center">
            <FileText className="w-10 h-10 text-text-muted opacity-40 mb-3" strokeWidth={1.5} />
            <p className="text-[14px] font-semibold text-text-primary mb-1">テンプレートがありません</p>
            <p className="text-[12px] text-text-muted">テンプレート管理から作成してください</p>
          </div>
        ) : (
          ringiTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => onSelect(tmpl)}
              className="w-full text-left bg-bg-elevated border border-border rounded-[12px] p-4 hover:border-accent hover:bg-[rgba(37,99,235,0.03)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                    {tmpl.name}
                  </p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {tmpl.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-base border border-border rounded-[6px] text-[11px] text-text-muted">
                      <GitBranch className="w-3 h-3" strokeWidth={1.75} />
                      {getRouteName(tmpl.approval_route_id)}
                    </span>
                    {tmpl.fields.departments.map((dept) => (
                      <span
                        key={dept}
                        className="px-2 py-0.5 bg-bg-base border border-border rounded-[6px] text-[11px] text-text-muted"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
              </div>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}

// ── メインページ ──

export default function RingiPage() {
  const [mounted, setMounted] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [routeModalOpen, setRouteModalOpen] = useState(false)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [templateSelectOpen, setTemplateSelectOpen] = useState(false)
  const [templateCreateData, setTemplateCreateData] = useState<RingiTemplate | null>(null)

  const getRingis = useRingiStore((s) => s.getRingis)
  const getPendingApprovals = useRingiStore((s) => s.getPendingApprovals)
  const hydrated = useRingiStore((s) => s._hydrated)
  const { currentUser } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 bg-bg-elevated rounded" />
        <div className="h-10 w-1/3 bg-bg-elevated rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-bg-elevated rounded-[16px]" />
          ))}
        </div>
      </div>
    )
  }

  const allRingis = getRingis()
  const pendingApprovals = currentUser ? getPendingApprovals(currentUser.id) : []
  const rejectedRingis = allRingis.filter(
    (r) => r.status === 'rejected' && r.created_by === currentUser?.id
  )
  const approvedRingis = allRingis.filter((r) => r.status === 'approved')
  const draftRingis = allRingis.filter(
    (r) => r.status === 'draft' && r.created_by === currentUser?.id
  )

  const formatAmount = (amount: number | null): string => {
    if (amount === null) return ''
    return `¥${amount.toLocaleString()}`
  }

  const handleTemplateSelect = (tmpl: RingiTemplate) => {
    setTemplateSelectOpen(false)
    setTemplateCreateData(tmpl)
    setCreateOpen(true)
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">稟議</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">稟議</h1>
        <p className="text-[13px] text-text-secondary mt-1">稟議の起案・承認プロセス管理</p>
      </motion.div>

      {/* 今日の処理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">今日の処理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {/* 承認待ち */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <Clock className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">承認待ち</p>
              <p className="text-[12px] text-text-secondary">未決裁の稟議を確認</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {pendingApprovals.length}
            </span>
          </div>

          {/* 差戻し対応 */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <RotateCcw className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">差戻し対応</p>
              <p className="text-[12px] text-text-secondary">修正が必要な稟議</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {rejectedRingis.length}
            </span>
          </div>

          {/* 新規起票 */}
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group text-left"
          >
            <Plus className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">新規起票</p>
              <p className="text-[12px] text-text-secondary">稟議書を作成する</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
          </button>

          {/* テンプレートから作成 */}
          <button
            onClick={() => setTemplateSelectOpen(true)}
            className="w-full flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group text-left"
          >
            <Copy className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">テンプレートから作成</p>
              <p className="text-[12px] text-text-secondary">登録済みテンプレートを使って起票</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
          </button>

          {/* 決裁済確認 */}
          <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-default group">
            <CheckCircle2 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-text-primary tracking-tight">決裁済確認</p>
              <p className="text-[12px] text-text-secondary">決裁完了の稟議を確認</p>
            </div>
            <span className="text-[12px] font-semibold text-accent tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
              {approvedRingis.length}
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* 承認待ち稟議（自分が承認者の場合） */}
      {pendingApprovals.length > 0 && (
        <motion.section
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            あなたの承認待ち
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {pendingApprovals.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Clock className="w-[18px] h-[18px] text-warning shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="processing"
                    label="承認待ち"
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 下書き（自分の） */}
      {draftRingis.length > 0 && (
        <motion.section
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
            あなたの下書き
          </h2>
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {draftRingis.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Edit3 className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="neutral"
                    label="下書き"
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 管理 */}
      <motion.section
        className="mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">管理</h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
          variants={fadeUp}
        >
          {/* 稟議一覧 scrolls to the list below */}
          <button
            onClick={() => {
              const el = document.getElementById('all-ringi-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <Search className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">稟議一覧</span>
              <span className="text-[12px] font-semibold text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                {allRingis.length}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
          <button
            onClick={() => setRouteModalOpen(true)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <GitBranch className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">承認ルート設定</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-5 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
              <FileText className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-semibold text-text-primary tracking-tight">テンプレート</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
            </div>
          </button>
        </motion.div>
      </motion.section>

      {/* すべての稟議 */}
      <motion.section
        id="all-ringi-section"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">すべての稟議</h2>
        {allRingis.length === 0 ? (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12"
            variants={fadeUp}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Stamp className="w-10 h-10 text-text-muted opacity-40 mb-4" strokeWidth={1.5} />
              <p className="text-[15px] font-semibold text-text-primary mb-1">稟議はまだありません</p>
              <p className="text-[13px] text-text-muted mb-4">新しい稟議を作成しましょう</p>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-all"
              >
                <Plus className="w-4 h-4" />
                新規稟議
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden divide-y divide-border"
            variants={fadeUp}
          >
            {allRingis.map((ringi) => (
              <Link key={ringi.id} href={`/ringi/${ringi.id}`}>
                <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer group">
                  <Stamp className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary tracking-tight">{ringi.title}</p>
                    {ringi.amount !== null && (
                      <p className="text-[12px] text-text-secondary" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatAmount(ringi.amount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={RINGI_STATUS_COLORS[ringi.status] as 'success' | 'warning' | 'danger' | 'info' | 'neutral'}
                    label={RINGI_STATUS_LABELS[ringi.status]}
                  />
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Modals */}
      <RingiCreateModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setTemplateCreateData(null)
        }}
        templateData={templateCreateData}
      />
      <ApprovalRouteModal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
      />
      <TemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
      />
      <TemplateSelectModal
        open={templateSelectOpen}
        onClose={() => setTemplateSelectOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </motion.div>
  )
}
