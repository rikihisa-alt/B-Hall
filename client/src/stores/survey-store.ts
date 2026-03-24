import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import { today } from '@/lib/date'

// ── 型定義 ──

export interface SurveyQuestion {
  id: string
  text: string
  type: 'rating' | 'text' | 'choice'
  options?: string[]
  required: boolean
}

export interface Survey {
  id: string
  title: string
  description: string
  type: 'engagement' | 'satisfaction' | 'pulse' | 'custom'
  status: 'draft' | 'active' | 'closed'
  questions: SurveyQuestion[]
  target_departments: string[]
  anonymous: boolean
  start_date: string
  end_date: string
  response_count: number
  total_targets: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SurveyResponse {
  id: string
  survey_id: string
  employee_id: string
  answers: { question_id: string; value: string | number }[]
  submitted_at: string
}

export interface SurveyStats {
  total_responses: number
  response_rate: number
  question_averages: { question_id: string; question_text: string; average: number; count: number }[]
}

// ── シードデータ ──

const now = today()

const SEED_SURVEYS: Survey[] = [
  {
    id: 'survey-1',
    title: '2026年度 第1四半期 エンゲージメントサーベイ',
    description: '従業員のエンゲージメントと職場満足度を測定します。全従業員を対象とした匿名アンケートです。',
    type: 'engagement',
    status: 'active',
    questions: [
      { id: 'q-1-1', text: '現在の仕事にやりがいを感じていますか？', type: 'rating', required: true },
      { id: 'q-1-2', text: '上司とのコミュニケーションは円滑ですか？', type: 'rating', required: true },
      { id: 'q-1-3', text: 'チームワークに満足していますか？', type: 'rating', required: true },
      { id: 'q-1-4', text: 'キャリア成長の機会があると感じますか？', type: 'rating', required: true },
      { id: 'q-1-5', text: '会社のビジョンに共感できますか？', type: 'rating', required: true },
    ],
    target_departments: [],
    anonymous: true,
    start_date: '2026-03-01',
    end_date: '2026-03-31',
    response_count: 2,
    total_targets: 6,
    created_at: '2026-02-25T09:00:00.000Z',
    updated_at: now,
    deleted_at: null,
  },
  {
    id: 'survey-2',
    title: '2025年度 下半期 パルスサーベイ',
    description: '従業員の現在の気持ちと職場環境を短時間で調査します。',
    type: 'pulse',
    status: 'closed',
    questions: [
      { id: 'q-2-1', text: '今の仕事量は適切ですか？', type: 'rating', required: true },
      { id: 'q-2-2', text: '職場環境に満足していますか？', type: 'rating', required: true },
      { id: 'q-2-3', text: 'ワークライフバランスは取れていますか？', type: 'rating', required: true },
      { id: 'q-2-4', text: '改善してほしいことがあれば教えてください', type: 'text', required: false },
    ],
    target_departments: [],
    anonymous: true,
    start_date: '2025-12-01',
    end_date: '2025-12-20',
    response_count: 6,
    total_targets: 6,
    created_at: '2025-11-25T09:00:00.000Z',
    updated_at: '2025-12-21T00:00:00.000Z',
    deleted_at: null,
  },
  {
    id: 'survey-3',
    title: '新入社員 満足度調査',
    description: '入社後3ヶ月の新入社員を対象とした満足度調査です。',
    type: 'satisfaction',
    status: 'draft',
    questions: [
      { id: 'q-3-1', text: 'オンボーディングの内容は役に立ちましたか？', type: 'rating', required: true },
      { id: 'q-3-2', text: 'メンター制度に満足していますか？', type: 'rating', required: true },
      { id: 'q-3-3', text: '入社前の期待と実際のギャップはありますか？', type: 'choice', options: ['ギャップなし', '少しある', 'かなりある'], required: true },
      { id: 'q-3-4', text: '入社して良かったと思いますか？', type: 'rating', required: true },
      { id: 'q-3-5', text: '自由コメント', type: 'text', required: false },
    ],
    target_departments: [],
    anonymous: false,
    start_date: '2026-04-15',
    end_date: '2026-04-30',
    response_count: 0,
    total_targets: 2,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  },
]

const SEED_RESPONSES: SurveyResponse[] = [
  // survey-1 (active) の回答 - 2件
  { id: 'resp-1-1', survey_id: 'survey-1', employee_id: 'emp-1', answers: [{ question_id: 'q-1-1', value: 4 }, { question_id: 'q-1-2', value: 5 }, { question_id: 'q-1-3', value: 4 }, { question_id: 'q-1-4', value: 3 }, { question_id: 'q-1-5', value: 4 }], submitted_at: '2026-03-05T10:30:00.000Z' },
  { id: 'resp-1-2', survey_id: 'survey-1', employee_id: 'emp-3', answers: [{ question_id: 'q-1-1', value: 3 }, { question_id: 'q-1-2', value: 4 }, { question_id: 'q-1-3', value: 5 }, { question_id: 'q-1-4', value: 4 }, { question_id: 'q-1-5', value: 5 }], submitted_at: '2026-03-08T14:00:00.000Z' },
  // survey-2 (closed) の回答 - 6件
  { id: 'resp-2-1', survey_id: 'survey-2', employee_id: 'emp-1', answers: [{ question_id: 'q-2-1', value: 4 }, { question_id: 'q-2-2', value: 3 }, { question_id: 'q-2-3', value: 3 }, { question_id: 'q-2-4', value: '特になし' }], submitted_at: '2025-12-03T09:00:00.000Z' },
  { id: 'resp-2-2', survey_id: 'survey-2', employee_id: 'emp-2', answers: [{ question_id: 'q-2-1', value: 3 }, { question_id: 'q-2-2', value: 4 }, { question_id: 'q-2-3', value: 4 }, { question_id: 'q-2-4', value: 'リモートワークの頻度を増やしてほしい' }], submitted_at: '2025-12-05T11:00:00.000Z' },
  { id: 'resp-2-3', survey_id: 'survey-2', employee_id: 'emp-3', answers: [{ question_id: 'q-2-1', value: 2 }, { question_id: 'q-2-2', value: 3 }, { question_id: 'q-2-3', value: 2 }, { question_id: 'q-2-4', value: '業務量が多すぎる' }], submitted_at: '2025-12-06T15:00:00.000Z' },
  { id: 'resp-2-4', survey_id: 'survey-2', employee_id: 'emp-4', answers: [{ question_id: 'q-2-1', value: 4 }, { question_id: 'q-2-2', value: 5 }, { question_id: 'q-2-3', value: 4 }, { question_id: 'q-2-4', value: '' }], submitted_at: '2025-12-08T10:00:00.000Z' },
  { id: 'resp-2-5', survey_id: 'survey-2', employee_id: 'emp-5', answers: [{ question_id: 'q-2-1', value: 5 }, { question_id: 'q-2-2', value: 4 }, { question_id: 'q-2-3', value: 5 }, { question_id: 'q-2-4', value: '' }], submitted_at: '2025-12-10T09:30:00.000Z' },
  { id: 'resp-2-6', survey_id: 'survey-2', employee_id: 'emp-6', answers: [{ question_id: 'q-2-1', value: 3 }, { question_id: 'q-2-2', value: 4 }, { question_id: 'q-2-3', value: 3 }, { question_id: 'q-2-4', value: '会議時間を短縮してほしい' }], submitted_at: '2025-12-12T16:00:00.000Z' },
  // survey-2 追加回答 (8-10 responses total)
  { id: 'resp-2-7', survey_id: 'survey-2', employee_id: 'emp-7', answers: [{ question_id: 'q-2-1', value: 4 }, { question_id: 'q-2-2', value: 4 }, { question_id: 'q-2-3', value: 3 }, { question_id: 'q-2-4', value: '' }], submitted_at: '2025-12-14T11:00:00.000Z' },
  { id: 'resp-2-8', survey_id: 'survey-2', employee_id: 'emp-8', answers: [{ question_id: 'q-2-1', value: 3 }, { question_id: 'q-2-2', value: 3 }, { question_id: 'q-2-3', value: 4 }, { question_id: 'q-2-4', value: '福利厚生を充実させてほしい' }], submitted_at: '2025-12-15T13:00:00.000Z' },
]

// ── Store ──

interface SurveyState {
  surveys: Survey[]
  responses: SurveyResponse[]
  _hydrated: boolean
}

interface SurveyActions {
  createSurvey: (data: Omit<Survey, 'id' | 'response_count' | 'created_at' | 'updated_at' | 'deleted_at'>) => Survey
  updateSurvey: (id: string, updates: Partial<Survey>) => void
  deleteSurvey: (id: string) => void
  submitResponse: (surveyId: string, employeeId: string, answers: { question_id: string; value: string | number }[]) => SurveyResponse
  getSurveys: () => Survey[]
  getResponses: (surveyId: string) => SurveyResponse[]
  getSurveyStats: (surveyId: string) => SurveyStats
  setHydrated: () => void
}

type SurveyStore = SurveyState & SurveyActions

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set, get) => ({
      surveys: SEED_SURVEYS,
      responses: SEED_RESPONSES,
      _hydrated: false,

      createSurvey: (data) => {
        const now = today()
        const newSurvey: Survey = {
          ...data,
          id: generateId(),
          response_count: 0,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        }
        set((state) => ({ surveys: [...state.surveys, newSurvey] }))
        return newSurvey
      },

      updateSurvey: (id, updates) => {
        set((state) => ({
          surveys: state.surveys.map((s) =>
            s.id === id ? { ...s, ...updates, updated_at: today() } : s
          ),
        }))
      },

      deleteSurvey: (id) => {
        set((state) => ({
          surveys: state.surveys.map((s) =>
            s.id === id ? { ...s, deleted_at: today() } : s
          ),
        }))
      },

      submitResponse: (surveyId, employeeId, answers) => {
        const newResponse: SurveyResponse = {
          id: generateId(),
          survey_id: surveyId,
          employee_id: employeeId,
          answers,
          submitted_at: today(),
        }
        set((state) => ({
          responses: [...state.responses, newResponse],
          surveys: state.surveys.map((s) =>
            s.id === surveyId ? { ...s, response_count: s.response_count + 1, updated_at: today() } : s
          ),
        }))
        return newResponse
      },

      getSurveys: () => {
        return get().surveys.filter((s) => !s.deleted_at)
      },

      getResponses: (surveyId) => {
        return get().responses.filter((r) => r.survey_id === surveyId)
      },

      getSurveyStats: (surveyId) => {
        const survey = get().surveys.find((s) => s.id === surveyId)
        const responses = get().responses.filter((r) => r.survey_id === surveyId)

        if (!survey) {
          return { total_responses: 0, response_rate: 0, question_averages: [] }
        }

        const ratingQuestions = survey.questions.filter((q) => q.type === 'rating')
        const questionAverages = ratingQuestions.map((q) => {
          const answers = responses
            .map((r) => r.answers.find((a) => a.question_id === q.id))
            .filter((a): a is NonNullable<typeof a> => a !== undefined && typeof a.value === 'number')

          const sum = answers.reduce((acc, a) => acc + (a.value as number), 0)
          const avg = answers.length > 0 ? sum / answers.length : 0

          return {
            question_id: q.id,
            question_text: q.text,
            average: Math.round(avg * 10) / 10,
            count: answers.length,
          }
        })

        return {
          total_responses: responses.length,
          response_rate: survey.total_targets > 0 ? Math.round((responses.length / survey.total_targets) * 100) : 0,
          question_averages: questionAverages,
        }
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-surveys',
      partialize: (state) => ({
        surveys: state.surveys,
        responses: state.responses,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
