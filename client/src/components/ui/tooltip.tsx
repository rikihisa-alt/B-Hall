'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true)
    }, 150)
  }, [])

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(false)
  }, [])

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}

      {visible && (
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 z-[var(--z-tooltip)]',
            'bg-bg-elevated border border-border rounded-[6px]',
            'px-2.5 py-1.5 text-[12px] text-text-primary shadow-md',
            'whitespace-nowrap pointer-events-none',
            'animate-[tooltip-fade-in_0.15s_ease-out_forwards]',
            side === 'top' && 'bottom-full mb-2',
            side === 'bottom' && 'top-full mt-2'
          )}
          style={{
            animation: `tooltip-fade-in 0.15s ease-out forwards`,
          }}
        >
          {content}
        </div>
      )}

      <style>{`
        @keyframes tooltip-fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(${side === 'top' ? '4px' : '-4px'});
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
