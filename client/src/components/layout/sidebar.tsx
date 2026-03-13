'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  CheckSquare,
  FileText,
  Stamp,
  Users,
  Building2,
  FolderOpen,
  Calculator,
  ClipboardList,
  BarChart3,
  Lightbulb,
  Bell,
  Settings,
} from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'ホーム', href: '/', icon: Home },
  { name: 'タスク', href: '/tasks', icon: CheckSquare, badge: 5 },
  { name: '申請・承認', href: '/applications', icon: FileText, badge: 3 },
  { name: '稟議', href: '/ringi', icon: Stamp },
  { name: '報告・改善', href: '/reports', icon: ClipboardList },
  { separator: true },
  { name: '人事・労務', href: '/hr', icon: Users },
  { name: '総務', href: '/general-affairs', icon: Building2 },
  { name: '法務・文書', href: '/documents', icon: FolderOpen },
  { name: '経理・財務', href: '/accounting', icon: Calculator },
  { separator: true },
  { name: '経営管理', href: '/management', icon: BarChart3 },
  { name: 'ナレッジ', href: '/knowledge', icon: Lightbulb },
] as const

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  separator?: never
} | {
  separator: true
  name?: never
  href?: never
  icon?: never
  badge?: never
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 glass-strong shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">B-Hall</span>
            <span className="text-[10px] text-gray-400 block -mt-1">by Backlly</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {(navigation as readonly NavItem[]).map((item, i) => {
          if ('separator' in item && item.separator) {
            return <div key={`sep-${i}`} className="my-3 border-t border-gray-200/40" />
          }

          if (!item.href || !item.icon) return null

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/10 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              )}
            >
              <Icon className={clsx('w-[18px] h-[18px]', isActive ? 'text-primary-600' : 'text-gray-400')} />
              <span className="flex-1">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary-500 text-white text-[11px] font-semibold px-1.5">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-200/40 space-y-1">
        <Link
          href="/notifications"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
        >
          <Bell className="w-[18px] h-[18px] text-gray-400" />
          <span className="flex-1">通知</span>
          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-danger text-white text-[11px] font-semibold px-1.5">
            8
          </span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
        >
          <Settings className="w-[18px] h-[18px] text-gray-400" />
          <span>設定</span>
        </Link>
      </div>
    </aside>
  )
}
