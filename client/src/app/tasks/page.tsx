'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'

type ViewMode = 'board' | 'list'
type TaskStatus = 'todo' | 'in_progress' | 'reviewing' | 'done'

interface Task {
  id: string
  title: string
  category: string
  assignee: string
  dueDate: string
  status: TaskStatus
  overdue?: boolean
}

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: '未着手', color: '#5A6070' },
  in_progress: { label: '進行中', color: '#60A5FA' },
  reviewing: { label: '確認待ち', color: '#F5A524' },
  done: { label: '完了', color: '#2FBF71' },
}

const demoTasks: Task[] = [
  {
    id: 'T-001',
    title: '新入社員オンボーディング準備',
    category: '人事',
    assignee: '佐藤花子',
    dueDate: '3/14',
    status: 'in_progress',
  },
  {
    id: 'T-002',
    title: '月次経費レポート作成',
    category: '経理',
    assignee: '高橋美咲',
    dueDate: '3/10',
    status: 'reviewing',
    overdue: true,
  },
  {
    id: 'T-003',
    title: 'NDA契約書最終確認',
    category: '法務',
    assignee: '鈴木一郎',
    dueDate: '3/12',
    status: 'done',
  },
  {
    id: 'T-004',
    title: '社内研修プログラム企画',
    category: '人事',
    assignee: '田中太郎',
    dueDate: '3/20',
    status: 'todo',
  },
  {
    id: 'T-005',
    title: 'オフィス備品発注',
    category: '総務',
    assignee: '伊藤恵',
    dueDate: '3/15',
    status: 'in_progress',
  },
  {
    id: 'T-006',
    title: '決算準備チェックリスト',
    category: '経理',
    assignee: '高橋美咲',
    dueDate: '3/31',
    status: 'todo',
  },
  {
    id: 'T-007',
    title: '就業規則改定案レビュー',
    category: '法務',
    assignee: '鈴木一郎',
    dueDate: '3/18',
    status: 'reviewing',
  },
  {
    id: 'T-008',
    title: '3月度請求書発行',
    category: '経理',
    assignee: '高橋美咲',
    dueDate: '3/25',
    status: 'todo',
  },
]

const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'reviewing', 'done']

export default function TasksPage() {
  const [view, setView] = useState<ViewMode>('board')

  return (
    <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[20px] font-semibold text-white/90">タスク</h1>
        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
            <button
              onClick={() => setView('board')}
              className={`p-1.5 rounded-md transition-all ${
                view === 'board'
                  ? 'bg-white/[0.06] text-[#7C8CFF]'
                  : 'text-[#3A3F4B] hover:text-[#5A6070]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${
                view === 'list'
                  ? 'bg-white/[0.06] text-[#7C8CFF]'
                  : 'text-[#3A3F4B] hover:text-[#5A6070]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-[#5A6070] hover:text-[#A8B0BD] hover:bg-white/[0.05] transition-all">
            <Plus className="w-3.5 h-3.5" />
            新規タスク
          </button>
        </div>
      </div>

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statusOrder.map((statusKey) => {
            const config = statusConfig[statusKey]
            const tasks = demoTasks.filter((t) => t.status === statusKey)

            return (
              <div key={statusKey} className="space-y-2.5">
                {/* Column Header */}
                <div className="flex items-center gap-2 px-1 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-[12px] font-medium text-[#A8B0BD]">
                    {config.label}
                  </span>
                  <span className="text-[11px] text-[#3A3F4B]">{tasks.length}</span>
                </div>

                {/* Task Cards */}
                <div className="space-y-2 min-h-[120px]">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.08] transition-all"
                    >
                      <p className="text-[13px] text-white/90 leading-snug mb-2">
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#5A6070]">{task.category}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] ${task.overdue ? 'text-red-400' : 'text-[#3A3F4B]'}`}>
                            {task.dueDate}
                          </span>
                          <div
                            className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-[#5A6070] font-medium"
                            title={task.assignee}
                          >
                            {task.assignee.charAt(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.06]">
          {demoTasks.map((task) => {
            const config = statusConfig[task.status]

            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                {/* Status Dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />

                {/* Title */}
                <span className="text-[13px] text-white/90 flex-1 min-w-0 truncate">
                  {task.title}
                </span>

                {/* Category */}
                <span className="text-[11px] text-[#5A6070] w-12 text-right flex-shrink-0">
                  {task.category}
                </span>

                {/* Assignee */}
                <div
                  className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-[#5A6070] font-medium flex-shrink-0"
                  title={task.assignee}
                >
                  {task.assignee.charAt(0)}
                </div>

                {/* Date */}
                <span className={`text-[11px] w-10 text-right flex-shrink-0 ${task.overdue ? 'text-red-400' : 'text-[#3A3F4B]'}`}>
                  {task.dueDate}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
