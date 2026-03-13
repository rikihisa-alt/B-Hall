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
  { name: '経理',        href: '/accounting',      icon: Calculator },
  { name: '人事',        href: '/hr',              icon: Users },
  { name: '総務',        href: '/general-affairs',  icon: Building2 },
  { name: '契約',        href: '/documents',       icon: FolderOpen },
  { name: '申請',        href: '/applications',    icon: FileText },
  { name: '稟議',        href: '/ringi',           icon: Stamp },
  { name: '報告',        href: '/reports',         icon: ClipboardList },
  { name: 'ドキュメント', href: '/knowledge',       icon: BookOpen },
  { name: '経営',        href: '/management',       icon: BarChart3 },
  { name: '改善',        href: '/improvements',    icon: MessageSquare },
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
    <aside className="w-[240px] h-screen flex flex-col bg-[#0A0A0C] border-r border-white/[0.04] shrink-0 select-none">

      {/* Logo */}
      <div className="h-14 flex items-center px-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#6E7BF7] flex items-center justify-center">
            <span className="text-[10px] font-black text-white leading-none">B</span>
          </div>
          <span className="text-[15px] font-semibold text-[#ECECEF] tracking-tight">B-Hall</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <button className="w-full flex items-center gap-2.5 h-9 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer">
          <Search className="w-[14px] h-[14px] text-[#4E4E56]" />
          <span className="text-[13px] text-[#4E4E56] flex-1 text-left">検索</span>
          <kbd className="text-[10px] text-[#3A3A42] font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-2 pb-4">

        {/* Home */}
        <div className="mb-6">
          <Link href="/">
            <div className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[14px] font-medium transition-colors ${
              isActive('/')
                ? 'bg-white/[0.06] text-[#ECECEF]'
                : 'text-[#8E8E96] hover:text-[#ECECEF] hover:bg-white/[0.03]'
            }`}>
              Home
            </div>
          </Link>
        </div>

        {/* Sections */}
        <div className="mb-6">
          <p className="text-[11px] font-medium text-[#3A3A42] px-3 mb-2 tracking-wide">
            WORKSPACE
          </p>
          <div className="space-y-0.5">
            {sections.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[14px] transition-colors ${
                    on
                      ? 'bg-white/[0.06] text-[#ECECEF] font-medium'
                      : 'text-[#6E6E78] hover:text-[#ECECEF] hover:bg-white/[0.03]'
                  }`}>
                    <Icon className={`w-[16px] h-[16px] shrink-0 ${on ? 'text-[#6E7BF7]' : 'text-[#4E4E56]'}`} />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <p className="text-[11px] font-medium text-[#3A3A42] px-3 mb-2 tracking-wide">
            TOOLS
          </p>
          <div className="space-y-0.5">
            {utilities.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[14px] transition-colors ${
                    on
                      ? 'bg-white/[0.06] text-[#ECECEF] font-medium'
                      : 'text-[#6E6E78] hover:text-[#ECECEF] hover:bg-white/[0.03]'
                  }`}>
                    <Icon className={`w-[16px] h-[16px] shrink-0 ${on ? 'text-[#6E7BF7]' : 'text-[#4E4E56]'}`} />
                    <span className="flex-1">{item.name}</span>
                    {'count' in item && item.count && (
                      <span className="text-[11px] font-medium text-[#E55A5A] tabular-nums">
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
