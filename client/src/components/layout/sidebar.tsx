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
    <aside className="w-[260px] h-screen flex flex-col shrink-0 select-none border-r border-black/[0.06] bg-white/72 backdrop-blur-xl">

      {/* ── Logo ── */}
      <div className="h-16 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[#6366F1] flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
            <span className="text-[12px] font-black text-white leading-none tracking-tight">B</span>
          </div>
          <span className="text-[16px] font-bold text-[#1E293B] tracking-tight">B-Hall</span>
        </Link>
      </div>

      {/* ── Search ── */}
      <div className="px-4 mb-3">
        <button className="w-full flex items-center gap-3 h-10 px-3.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors cursor-pointer">
          <Search className="w-[15px] h-[15px] text-[#94A3B8]" />
          <span className="text-[14px] text-[#94A3B8] flex-1 text-left">検索</span>
          <kbd className="text-[11px] text-[#CBD5E1] font-mono bg-white px-1.5 py-0.5 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.06)]">⌘K</kbd>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-1 pb-6">

        {/* Home */}
        <div className="mb-6 px-1">
          <Link href="/">
            <div className={`flex items-center gap-3 px-3 h-10 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
              isActive('/')
                ? 'bg-[#6366F1]/[0.08] text-[#6366F1]'
                : 'text-[#475569] hover:text-[#1E293B] hover:bg-black/[0.03]'
            }`}>
              ホーム
            </div>
          </Link>
        </div>

        {/* Sections */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase px-4 mb-2 tracking-[0.08em]">
            Workspace
          </p>
          <div className="space-y-0.5">
            {sections.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 h-10 rounded-xl text-[14px] transition-all duration-200 ${
                    on
                      ? 'bg-[#6366F1]/[0.08] text-[#6366F1] font-semibold'
                      : 'text-[#64748B] hover:text-[#1E293B] hover:bg-black/[0.03]'
                  }`}>
                    <Icon className={`w-[17px] h-[17px] shrink-0 ${on ? 'text-[#6366F1]' : 'text-[#94A3B8]'}`} />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase px-4 mb-2 tracking-[0.08em]">
            Tools
          </p>
          <div className="space-y-0.5">
            {utilities.map(item => {
              const Icon = item.icon
              const on = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 h-10 rounded-xl text-[14px] transition-all duration-200 ${
                    on
                      ? 'bg-[#6366F1]/[0.08] text-[#6366F1] font-semibold'
                      : 'text-[#64748B] hover:text-[#1E293B] hover:bg-black/[0.03]'
                  }`}>
                    <Icon className={`w-[17px] h-[17px] shrink-0 ${on ? 'text-[#6366F1]' : 'text-[#94A3B8]'}`} />
                    <span className="flex-1">{item.name}</span>
                    {'count' in item && item.count && (
                      <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[#E11D48] text-white text-[11px] font-bold px-1.5">
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
