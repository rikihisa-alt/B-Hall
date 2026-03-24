import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Report, ReportType } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード報告 ──

const SEED_REPORTS: Report[] = [
  {
    id: 'report-1',
    type: 'daily',
    title: '営業支援ツール改修対応',
    content: '本日は営業支援ツールのバグ修正対応を行いました。\n\n【対応内容】\n- 検索フィルタの不具合修正\n- レスポンス速度の改善\n- ユーザーからの問い合わせ対応 3件\n\n【明日の予定】\n- 新機能の設計レビュー\n- テスト環境のセットアップ',
    author_id: 'user-1',
    department: '開発部',
    period_start: daysFromNow(0),
    period_end: daysFromNow(0),
    status: 'submitted',
    reviewer_id: 'user-5',
    is_anonymous: false,
    tags: ['開発', 'バグ修正'],
    created_at: daysFromNow(0),
    updated_at: daysFromNow(0),
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'report-2',
    type: 'daily',
    title: '採用面接・研修準備',
    content: '本日の業務内容を報告します。\n\n【実施内容】\n- 中途採用面接 2名実施\n- 新入社員研修資料の更新\n- 社会保険手続き 1件完了\n\n【特記事項】\n- 面接候補者1名は非常に有望。二次面接を推薦。',
    author_id: 'user-2',
    department: '人事部',
    period_start: daysFromNow(0),
    period_end: daysFromNow(0),
    status: 'submitted',
    reviewer_id: 'user-5',
    is_anonymous: false,
    tags: ['採用', '研修'],
    created_at: daysFromNow(0),
    updated_at: daysFromNow(0),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'report-3',
    type: 'weekly',
    title: '開発部 第11週 週報',
    content: '【今週の成果】\n- 新機能リリース: ダッシュボード改善\n- バグ修正: 12件解決\n- コードレビュー: 8件完了\n\n【課題・リスク】\n- テスト環境のディスク容量不足\n- デザインレビュー待ちが3件滞留\n\n【来週の計画】\n- API v2 の設計開始\n- パフォーマンス改善タスク着手',
    author_id: 'user-1',
    department: '開発部',
    period_start: daysFromNow(-7),
    period_end: daysFromNow(-1),
    status: 'submitted',
    reviewer_id: 'user-5',
    is_anonymous: false,
    tags: ['開発', '週報'],
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1),
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'report-4',
    type: 'monthly',
    title: '経理部 2月度 月次報告',
    content: '【月次サマリー】\n- 経費精算処理: 45件\n- 請求書発行: 12件\n- 入金確認: 8件\n\n【特記事項】\n- 月次決算は予定通り完了\n- 来月の法人税中間申告の準備開始',
    author_id: 'user-3',
    department: '経理部',
    period_start: daysFromNow(-30),
    period_end: daysFromNow(-1),
    status: 'draft',
    reviewer_id: 'user-5',
    is_anonymous: false,
    tags: ['経理', '月次'],
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'report-5',
    type: 'incident',
    title: 'サーバー障害発生報告',
    content: '【発生日時】本日 14:30\n【影響範囲】社内システム全般（約30分間）\n【原因】データベースサーバーのメモリ不足\n【対応内容】\n- 14:35 障害検知、調査開始\n- 14:50 原因特定、メモリ増設対応\n- 15:00 復旧確認\n\n【再発防止策】\n- メモリ監視アラートの閾値見直し\n- 定期的なリソース確認の実施',
    author_id: 'user-6',
    department: '総務部',
    period_start: daysFromNow(0),
    period_end: daysFromNow(0),
    status: 'submitted',
    reviewer_id: 'user-1',
    is_anonymous: false,
    tags: ['インシデント', 'サーバー', '障害'],
    created_at: daysFromNow(0),
    updated_at: daysFromNow(0),
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
  {
    id: 'report-6',
    type: 'improvement',
    title: '社内コミュニケーション改善報告',
    content: '【改善テーマ】部門間のコミュニケーション改善\n\n【実施内容】\n- 週次の部門横断ミーティングを導入（毎週水曜 15:00）\n- Slackチャンネルの整理・統合\n\n【効果測定】\n- 部門間の問い合わせレスポンスが平均2時間から30分に短縮\n- 社内アンケートで「情報共有が改善された」と回答した割合: 78%',
    author_id: 'user-4',
    department: '経営企画',
    period_start: daysFromNow(-30),
    period_end: daysFromNow(0),
    status: 'reviewed',
    reviewer_id: 'user-5',
    is_anonymous: false,
    tags: ['コミュニケーション', '改善'],
    created_at: daysFromNow(-3),
    updated_at: daysFromNow(-1),
    created_by: 'user-4',
    updated_by: 'user-5',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface ReportState {
  reports: Report[]
  _hydrated: boolean
}

interface ReportActions {
  addReport: (data: Partial<Report>) => Report
  updateReport: (id: string, data: Partial<Report>) => void
  deleteReport: (id: string) => void
  submitReport: (id: string) => void
  reviewReport: (id: string, reviewerId: string) => void
  getReports: () => Report[]
  getReportsByType: (type: ReportType) => Report[]
  getReportsByAuthor: (authorId: string) => Report[]
  setHydrated: () => void
}

type ReportStore = ReportState & ReportActions

// ── Store ──

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: SEED_REPORTS,
      _hydrated: false,

      addReport: (data: Partial<Report>) => {
        const now = today()
        const newReport: Report = {
          id: generateId(),
          type: data.type || 'daily',
          title: data.title || '',
          content: data.content || '',
          author_id: data.author_id || '',
          department: data.department || '',
          period_start: data.period_start || now,
          period_end: data.period_end || now,
          status: data.status || 'draft',
          reviewer_id: data.reviewer_id || '',
          is_anonymous: data.is_anonymous || false,
          tags: data.tags || [],
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ reports: [...state.reports, newReport] }))
        return newReport
      },

      updateReport: (id: string, data: Partial<Report>) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, ...data, updated_at: today() } : r
          ),
        }))
      },

      deleteReport: (id: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, deleted_at: today() } : r
          ),
        }))
      },

      submitReport: (id: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id && r.status === 'draft'
              ? { ...r, status: 'submitted' as const, updated_at: today() }
              : r
          ),
        }))
      },

      reviewReport: (id: string, reviewerId: string) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id && r.status === 'submitted'
              ? { ...r, status: 'reviewed' as const, reviewer_id: reviewerId, updated_at: today() }
              : r
          ),
        }))
      },

      getReports: () => {
        return get().reports.filter((r) => !r.deleted_at)
      },

      getReportsByType: (type: ReportType) => {
        return get().reports.filter((r) => !r.deleted_at && r.type === type)
      },

      getReportsByAuthor: (authorId: string) => {
        return get().reports.filter((r) => !r.deleted_at && r.author_id === authorId)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-reports',
      partialize: (state) => ({
        reports: state.reports,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
