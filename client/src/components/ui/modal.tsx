'use client'

import { type ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { modalOverlay, modalPanel } from '@/lib/animation'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: ModalSize
  footer?: ReactNode
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-[420px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[800px]',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-overlay)]"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[var(--z-modal)] p-4">
            <motion.div
              className={cn(
                'bg-bg-elevated border border-border rounded-[24px] shadow-lg',
                'w-full overflow-hidden',
                sizeStyles[size]
              )}
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-[18px] font-bold text-text-primary">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'hover:bg-[rgba(255,255,255,0.06)]',
                    'text-text-muted hover:text-text-primary',
                    'transition-all hover:rotate-90 cursor-pointer'
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-5">{children}</div>

              {footer && (
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
