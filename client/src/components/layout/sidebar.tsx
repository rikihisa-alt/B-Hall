'use client'

import { useState } from 'react'
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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronUp,
} from 'lucide-react'

const workspaceItems = [
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

const toolsItems: Array<{ name: string; href: string; icon: typeof CheckSquare; count?: number }> = [
  { name: 'タスク',   href: '/tasks',          icon: CheckSquare },
  { name: '通知',     href: '/notifications',  icon: Bell, count: 3 },
  { name: 'ジジロボ', href: '/assistant',      icon: Bot },
  { name: '設定',     href: '/settings',       icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside
      className={`h-screen flex flex-col shrink-0 select-none bg-bg-base border-r border-border z-[100] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* ── Brand area ── */}
      <div className="h-16 flex items-center justify-between px-3 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center shrink-0">
            <span className="text-[12px] font-black text-white leading-none">B</span>
          </div>
          {!collapsed && (
            <span className="text-[15px] font-semibold text-text-primary tracking-tight">
              B-Hall
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* ── Search box ── */}
      {!collapsed ? (
        <div className="px-3 mb-3">
          <button className="w-full flex items-center gap-2.5 h-9 px-3 rounded-[10px] bg-bg-elevated border border-border hover:border-border-strong transition-colors cursor-pointer">
            <Search className="w-[14px] h-[14px] text-text-muted shrink-0" strokeWidth={1.75} />
            <span className="text-[13px] text-text-muted flex-1 text-left">検索</span>
            <kbd className="text-[10px] text-text-muted font-mono px-1.5 py-0.5 rounded-[6px] bg-bg-base border border-border">
              ⌘K
            </kbd>
          </button>
        </div>
      ) : (
        <div className="px-3 mb-3 flex justify-center">
          <button className="w-10 h-9 flex items-center justify-center rounded-[10px] bg-bg-elevated border border-border hover:border-border-strong transition-colors cursor-pointer">
            <Search className="w-[14px] h-[14px] text-text-muted" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto pb-2">
        {/* Workspace section */}
        <div className="mb-3">
          {!collapsed && (
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] px-5 mb-1">
              Workspace
            </p>
          )}
          <div className="space-y-px">
            {workspaceItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 h-10 rounded-[10px] mx-2 transition-all duration-150 text-[14px] ${
                      collapsed ? 'justify-center px-0' : 'px-3'
                    } ${
                      active
                        ? 'bg-accent-muted text-accent border-l-[3px] border-accent font-semibold'
                        : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                        active ? 'text-accent' : 'text-text-muted group-hover:text-accent'
                      }`}
                      strokeWidth={1.75}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Tools section */}
        <div>
          {!collapsed && (
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] px-5 mb-1">
              Tools
            </p>
          )}
          <div className="space-y-px">
            {toolsItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`relative flex items-center gap-3 h-10 rounded-[10px] mx-2 transition-all duration-150 text-[14px] ${
                      collapsed ? 'justify-center px-0' : 'px-3'
                    } ${
                      active
                        ? 'bg-accent-muted text-accent border-l-[3px] border-accent font-semibold'
                        : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                        active ? 'text-accent' : 'text-text-muted'
                      }`}
                      strokeWidth={1.75}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.count && (
                          <span className="min-w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center px-1">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.count && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ── User area ── */}
      <div className="border-t border-border p-3">
        <div
          className={`flex items-center gap-3 rounded-[10px] cursor-pointer hover:bg-bg-elevated transition-colors p-2 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-bold shrink-0">
            田
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">田中 太郎</p>
                <p className="text-[12px] text-text-muted truncate">管理者</p>
              </div>
              <ChevronUp className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} />
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
