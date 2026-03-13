'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  variant: ToastVariant
  message: string
  duration?: number
  onDismiss: (id: string) => void
}

const variantConfig: Record<
  ToastVariant,
  { icon: LucideIcon; borderColor: string; iconColor: string; barColor: string }
> = {
  success: {
    icon: CheckCircle,
    borderColor: 'border-l-success',
    iconColor: 'text-success',
    barColor: 'bg-success',
  },
  error: {
    icon: AlertCircle,
    borderColor: 'border-l-danger',
    iconColor: 'text-danger',
    barColor: 'bg-danger',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-warning',
    iconColor: 'text-warning',
    barColor: 'bg-warning',
  },
  info: {
    icon: Info,
    borderColor: 'border-l-info',
    iconColor: 'text-info',
    barColor: 'bg-info',
  },
}

export function Toast({
  id,
  variant,
  message,
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onDismiss(id)
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [id, duration, onDismiss])

  return (
    <motion.div
      layout
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'min-w-[320px] bg-bg-elevated border border-border rounded-[16px]',
        'shadow-lg overflow-hidden border-l-4',
        config.borderColor
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', config.iconColor)} />
        <p className="text-[14px] text-text-primary flex-1">{message}</p>
        <button
          onClick={() => onDismiss(id)}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
            'text-text-muted hover:text-text-primary',
            'hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer'
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-0.5 w-full">
        <div
          className={cn('h-full', config.barColor)}
          style={{
            animation: `progress-shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
    </motion.div>
  )
}
