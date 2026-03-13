'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: LucideIcon
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold',
    'shadow-[0_0_20px_rgba(37,99,235,0.35)]',
    'hover:-translate-y-[2px] hover:brightness-110 hover:shadow-[0_0_28px_rgba(37,99,235,0.5)]',
    'active:translate-y-0 active:shadow-[0_0_12px_rgba(37,99,235,0.2)]',
  ].join(' '),
  secondary: [
    'bg-transparent border border-[rgba(37,99,235,0.4)] text-accent',
    'hover:bg-accent-muted hover:border-accent',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-secondary',
    'hover:bg-[rgba(255,255,255,0.06)] hover:text-text-primary',
  ].join(' '),
  danger: [
    'bg-transparent text-danger',
    'hover:bg-[rgba(239,68,68,0.12)]',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-5 text-[14px] min-h-[48px]',
  lg: 'h-12 px-6 text-[15px] min-h-[48px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-[10px] transition-all duration-200 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            {children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
