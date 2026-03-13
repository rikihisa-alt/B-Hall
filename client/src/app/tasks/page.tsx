'use client'

import { useState } from 'react'
import { Plus, Filter, LayoutGrid, List, Clock } from 'lucide-react'
import { TaskCard } from '@/components/ui/task-card'

type ViewMode = 'board' | 'list'

const statusColumns = [
  { key: 'todo', label: '未着手', color: 'bg-gray-400' },
  { key: 'in_progress', label: '進行中', color: 'bg-blue-500' },
  { key: 'reviewing', label: '確認待ち', color: 'bg-amber-500' },
  { key: 'done', label: '完了', color: 'bg-emerald-500' },
] as const

const demoTasks = [
  { id: '1', title: '月次経費レポート作成', assignee: '田中', priority: 'high' as const, dueDate: '3/15', status: 'todo', category: '経理' },
  { id: '2', title: '新入社員オンボーディング準備', assignee: '佐藤', priority: 'urgent' as const, dueDate: '3/14', status: 'todo', category: '人事' },
  { id: '3', title: '就業規則改定案のレビュー', assignee: '鈴木', priority: 'medium' as const, dueDate: '3/20', status: 'in_progress', category: '法務' },
  { id: '4', title: '備品発注リスト確認', assignee: '高橋', priority: 'low' as const, dueDate: '3/18', status: 'in_progress', category: '総務' },
  { id: '5', title: '3月度請求書発行', assignee: '田中', priority: 'high' as const, dueDate: '3/25', status: 'reviewing', category: '経理' },
  { id: '6', title: 'NDA契約書最終確認', assignee: '鈴木', priority: 'medium' as const, dueDate: '3/13', status: 'done', category: '法務' },
]

export default function TasksPage() {
  const [view, setView] = useState<ViewMode>('board')

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">タスク</h1>
          <p className="text-sm text-gray-500 mt-1">全 {demoTasks.length} 件のタスク</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center glass rounded-xl p-1">
            <button
              onClick={() => setView('board')}
              className={`p-2 rounded-lg transition-all ${view === 'board' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            新規タスク
          </button>
        </div>
      </div>

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {statusColumns.map((column) => {
            const tasks = demoTasks.filter((t) => t.status === column.key)
            return (
              <div key={column.key} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                  <span className="text-sm font-semibold text-gray-700">{column.label}</span>
                  <span className="text-xs text-gray-400 font-medium">{tasks.length}</span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="glass rounded-2xl divide-y divide-gray-100">
          {demoTasks.map((task) => (
            <TaskCard key={task.id} task={task} variant="list" />
          ))}
        </div>
      )}
    </div>
  )
}
