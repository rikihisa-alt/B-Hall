import type {
  Task,
  Application,
  Ringi,
  Employee,
  Transaction,
  Invoice,
  Payment,
  Notification,
  Document,
  Report,
  Improvement,
  KnowledgeArticle,
  EquipmentItem,
  FacilityBooking,
} from '@/types'

// ── Store Data Snapshot ──

export interface StoreData {
  tasks: Task[]
  applications: Application[]
  ringis: Ringi[]
  employees: Employee[]
  transactions: Transaction[]
  invoices: Invoice[]
  payments: Payment[]
  notifications: Notification[]
  documents: Document[]
  reports: Report[]
  improvements: Improvement[]
  articles: KnowledgeArticle[]
  equipment: EquipmentItem[]
  facilityBookings: FacilityBooking[]
}

// ── Helpers ──

function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

function active<T extends { deleted_at: string | null }>(items: T[]): T[] {
  return items.filter((i) => !i.deleted_at)
}

// ── Intent Detection ──

type Intent =
  | 'task'
  | 'application'
  | 'ringi'
  | 'employee'
  | 'accounting'
  | 'document'
  | 'report'
  | 'improvement'
  | 'knowledge'
  | 'general_affairs'
  | 'notification'
  | 'greeting'
  | 'dashboard'
  | 'unknown'

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  task: ['タスク', '仕事', 'やること', '未完了', '進捗', '期限', '今日のタスク', '業務'],
  application: ['申請', '承認', 'ワークフロー', '承認待ち', '経費申請', '休暇申請'],
  ringi: ['稟議', '決裁', '起案'],
  employee: ['従業員', '社員', '入社', '退社', '人事', '人員', 'メンバー', 'スタッフ'],
  accounting: ['経費', '請求', '支払', '売上', '経理', 'お金', '残高', '収支', '取引', '入金', '出金', '予算', '財務', '費用'],
  document: ['文書', '契約', '書類', 'ドキュメント', '規程', 'マニュアル'],
  report: ['日報', '報告', 'レポート', '週報', '月報', 'インシデント'],
  improvement: ['改善', '提案', '目安箱'],
  knowledge: ['ナレッジ', 'マニュアル', '手順', 'FAQ', 'テンプレート', 'ガイド'],
  general_affairs: ['備品', '施設', '予約', '総務', '会議室', '設備'],
  notification: ['通知', '未読', 'お知らせ'],
  greeting: ['こんにちは', 'おはよう', 'ありがとう', 'ヘルプ', '使い方', 'はじめまして', 'よろしく', 'おつかれ', 'こんばんは'],
  dashboard: ['概要', 'ダッシュボード', '全体', '状況', 'サマリー', '一覧', 'まとめ'],
  unknown: [],
}

function detectIntent(message: string): Intent {
  const msg = message.toLowerCase()

  // Check each intent's keywords (order matters - more specific first)
  const intentOrder: Intent[] = [
    'greeting',
    'dashboard',
    'ringi',
    'application',
    'task',
    'accounting',
    'employee',
    'document',
    'report',
    'improvement',
    'knowledge',
    'general_affairs',
    'notification',
  ]

  for (const intent of intentOrder) {
    const keywords = INTENT_KEYWORDS[intent]
    if (keywords.some((kw) => msg.includes(kw))) {
      return intent
    }
  }

  return 'unknown'
}

// ── Response Generators ──

function taskResponse(stores: StoreData): string {
  const tasks = active(stores.tasks)
  const todo = tasks.filter((t) => t.status === 'todo')
  const inProgress = tasks.filter((t) => t.status === 'in_progress')
  const reviewing = tasks.filter((t) => t.status === 'reviewing')
  const approving = tasks.filter((t) => t.status === 'approving')
  const done = tasks.filter((t) => t.status === 'done')

  const now = new Date()
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.status === 'done' || t.status === 'cancelled') return false
    return new Date(t.due_date) < now
  })

  const urgent = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done' && t.status !== 'cancelled')

  let response = `現在のタスク状況をお伝えします。\n\n`
  response += `全タスク数: ${tasks.length}件\n`
  response += `- 未着手: ${todo.length}件\n`
  response += `- 進行中: ${inProgress.length}件\n`
  response += `- 確認待ち: ${reviewing.length}件\n`
  response += `- 承認待ち: ${approving.length}件\n`
  response += `- 完了: ${done.length}件\n`

  if (overdue.length > 0) {
    response += `\n期限超過のタスクが${overdue.length}件あります:\n`
    overdue.slice(0, 3).forEach((t) => {
      response += `- 「${t.title}」（${t.category}）\n`
    })
  }

  if (urgent.length > 0) {
    response += `\n緊急タスク:\n`
    urgent.forEach((t) => {
      response += `- 「${t.title}」\n`
    })
  }

  if (todo.length > 0) {
    response += `\n直近で着手すべきタスク:\n`
    todo.slice(0, 3).forEach((t) => {
      const dueStr = t.due_date ? `期限: ${new Date(t.due_date).toLocaleDateString('ja-JP')}` : '期限なし'
      response += `- 「${t.title}」（${dueStr}）\n`
    })
  }

  return response
}

function applicationResponse(stores: StoreData): string {
  const apps = active(stores.applications)
  const pending = apps.filter((a) => a.status === 'approving' || a.status === 'submitted')
  const approved = apps.filter((a) => a.status === 'approved')
  const rejected = apps.filter((a) => a.status === 'rejected')
  const draft = apps.filter((a) => a.status === 'draft')

  let response = `申請・承認の状況をお知らせします。\n\n`
  response += `全申請数: ${apps.length}件\n`
  response += `- 承認待ち: ${pending.length}件\n`
  response += `- 承認済み: ${approved.length}件\n`
  response += `- 差戻し: ${rejected.length}件\n`
  response += `- 下書き: ${draft.length}件\n`

  if (pending.length > 0) {
    response += `\n承認待ちの申請:\n`
    pending.forEach((a) => {
      const amountStr = a.amount ? ` (${formatYen(a.amount)})` : ''
      response += `- 「${a.title}」${amountStr} - ${a.type_label}\n`
    })
  }

  return response
}

function ringiResponse(stores: StoreData): string {
  const ringis = active(stores.ringis)
  const approving = ringis.filter((r) => r.status === 'approving' || r.status === 'submitted')
  const approved = ringis.filter((r) => r.status === 'approved')
  const draft = ringis.filter((r) => r.status === 'draft')

  const totalAmount = ringis
    .filter((r) => r.amount !== null)
    .reduce((sum, r) => sum + (r.amount || 0), 0)

  const pendingAmount = approving
    .filter((r) => r.amount !== null)
    .reduce((sum, r) => sum + (r.amount || 0), 0)

  let response = `稟議の状況をお知らせします。\n\n`
  response += `全稟議数: ${ringis.length}件（総額: ${formatYen(totalAmount)}）\n`
  response += `- 承認待ち: ${approving.length}件（${formatYen(pendingAmount)}）\n`
  response += `- 承認済み: ${approved.length}件\n`
  response += `- 下書き: ${draft.length}件\n`

  if (approving.length > 0) {
    response += `\n承認待ちの稟議:\n`
    approving.forEach((r) => {
      response += `- 「${r.title}」（${formatYen(r.amount || 0)}）\n`
    })
  }

  return response
}

function employeeResponse(stores: StoreData): string {
  const employees = active(stores.employees)
  const activeEmps = employees.filter((e) => e.status === 'active')
  const onLeave = employees.filter((e) => e.status === 'on_leave')

  const departments = new Map<string, number>()
  activeEmps.forEach((e) => {
    departments.set(e.department, (departments.get(e.department) || 0) + 1)
  })

  const fullTime = activeEmps.filter((e) => e.employment_type === 'full_time')
  const contract = activeEmps.filter((e) => e.employment_type === 'contract')

  let response = `従業員情報をお知らせします。\n\n`
  response += `在籍社員数: ${activeEmps.length}名\n`
  response += `- 正社員: ${fullTime.length}名\n`
  response += `- 契約社員: ${contract.length}名\n`
  if (onLeave.length > 0) {
    response += `- 休職中: ${onLeave.length}名\n`
  }

  response += `\n部署別人数:\n`
  departments.forEach((count, dept) => {
    response += `- ${dept}: ${count}名\n`
  })

  return response
}

function accountingResponse(stores: StoreData): string {
  const txns = active(stores.transactions)
  const now = new Date()
  const thisMonth = txns.filter((t) => {
    const d = new Date(t.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  const income = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const invoices = active(stores.invoices)
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue')
  const pendingPayments = active(stores.payments).filter((p) => p.status === 'pending')
  const pendingPaymentTotal = pendingPayments.reduce((s, p) => s + p.amount, 0)

  let response = `経理・財務の状況をお知らせします。\n\n`
  response += `【今月の収支】\n`
  response += `- 収入: ${formatYen(income)}\n`
  response += `- 支出: ${formatYen(expense)}\n`
  response += `- 差引: ${formatYen(income - expense)}\n`

  response += `\n【請求書】\n`
  response += `- 全請求書: ${invoices.length}件\n`
  if (overdueInvoices.length > 0) {
    const overdueTotal = overdueInvoices.reduce((s, i) => s + i.total_amount, 0)
    response += `- 未回収（期限超過）: ${overdueInvoices.length}件（${formatYen(overdueTotal)}）\n`
  }

  if (pendingPayments.length > 0) {
    response += `\n【支払予定】\n`
    response += `- 未処理支払: ${pendingPayments.length}件（${formatYen(pendingPaymentTotal)}）\n`
  }

  return response
}

function documentResponse(stores: StoreData): string {
  const docs = active(stores.documents)
  const now = new Date()

  const categories = new Map<string, number>()
  docs.forEach((d) => {
    const label = categoryLabel(d.category)
    categories.set(label, (categories.get(label) || 0) + 1)
  })

  const expiringSoon = docs.filter((d) => {
    if (!d.expiry_date) return false
    const expiry = new Date(d.expiry_date)
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 90
  })

  let response = `文書管理の状況をお知らせします。\n\n`
  response += `全文書数: ${docs.length}件\n\n`
  response += `カテゴリ別:\n`
  categories.forEach((count, cat) => {
    response += `- ${cat}: ${count}件\n`
  })

  if (expiringSoon.length > 0) {
    response += `\n有効期限が90日以内の文書:\n`
    expiringSoon.forEach((d) => {
      const expiry = new Date(d.expiry_date!).toLocaleDateString('ja-JP')
      response += `- 「${d.title}」（期限: ${expiry}）\n`
    })
  }

  return response
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    contract: '契約書',
    nda: 'NDA',
    regulation: '規程',
    manual: 'マニュアル',
    form: '帳票',
    certificate: '証明書',
    report: '報告書',
    other: 'その他',
  }
  return map[cat] || cat
}

function reportResponse(stores: StoreData): string {
  const reports = active(stores.reports)
  const daily = reports.filter((r) => r.type === 'daily')
  const weekly = reports.filter((r) => r.type === 'weekly')
  const monthly = reports.filter((r) => r.type === 'monthly')
  const incident = reports.filter((r) => r.type === 'incident')
  const submitted = reports.filter((r) => r.status === 'submitted')
  const draft = reports.filter((r) => r.status === 'draft')

  let response = `報告の状況をお知らせします。\n\n`
  response += `全報告数: ${reports.length}件\n`
  response += `- 日報: ${daily.length}件\n`
  response += `- 週報: ${weekly.length}件\n`
  response += `- 月報: ${monthly.length}件\n`
  response += `- インシデント報告: ${incident.length}件\n`

  response += `\nステータス別:\n`
  response += `- 提出済み（未レビュー）: ${submitted.length}件\n`
  response += `- 下書き: ${draft.length}件\n`

  if (incident.length > 0) {
    response += `\n直近のインシデント報告:\n`
    incident.slice(0, 2).forEach((r) => {
      response += `- 「${r.title}」\n`
    })
  }

  return response
}

function improvementResponse(stores: StoreData): string {
  const improvements = active(stores.improvements)
  const proposed = improvements.filter((i) => i.status === 'proposed')
  const inProgress = improvements.filter((i) => i.status === 'in_progress')
  const totalVotes = improvements.reduce((s, i) => s + i.votes, 0)

  const topVoted = [...improvements].sort((a, b) => b.votes - a.votes).slice(0, 3)

  let response = `改善提案の状況をお知らせします。\n\n`
  response += `全提案数: ${improvements.length}件（合計投票: ${totalVotes}票）\n`
  response += `- 新規提案: ${proposed.length}件\n`
  response += `- 実施中: ${inProgress.length}件\n`

  if (topVoted.length > 0) {
    response += `\n人気の提案（投票数順）:\n`
    topVoted.forEach((imp) => {
      response += `- 「${imp.title}」（${imp.votes}票）- ${imp.status === 'proposed' ? '提案中' : imp.status === 'in_progress' ? '実施中' : imp.status === 'approved' ? '承認済み' : imp.status}\n`
    })
  }

  return response
}

function knowledgeResponse(stores: StoreData): string {
  const articles = active(stores.articles)
  const published = articles.filter((a) => a.is_published)

  const popular = [...published].sort((a, b) => b.view_count - a.view_count).slice(0, 5)

  let response = `ナレッジベースの状況をお知らせします。\n\n`
  response += `全記事数: ${articles.length}件（公開中: ${published.length}件）\n`

  if (popular.length > 0) {
    response += `\n人気の記事（閲覧数順）:\n`
    popular.forEach((a) => {
      response += `- 「${a.title}」（${a.view_count}回閲覧）\n`
    })
  }

  return response
}

function generalAffairsResponse(stores: StoreData): string {
  const equipment = active(stores.equipment)
  const inUse = equipment.filter((e) => e.status === 'in_use')
  const available = equipment.filter((e) => e.status === 'available')
  const maintenance = equipment.filter((e) => e.status === 'maintenance')

  const bookings = stores.facilityBookings.filter((b) => !b.deleted_at && b.status === 'confirmed')
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter((b) => b.date === todayStr)

  let response = `総務関連の状況をお知らせします。\n\n`
  response += `【備品・設備】\n`
  response += `- 全備品: ${equipment.length}点\n`
  response += `- 使用中: ${inUse.length}点\n`
  response += `- 貸出可能: ${available.length}点\n`
  if (maintenance.length > 0) {
    response += `- メンテナンス中: ${maintenance.length}点\n`
  }

  response += `\n【施設予約（本日）】\n`
  if (todayBookings.length === 0) {
    response += `本日の予約はありません。\n`
  } else {
    todayBookings.forEach((b) => {
      response += `- ${b.facility_name}: ${b.start_time}〜${b.end_time}（${b.purpose}）\n`
    })
  }

  return response
}

function notificationResponse(stores: StoreData): string {
  const notifs = stores.notifications.filter((n) => !n.deleted_at)
  const unread = notifs.filter((n) => !n.is_read)

  let response = `通知の状況をお知らせします。\n\n`
  response += `全通知: ${notifs.length}件\n`
  response += `未読: ${unread.length}件\n`

  if (unread.length > 0) {
    response += `\n未読の通知:\n`
    unread.slice(0, 5).forEach((n) => {
      response += `- ${n.title}: ${n.body}\n`
    })
  } else {
    response += `\n未読の通知はありません。`
  }

  return response
}

function greetingResponse(): string {
  const hour = new Date().getHours()
  let greeting = 'こんにちは'
  if (hour < 10) greeting = 'おはようございます'
  else if (hour >= 18) greeting = 'おつかれさまです'

  return `${greeting}！ジジロボです。\n\nB-Hallの業務について、以下のようなことをお手伝いできます:\n\n- タスクの状況確認\n- 申請・承認の状況\n- 稟議の進捗\n- 経理・財務サマリー\n- 従業員情報\n- 文書・契約管理\n- 報告の確認\n- 改善提案の状況\n- ナレッジ検索\n- 総務・備品・施設予約\n- 通知の確認\n\n何でも聞いてください！`
}

function dashboardResponse(stores: StoreData): string {
  const tasks = active(stores.tasks)
  const activeTasks = tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled')
  const apps = active(stores.applications)
  const pendingApps = apps.filter((a) => a.status === 'approving' || a.status === 'submitted')
  const ringis = active(stores.ringis)
  const pendingRingis = ringis.filter((r) => r.status === 'approving' || r.status === 'submitted')
  const employees = active(stores.employees).filter((e) => e.status === 'active')

  const txns = active(stores.transactions)
  const now = new Date()
  const thisMonthTxns = txns.filter((t) => {
    const d = new Date(t.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const income = thisMonthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = thisMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const unreadNotifs = stores.notifications.filter((n) => !n.deleted_at && !n.is_read)
  const improvements = active(stores.improvements)
  const overdueInvoices = active(stores.invoices).filter((i) => i.status === 'overdue')

  let response = `B-Hall 全体状況サマリーです。\n\n`

  response += `【タスク】\n`
  response += `アクティブ: ${activeTasks.length}件\n`

  const urgent = activeTasks.filter((t) => t.priority === 'urgent')
  if (urgent.length > 0) {
    response += `緊急: ${urgent.length}件\n`
  }

  response += `\n【申請・承認】\n`
  response += `承認待ち: ${pendingApps.length}件\n`

  response += `\n【稟議】\n`
  response += `承認待ち: ${pendingRingis.length}件\n`
  if (pendingRingis.length > 0) {
    const total = pendingRingis.reduce((s, r) => s + (r.amount || 0), 0)
    response += `承認待ち総額: ${formatYen(total)}\n`
  }

  response += `\n【今月の収支】\n`
  response += `収入: ${formatYen(income)} / 支出: ${formatYen(expense)}\n`

  if (overdueInvoices.length > 0) {
    response += `未回収請求: ${overdueInvoices.length}件\n`
  }

  response += `\n【従業員】 ${employees.length}名在籍\n`
  response += `【通知】 未読 ${unreadNotifs.length}件\n`
  response += `【改善提案】 ${improvements.filter((i) => i.status === 'proposed').length}件の新規提案\n`

  return response
}

// ── Main Function ──

export function generateJijiRoboResponse(message: string, stores: StoreData): string {
  const intent = detectIntent(message)

  switch (intent) {
    case 'task':
      return taskResponse(stores)
    case 'application':
      return applicationResponse(stores)
    case 'ringi':
      return ringiResponse(stores)
    case 'employee':
      return employeeResponse(stores)
    case 'accounting':
      return accountingResponse(stores)
    case 'document':
      return documentResponse(stores)
    case 'report':
      return reportResponse(stores)
    case 'improvement':
      return improvementResponse(stores)
    case 'knowledge':
      return knowledgeResponse(stores)
    case 'general_affairs':
      return generalAffairsResponse(stores)
    case 'notification':
      return notificationResponse(stores)
    case 'greeting':
      return greetingResponse()
    case 'dashboard':
      return dashboardResponse(stores)
    default:
      return '申し訳ありませんが、その内容についてはまだ対応できません。タスク、申請、稟議、経理、人事、文書、報告、改善、ナレッジ、総務について質問できます。'
  }
}
