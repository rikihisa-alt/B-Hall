'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Column<T> {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  actions?: (row: T) => ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const alignClass = (align?: string) => {
    if (align === 'center') return 'text-center'
    if (align === 'right') return 'text-right'
    return 'text-left'
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-base">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-[11px] font-semibold text-text-muted',
                  'uppercase tracking-[0.08em]',
                  alignClass(col.align)
                )}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border transition-all duration-150',
                'hover:bg-[rgba(255,255,255,0.03)] group',
                'border-l-[3px] border-l-transparent hover:border-l-accent',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col) => {
                const isNumeric = col.align === 'right'
                return (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3.5 text-[14px]',
                      alignClass(col.align),
                      isNumeric &&
                        'font-[var(--font-inter)] tabular-nums'
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? '')}
                  </td>
                )
              })}
              {actions && (
                <td className="px-4 py-3.5 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
