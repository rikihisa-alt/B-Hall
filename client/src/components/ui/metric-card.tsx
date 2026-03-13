'use client'

import { cn } from '@/lib/cn'
import { useCountUp } from '@/lib/use-count-up'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  change: number
  changeType: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  accentColor?: string
}

export function MetricCard({
  title,
  value,
  prefix,
  suffix,
  change,
  changeType,
  icon: Icon,
  accentColor,
}: MetricCardProps) {
  const animatedValue = useCountUp(value)

  const changeStyles = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-text-muted',
  }

  const changePrefix = {
    up: '+',
    down: '-',
    neutral: '',
  }

  return (
    <div
      className={cn(
        'bg-bg-surface border border-border rounded-[16px] p-5',
        'shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]',
        'border-l-[3px] transition-all duration-[250ms]',
        'hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
      )}
      style={{
        borderLeftColor: accentColor || 'var(--color-accent)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{
            backgroundColor: accentColor
              ? `${accentColor}26`
              : 'var(--color-accent-muted)',
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: accentColor || 'var(--color-accent)' }}
          />
        </div>
      </div>

      <div
        className="text-[36px] font-bold tracking-[-0.03em] text-text-primary"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {prefix}
        {animatedValue.toLocaleString()}
        {suffix}
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[13px] text-text-muted">{title}</span>
        <span className={cn('text-[12px] font-medium', changeStyles[changeType])}>
          {changePrefix[changeType]}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  )
}
