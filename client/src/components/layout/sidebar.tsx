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

const workNav: NavItem[] = [
  { name: 'タスク', href: '/tasks', icon: CheckSquare, badge: 5 },
  { name: '申請・承認', href: '/applications', icon: FileText, badge: 3 },
  { name: '稟議', href: '/ringi', icon: Stamp, badge: 1 },
  { name: '報告', href: '/reports', icon: ClipboardList },
]

const deptNav: NavItem[] = [
  { name: '人事・労務', href: '/hr', icon: Users },
  { name: '総務', href: '/general-affairs', icon: Building2 },
  { name: '法務・文書', href: '/documents', icon: FolderOpen },
  { name: '経理・財務', href: '/accounting', icon: Calculator },
]

const mgmtNav: NavItem[] = [
  { name: '経営管理', href: '/management', icon: BarChart3 },
  { name: 'ナレッジ', href: '/knowledge', icon: Lightbulb },
  { name: '改善', href: '/improvements', icon: MessageSquare },
  { name: 'ジジロボ', href: '/assistant', icon: Bot },
]

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={clsx(
        'flex items-center gap-2.5 px-3 py-[7px] rounded-[10px] text-[13px] font-medium transition-all duration-150 group',
        isActive
          ? 'bg-white/[0.08] text-white'
          : 'text-[#7B8392] hover:text-[#A8B0BD] hover:bg-white/[0.04]'
      )}
    >
      <Icon
        className={clsx(
          'w-[15px] h-[15px] shrink-0 transition-colors',
          isActive ? 'text-[#7C8CFF]' : 'text-[#5A6070] group-hover:text-[#7B8392]'
        )}
      />
      <span className="flex-1 truncate">{item.name}</span>
      {item.badge && item.badge > 0 && (
        <span
          className={clsx(
            'min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-semibold px-1',
            isActive
              ? 'bg-[#7C8CFF] text-[#0F1115]'
              : 'bg-white/[0.08] text-[#7B8392]'
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-6 pb-1.5">
      <span className="text-[10px] font-semibold text-[#4B5263] uppercase tracking-[0.1em]">
        {children}
      </span>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[220px] bg-[#0F1115] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="h-12 flex items-center px-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-[7px] bg-gradient-to-br from-[#7C8CFF] to-[#6366F1] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">B</span>
          </div>
          <span className="text-[14px] font-semibold text-white/90 tracking-tight group-hover:text-white transition-colors">
            B-Hall
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 pb-2 overflow-y-auto">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <SectionLabel>業務</SectionLabel>
        <div className="space-y-0.5">
          {workNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <SectionLabel>部門</SectionLabel>
        <div className="space-y-0.5">
          {deptNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <SectionLabel>経営</SectionLabel>
        <div className="space-y-0.5">
          {mgmtNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-3 border-t border-white/[0.06] space-y-0.5">
        <NavLink item={{ name: '通知', href: '/notifications', icon: Bell, badge: 8 }} pathname={pathname} />
        <NavLink item={{ name: '設定', href: '/settings', icon: Settings }} pathname={pathname} />

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 rounded-[10px] hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C8CFF] to-[#6366F1] flex items-center justify-center shrink-0">
            <span className="text-[9px] font-semibold text-white">田</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-[#7B8392] group-hover:text-[#A8B0BD] truncate block transition-colors">田中太郎</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
