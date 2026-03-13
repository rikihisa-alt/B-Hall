'use client'

import { cn } from '@/lib/cn'

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'processing'

interface BadgeProps {
  variant: BadgeVariant
  label: string
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success:
    'bg-[rgba(34,197,94,0.15)] text-success border border-[rgba(34,197,94,0.3)]',
  warning:
    'bg-[rgba(245,158,11,0.15)] text-warning border border-[rgba(245,158,11,0.3)]',
  danger:
    'bg-[rgba(239,68,68,0.15)] text-danger border border-[rgba(239,68,68,0.3)]',
  info: 'bg-[rgba(59,130,246,0.15)] text-info border border-[rgba(59,130,246,0.3)]',
  neutral: 'bg-bg-elevated text-text-muted border border-border',
  processing:
    'bg-[rgba(245,158,11,0.15)] text-warning border border-[rgba(245,158,11,0.3)]',
}

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        'inline-flex items-center gap-1.5',
        variantStyles[variant],
        className
      )}
    >
      {variant === 'processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-warning pulse-dot" />
      )}
      {label}
    </span>
  )
}
