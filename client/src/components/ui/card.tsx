'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-surface border border-border rounded-[16px]',
        'shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  )
}
