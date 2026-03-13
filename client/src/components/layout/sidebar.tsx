'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Shield,
  Building,
  TrendingUp,
  CheckSquare,
  FileText,
  Stamp,
  ClipboardList,
  Users,
  Building2,
  FolderOpen,
  Calculator,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Bot,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'

interface NavCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  children: NavChild[]
}

interface NavChild {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const categories: NavCategory[] = [
  {
    name: '業務統制',
    icon: Shield,
    href: '/operations',
    color: 'text-blue-500',
    children: [
      { name: 'タスク', href: '/tasks', icon: CheckSquare, badge: 5 },
      { name: '申請・承認', href: '/applications', icon: FileText, badge: 3 },
      { name: '稟議', href: '/ringi', icon: Stamp, badge: 1 },
      { name: '日報・報告', href: '/reports', icon: ClipboardList },
    ],
  },
  {
    name: '部門管理',
    icon: Building,
    href: '/department',
    color: 'text-emerald-500',
    children: [
      { name: '人事・労務', href: '/hr', icon: Users },
      { name: '総務', href: '/general-affairs', icon: Building2 },
      { name: '法務・文書', href: '/documents', icon: FolderOpen },
      { name: '経理・財務', href: '/accounting', icon: Calculator },
    ],
  },
  {
    name: '経営・ナレッジ',
    icon: TrendingUp,
    href: '/executive',
    color: 'text-amber-500',
    children: [
      { name: '経営管理', href: '/management', icon: BarChart3 },
      { name: 'ナレッジ', href: '/knowledge', icon: Lightbulb },
      { name: '改善・目安箱', href: '/improvements', icon: MessageSquare },
      { name: 'ジジロボ', href: '/assistant', icon: Bot },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  // Auto-expand category that contains the active page
  const getInitialExpanded = (): Record<string, boolean> => {
    const result: Record<string, boolean> = {}
    categories.forEach((cat) => {
      const isInCategory = cat.children.some((child) => pathname.startsWith(child.href))
      const isCategoryPage = pathname === cat.href
      result[cat.name] = isInCategory || isCategoryPage
    })
    return result
  }

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded)

  const toggleCategory = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 glass-strong shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">B-Hall</span>
            <span className="text-[10px] text-gray-400 block -mt-1">by Backlly</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Home */}
        <Link
          href="/"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-2',
            pathname === '/'
              ? 'bg-primary-500/10 text-primary-700 shadow-sm'
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
          )}
        >
          <Home className={clsx('w-[18px] h-[18px]', pathname === '/' ? 'text-primary-600' : 'text-gray-400')} />
          <span>ホーム</span>
        </Link>

        {/* Category Groups */}
        <div className="space-y-1">
          {categories.map((cat) => {
            const CatIcon = cat.icon
            const isExpanded = expanded[cat.name]
            const isActive = pathname === cat.href
            const hasActiveChild = cat.children.some((c) => pathname.startsWith(c.href))

            return (
              <div key={cat.name}>
                {/* Category Header */}
                <div className="flex items-center">
                  <Link
                    href={cat.href}
                    className={clsx(
                      'flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-500/10 text-primary-700 shadow-sm'
                        : hasActiveChild
                          ? 'text-gray-900'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                    )}
                  >
                    <CatIcon className={clsx('w-[18px] h-[18px]', isActive ? 'text-primary-600' : cat.color)} />
                    <span className="flex-1">{cat.name}</span>
                  </Link>
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="p-1.5 rounded-lg hover:bg-white/60 transition-colors mr-1"
                  >
                    <ChevronDown
                      className={clsx(
                        'w-3.5 h-3.5 text-gray-400 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                </div>

                {/* Children */}
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l border-gray-200/40 space-y-0.5 mt-0.5 mb-2">
                    {cat.children.map((child) => {
                      const ChildIcon = child.icon
                      const isChildActive = pathname.startsWith(child.href)

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={clsx(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200',
                            isChildActive
                              ? 'bg-primary-500/10 text-primary-700'
                              : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
                          )}
                        >
                          <ChildIcon className={clsx('w-4 h-4', isChildActive ? 'text-primary-600' : 'text-gray-400')} />
                          <span className="flex-1">{child.name}</span>
                          {child.badge && child.badge > 0 && (
                            <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary-500 text-white text-[10px] font-semibold px-1">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-200/40 space-y-1">
        <Link
          href="/notifications"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            pathname === '/notifications'
              ? 'bg-primary-500/10 text-primary-700 shadow-sm'
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
          )}
        >
          <Bell className={clsx('w-[18px] h-[18px]', pathname === '/notifications' ? 'text-primary-600' : 'text-gray-400')} />
          <span className="flex-1">通知</span>
          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-danger text-white text-[11px] font-semibold px-1.5">
            8
          </span>
        </Link>
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            pathname === '/settings'
              ? 'bg-primary-500/10 text-primary-700 shadow-sm'
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
          )}
        >
          <Settings className={clsx('w-[18px] h-[18px]', pathname === '/settings' ? 'text-primary-600' : 'text-gray-400')} />
          <span>設定</span>
        </Link>
      </div>
    </aside>
  )
}
