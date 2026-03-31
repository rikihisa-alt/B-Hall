import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Calculator,
  Users,
  Building2,
  Scale,
  FileText,
  Stamp,
  ClipboardList,
  BookOpen,
  BarChart3,
  Lightbulb,
  Bot,
  CheckSquare,
  Bell,
  Settings,
  // Sub-item icons
  Receipt,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  List,
  Wallet,
  TrendingUp,
  PieChart,
  CalendarCheck,
  UserPlus,
  UserMinus,
  Shield,
  Heart,
  FileCheck,
  Package,
  Monitor,
  Mail,
  UserCheck,
  Megaphone,
  FolderOpen,
  FileSignature,
  Search,
  Plane,
  ShoppingCart,
  Clock,
  History,
  Plus,
  CheckCircle2,
  ArrowLeftRight,
  Calendar,
  AlertTriangle,
  FileBarChart,
  Target,
  ShieldAlert,
  Inbox,
  Wrench,
  Eye,
  HelpCircle,
  BookMarked,
  Network,
  CalendarDays,
  Star,
  GraduationCap,
} from 'lucide-react'

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

export interface NavSubItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  description?: string
}

export interface NavSection {
  key: string
  label: string
  shortLabel: string   // 左サイドバー用の短縮ラベル
  labelKey: string     // i18n translation key (short)
  labelKeyFull: string // i18n translation key (full)
  icon: LucideIcon
  href: string          // デフォルトの遷移先
  directNav?: boolean   // true = 第2サイドバーを開かず直接遷移
  subItems?: NavSubItem[]
}

export interface NavToolItem {
  key: string
  label: string
  labelKey: string   // i18n translation key
  icon: LucideIcon
  href: string
  count?: number
}

/* ────────────────────────────────────────── */
/*  Sections (大セクション)                    */
/* ────────────────────────────────────────── */

export const sections: NavSection[] = [
  {
    key: 'home',
    label: 'ホーム',
    shortLabel: 'ホーム',
    labelKey: 'nav_home',
    labelKeyFull: 'nav_home_full',
    icon: Home,
    href: '/',
    directNav: true,
  },
  {
    key: 'accounting',
    label: '経理・財務',
    shortLabel: '経理',
    labelKey: 'nav_accounting',
    labelKeyFull: 'nav_accounting_full',
    icon: Calculator,
    href: '/accounting',
    subItems: [
      { key: 'expense',      label: '経費精算',         href: '/accounting', icon: Receipt,       description: '経費申請の確認・精算' },
      { key: 'invoice',      label: '請求管理',         href: '/accounting', icon: CreditCard,    description: '請求書の発行・管理' },
      { key: 'payment',      label: '支払処理',         href: '/accounting', icon: Banknote,      description: '支払依頼の承認・実行' },
      { key: 'deposit',      label: '入金確認',         href: '/accounting', icon: ArrowDownLeft,  description: '入金の消込・確認' },
      { key: 'transactions', label: '取引一覧',         href: '/accounting', icon: List,          description: '全取引の一覧・検索' },
      { key: 'balance',      label: '口座残高',         href: '/accounting', icon: Wallet,        description: '口座残高の確認' },
      { key: 'cashflow',     label: 'キャッシュフロー', href: '/accounting', icon: TrendingUp,    description: '資金繰りの管理' },
      { key: 'monthly',      label: '月次管理',         href: '/accounting', icon: PieChart,      description: '月次締め・レポート' },
    ],
  },
  {
    key: 'hr',
    label: '人事・労務',
    shortLabel: '人事',
    labelKey: 'nav_hr',
    labelKeyFull: 'nav_hr_full',
    icon: Users,
    href: '/hr',
    subItems: [
      { key: 'employees',    label: '従業員管理', href: '/hr', icon: Users,          description: '従業員情報の管理' },
      { key: 'onboarding',   label: '入社手続き', href: '/hr', icon: UserPlus,       description: '入社時の手続き一覧' },
      { key: 'offboarding',  label: '退社手続き', href: '/hr', icon: UserMinus,      description: '退社時の手続き一覧' },
      { key: 'insurance',    label: '社保・雇保', href: '/hr', icon: Shield,         description: '社会保険・雇用保険' },
      { key: 'health',       label: '健診',       href: '/hr', icon: Heart,          description: '健康診断の管理' },
      { key: 'contracts',    label: '契約更新',   href: '/hr', icon: FileCheck,      description: '雇用契約の更新管理' },
      { key: 'attendance',   label: '勤怠管理',   href: '/hr/attendance', icon: Clock, description: '出退勤の記録・管理' },
      { key: 'org-chart',    label: '組織図',     href: '/hr/org-chart', icon: Network,      description: '部署・チーム構成の可視化' },
      { key: 'leave',        label: '有給管理',   href: '/hr/leave',     icon: CalendarDays, description: '有給休暇の残高・申請管理' },
      { key: 'surveys',      label: 'サーベイ',   href: '/hr/surveys',   icon: Star,         description: 'エンゲージメント・満足度調査' },
      { key: 'payroll',      label: '給与管理',   href: '/hr/payroll',   icon: Banknote,     description: '給与明細の管理・配布' },
    ],
  },
  {
    key: 'general-affairs',
    label: '総務',
    shortLabel: '総務',
    labelKey: 'nav_general_affairs',
    labelKeyFull: 'nav_general_affairs_full',
    icon: Building2,
    href: '/general-affairs',
    subItems: [
      { key: 'supplies',     label: '備品管理',     href: '/general-affairs', icon: Package,     description: '備品の在庫・発注' },
      { key: 'equipment',    label: '貸与物',       href: '/general-affairs', icon: Monitor,     description: 'PC・端末等の貸与管理' },
      { key: 'office',       label: 'オフィス設備', href: '/general-affairs', icon: Building2,   description: '設備の管理・修繕' },
      { key: 'mail',         label: '郵送物',       href: '/general-affairs', icon: Mail,        description: '郵送物の受発送管理' },
      { key: 'visitor',      label: '来客管理',     href: '/general-affairs', icon: UserCheck,   description: '来客予約・受付' },
      { key: 'bulletin',     label: '社内掲示',     href: '/general-affairs', icon: Megaphone,   description: '社内掲示板' },
    ],
  },
  {
    key: 'documents',
    label: '法務・契約',
    shortLabel: '法務',
    labelKey: 'nav_legal',
    labelKeyFull: 'nav_legal_full',
    icon: Scale,
    href: '/documents',
    subItems: [
      { key: 'contracts',    label: '契約書',   href: '/documents', icon: FileSignature, description: '契約書の管理' },
      { key: 'nda',          label: 'NDA',       href: '/documents', icon: Shield,        description: '秘密保持契約' },
      { key: 'regulations',  label: '就業規則', href: '/documents', icon: BookOpen,      description: '就業規則・規程' },
      { key: 'filings',      label: '届出書',   href: '/documents', icon: FileText,      description: '行政届出書類' },
      { key: 'evidence',     label: '証憑管理', href: '/documents', icon: FolderOpen,    description: '証憑書類の保管' },
      { key: 'search',       label: '文書検索', href: '/documents', icon: Search,        description: '文書の横断検索' },
    ],
  },
  {
    key: 'applications',
    label: '申請・承認',
    shortLabel: '申請',
    labelKey: 'nav_applications',
    labelKeyFull: 'nav_applications_full',
    icon: FileText,
    href: '/applications',
    subItems: [
      { key: 'expense-req',  label: '経費申請',   href: '/applications', icon: Receipt,       description: '経費の申請' },
      { key: 'leave',        label: '休暇申請',   href: '/applications', icon: Calendar,      description: '有休・特別休暇の申請' },
      { key: 'travel',       label: '出張申請',   href: '/applications', icon: Plane,         description: '出張の申請' },
      { key: 'purchase',     label: '購買申請',   href: '/applications', icon: ShoppingCart,  description: '物品購入の申請' },
      { key: 'pending',      label: '承認待ち',   href: '/applications', icon: Clock,         description: '承認待ちの申請一覧' },
      { key: 'history',      label: '申請履歴',   href: '/applications', icon: History,       description: '過去の申請履歴' },
    ],
  },
  {
    key: 'ringi',
    label: '稟議',
    shortLabel: '稟議',
    labelKey: 'nav_ringi',
    labelKeyFull: 'nav_ringi_full',
    icon: Stamp,
    href: '/ringi',
    subItems: [
      { key: 'new',          label: '新規起票',   href: '/ringi', icon: Plus,           description: '稟議の新規作成' },
      { key: 'pending',      label: '承認待ち',   href: '/ringi', icon: Clock,          description: '承認待ちの稟議' },
      { key: 'approved',     label: '決裁済み',   href: '/ringi', icon: CheckCircle2,   description: '決裁済みの稟議' },
      { key: 'returned',     label: '差戻し',     href: '/ringi', icon: ArrowLeftRight, description: '差戻しされた稟議' },
      { key: 'all',          label: '稟議一覧',   href: '/ringi', icon: List,           description: '全稟議の一覧' },
    ],
  },
  {
    key: 'reports',
    label: '日報・報告',
    shortLabel: '報告',
    labelKey: 'nav_reports',
    labelKeyFull: 'nav_reports_full',
    icon: ClipboardList,
    href: '/reports',
    subItems: [
      { key: 'daily',        label: '日報',         href: '/reports', icon: CalendarCheck,  description: '日報の作成・確認' },
      { key: 'weekly',       label: '週報',         href: '/reports', icon: Calendar,       description: '週報の作成・確認' },
      { key: 'monthly',      label: '月報',         href: '/reports', icon: FileBarChart,   description: '月報の作成・確認' },
      { key: 'incident',     label: '事故報告',     href: '/reports', icon: AlertTriangle,  description: '事故・ヒヤリハット' },
      { key: 'ir',           label: 'インシデント', href: '/reports', icon: ShieldAlert,    description: 'インシデント報告' },
    ],
  },
  {
    key: 'knowledge',
    label: 'ドキュメント',
    shortLabel: '文書',
    labelKey: 'nav_knowledge',
    labelKeyFull: 'nav_knowledge_full',
    icon: BookOpen,
    href: '/knowledge',
    subItems: [
      { key: 'templates',    label: 'テンプレート', href: '/knowledge', icon: FileText,     description: '業務テンプレート' },
      { key: 'manual',       label: 'マニュアル',   href: '/knowledge', icon: BookOpen,     description: '業務マニュアル' },
      { key: 'faq',          label: 'FAQ',           href: '/knowledge', icon: HelpCircle,  description: 'よくある質問' },
      { key: 'guide',        label: 'ガイド',       href: '/knowledge', icon: BookMarked,   description: '手順ガイド' },
      { key: 'rules',        label: '規程',         href: '/knowledge', icon: Scale,        description: '社内規程集' },
    ],
  },
  {
    key: 'management',
    label: '経営管理',
    shortLabel: '経営',
    labelKey: 'nav_management',
    labelKeyFull: 'nav_management_full',
    icon: BarChart3,
    href: '/management',
    subItems: [
      { key: 'dashboard',    label: 'ダッシュボード', href: '/management', icon: BarChart3,     description: '経営状況の概要' },
      { key: 'analysis',     label: '収支分析',       href: '/management', icon: PieChart,      description: '収支の分析レポート' },
      { key: 'department',   label: '部門別',         href: '/management', icon: Building2,     description: '部門別の状況' },
      { key: 'investment',   label: '投資判断',       href: '/management', icon: Target,        description: '投資判断の支援' },
      { key: 'risk',         label: 'リスク管理',     href: '/management', icon: ShieldAlert,   description: 'リスクの管理' },
    ],
  },
  {
    key: 'improvements',
    label: '改善',
    shortLabel: '改善',
    labelKey: 'nav_improvements',
    labelKeyFull: 'nav_improvements_full',
    icon: Lightbulb,
    href: '/improvements',
    subItems: [
      { key: 'proposal',     label: '改善提案',   href: '/improvements', icon: Lightbulb,   description: '改善の提案' },
      { key: 'suggestion',   label: '目安箱',     href: '/improvements', icon: Inbox,       description: '匿名の提案' },
      { key: 'tasks',        label: '改善タスク', href: '/improvements', icon: Wrench,      description: '改善の実行タスク' },
      { key: 'review',       label: '効果検証',   href: '/improvements', icon: Eye,         description: '改善効果の検証' },
    ],
  },
  {
    key: 'assistant',
    label: 'ジジロボ',
    shortLabel: 'ジジロボ',
    labelKey: 'nav_assistant',
    labelKeyFull: 'nav_assistant_full',
    icon: Bot,
    href: '/assistant',
    directNav: true,
  },
]

/* ────────────────────────────────────────── */
/*  Tool Items (下部ツール)                    */
/* ────────────────────────────────────────── */

export const toolItems: NavToolItem[] = [
  { key: 'tasks',         label: 'タスク',         labelKey: 'nav_tasks',    icon: CheckSquare,   href: '/tasks' },
  { key: 'tutorial',      label: 'チュートリアル', labelKey: 'nav_tutorial', icon: GraduationCap, href: '/tutorial' },
]

// Header-only utility items (not shown in nav tabs)
export const headerUtilItems = {
  notifications: { key: 'notifications', label: '通知', icon: Bell, href: '/notifications', count: 3 },
  settings:      { key: 'settings',      label: '設定', icon: Settings, href: '/settings' },
}

/* ────────────────────────────────────────── */
/*  Helper                                    */
/* ────────────────────────────────────────── */

export function getSectionKeyFromPathname(pathname: string): string | null {
  if (pathname === '/') return 'home'

  for (const section of sections) {
    if (section.href !== '/' && pathname.startsWith(section.href)) {
      return section.key
    }
  }

  for (const tool of toolItems) {
    if (pathname.startsWith(tool.href)) {
      return tool.key
    }
  }

  return null
}
