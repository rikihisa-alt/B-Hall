'use client'

import Link from 'next/link'
import {
  Calculator,
  Users,
  Building2,
  FolderOpen,
  FileText,
  Stamp,
  ClipboardList,
  BarChart3,
  MessageSquare,
  BookOpen,
  Bot,
  Search,
} from 'lucide-react'

/* ─────────────────────────────────
   Launcher — Mac Launchpad 構造

   禁止：
   - Dashboard
   - Greeting message
   - Notification strip
   - Stats row
   - Feature card grid

   ユーザーは「何を見るか」ではなく
   「どの業務を行うか」を選ぶ。
───────────────────────────────── */

const apps = [
  {
    name: '経理',
    sub: '経費・請求・支払・資金',
    href: '/accounting',
    icon: Calculator,
    gradient: 'from-emerald-500 to-teal-600',
    badge: 4,
  },
  {
    name: '人事・労務',
    sub: '従業員・入退社・社保',
    href: '/hr',
    icon: Users,
    gradient: 'from-violet-500 to-violet-600',
    badge: 3,
  },
  {
    name: '総務',
    sub: '備品・設備・庶務',
    href: '/general-affairs',
    icon: Building2,
    gradient: 'from-sky-500 to-sky-600',
    badge: 2,
  },
  {
    name: '法務・契約',
    sub: '契約書・規程・法定文書',
    href: '/documents',
    icon: FolderOpen,
    gradient: 'from-rose-500 to-rose-600',
    badge: 1,
  },
  {
    name: '申請・承認',
    sub: 'ワークフロー処理',
    href: '/applications',
    icon: FileText,
    gradient: 'from-indigo-500 to-indigo-600',
    badge: 5,
  },
  {
    name: '稟議',
    sub: '決裁プロセス管理',
    href: '/ringi',
    icon: Stamp,
    gradient: 'from-amber-500 to-amber-600',
    badge: 1,
  },
  {
    name: '日報・報告',
    sub: '報告・インシデント',
    href: '/reports',
    icon: ClipboardList,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    name: 'ドキュメント',
    sub: 'テンプレート・手順書',
    href: '/knowledge',
    icon: BookOpen,
    gradient: 'from-yellow-500 to-yellow-600',
  },
  {
    name: '経営管理',
    sub: '分析・投資判断',
    href: '/management',
    icon: BarChart3,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    name: '改善',
    sub: '提案・目安箱',
    href: '/improvements',
    icon: MessageSquare,
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    name: 'ジジロボ',
    sub: 'AIアシスタント',
    href: '/assistant',
    icon: Bot,
    gradient: 'from-cyan-500 to-cyan-600',
  },
]

export default function LauncherPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full -mt-4">
      {/* ── Search ── */}
      <div className="w-full max-w-[400px] mb-16">
        <button className="w-full flex items-center gap-3 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group cursor-pointer">
          <Search className="w-[14px] h-[14px] text-[#2E323B] group-hover:text-[#4B5263] transition-colors" />
          <span className="text-[12px] text-[#2E323B] group-hover:text-[#4B5263] transition-colors flex-1 text-left">
            業務を検索...
          </span>
          <div className="flex items-center gap-0.5">
            <kbd className="text-[9px] text-[#1E2028] bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5 font-mono leading-none">⌘</kbd>
            <kbd className="text-[9px] text-[#1E2028] bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5 font-mono leading-none">K</kbd>
          </div>
        </button>
      </div>

      {/* ── App Tile Grid ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-9">
        {apps.map(app => {
          const Icon = app.icon
          return (
            <Link key={app.href} href={app.href}>
              <div className="flex flex-col items-center text-center w-[80px] group cursor-pointer">
                {/* Icon */}
                <div className="relative mb-2">
                  <div className={`w-[50px] h-[50px] rounded-[13px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg shadow-black/25 group-hover:scale-[1.08] group-hover:shadow-xl group-hover:shadow-black/35 transition-all duration-200 ease-out`}>
                    <Icon className="w-[21px] h-[21px] text-white" />
                  </div>
                  {app.badge && app.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[#FF5D5D] text-white text-[8px] font-bold px-1 ring-[1.5px] ring-[#0F1115] leading-none">
                      {app.badge}
                    </span>
                  )}
                </div>
                {/* Label */}
                <span className="text-[11px] font-medium text-[#5A6070] group-hover:text-white/80 transition-colors leading-tight">
                  {app.name}
                </span>
                <span className="text-[9px] text-[#2E323B] mt-0.5 leading-tight">
                  {app.sub}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
