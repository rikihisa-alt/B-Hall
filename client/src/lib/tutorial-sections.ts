import type { LucideIcon } from 'lucide-react'

// ── Tutorial Step Definition ──

export interface TutorialStep {
  title: string
  description: string
  targetSelector?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
  route?: string
}

export interface TutorialSection {
  key: string
  title: string
  description: string
  iconName: string
  estimatedMinutes: number
  steps: TutorialStep[]
}

// ── Section Definitions ──

export const TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    key: 'dashboard',
    title: 'ダッシュボード',
    description: '会社の全体状況を一目で把握',
    iconName: 'Home',
    estimatedMinutes: 1,
    steps: [
      {
        title: 'ダッシュボードへようこそ',
        description:
          'ここがB-Hallのダッシュボードです。会社の売上・タスク・従業員数などの全体状況が一目でわかります。',
        route: '/',
        targetSelector: '[data-tutorial="dashboard-metrics"]',
        position: 'bottom',
      },
      {
        title: 'ナビゲーション',
        description:
          '上部のアイコンから各機能にアクセスできます。アイコンをドラッグして並び替えも可能です。',
        targetSelector: 'header',
        position: 'bottom',
      },
      {
        title: '通知とアカウント',
        description:
          '右上のベルアイコンで通知を、歯車アイコンで設定を確認できます。',
        targetSelector: '[data-tutorial="header-right"]',
        position: 'bottom',
      },
    ],
  },
  {
    key: 'tasks',
    title: 'タスクを作ってみよう',
    description: 'デモタスクで操作を体験',
    iconName: 'CheckSquare',
    estimatedMinutes: 2,
    steps: [
      {
        title: 'タスク管理画面',
        description:
          'ここで全ての業務タスクを管理します。一覧表示・ボード表示・期限ビューを切り替えられます。',
        route: '/tasks',
      },
      {
        title: 'デモタスクを作成',
        description:
          'デモ用のタスクを3件作成しました。「月次経費精算の締め」「新入社員のPC発注」「セキュリティ研修資料作成」が追加されています。',
        action: () => {
          const { seedDemoTasks } = require('@/lib/tutorial-demo-data')
          seedDemoTasks()
        },
        targetSelector: '[data-tutorial="task-list"]',
        position: 'top',
      },
      {
        title: 'タスクの操作',
        description:
          'タスクをクリックすると詳細を確認・編集できます。ステータスの変更や優先度の設定も可能です。',
        targetSelector: '[data-tutorial="task-list"]',
        position: 'top',
      },
      {
        title: '表示の切替',
        description:
          'ビュー切替タブで、リスト表示・ボード表示・期限ビューに切り替えてみましょう。',
        targetSelector: '[data-tutorial="task-views"]',
        position: 'bottom',
      },
    ],
  },
  {
    key: 'applications',
    title: '申請を出してみよう',
    description: 'デモ申請で承認フローを体験',
    iconName: 'FileText',
    estimatedMinutes: 1,
    steps: [
      {
        title: '申請・承認画面',
        description:
          '経費申請・休暇申請・出張申請など、各種申請をここで管理します。',
        route: '/applications',
      },
      {
        title: 'デモ申請を作成',
        description:
          'デモ用の申請を2件作成しました。「交通費精算（¥15,000）」と「有給休暇申請」が追加されています。',
        action: () => {
          const { seedDemoApplications } = require('@/lib/tutorial-demo-data')
          seedDemoApplications()
        },
        targetSelector: '[data-tutorial="application-list"]',
        position: 'top',
      },
      {
        title: '承認フロー',
        description:
          '申請をクリックすると、承認ステータスや承認者の確認ができます。差戻し・再申請にも対応しています。',
      },
    ],
  },
  {
    key: 'accounting',
    title: '経理を確認しよう',
    description: 'デモ取引で収支管理を体験',
    iconName: 'Calculator',
    estimatedMinutes: 1,
    steps: [
      {
        title: '経理・財務画面',
        description:
          '収入・支出の取引管理、請求書、支払管理、キャッシュフローを一元管理できます。',
        route: '/accounting',
      },
      {
        title: 'デモ取引データを登録',
        description:
          'デモ取引を5件登録しました。売上3件（¥500,000〜¥1,200,000）と支出2件（¥45,000〜¥180,000）が追加されています。',
        action: () => {
          const { seedDemoTransactions } = require('@/lib/tutorial-demo-data')
          seedDemoTransactions()
        },
        targetSelector: '[data-tutorial="accounting-metrics"]',
        position: 'bottom',
      },
      {
        title: '収支の確認',
        description:
          'メトリクスカードで収入合計・支出合計・純利益を確認できます。取引タブで詳細を管理しましょう。',
        targetSelector: '[data-tutorial="accounting-metrics"]',
        position: 'bottom',
      },
    ],
  },
  {
    key: 'assistant',
    title: 'AIアシスタントに話しかけよう',
    description: 'ジジロボと会話してみよう',
    iconName: 'Bot',
    estimatedMinutes: 1,
    steps: [
      {
        title: 'ジジロボ',
        description:
          'ジジロボはB-Hallの情報をもとに回答するAIアシスタントです。業務の質問から日常会話まで対応します。',
        route: '/assistant',
      },
      {
        title: 'チュートリアル完了！',
        description:
          'おめでとうございます！B-Hallの基本操作をマスターしました。さっそく業務を始めましょう。いつでも「チュートリアル」ページから再確認できます。',
      },
    ],
  },
]
