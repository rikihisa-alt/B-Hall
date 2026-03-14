'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { sections, toolItems, getSectionKeyFromPathname } from '@/lib/navigation'
import { useNavigation } from './sidebar-context'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    activeSection,
    setActiveSection,
    subSidebarOpen,
    subSidebarSection,
    openSubSidebar,
    closeSubSidebar,
  } = useNavigation()

  // パスからアクティブセクションを同期
  useEffect(() => {
    const key = getSectionKeyFromPathname(pathname)
    setActiveSection(key)
  }, [pathname, setActiveSection])

  const handleSectionClick = (section: typeof sections[number]) => {
    if (section.directNav) {
      // 直接遷移 → ページ遷移 + 第2サイドバーを閉じる
      router.push(section.href)
      closeSubSidebar()
    } else {
      // 第2サイドバーを開く/トグル
      openSubSidebar(section.key)
    }
  }

  const handleToolClick = (href: string) => {
    router.push(href)
    closeSubSidebar()
  }

  return (
    <aside className="h-screen w-[68px] flex flex-col shrink-0 select-none bg-bg-elevated border-r border-border z-[100]">
      {/* ── ヘッダー揃え用スペーサー ── */}
      <div className="h-16 shrink-0" />

      {/* ── セクションナビ ── */}
      <nav className="flex-1 overflow-y-auto py-1 flex flex-col">
        <div className="flex-1 space-y-0.5 px-1.5">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.key
            const isSubOpen = subSidebarOpen && subSidebarSection === section.key

            return (
              <button
                key={section.key}
                onClick={() => handleSectionClick(section)}
                className={`
                  w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-[10px]
                  transition-all duration-150 cursor-pointer group
                  ${isActive || isSubOpen
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors duration-150 ${
                    isActive || isSubOpen ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                  }`}
                  strokeWidth={1.75}
                />
                <span className={`text-[10px] leading-tight font-medium truncate max-w-full ${
                  isActive || isSubOpen ? 'text-accent' : ''
                }`}>
                  {section.shortLabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── ツール（下部セパレータ） ── */}
        <div className="border-t border-border mt-1 pt-1 px-1.5 space-y-0.5">
          {toolItems.map((tool) => {
            const Icon = tool.icon
            const isActive = activeSection === tool.key

            return (
              <button
                key={tool.key}
                onClick={() => handleToolClick(tool.href)}
                className={`
                  relative w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-[10px]
                  transition-all duration-150 cursor-pointer group
                  ${isActive
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                  }`}
                  strokeWidth={1.75}
                />
                <span className={`text-[10px] leading-tight font-medium ${
                  isActive ? 'text-accent' : ''
                }`}>
                  {tool.label}
                </span>
                {/* 通知バッジ */}
                {tool.count && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {tool.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── ユーザーエリア ── */}
      <div className="border-t border-border p-2 flex justify-center">
        <button className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold cursor-pointer hover:ring-2 hover:ring-accent/30 transition-all">
          田
        </button>
      </div>
    </aside>
  )
}
