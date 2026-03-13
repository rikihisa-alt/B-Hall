'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
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
} from 'lucide-react'
import { clsx } from 'clsx'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const mainNav: NavItem[] = [
  { name: 'ホーム', href: '/', icon: Home },
]

const operationsNav: NavItem[] = [
  { name: 'タスク', href: '/tasks', icon: CheckSquare, badge: 5 },
  { name: '申請・承認', href: '/applications', icon: FileText, badge: 3 },
  { name: '稟議', href: '/ringi', icon: Stamp, badge: 1 },
  { name: '日報・報告', href: '/reports', icon: ClipboardList },
]

const departmentNav: NavItem[] = [
  { name: '人事・労務', href: '/hr', icon: Users },
  { name: '総務', href: '/general-affairs', icon: Building2 },
  { name: '法務・文書', href: '/documents', icon: FolderOpen },
  { name: '経理・財務', href: '/accounting', icon: Calculator },
]

const executiveNav: NavItem[] = [
  { name: '経営管理', href: '/management', icon: BarChart3 },
  { name: 'ナレッジ', href: '/knowledge', icon: Lightbulb },
  { name: '改善・目安箱', href: '/improvements', icon: MessageSquare },
  { name: 'ジジロボ', href: '/assistant', icon: Bot },
]

const bottomNav: NavItem[] = [
  { name: '通知', href: '/notifications', icon: Bell, badge: 8 },
  { name: '設定', href: '/settings', icon: Settings },
]

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={clsx(
        'flex items-center gap-2.5 px-3 py-[7px] rounded-[10px] text-[13px] font-medium transition-all duration-150 relative group',
        isActive
          ? 'bg-white/80 text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
          : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
      )}
    >
      <Icon
        className={clsx(
          'w-[16px] h-[16px] shrink-0 transition-colors',
          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
        )}
      />
      <span className="flex-1 truncate">{item.name}</span>
      {item.badge && item.badge > 0 && (
        <span
          className={clsx(
            'min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-semibold px-1',
            isActive
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200/80 text-gray-500'
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-3 pt-5 pb-1.5">
      <span className="text-[10px] font-semibold text-gray-400/70 uppercase tracking-[0.1em]">{label}</span>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[240px] bg-gray-50/80 border-r border-gray-200/40">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-[15px] font-semibold text-gray-800 tracking-tight">B-Hall</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 pb-2 overflow-y-auto">
        {/* Main */}
        <div className="space-y-0.5 mb-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Operations */}
        <SectionDivider label="業務" />
        <div className="space-y-0.5">
          {operationsNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Department */}
        <SectionDivider label="部門" />
        <div className="space-y-0.5">
          {departmentNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Executive */}
        <SectionDivider label="経営" />
        <div className="space-y-0.5">
          {executiveNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-3 border-t border-gray-200/40 space-y-0.5">
        {bottomNav.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1.5 rounded-[10px] hover:bg-white/50 transition-colors cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-semibold">田</span>
          </div>
          <span className="text-[12px] text-gray-500 group-hover:text-gray-700 truncate transition-colors">田中太郎</span>
        </div>
      </div>
    </aside>
  )
}
