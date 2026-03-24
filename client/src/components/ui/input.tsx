'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-text-secondary mb-1.5"
          >
            {label}
            {required && <span className="text-accent"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'bg-bg-base border border-border rounded-[10px] px-4 py-3',
            'text-[15px] text-text-primary placeholder:text-text-muted',
            'w-full transition-all duration-150',
            'focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]',
            error &&
              'border-danger shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
