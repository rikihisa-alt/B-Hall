'use client'

import { Calendar, MessageSquare } from 'lucide-react'
import { clsx } from 'clsx'

interface Task {
  id: string
  title: string
  assignee: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  dueDate: string
  status: string
  category: string
}

const priorityConfig = {
  urgent: { label: '緊急', class: 'bg-[#FF5D5D]/10 text-[#FF5D5D]' },
  high: { label: '高', class: 'bg-[#F5A524]/10 text-[#F5A524]' },
  medium: { label: '中', class: 'bg-[#7C8CFF]/10 text-[#7C8CFF]' },
  low: { label: '低', class: 'bg-white/[0.06] text-[#6B7280]' },
}

export function TaskCard({ task, variant = 'card' }: { task: Task; variant?: 'card' | 'list' }) {
  const priority = priorityConfig[task.priority]

  if (variant === 'list') {
    return (
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors cursor-pointer">
        <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full', priority.class)}>
          {priority.label}
        </span>
        <span className="flex-1 text-sm font-medium text-white/90">{task.title}</span>
        <span className="text-xs text-[#6B7280] bg-white/[0.06] px-2 py-1 rounded-lg">{task.category}</span>
        <div className="flex items-center gap-1.5 text-xs text-[#A8B0BD]">
          <Calendar className="w-3.5 h-3.5" />
          {task.dueDate}
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C8CFF] to-[#5A6AFF] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">{task.assignee[0]}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/[0.10] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full', priority.class)}>
          {priority.label}
        </span>
        <span className="text-xs text-[#5A6070] bg-white/[0.06] px-2 py-0.5 rounded-lg">{task.category}</span>
      </div>
      <h3 className="text-sm font-semibold text-white/90 mb-3 group-hover:text-[#7C8CFF] transition-colors">
        {task.title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            2
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C8CFF] to-[#5A6AFF] flex items-center justify-center shadow-sm">
          <span className="text-white text-[10px] font-bold">{task.assignee[0]}</span>
        </div>
      </div>
    </div>
  )
}
