import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Ringi, ApprovalStep, ApprovalRoute, RingiTemplate } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'
import { useTaskStore } from '@/stores/task-store'

// ── シード稟議 ──

const now = today()

const SEED_RINGIS: Ringi[] = []

// ── シード承認ルート ──

const SEED_APPROVAL_ROUTES: ApprovalRoute[] = [
  {
    id: 'route-1',
    name: '標準承認ルート',
    description: '部門長 → 経営者の2段階承認。一般的な稟議に使用。',
    steps: [
      { order: 1, role: '部門長', approver_name: '田中太郎' },
      { order: 2, role: '経営者', approver_name: '山田太郎' },
    ],
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-30),
  },
  {
    id: 'route-2',
    name: '高額稟議ルート',
    description: '部門長 → 経理部長 → 経営者の3段階承認。500万円以上の案件に使用。',
    steps: [
      { order: 1, role: '部門長', approver_name: '田中太郎' },
      { order: 2, role: '経理部長', approver_name: '佐藤花子' },
      { order: 3, role: '経営者', approver_name: '山田太郎' },
    ],
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-30),
  },
  {
    id: 'route-3',
    name: '簡易承認ルート',
    description: '経営者の1段階承認。少額・緊急案件に使用。',
    steps: [
      { order: 1, role: '経営者', approver_name: '山田太郎' },
    ],
    created_at: daysFromNow(-20),
    updated_at: daysFromNow(-20),
  },
]

// ── シード稟議テンプレート ──

const SEED_RINGI_TEMPLATES: RingiTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'ツール・ソフトウェア導入',
    description: '新規ツールやソフトウェアの導入稟議用テンプレート',
    fields: {
      title: '【ツール導入】',
      background: '業務効率化のため、新規ツールの導入を検討。現行ツールの課題と改善の必要性を記載。',
      purpose: '業務効率の向上と生産性改善を目的とする。',
      content: '対象ツール名、ライセンス数、導入スケジュール、研修計画を記載。',
      amount: null,
      departments: ['開発部', '経理部'],
    },
    approval_route_id: 'route-1',
    created_at: daysFromNow(-25),
    updated_at: daysFromNow(-25),
  },
  {
    id: 'tmpl-2',
    name: '設備投資・オフィス関連',
    description: 'オフィス移転、内装工事、大型設備購入などの高額稟議テンプレート',
    fields: {
      title: '【設備投資】',
      background: '事業拡大・環境改善のため、設備投資が必要な背景を記載。',
      purpose: '従業員の生産性向上と事業拡大に備える。',
      content: '投資対象、見積金額、施工・導入スケジュール、期待効果を記載。',
      amount: null,
      departments: ['総務部', '経営企画'],
    },
    approval_route_id: 'route-2',
    created_at: daysFromNow(-25),
    updated_at: daysFromNow(-25),
  },
  {
    id: 'tmpl-3',
    name: '採用関連費用',
    description: '採用広告、エージェント費用、採用イベント等の稟議テンプレート',
    fields: {
      title: '【採用費用】',
      background: '人員不足の解消のため、採用活動の強化が必要。',
      purpose: '必要な人材の確保と採用コストの最適化。',
      content: '利用する採用チャネル、掲載期間、予算内訳を記載。',
      amount: null,
      departments: ['人事部'],
    },
    approval_route_id: 'route-1',
    created_at: daysFromNow(-20),
    updated_at: daysFromNow(-20),
  },
]

// ── Store 型定義 ──

interface RingiState {
  ringis: Ringi[]
  approvalRoutes: ApprovalRoute[]
  ringiTemplates: RingiTemplate[]
  _hydrated: boolean
}

interface RingiActions {
  createRingi: (data: Partial<Ringi>) => Ringi
  submitRingi: (id: string) => void
  approveRingi: (ringiId: string, stepId: string, comment?: string) => void
  rejectRingi: (ringiId: string, stepId: string, comment: string) => void
  getRingis: () => Ringi[]
  getRingi: (id: string) => Ringi | undefined
  getPendingApprovals: (userId: string) => Ringi[]
  // Approval Route CRUD
  addApprovalRoute: (data: Omit<ApprovalRoute, 'id' | 'created_at' | 'updated_at'>) => ApprovalRoute
  updateApprovalRoute: (id: string, data: Partial<Omit<ApprovalRoute, 'id' | 'created_at'>>) => void
  deleteApprovalRoute: (id: string) => void
  // Template CRUD
  addTemplate: (data: Omit<RingiTemplate, 'id' | 'created_at' | 'updated_at'>) => RingiTemplate
  updateTemplate: (id: string, data: Partial<Omit<RingiTemplate, 'id' | 'created_at'>>) => void
  deleteTemplate: (id: string) => void
  setHydrated: () => void
}

type RingiStore = RingiState & RingiActions

// ── Store ──

export const useRingiStore = create<RingiStore>()(
  persist(
    (set, get) => ({
      ringis: SEED_RINGIS,
      approvalRoutes: SEED_APPROVAL_ROUTES,
      ringiTemplates: SEED_RINGI_TEMPLATES,
      _hydrated: false,

      createRingi: (data: Partial<Ringi>) => {
        const now = today()
        const newRingi: Ringi = {
          id: generateId(),
          title: data.title || '',
          background: data.background || '',
          purpose: data.purpose || '',
          content: data.content || '',
          amount: data.amount ?? null,
          roi_estimate: data.roi_estimate || '',
          risk: data.risk || '',
          effect: data.effect || '',
          departments: data.departments || [],
          status: data.status || 'draft',
          decision_date: '',
          approval_steps: data.approval_steps || [],
          related_contract_id: '',
          execution_task_id: '',
          attachments: data.attachments || [],
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ ringis: [...state.ringis, newRingi] }))
        return newRingi
      },

      submitRingi: (id: string) => {
        set((state) => ({
          ringis: state.ringis.map((r) =>
            r.id === id && r.status === 'draft'
              ? { ...r, status: 'submitted' as const, updated_at: today() }
              : r
          ),
        }))
      },

      approveRingi: (ringiId: string, stepId: string, comment?: string) => {
        const now = today()
        set((state) => {
          const ringis = state.ringis.map((r) => {
            if (r.id !== ringiId) return r

            const updatedSteps = r.approval_steps.map((step) =>
              step.id === stepId
                ? {
                    ...step,
                    status: 'approved' as const,
                    comment: comment || '',
                    decided_at: now,
                  }
                : step
            )

            const allApproved = updatedSteps.every(
              (step) => step.status === 'approved'
            )

            const updated: Ringi = {
              ...r,
              approval_steps: updatedSteps,
              status: allApproved ? 'approved' : 'approving',
              decision_date: allApproved ? now : r.decision_date,
              updated_at: now,
            }

            // 全承認完了時にタスクを自動生成
            if (allApproved) {
              const taskStore = useTaskStore.getState()
              const executionTask = taskStore.addTask({
                title: `稟議実行: ${r.title}`,
                description: `決裁済み稟議「${r.title}」の実行タスクです。\n金額: ¥${r.amount?.toLocaleString() || '未設定'}`,
                category: '経営',
                sub_category: '稟議実行',
                department: r.departments[0] || '',
                assignee_id: r.created_by,
                reviewer_id: '',
                approver_id: '',
                due_date: daysFromNow(30),
                priority: 'high',
                status: 'todo',
                source_event: '稟議承認',
                related_ringi_id: r.id,
                created_by: 'system',
                updated_by: 'system',
              })
              updated.execution_task_id = executionTask.id
            }

            return updated
          })

          return { ringis }
        })
      },

      rejectRingi: (ringiId: string, stepId: string, comment: string) => {
        const now = today()
        set((state) => ({
          ringis: state.ringis.map((r) =>
            r.id === ringiId
              ? {
                  ...r,
                  status: 'rejected' as const,
                  approval_steps: r.approval_steps.map((step) =>
                    step.id === stepId
                      ? {
                          ...step,
                          status: 'rejected' as const,
                          comment,
                          decided_at: now,
                        }
                      : step
                  ),
                  updated_at: now,
                }
              : r
          ),
        }))
      },

      getRingis: () => {
        return get().ringis.filter((r) => !r.deleted_at)
      },

      getRingi: (id: string) => {
        return get().ringis.find((r) => r.id === id && !r.deleted_at)
      },

      getPendingApprovals: (userId: string) => {
        return get().ringis.filter(
          (r) =>
            !r.deleted_at &&
            (r.status === 'submitted' || r.status === 'approving') &&
            r.approval_steps.some(
              (step) =>
                step.approver_id === userId &&
                step.status === 'pending' &&
                // 前のステップがすべて承認済みであること
                r.approval_steps
                  .filter((s) => s.order < step.order)
                  .every((s) => s.status === 'approved')
            )
        )
      },

      // ── Approval Route CRUD ──

      addApprovalRoute: (data) => {
        const now = today()
        const route: ApprovalRoute = {
          id: generateId(),
          name: data.name,
          description: data.description,
          steps: data.steps,
          created_at: now,
          updated_at: now,
        }
        set((state) => ({ approvalRoutes: [...state.approvalRoutes, route] }))
        return route
      },

      updateApprovalRoute: (id, data) => {
        set((state) => ({
          approvalRoutes: state.approvalRoutes.map((r) =>
            r.id === id ? { ...r, ...data, updated_at: today() } : r
          ),
        }))
      },

      deleteApprovalRoute: (id) => {
        set((state) => ({
          approvalRoutes: state.approvalRoutes.filter((r) => r.id !== id),
        }))
      },

      // ── Template CRUD ──

      addTemplate: (data) => {
        const now = today()
        const tmpl: RingiTemplate = {
          id: generateId(),
          name: data.name,
          description: data.description,
          fields: data.fields,
          approval_route_id: data.approval_route_id,
          created_at: now,
          updated_at: now,
        }
        set((state) => ({ ringiTemplates: [...state.ringiTemplates, tmpl] }))
        return tmpl
      },

      updateTemplate: (id, data) => {
        set((state) => ({
          ringiTemplates: state.ringiTemplates.map((t) =>
            t.id === id ? { ...t, ...data, updated_at: today() } : t
          ),
        }))
      },

      deleteTemplate: (id) => {
        set((state) => ({
          ringiTemplates: state.ringiTemplates.filter((t) => t.id !== id),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-ringi',
      partialize: (state) => ({
        ringis: state.ringis,
        approvalRoutes: state.approvalRoutes,
        ringiTemplates: state.ringiTemplates,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
