'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'b-hall-sidebar-collapsed'

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

interface NavigationContextValue {
  // 左サイドバー collapse（将来用に保持）
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggleCollapsed: () => void

  // アクティブセクション
  activeSection: string | null
  setActiveSection: (key: string | null) => void

  // 第2サイドバー
  subSidebarOpen: boolean
  subSidebarSection: string | null
  openSubSidebar: (sectionKey: string) => void
  closeSubSidebar: () => void

  // モバイルメニュー
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

/* ────────────────────────────────────────── */
/*  Provider                                  */
/* ────────────────────────────────────────── */

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [subSidebarOpen, setSubSidebarOpen] = useState(false)
  const [subSidebarSection, setSubSidebarSection] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // localStorage からサイドバー状態を復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) setCollapsedState(stored === 'true')
    } catch {
      // localStorage unavailable
    }
  }, [])

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // localStorage unavailable
    }
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // localStorage unavailable
      }
      return next
    })
  }, [])

  // 第2サイドバーを開く（同じセクション再クリックでトグル閉じ）
  const openSubSidebar = useCallback((sectionKey: string) => {
    setSubSidebarOpen((prevOpen) => {
      if (prevOpen && subSidebarSection === sectionKey) {
        // 同じセクションを再クリック → 閉じる
        setSubSidebarSection(null)
        return false
      }
      // 新しいセクション or 閉じている状態 → 開く
      setSubSidebarSection(sectionKey)
      return true
    })
  }, [subSidebarSection])

  const closeSubSidebar = useCallback(() => {
    setSubSidebarOpen(false)
    setSubSidebarSection(null)
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
        activeSection,
        setActiveSection,
        subSidebarOpen,
        subSidebarSection,
        openSubSidebar,
        closeSubSidebar,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

/* ────────────────────────────────────────── */
/*  Hook                                      */
/* ────────────────────────────────────────── */

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return ctx
}
