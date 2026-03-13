'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  CheckSquare,
  Bell,
  Settings,
  Search,
} from 'lucide-react'

const sections = [
  { name: '経理',        href: '/accounting',       icon: Calculator },
  { name: '人事',        href: '/hr',               icon: Users },
  { name: '総務',        href: '/general-affairs',   icon: Building2 },
  { name: '契約',        href: '/documents',        icon: FolderOpen },
  { name: '申請',        href: '/applications',     icon: FileText },
  { name: '稟議',        href: '/ringi',            icon: Stamp },
  { name: '報告',        href: '/reports',          icon: ClipboardList },
  { name: 'ドキュメント', href: '/knowledge',        icon: BookOpen },
  { name: '経営',        href: '/management',        icon: BarChart3 },
  { name: '改善',        href: '/improvements',     icon: MessageSquare },
]

const utilities = [
  { name: 'タスク',   href: '/tasks',          icon: CheckSquare },
  { name: '通知',     href: '/notifications',  icon: Bell, count: 3 },
  { name: 'ジジロボ', href: '/assistant',      icon: Bot },
  { name: '設定',     href: '/settings',       icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="w-[252px] h-screen flex flex-col shrink-0 select-none bg-white/60 backdrop-blur-2xl border-r border-black/[0.04]">

      {/* Logo */}
      <div className="h-[56px] flex items-center px-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center">
            <span className="text-[11px] font-black text-white leading-none">B</span>
          </div>
          <span className="text-[15px] font-semibold text-[#0f172a] tracking-tight">B-Hall</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <button className="w-full flex items-center gap-2.5 h-9 px-3 rounded-lg bg-black/[0.03] hover:bg-black/[0.05] transition-colors cursor-pointer">
          <Search className="w-[14px] h-[14px] text-[#94a3b8]" />
          <span className="text-[13px] text-[#94a3b8] flex-1 text-left">検索</span>
          <kbd className="text-[10px] text-[#cbd5e1] font-mono px-1.5 py-0.5 rounded bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 pt-1 pb-4">

        {/* Home */}
        <div className="mb-4 px-0.5">
          <Link href="/">
            <div className={`flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] font-semibold tracking-tight transition-all duration-150 ${
              isActive('/')
                ? 'bg-[#6366f1]/[0.07] text-[#6366f1]'
                : 'text-[#334155] hover:bg-black/[0.03]'
            }`}>
              ホーム
            </div>
          </Link>
        </div>

        {/* Sections */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-[#94a3b8] uppercase px-3 mb-1.5 tracking-[0.06em]">
            Workspace
          </p>
          <div className="space-y-px">
            {sections.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] tracking-tight transition-all duration-150 ${
                    on
                      ? 'bg-[#6366f1]/[0.07] text-[#6366f1] font-semibold'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-black/[0.03]'
                  }`}>
                    <Icon className={`w-4 h-4 shrink-0 ${on ? 'text-[#6366f1]' : 'text-[#94a3b8]'}`} strokeWidth={1.75} />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-[10px] font-semibold text-[#94a3b8] uppercase px-3 mb-1.5 tracking-[0.06em]">
            Tools
          </p>
          <div className="space-y-px">
            {utilities.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] tracking-tight transition-all duration-150 ${
                    on
                      ? 'bg-[#6366f1]/[0.07] text-[#6366f1] font-semibold'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-black/[0.03]'
                  }`}>
                    <Icon className={`w-4 h-4 shrink-0 ${on ? 'text-[#6366f1]' : 'text-[#94a3b8]'}`} strokeWidth={1.75} />
                    <span className="flex-1">{item.name}</span>
                    {'count' in item && item.count && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#e11d48] text-white text-[10px] font-bold px-1">
                        {item.count}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
