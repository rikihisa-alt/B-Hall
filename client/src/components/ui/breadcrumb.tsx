'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-[13px]" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={index} className="inline-flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
            )}
            {isLast ? (
              <span className="text-text-secondary font-medium">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-text-muted">{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
