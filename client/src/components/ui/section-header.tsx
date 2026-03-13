'use client'

import { type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

interface SectionHeaderProps {
  label: string
  count?: number
  action?: ReactNode
}

export function SectionHeader({ label, count, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
          {label}
        </span>
        {count !== undefined && (
          <Badge variant="info" label={String(count)} />
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
