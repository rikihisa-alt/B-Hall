'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { sections, toolItems, getSectionKeyFromPathname } from '@/lib/navigation'
import { useNavigation } from './sidebar-context'
import { useAuth } from '@/hooks/use-auth'
import { USER_ROLE_LABELS } from '@/lib/constants'
import { Check } from 'lucide-react'

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
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useNavigation()

  const { currentUser, users, switchUser, mounted } = useAuth()

  // ── ユーザー切替ポップオーバー ──
  const [userPopoverOpen, setUserPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

  // パスからアクティブセクションを同期
  useEffect(() => {
    const key = getSectionKeyFromPathname(pathname)
    setActiveSection(key)
  }, [pathname, setActiveSection])

  // ポップオーバー外クリックで閉じる
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(e.target as Node) &&
      avatarRef.current &&
      !avatarRef.current.contains(e.target as Node)
    ) {
      setUserPopoverOpen(false)
    }
  }, [])

  useEffect(() => {
    if (userPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userPopoverOpen, handleClickOutside])

  // Escape キーでモバイルメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen, setMobileMenuOpen])

  const handleSectionClick = (section: typeof sections[number]) => {
    if (section.directNav) {
      router.push(section.href)
      closeSubSidebar()
      setMobileMenuOpen(false)
    } else {
      // On mobile, navigate directly instead of opening sub-sidebar
      if (mobileMenuOpen) {
        router.push(section.href)
        setMobileMenuOpen(false)
        closeSubSidebar()
      } else {
        openSubSidebar(section.key)
      }
    }
  }

  const handleToolClick = (href: string) => {
    router.push(href)
    closeSubSidebar()
    setMobileMenuOpen(false)
  }

  const handleUserSwitch = (userId: string) => {
    switchUser(userId)
    setUserPopoverOpen(false)
  }

  const avatarInitial = mounted && currentUser ? currentUser.avatar_initial : '田'

  /* ────────────────────────────────────────── */
  /*  Desktop Sidebar                           */
  /* ────────────────────────────────────────── */

  const desktopSidebar = (
    <aside className="hidden md:flex w-[68px] flex-col shrink-0 select-none bg-bg-elevated border-r border-border z-[100]">
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

      {/* ── ユーザーエリア（ユーザー切替ポップオーバー付き） ── */}
      <div className="relative border-t border-border p-2 flex justify-center">
        {/* ユーザー切替ポップオーバー */}
        {userPopoverOpen && (
          <div
            ref={popoverRef}
            className="absolute bottom-14 left-2 w-[220px] bg-bg-surface border border-border rounded-[16px] shadow-lg z-[300] overflow-hidden"
          >
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-[11px] font-medium text-text-muted">ユーザー切替</p>
            </div>
            <div className="py-1.5 max-h-[320px] overflow-y-auto">
              {users.map((user) => {
                const isCurrentUser = currentUser?.id === user.id
                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserSwitch(user.id)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer
                      transition-colors duration-100
                      ${isCurrentUser
                        ? 'bg-accent-muted'
                        : 'hover:bg-bg-elevated'
                      }
                    `}
                  >
                    {/* アバター */}
                    <div
                      className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
                        ${isCurrentUser
                          ? 'bg-accent text-white'
                          : 'bg-bg-elevated text-text-secondary border border-border'
                        }
                      `}
                    >
                      {user.avatar_initial}
                    </div>
                    {/* ユーザー情報 */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-medium truncate ${
                        isCurrentUser ? 'text-accent' : 'text-text-primary'
                      }`}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-text-muted truncate">
                        {USER_ROLE_LABELS[user.role]} / {user.department}
                      </p>
                    </div>
                    {/* チェックマーク */}
                    {isCurrentUser && (
                      <Check className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={2.5} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* アバターボタン */}
        <button
          ref={avatarRef}
          onClick={() => setUserPopoverOpen((prev) => !prev)}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer
            transition-all duration-150
            ${userPopoverOpen
              ? 'bg-accent text-white ring-2 ring-accent/30'
              : 'bg-accent text-white hover:ring-2 hover:ring-accent/30'
            }
          `}
        >
          {avatarInitial}
        </button>
      </div>
    </aside>
  )

  /* ────────────────────────────────────────── */
  /*  Mobile Drawer                             */
  /* ────────────────────────────────────────── */

  const mobileDrawer = (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* ── バックドロップ ── */}
          <motion.div
            key="mobile-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[250] bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* ── ドロワーパネル ── */}
          <motion.aside
            key="mobile-sidebar-panel"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-[260] bg-bg-surface flex flex-col shadow-2xl md:hidden"
          >
            {/* ── ヘッダー ── */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-border">
              <span className="text-[15px] font-semibold text-text-primary">メニュー</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                aria-label="メニューを閉じる"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* ── セクションナビ ── */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="space-y-0.5 px-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.key

                  return (
                    <button
                      key={section.key}
                      onClick={() => handleSectionClick(section)}
                      className={`
                        w-full flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-[10px]
                        transition-all duration-150 cursor-pointer group text-left
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
                      <span className={`text-[14px] font-medium flex-1 ${
                        isActive ? 'text-accent' : 'text-text-primary'
                      }`}>
                        {section.label}
                      </span>
                      {!section.directNav && (
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-accent' : 'text-text-muted'
                          }`}
                          strokeWidth={1.75}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* ── ツール（下部セパレータ） ── */}
              <div className="border-t border-border mt-2 pt-2 px-2 space-y-0.5">
                {toolItems.map((tool) => {
                  const Icon = tool.icon
                  const isActive = activeSection === tool.key

                  return (
                    <button
                      key={tool.key}
                      onClick={() => handleToolClick(tool.href)}
                      className={`
                        w-full flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-[10px]
                        transition-all duration-150 cursor-pointer group text-left
                        ${isActive
                          ? 'bg-accent-muted text-accent'
                          : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                        }
                      `}
                    >
                      <div className="relative">
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors duration-150 ${
                            isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                          }`}
                          strokeWidth={1.75}
                        />
                        {/* 通知バッジ */}
                        {tool.count && (
                          <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center px-1">
                            {tool.count}
                          </span>
                        )}
                      </div>
                      <span className={`text-[14px] font-medium ${
                        isActive ? 'text-accent' : 'text-text-primary'
                      }`}>
                        {tool.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* ── ユーザーエリア ── */}
            {mounted && currentUser && (
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-accent text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    {avatarInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      {USER_ROLE_LABELS[currentUser.role]} / {currentUser.department}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {desktopSidebar}
      {mobileDrawer}
    </>
  )
}
