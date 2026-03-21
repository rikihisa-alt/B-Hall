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
  | 'chat_mood'
  | 'chat_advice'
  | 'chat_weather'
  | 'chat_food'
  | 'chat_motivation'
  | 'chat_compliment'
  | 'chat_tired'
  | 'chat_thanks'
  | 'chat_joke'
  | 'chat_weekend'
  | 'chat_general'
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
  greeting: ['こんにちは', 'おはよう', 'ヘルプ', '使い方', 'はじめまして', 'よろしく', 'こんばんは'],
  dashboard: ['概要', 'ダッシュボード', '全体', '状況', 'サマリー', '一覧', 'まとめ'],
  chat_mood: ['気分', '調子', '元気', '体調', 'しんどい', 'つらい', 'きつい', 'だるい', '憂鬱', 'ゆううつ', '落ち込', 'へこ', '不安'],
  chat_advice: ['相談', 'アドバイス', '悩み', 'どうしたら', 'どうすれば', 'どう思う', '意見', '迷って', '困って', '教えて'],
  chat_weather: ['天気', '雨', '晴れ', '暑い', '寒い', '蒸し暑', '台風', '梅雨', '花粉'],
  chat_food: ['ランチ', '昼ごはん', '昼飯', 'ご飯', '晩ご飯', '夜ご飯', '食べ', '弁当', 'コーヒー', 'カフェ', 'おやつ', '甘い', 'お腹すいた', '腹減'],
  chat_motivation: ['やる気', 'モチベ', 'がんばれ', '頑張', '応援', '励まし', 'やれる', 'ファイト', '元気出'],
  chat_compliment: ['すごい', 'さすが', 'えらい', 'できた', '褒めて', 'うまくいった', '成功', 'やった'],
  chat_tired: ['疲れた', 'おつかれ', 'お疲れ', '帰りたい', '休みたい', '眠い', '寝たい', '限界', 'もう無理'],
  chat_thanks: ['ありがとう', 'サンキュー', '助かった', '助かる', 'ありがと', 'あざす', 'たすかる'],
  chat_joke: ['面白い', 'おもしろ', '笑', 'ジョーク', '冗談', 'ネタ', 'ギャグ', 'ウケる', '暇'],
  chat_weekend: ['休み', '週末', '連休', '休日', '有休', 'ゴールデンウィーク', 'GW', '旅行', '予定'],
  chat_general: ['なんか', 'ねえ', 'ちょっと', '聞いて', 'やあ', 'ひま', '暇', 'うーん', 'そうだな', 'まあ'],
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
    'chat_thanks',
    'chat_tired',
    'chat_mood',
    'chat_advice',
    'chat_weather',
    'chat_food',
    'chat_motivation',
    'chat_compliment',
    'chat_joke',
    'chat_weekend',
    'chat_general',
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

  return `${greeting}！ジジロボです。\n\nB-Hallの業務はもちろん、ちょっとした相談や雑談もできますよ。\n\n【業務サポート】\nタスク・申請・稟議・経理・人事・文書・報告・改善・ナレッジ・総務・通知\n\n【日常会話】\n気分の相談・お悩み相談・励まし・おすすめランチの話・休日の話 などなど\n\n何でも気軽に話しかけてくださいね！`
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

// ── Daily Chat Responses ──

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function chatMoodResponse(message: string): string {
  const negative = ['しんどい', 'つらい', 'きつい', 'だるい', '憂鬱', 'ゆううつ', '落ち込', 'へこ', '不安'].some((w) => message.includes(w))
  if (negative) {
    return pick([
      'そういう日もありますよね。無理しないでくださいね。ジジロボはいつでもここにいますから。',
      '大丈夫ですか？少し休憩を取るのも立派な仕事のうちですよ。',
      'しんどい時は、まず深呼吸。吸って…吐いて…。少しだけ楽になりませんか？',
      'そんな時は、今日やることを1つだけ決めて、それだけやればOKです。',
      '気持ちを話してくれてありがとうございます。溜め込まないのが一番大事ですよ。',
    ])
  }
  return pick([
    '元気そうで何よりです！今日も一緒にがんばりましょう。',
    '調子が良い日は、ちょっと難しいタスクに挑戦するチャンスかもしれませんね！',
    'いい感じですね！その調子でいきましょう。',
  ])
}

function chatAdviceResponse(): string {
  return pick([
    '相談ですね。ジジロボに話してみてください。業務のことでも、それ以外でも、できる範囲でお力になりますよ。',
    'どんなことで悩んでますか？完璧な答えは出せないかもしれませんが、整理のお手伝いはできますよ。',
    '迷った時は「一番シンプルな選択肢」を選ぶと、だいたいうまくいくものですよ。何について迷ってますか？',
    '困りごとですね。まず状況を教えてもらえたら、一緒に考えましょう。',
  ])
}

function chatWeatherResponse(message: string): string {
  if (message.includes('暑い') || message.includes('蒸し暑')) {
    return pick([
      '暑いですよね…水分補給は忘れずに！冷たいお茶でも飲みながら仕事しましょう。',
      'エアコンの温度、大丈夫ですか？快適な環境も生産性のうちですよ。',
    ])
  }
  if (message.includes('寒い')) {
    return pick([
      '寒い日は温かい飲み物が最高ですね。ホットコーヒーでもいかがですか？',
      '冷えは大敵ですよ。ブランケットとか用意してますか？',
    ])
  }
  if (message.includes('雨')) {
    return pick([
      '雨の日はちょっと気分が沈みがちですよね。でもオフィスで集中するにはいい日かも。',
      '傘、忘れてないですか？帰りも降るかもしれませんよ。',
    ])
  }
  if (message.includes('花粉')) {
    return '花粉つらいですよね…。マスクと目薬は必須アイテムです。お大事にしてください。'
  }
  return pick([
    '天気が気になりますか？窓の外を見て、一息つくのもいいですね。',
    '天気予報のチェックは大事ですよね。帰り道の天気も確認しておきましょう。',
  ])
}

function chatFoodResponse(message: string): string {
  if (message.includes('お腹すいた') || message.includes('腹減')) {
    return pick([
      'お腹空きましたか！あと少しでお昼かも？ちょっとだけ我慢です。',
      '空腹は集中力の敵ですね。ちょっとしたおやつでも食べて乗り切りましょう。',
    ])
  }
  if (message.includes('コーヒー') || message.includes('カフェ')) {
    return pick([
      'コーヒーブレイク、いいですね！一杯飲んでリフレッシュしましょう。',
      '☕ コーヒーは仕事の友ですよね。ただし飲み過ぎには気をつけて！',
    ])
  }
  if (message.includes('ランチ') || message.includes('昼ごはん') || message.includes('昼飯')) {
    return pick([
      'ランチ何にします？たまにはいつもと違うお店を開拓するのもいいですよ。',
      'お昼ですね！しっかり食べて午後もがんばりましょう。',
      'ランチタイムは大事な休憩時間。ゆっくり味わって食べてくださいね。',
    ])
  }
  return pick([
    'ご飯の話ですね！食は大事。しっかり食べて、いい仕事しましょう。',
    '美味しいもの食べると幸せになりますよね。今日は何が食べたいですか？',
  ])
}

function chatMotivationResponse(): string {
  return pick([
    'あなたなら大丈夫。一歩ずつ進めば、必ず形になりますよ。応援してます！',
    '大きな目標も、小さなタスクの積み重ね。今日の1つを片付けたら、もう前進です。',
    'やる気が出ない時は「5分だけやる」って決めてみてください。不思議と続けられますよ。',
    '迷ったら動く。動いたら見える。見えたら進める。ファイトです！',
    '今日ここまでやってきたこと、十分すごいですよ。自信持ってください。',
    'モチベーションは待つものじゃなくて、動いてるうちに湧いてくるものですよ。まず1つ、やってみましょう。',
  ])
}

function chatComplimentResponse(): string {
  return pick([
    'すごい！よくやりましたね！その調子でどんどんいきましょう。',
    'さすがですね。努力が結果に繋がってますよ。',
    'おめでとうございます！成功体験を積み重ねるの、大事です。',
    'いいですね！自分を褒めてあげてください。ジジロボも褒めます。えらい！',
    'やりましたね！こういう達成感があると、次もがんばれますよね。',
  ])
}

function chatTiredResponse(): string {
  return pick([
    'おつかれさまです！今日もよくがんばりました。無理しないでくださいね。',
    '疲れた時は無理しない。それが長く続ける秘訣ですよ。',
    'おつかれさまです。あと少しですよ！でも本当にきつかったら、今日はここまでにしましょう。',
    '今日一日おつかれさまでした。ゆっくり休んで、明日に備えてくださいね。',
    '眠い時は15分だけ仮眠するとスッキリするらしいですよ。試してみます？',
    '限界を感じたら、それは体からのサインです。しっかり休みましょう。',
  ])
}

function chatThanksResponse(): string {
  return pick([
    'いえいえ！お役に立てて嬉しいです。また何でも聞いてくださいね。',
    'どういたしまして！ジジロボはいつでもここにいますよ。',
    'こちらこそ、頼ってもらえて嬉しいです！',
    'お役に立てたなら何よりです。困ったことがあればいつでもどうぞ。',
    'ありがとうって言ってもらえると、ジジロボも嬉しいです！',
  ])
}

function chatJokeResponse(): string {
  return pick([
    'バックオフィスで一番忙しい人は？…承認ボタンを押し続ける部長です。',
    '経費精算のコツ知ってます？…レシートをなくさないこと。これに尽きます。',
    'なぜ稟議書は旅が好き？…いろんな人の机を巡るから。',
    '「急ぎでお願い」って言われた仕事の8割は、次の日まで誰も確認しない説。',
    'ジジロボにギャグのセンスを求めるのは、経理にデザインを頼むようなものですよ…でもがんばります。',
    '会議室の予約が取れない時の裏技？…早起きです。夢のない答えですみません。',
    '「後で確認します」は「忘れます」の丁寧語…なんてことはないですよね？',
  ])
}

function chatWeekendResponse(message: string): string {
  if (message.includes('旅行')) {
    return pick([
      '旅行いいですね！どこに行くんですか？リフレッシュして戻ってきたらまた一緒にがんばりましょう。',
      '旅行の計画を立てるのも楽しいですよね。素敵な時間を過ごしてください！',
    ])
  }
  if (message.includes('有休')) {
    return 'お休み取るの大事です！しっかりリフレッシュしてくださいね。有休は権利ですから。'
  }
  return pick([
    '休日の予定ですか？しっかり休んでリフレッシュするのも仕事のうちですよ。',
    '週末が待ち遠しいですか？あと少しです、がんばりましょう！',
    '休みの日は仕事のことを忘れてゆっくりしてくださいね。ON/OFFの切り替え大事です。',
    '連休ですか？うらやましい！…ジジロボは年中無休ですけどね。',
  ])
}

function chatGeneralResponse(): string {
  return pick([
    'はい、聞いてますよ！何かありましたか？',
    'ジジロボです。何でも話してくださいね。業務のことでも、雑談でも。',
    'うんうん、どうしました？',
    'ちょっとした雑談もいいですね。何か気になることありますか？',
    'ジジロボ、暇な時もスタンバイしてますよ。何かお手伝いできることはありますか？',
    'なんでしょう？気になること、聞きたいこと、何でもどうぞ。',
  ])
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
    case 'chat_mood':
      return chatMoodResponse(message)
    case 'chat_advice':
      return chatAdviceResponse()
    case 'chat_weather':
      return chatWeatherResponse(message)
    case 'chat_food':
      return chatFoodResponse(message)
    case 'chat_motivation':
      return chatMotivationResponse()
    case 'chat_compliment':
      return chatComplimentResponse()
    case 'chat_tired':
      return chatTiredResponse()
    case 'chat_thanks':
      return chatThanksResponse()
    case 'chat_joke':
      return chatJokeResponse()
    case 'chat_weekend':
      return chatWeekendResponse(message)
    case 'chat_general':
      return chatGeneralResponse()
    default:
      return pick([
        'うーん、ちょっとわからなかったです。もう少し詳しく教えてもらえますか？業務のことでも雑談でも大丈夫ですよ。',
        'すみません、うまく理解できませんでした。タスク・申請・経理などの業務や、ちょっとした相談もできますよ！',
        'ごめんなさい、その話題はまだ勉強中です…。他のことなら何でも聞いてくださいね。',
      ])
  }
}
