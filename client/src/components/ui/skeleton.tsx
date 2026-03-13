'use client'

import { cn } from '@/lib/cn'

type SkeletonVariant =
  | 'text'
  | 'card'
  | 'metric'
  | 'table-row'
  | 'avatar'
  | 'rect'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string
  height?: string
  className?: string
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-40 w-full rounded-[16px]',
  metric: 'h-28 w-full rounded-[16px]',
  'table-row': 'h-12 w-full rounded',
  avatar: 'w-10 h-10 rounded-full',
  rect: '',
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-bg-elevated shimmer',
        variantStyles[variant],
        className
      )}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
    />
  )
}
