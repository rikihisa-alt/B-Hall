import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Ringi, ApprovalStep } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'
import { useTaskStore } from '@/stores/task-store'

// ── シード稟議 ──

const now = today()

const SEED_RINGIS: Ringi[] = [
  {
    id: 'ringi-1',
    title: '新規開発ツール導入',
    background:
      '現在使用している開発環境のライセンスが年内に期限切れとなる。また、チーム規模の拡大に伴い、より効率的なコラボレーション機能を備えたツールへの移行が必要。',
    purpose:
      '開発チームの生産性向上とコラボレーション強化を目的とし、最新の開発ツールを導入する。',
    content:
      '開発ツール「DevPlatform Pro」の企業ライセンス（50ユーザー）を導入する。導入期間は3ヶ月、全開発メンバーへの研修を含む。',
    amount: 5000000,
    roi_estimate: '導入後6ヶ月で開発効率20%向上、年間約800万円のコスト削減見込み',
    risk: 'ツール移行に伴う一時的な生産性低下（約1ヶ月）、学習コスト',
    effect:
      '開発速度の向上、コードレビュー効率化、ナレッジ共有の促進、リモートワーク環境の改善',
    departments: ['開発部', '経理部'],
    status: 'approved',
    decision_date: daysFromNow(-7),
    approval_steps: [
      {
        id: 'step-1-1',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'approved',
        comment: '開発効率の改善は急務です。承認します。',
        decided_at: daysFromNow(-10),
        order: 1,
      },
      {
        id: 'step-1-2',
        approver_id: 'user-5',
        approver_name: '山田太郎',
        status: 'approved',
        comment: 'ROI妥当。実行タスクの進捗管理を徹底すること。',
        decided_at: daysFromNow(-7),
        order: 2,
      },
    ],
    related_contract_id: '',
    execution_task_id: 'task-ringi-1',
    attachments: [],
    created_at: daysFromNow(-14),
    updated_at: daysFromNow(-7),
    created_by: 'user-1',
    updated_by: 'user-5',
    deleted_at: null,
  },
  {
    id: 'ringi-2',
    title: 'オフィス移転計画',
    background:
      '現オフィスの賃貸契約が6ヶ月後に満了を迎える。従業員数の増加により手狭になっており、より広いスペースへの移転を検討。',
    purpose:
      '従業員の働きやすさ向上と将来の事業拡大に備え、より広く利便性の高いオフィスへ移転する。',
    content:
      '渋谷区のオフィスビル「○○タワー」10階（150坪）への移転。内装工事、家具・設備の購入、引越し費用を含む。',
    amount: 20000000,
    roi_estimate:
      '採用力強化による人材確保コスト削減、従業員満足度向上による離職率低下',
    risk: '移転期間中の業務効率低下、予算超過リスク、入居時期の遅延リスク',
    effect:
      'オフィス環境の改善、会議室不足の解消、来客対応品質の向上、企業イメージ向上',
    departments: ['総務部', '経営企画'],
    status: 'approving',
    decision_date: '',
    approval_steps: [
      {
        id: 'step-2-1',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'approved',
        comment: '移転の必要性は理解しています。コスト管理を徹底してください。',
        decided_at: daysFromNow(-3),
        order: 1,
      },
      {
        id: 'step-2-2',
        approver_id: 'user-5',
        approver_name: '山田太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 2,
      },
    ],
    related_contract_id: '',
    execution_task_id: '',
    attachments: [],
    created_at: daysFromNow(-5),
    updated_at: daysFromNow(-3),
    created_by: 'user-6',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'ringi-3',
    title: '採用広告出稿',
    background:
      '開発部門の人員不足が深刻化しており、エンジニア採用を強化する必要がある。現在の採用チャネルだけでは母集団形成が不十分。',
    purpose:
      '主要求人媒体への広告出稿により、エンジニア採用の母集団を拡大する。',
    content:
      '求人媒体3社への掲載（各社3ヶ月プラン）。掲載開始は来月1日を予定。',
    amount: 800000,
    roi_estimate: '3名のエンジニア採用により、エージェント費用約300万円の削減',
    risk: '応募者の質が期待を下回る可能性、掲載期間内に採用に至らないリスク',
    effect:
      '採用母集団の拡大、採用コストの最適化、採用リードタイムの短縮',
    departments: ['人事部'],
    status: 'draft',
    decision_date: '',
    approval_steps: [
      {
        id: 'step-3-1',
        approver_id: 'user-1',
        approver_name: '田中太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 1,
      },
      {
        id: 'step-3-2',
        approver_id: 'user-5',
        approver_name: '山田太郎',
        status: 'pending',
        comment: '',
        decided_at: '',
        order: 2,
      },
    ],
    related_contract_id: '',
    execution_task_id: '',
    attachments: [],
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface RingiState {
  ringis: Ringi[]
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
  setHydrated: () => void
}

type RingiStore = RingiState & RingiActions

// ── Store ──

export const useRingiStore = create<RingiStore>()(
  persist(
    (set, get) => ({
      ringis: SEED_RINGIS,
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

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-ringi',
      partialize: (state) => ({
        ringis: state.ringis,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
