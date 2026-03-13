'use client'

import { type ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex items-start justify-between mt-4">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-[-0.02em]">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-text-secondary mt-1">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
