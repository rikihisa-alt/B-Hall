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
  urgent: { label: '緊急', class: 'bg-red-100 text-red-700' },
  high: { label: '高', class: 'bg-orange-100 text-orange-700' },
  medium: { label: '中', class: 'bg-blue-100 text-blue-700' },
  low: { label: '低', class: 'bg-gray-100 text-gray-600' },
}

export function TaskCard({ task, variant = 'card' }: { task: Task; variant?: 'card' | 'list' }) {
  const priority = priorityConfig[task.priority]

  if (variant === 'list') {
    return (
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 transition-colors cursor-pointer">
        <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full', priority.class)}>
          {priority.label}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-900">{task.title}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{task.category}</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {task.dueDate}
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">{task.assignee[0]}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full', priority.class)}>
          {priority.label}
        </span>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">{task.category}</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
        {task.title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            2
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
          <span className="text-white text-[10px] font-bold">{task.assignee[0]}</span>
        </div>
      </div>
    </div>
  )
}
