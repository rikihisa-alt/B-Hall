'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigation } from './sidebar-context'
import { useNavStore } from '@/stores/nav-store'
import { sections, toolItems, getSectionKeyFromPathname } from '@/lib/navigation'
import type { NavSection, NavToolItem } from '@/lib/navigation'
import { USER_ROLE_LABELS } from '@/lib/constants'

/* ────────────────────────────────────────── */
/*  Helper: get ordered nav items             */
/* ────────────────────────────────────────── */

type NavItem =
  | { type: 'section'; data: NavSection }
  | { type: 'tool'; data: NavToolItem }

function getOrderedItems(order: string[]): NavItem[] {
  const sectionMap = new Map(sections.map((s) => [s.key, s]))
  const toolMap = new Map(toolItems.map((t) => [t.key, t]))

  const items: NavItem[] = []
  for (const key of order) {
    const sec = sectionMap.get(key)
    if (sec) {
      items.push({ type: 'section', data: sec })
      continue
    }
    const tool = toolMap.get(key)
    if (tool) {
      items.push({ type: 'tool', data: tool })
    }
  }
  return items
}

/* ────────────────────────────────────────── */
/*  Header Component                          */
/* ────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, mounted } = useAuth()
  const {
    activeSection,
    setActiveSection,
    dropdownOpen,
    dropdownSection,
    openDropdown,
    closeDropdown,
  } = useNavigation()
  const { desktopOrder, setDesktopOrder } = useNavStore()

  const avatarInitial = mounted && currentUser ? currentUser.avatar_initial : '田'
  const roleLabel = mounted && currentUser ? USER_ROLE_LABELS[currentUser.role] : ''

  // Sync active section from pathname
  useEffect(() => {
    const key = getSectionKeyFromPathname(pathname)
    setActiveSection(key)
  }, [pathname, setActiveSection])

  // Ordered items for desktop
  const orderedItems = useMemo(() => getOrderedItems(desktopOrder), [desktopOrder])

  // ── Dropdown close on click outside ──
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        navRowRef.current &&
        !navRowRef.current.contains(e.target as Node)
      ) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen, closeDropdown])

  // ── Escape closes dropdown ──
  useEffect(() => {
    if (!dropdownOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [dropdownOpen, closeDropdown])

  // ── Drag reorder state (desktop) ──
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Use a transparent image as drag ghost
    const ghost = document.createElement('div')
    ghost.style.opacity = '0'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const newOrder = [...desktopOrder]
      const [removed] = newOrder.splice(dragIndex, 1)
      newOrder.splice(dragOverIndex, 0, removed)
      setDesktopOrder(newOrder)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, dragOverIndex, desktopOrder, setDesktopOrder])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  // ── Click handlers ──
  const handleItemClick = useCallback(
    (item: NavItem) => {
      if (item.type === 'tool') {
        router.push(item.data.href)
        closeDropdown()
        return
      }
      const section = item.data
      if (section.directNav || !section.subItems?.length) {
        router.push(section.href)
        closeDropdown()
      } else {
        openDropdown(section.key)
      }
    },
    [router, closeDropdown, openDropdown],
  )

  const handleSubItemClick = useCallback(
    (href: string) => {
      router.push(href)
      closeDropdown()
    },
    [router, closeDropdown],
  )

  // ── Current dropdown section data ──
  const currentDropdownSection = useMemo(() => {
    if (!dropdownSection) return null
    return sections.find((s) => s.key === dropdownSection) ?? null
  }, [dropdownSection])

  // ── Find the anchor position for the dropdown ──
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [dropdownLeft, setDropdownLeft] = useState(0)

  useEffect(() => {
    if (dropdownOpen && dropdownSection) {
      const el = itemRefs.current.get(dropdownSection)
      if (el) {
        const rect = el.getBoundingClientRect()
        const left = rect.left + rect.width / 2
        setDropdownLeft(left)
      }
    }
  }, [dropdownOpen, dropdownSection])

  return (
    <header className="h-14 md:h-16 border-b border-border bg-bg-surface flex items-center px-4 md:px-6 shrink-0 z-[200] relative">
      {/* ── Left: Logo ── */}
      <div className="flex items-center shrink-0">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="B-Hall"
            width={240}
            height={40}
            className="h-[28px] md:h-[36px] w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* ── Center: Desktop nav icons (hidden on mobile) ── */}
      <div className="hidden md:flex flex-1 mx-4 overflow-x-auto overflow-y-hidden" ref={navRowRef}>
        <div className="flex items-center gap-0.5 mx-auto">
          {orderedItems.map((item, index) => {
            const key = item.type === 'section' ? item.data.key : item.data.key
            const Icon = item.data.icon
            const label = item.type === 'section' ? item.data.shortLabel : item.data.label
            const isActive = activeSection === key
            const isDropdownTarget = dropdownOpen && dropdownSection === key
            const isDragging = dragIndex === index
            const isDragOver = dragOverIndex === index
            const isToolWithCount = item.type === 'tool' && (item.data as NavToolItem).count

            return (
              <button
                key={key}
                ref={(el) => {
                  if (el) itemRefs.current.set(key, el)
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
                onClick={() => handleItemClick(item)}
                className={`
                  relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-[10px]
                  transition-all duration-150 cursor-pointer group select-none
                  min-w-[52px]
                  ${isDragging ? 'opacity-30' : ''}
                  ${isDragOver ? 'bg-accent-muted/50' : ''}
                  ${isActive || isDropdownTarget
                    ? 'text-accent'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                  }
                `}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors duration-150 ${
                      isActive || isDropdownTarget ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                    }`}
                    strokeWidth={1.75}
                  />
                  {isToolWithCount && (
                    <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                      {(item.data as NavToolItem).count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight font-medium whitespace-nowrap ${
                  isActive || isDropdownTarget ? 'text-accent' : ''
                }`}>
                  {label}
                </span>
                {/* Active underline */}
                {(isActive || isDropdownTarget) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[9px] left-2 right-2 h-[2px] rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right: notification bell + user avatar ── */}
      <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
        <button className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-bg-elevated transition-colors cursor-pointer relative">
          <Bell className="w-[18px] h-[18px] text-text-secondary" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-muted text-accent text-[13px] font-semibold flex items-center justify-center cursor-pointer">
            {avatarInitial}
          </div>
          {mounted && currentUser && (
            <div className="hidden md:flex flex-col">
              <span className="text-[12px] font-medium text-text-primary leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {roleLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop dropdown panel ── */}
      <AnimatePresence>
        {dropdownOpen && currentDropdownSection && currentDropdownSection.subItems && (
          <motion.div
            ref={dropdownRef}
            key="desktop-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-14 md:top-16 z-[300] bg-white rounded-[16px] shadow-lg border border-border p-3"
            style={{
              left: `${dropdownLeft}px`,
              transform: 'translateX(-50%)',
              minWidth: '320px',
              maxWidth: '480px',
            }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 px-2 pb-2 mb-1 border-b border-border">
              {(() => {
                const Icon = currentDropdownSection.icon
                return <Icon className="w-4 h-4 text-accent" strokeWidth={1.75} />
              })()}
              <span className="text-[13px] font-semibold text-text-primary">
                {currentDropdownSection.label}
              </span>
            </div>

            {/* Sub-items grid */}
            <div className="grid grid-cols-2 gap-1">
              {currentDropdownSection.subItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <button
                    key={subItem.key}
                    onClick={() => handleSubItemClick(subItem.href)}
                    className="flex items-start gap-2.5 p-2.5 rounded-[12px] hover:bg-bg-elevated transition-colors cursor-pointer group text-left"
                  >
                    <SubIcon
                      className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5"
                      strokeWidth={1.75}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors">
                        {subItem.label}
                      </p>
                      {subItem.description && (
                        <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* View all link */}
            <button
              onClick={() => handleSubItemClick(currentDropdownSection.href)}
              className="flex items-center gap-1.5 w-full mt-1 pt-2 border-t border-border px-2 text-[12px] text-accent hover:text-accent/80 transition-colors cursor-pointer"
            >
              <span className="font-medium">{currentDropdownSection.label}を開く</span>
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
