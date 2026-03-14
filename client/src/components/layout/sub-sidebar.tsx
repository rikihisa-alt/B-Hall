'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { sections } from '@/lib/navigation'
import { useNavigation } from './sidebar-context'

export function SubSidebar() {
  const router = useRouter()
  const { subSidebarOpen, subSidebarSection, closeSubSidebar } = useNavigation()

  // 現在のセクション設定を取得
  const currentSection = useMemo(() => {
    if (!subSidebarSection) return null
    return sections.find((s) => s.key === subSidebarSection) ?? null
  }, [subSidebarSection])

  // Escape キーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && subSidebarOpen) {
        closeSubSidebar()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [subSidebarOpen, closeSubSidebar])

  const handleItemClick = (href: string) => {
    router.push(href)
    closeSubSidebar()
  }

  return (
    <AnimatePresence>
      {subSidebarOpen && currentSection && currentSection.subItems && (
        <>
          {/* ── バックドロップ ── */}
          <motion.div
            key="sub-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-[68px] top-[120px] right-0 bottom-0 z-[140] bg-black/10"
            onClick={closeSubSidebar}
          />

          {/* ── パネル ── */}
          <motion.aside
            key="sub-sidebar-panel"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-[68px] top-[120px] bottom-0 w-[280px] z-[150] bg-bg-surface border-r border-border flex flex-col shadow-lg"
          >
            {/* ── ヘッダー ── */}
            <div className="flex items-center justify-between px-5 h-14 shrink-0 border-b border-border">
              <div className="flex items-center gap-2.5">
                {(() => {
                  const Icon = currentSection.icon
                  return <Icon className="w-[18px] h-[18px] text-accent" strokeWidth={1.75} />
                })()}
                <h2 className="text-[15px] font-semibold text-text-primary">
                  {currentSection.label}
                </h2>
              </div>
              <button
                onClick={closeSubSidebar}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* ── 業務リスト ── */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="space-y-px">
                {currentSection.subItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleItemClick(item.href)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[rgba(0,0,0,0.03)] transition-colors cursor-pointer group text-left"
                    >
                      <Icon
                        className="w-[18px] h-[18px] text-text-muted group-hover:text-accent transition-colors shrink-0"
                        strokeWidth={1.75}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-text-primary group-hover:text-accent transition-colors">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-[12px] text-text-muted mt-0.5 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        strokeWidth={1.75}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
