'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface Module {
  name: string
  description: string
  icon: LucideIcon
  href: string
  badge?: number
  color: string
}

export function LauncherCard({ module }: { module: Module }) {
  const Icon = module.icon

  return (
    <Link href={module.href}>
      <div className="group relative glass rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
        {/* Badge */}
        {module.badge && module.badge > 0 && (
          <span className="absolute top-4 right-4 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold px-1.5 shadow-sm">
            {module.badge}
          </span>
        )}

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Text */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
          {module.name}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          {module.description}
        </p>
      </div>
    </Link>
  )
}
