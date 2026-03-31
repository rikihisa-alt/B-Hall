'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid3X3, GripVertical, X } from 'lucide-react'
import { sections, toolItems } from '@/lib/navigation'
import type { NavSection, NavToolItem } from '@/lib/navigation'
import { useNavigation } from './sidebar-context'
import { useNavStore } from '@/stores/nav-store'
import { useI18n } from '@/stores/i18n-store'

/* ────────────────────────────────────────── */
/*  Helper: get ordered nav items             */
/* ────────────────────────────────────────── */

type NavItem =
  | { type: 'section'; data: NavSection }
  | { type: 'tool'; data: NavToolItem }

function getOrderedItems(order: string[]): NavItem[] {
  const sectionMap = new Map(sections.map((s) => [s.key, s]))
  const toolMap = new Map(toolItems.map((t) => [t.key, t]))
  const orderSet = new Set(order)

  const items: NavItem[] = []
  for (const key of order) {
    if (key === 'notifications' || key === 'settings') continue
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
  // Append any new items not yet in the saved order
  for (const s of sections) {
    if (!orderSet.has(s.key)) items.push({ type: 'section', data: s })
  }
  for (const t of toolItems) {
    if (!orderSet.has(t.key)) items.push({ type: 'tool', data: t })
  }
  return items
}

/* ────────────────────────────────────────── */
/*  Constants                                 */
/* ────────────────────────────────────────── */

const VISIBLE_COUNT = 4
const BOTTOM_BAR_HEIGHT = 68 // px

/* ────────────────────────────────────────── */
/*  BottomBar Component                       */
/* ────────────────────────────────────────── */

export function BottomBar() {
  const router = useRouter()
  const {
    activeSection,
    mobilePanelOpen,
    mobilePanelSection,
    openMobilePanel,
    closeMobilePanel,
    moreMenuOpen,
    setMoreMenuOpen,
  } = useNavigation()
  const { mobileOrder, setMobileOrder } = useNavStore()
  const { t } = useI18n()

  const orderedItems = useMemo(() => getOrderedItems(mobileOrder), [mobileOrder])
  const visibleItems = useMemo(() => orderedItems.slice(0, VISIBLE_COUNT), [orderedItems])

  // Find which key is effectively active (panel open overrides pathname-based)
  const effectiveActiveKey = mobilePanelOpen && mobilePanelSection ? mobilePanelSection : moreMenuOpen ? '__more__' : activeSection

  // ── Handle icon click ──
  const handleItemClick = useCallback(
    (item: NavItem) => {
      if (item.type === 'tool') {
        router.push(item.data.href)
        closeMobilePanel()
        setMoreMenuOpen(false)
        return
      }
      const section = item.data
      if (section.directNav || !section.subItems?.length) {
        router.push(section.href)
        closeMobilePanel()
        setMoreMenuOpen(false)
      } else {
        openMobilePanel(section.key)
      }
    },
    [router, closeMobilePanel, openMobilePanel, setMoreMenuOpen],
  )

  // ── Current panel section data ──
  const currentPanelSection = useMemo(() => {
    if (!mobilePanelSection) return null
    return sections.find((s) => s.key === mobilePanelSection) ?? null
  }, [mobilePanelSection])

  // ── Handle sub item click ──
  const handleSubItemClick = useCallback(
    (href: string) => {
      router.push(href)
      closeMobilePanel()
    },
    [router, closeMobilePanel],
  )

  // ── More menu item click ──
  const handleMoreItemClick = useCallback(
    (item: NavItem) => {
      setMoreMenuOpen(false)
      handleItemClick(item)
    },
    [setMoreMenuOpen, handleItemClick],
  )

  // ── Touch drag reorder for More menu ──
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [targetIdx, setTargetIdx] = useState<number | null>(null)
  const itemHeightRef = useRef(56)
  const listRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const currentOrderRef = useRef<string[]>([])

  useEffect(() => {
    currentOrderRef.current = mobileOrder
  }, [mobileOrder])

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    startYRef.current = e.touches[0].clientY
    setDragIdx(index)
    setTargetIdx(index)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragIdx === null || !listRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const listRect = listRef.current.getBoundingClientRect()
      const relativeY = touch.clientY - listRect.top
      const newTarget = Math.max(0, Math.min(orderedItems.length - 1, Math.floor(relativeY / itemHeightRef.current)))
      setTargetIdx(newTarget)
    },
    [dragIdx, orderedItems.length],
  )

  const handleTouchEnd = useCallback(() => {
    if (dragIdx !== null && targetIdx !== null && dragIdx !== targetIdx) {
      const newOrder = [...mobileOrder]
      const [removed] = newOrder.splice(dragIdx, 1)
      newOrder.splice(targetIdx, 0, removed)
      setMobileOrder(newOrder)
    }
    setDragIdx(null)
    setTargetIdx(null)
  }, [dragIdx, targetIdx, mobileOrder, setMobileOrder])

  // ── Compute reordered list for visual feedback ──
  const displayOrder = useMemo(() => {
    if (dragIdx === null || targetIdx === null || dragIdx === targetIdx) {
      return orderedItems
    }
    const result = [...orderedItems]
    const [removed] = result.splice(dragIdx, 1)
    result.splice(targetIdx, 0, removed)
    return result
  }, [orderedItems, dragIdx, targetIdx])

  return (
    <>
      {/* ── Bottom bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/[0.06] shadow-[0_-2px_16px_rgba(0,0,0,0.04)] z-[100] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]"
        style={{ height: `${BOTTOM_BAR_HEIGHT}px` }}
      >
        {visibleItems.map((item) => {
          const key = item.data.key
          const Icon = item.data.icon
          const label = t(item.data.labelKey)
          const isActive = effectiveActiveKey === key
          const isToolWithCount = item.type === 'tool' && (item.data as NavToolItem).count

          return (
            <button
              key={key}
              onClick={() => handleItemClick(item)}
              className={`
                flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-1 py-1 rounded-[10px]
                transition-colors duration-150 cursor-pointer relative
                ${isActive
                  ? 'text-text-primary z-[102]'
                  : 'text-text-muted'
                }
              `}
            >
              {/* Glass circle via layoutId */}
              {isActive && (
                <motion.div
                  layoutId="bottom-bar-glass"
                  className="absolute -top-3 w-14 h-14 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.1)] border border-white/50 z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className={`shrink-0 transition-all duration-150 ${
                    isActive ? 'w-[22px] h-[22px]' : 'w-5 h-5'
                  }`}
                  strokeWidth={isActive ? 1.75 : 1.5}
                />
                {isToolWithCount && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                    {(item.data as NavToolItem).count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-tight whitespace-nowrap ${
                isActive ? 'font-medium text-text-primary' : 'font-normal text-text-muted'
              }`}>
                {label}
              </span>
            </button>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setMoreMenuOpen(true)}
          className={`
            flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-1 py-1 rounded-[10px]
            transition-colors duration-150 cursor-pointer relative
            ${moreMenuOpen ? 'text-text-primary z-[102]' : 'text-text-muted'}
          `}
        >
          {effectiveActiveKey === '__more__' && (
            <motion.div
              layoutId="bottom-bar-glass"
              className="absolute -top-3 w-14 h-14 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.1)] border border-white/50 z-[-1]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Grid3X3 className={`shrink-0 ${moreMenuOpen ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} strokeWidth={moreMenuOpen ? 1.75 : 1.5} />
          <span className={`text-[10px] leading-tight ${moreMenuOpen ? 'font-medium text-text-primary' : 'font-normal text-text-muted'}`}>その他</span>
        </button>
      </nav>

      {/* ── Sub-items slide-up panel (positioned ABOVE bottom bar) ── */}
      <AnimatePresence>
        {mobilePanelOpen && currentPanelSection && currentPanelSection.subItems && (
          <>
            <motion.div
              key="mobile-panel-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[98] bg-black/40 md:hidden"
              onClick={closeMobilePanel}
            />
            <motion.div
              key="mobile-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              className="fixed left-0 right-0 z-[99] bg-white/90 backdrop-blur-xl rounded-t-[20px] shadow-2xl md:hidden max-h-[60vh] flex flex-col"
              style={{ bottom: `${BOTTOM_BAR_HEIGHT}px` }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Section header */}
              <div className="flex items-center gap-2.5 px-5 pb-3 border-b border-border/60">
                {(() => {
                  const Icon = currentPanelSection.icon
                  return <Icon className="w-[18px] h-[18px] text-text-secondary" strokeWidth={1.5} />
                })()}
                <h3 className="text-[15px] font-semibold text-text-primary flex-1">
                  {t(currentPanelSection.labelKeyFull)}
                </h3>
                <button
                  onClick={closeMobilePanel}
                  className="w-8 h-8 flex items-center justify-center rounded-[8px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Sub-items list */}
              <div className="flex-1 overflow-y-auto py-2">
                {currentPanelSection.subItems.map((subItem) => {
                  const SubIcon = subItem.icon
                  return (
                    <button
                      key={subItem.key}
                      onClick={() => handleSubItemClick(subItem.href)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.03] transition-colors cursor-pointer group text-left min-h-[48px]"
                    >
                      <SubIcon
                        className="w-[18px] h-[18px] text-text-muted group-hover:text-text-primary transition-colors shrink-0"
                        strokeWidth={1.5}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-text-primary group-hover:text-text-primary transition-colors">
                          {subItem.label}
                        </p>
                        {subItem.description && (
                          <p className="text-[12px] text-text-muted mt-0.5">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── More menu (slide-up, positioned ABOVE bottom bar) ── */}
      <AnimatePresence>
        {moreMenuOpen && (
          <>
            <motion.div
              key="more-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[98] bg-black/40 md:hidden"
              onClick={() => setMoreMenuOpen(false)}
            />
            <motion.div
              key="more-menu-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              className="fixed left-0 right-0 z-[99] bg-white/90 backdrop-blur-xl rounded-t-[20px] shadow-2xl md:hidden max-h-[75vh] flex flex-col"
              style={{ bottom: `${BOTTOM_BAR_HEIGHT}px` }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-border/60">
                <h3 className="text-[15px] font-semibold text-text-primary">
                  メニュー
                </h3>
                <button
                  onClick={() => setMoreMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-[8px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" strokeWidth={1.5} />
                </button>
              </div>

              <p className="px-5 pt-2 pb-1 text-[11px] text-text-muted">
                ドラッグハンドルで並び替え
              </p>

              {/* Reorderable list */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto py-1"
                onTouchMove={(e) => handleTouchMove(e)}
                onTouchEnd={handleTouchEnd}
              >
                {displayOrder.map((item, index) => {
                  const key = item.data.key
                  const Icon = item.data.icon
                  const labelKey = item.type === 'section' ? item.data.labelKeyFull : item.data.labelKey
                  const label = t(labelKey)
                  const isActive = activeSection === key
                  const isDragging = dragIdx !== null && displayOrder[index] === orderedItems[dragIdx]
                  const isToolWithCount = item.type === 'tool' && (item.data as NavToolItem).count

                  return (
                    <div
                      key={key}
                      className={`
                        flex items-center gap-2 px-3 min-h-[56px]
                        transition-all duration-100
                        ${isDragging ? 'opacity-50 scale-[0.98] shadow-md bg-bg-elevated rounded-[12px] mx-2' : ''}
                      `}
                    >
                      {/* Drag handle */}
                      <div
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted shrink-0 touch-none"
                      >
                        <GripVertical className="w-4 h-4" strokeWidth={1.5} />
                      </div>

                      {/* Item button */}
                      <button
                        onClick={() => handleMoreItemClick(item)}
                        className={`
                          flex-1 flex items-center gap-3 py-3 pr-3 rounded-[10px]
                          transition-colors duration-150 cursor-pointer group text-left min-h-[44px]
                          ${isActive ? 'text-text-primary' : 'text-text-primary'}
                        `}
                      >
                        <div className="relative">
                          <Icon
                            className={`w-5 h-5 shrink-0 ${isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`}
                            strokeWidth={1.5}
                          />
                          {isToolWithCount && (
                            <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                              {(item.data as NavToolItem).count}
                            </span>
                          )}
                        </div>
                        <span className={`text-[14px] font-medium ${isActive ? 'text-text-primary' : ''}`}>
                          {label}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
