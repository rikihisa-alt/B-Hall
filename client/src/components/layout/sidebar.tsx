'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
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
  CheckSquare,
  Bell,
  Bot,
  Settings,
} from 'lucide-react'

/* ─────────────────────────────────
   Sidebar Architecture:
     Home       → Launcher（業務選択画面）
     Workspace  → 業務別コンテキスト
     Tools      → 横断ユーティリティ

   設計思想：
   - 機能一覧ナビ 禁止
   - Home / Workspace / Tools の3層構造
   - Arc Browser の Spaces 概念を参照
   - Linear のミニマリズムを参照
───────────────────────────────── */

const workspaces = [
  { name: '経理',        href: '/accounting',      icon: Calculator },
  { name: '人事・労務',   href: '/hr',              icon: Users },
  { name: '総務',        href: '/general-affairs',  icon: Building2 },
  { name: '法務・契約',   href: '/documents',       icon: FolderOpen },
  { name: '申請・承認',   href: '/applications',    icon: FileText },
  { name: '稟議',        href: '/ringi',           icon: Stamp },
  { name: '日報・報告',   href: '/reports',         icon: ClipboardList },
  { name: 'ドキュメント', href: '/knowledge',       icon: BookOpen },
  { name: '経営管理',    href: '/management',       icon: BarChart3 },
  { name: '改善',        href: '/improvements',    icon: MessageSquare },
]

const tools = [
  { name: 'タスク',    href: '/tasks',          icon: CheckSquare },
  { name: '通知',      href: '/notifications',  icon: Bell, badge: 3 },
  { name: 'ジジロボ',  href: '/assistant',      icon: Bot },
  { name: '設定',      href: '/settings',       icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="w-[220px] h-screen flex flex-col bg-[#0C0D11] border-r border-white/[0.05] shrink-0 select-none">

      {/* ── Logo ── */}
      <div className="h-[48px] flex items-center px-4 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[20px] h-[20px] rounded-[5px] bg-gradient-to-br from-[#7C8CFF] to-[#6366F1] flex items-center justify-center">
            <span className="text-[8px] font-bold text-white leading-none">B</span>
          </div>
          <span className="text-[13px] font-semibold text-white/60 tracking-tight">B-Hall</span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3">

        {/* Home */}
        <Link href="/">
          <div className={`flex items-center gap-2 px-2 h-[28px] rounded-md text-[12px] transition-colors mb-4 ${
            active('/')
              ? 'bg-white/[0.06] text-white/80 font-medium'
              : 'text-[#4B5263] hover:text-[#7B8392] hover:bg-white/[0.03]'
          }`}>
            <LayoutGrid className={`w-[13px] h-[13px] shrink-0 ${active('/') ? 'text-[#7C8CFF]' : ''}`} />
            Home
          </div>
        </Link>

        {/* Workspace */}
        <div className="mb-4">
          <p className="text-[9px] font-semibold text-[#272A31] uppercase tracking-[0.1em] px-2 mb-1">
            Workspace
          </p>
          <div className="space-y-[1px]">
            {workspaces.map(item => {
              const Icon = item.icon
              const on = active(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-2 px-2 h-[28px] rounded-md text-[12px] transition-colors ${
                    on
                      ? 'bg-white/[0.06] text-white/80 font-medium'
                      : 'text-[#4B5263] hover:text-[#7B8392] hover:bg-white/[0.03]'
                  }`}>
                    <Icon className={`w-[13px] h-[13px] shrink-0 ${on ? 'text-[#7C8CFF]' : ''}`} />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-[9px] font-semibold text-[#272A31] uppercase tracking-[0.1em] px-2 mb-1">
            Tools
          </p>
          <div className="space-y-[1px]">
            {tools.map(item => {
              const Icon = item.icon
              const on = active(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-2 px-2 h-[28px] rounded-md text-[12px] transition-colors ${
                    on
                      ? 'bg-white/[0.06] text-white/80 font-medium'
                      : 'text-[#4B5263] hover:text-[#7B8392] hover:bg-white/[0.03]'
                  }`}>
                    <Icon className={`w-[13px] h-[13px] shrink-0 ${on ? 'text-[#7C8CFF]' : ''}`} />
                    <span className="flex-1">{item.name}</span>
                    {'badge' in item && item.badge && (
                      <span className="min-w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#FF5D5D]/15 text-[#FF5D5D] text-[8px] font-bold px-0.5 leading-none">
                        {item.badge}
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
