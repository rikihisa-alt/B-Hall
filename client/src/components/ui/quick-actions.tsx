'use client'

import { Plus, FileUp, Clock, AlertTriangle } from 'lucide-react'

const actions = [
  { label: 'タスク作成', icon: Plus, color: 'bg-primary-500' },
  { label: '経費申請', icon: FileUp, color: 'bg-emerald-500' },
  { label: '日報提出', icon: Clock, color: 'bg-amber-500' },
  { label: '報告作成', icon: AlertTriangle, color: 'bg-rose-500' },
]

export function QuickActions() {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        クイックアクション
      </h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200/50 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm hover:border-gray-300/50 transition-all duration-200 active:scale-[0.98]"
            >
              <div className={`w-6 h-6 rounded-lg ${action.color} flex items-center justify-center`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
