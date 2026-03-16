'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

interface NavigationContextValue {
  activeSection: string | null
  setActiveSection: (key: string | null) => void

  // Desktop dropdown
  dropdownOpen: boolean
  dropdownSection: string | null
  openDropdown: (sectionKey: string) => void
  closeDropdown: () => void

  // Mobile panel
  mobilePanelOpen: boolean
  mobilePanelSection: string | null
  openMobilePanel: (sectionKey: string) => void
  closeMobilePanel: () => void
  moreMenuOpen: boolean
  setMoreMenuOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

/* ────────────────────────────────────────── */
/*  Provider                                  */
/* ────────────────────────────────────────── */

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Desktop dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownSection, setDropdownSection] = useState<string | null>(null)

  // Mobile panel
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [mobilePanelSection, setMobilePanelSection] = useState<string | null>(null)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  const openDropdown = useCallback((sectionKey: string) => {
    if (dropdownOpen && dropdownSection === sectionKey) {
      setDropdownOpen(false)
      setDropdownSection(null)
    } else {
      setDropdownSection(sectionKey)
      setDropdownOpen(true)
    }
  }, [dropdownOpen, dropdownSection])

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false)
    setDropdownSection(null)
  }, [])

  const openMobilePanel = useCallback((sectionKey: string) => {
    setMobilePanelSection(sectionKey)
    setMobilePanelOpen(true)
  }, [])

  const closeMobilePanel = useCallback(() => {
    setMobilePanelOpen(false)
    setMobilePanelSection(null)
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        dropdownOpen,
        dropdownSection,
        openDropdown,
        closeDropdown,
        mobilePanelOpen,
        mobilePanelSection,
        openMobilePanel,
        closeMobilePanel,
        moreMenuOpen,
        setMoreMenuOpen,
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
