'use client'

const statusColors: Record<string, string> = {
  '未着手': '#4E4E56',
  '進行中': '#4A9FE8',
  '確認待ち': '#D4993D',
  '完了': '#3CB06C',
}

const tasks = [
  { title: '新入社員オンボーディング準備', status: '進行中', category: '人事', assignee: '佐藤花子', date: '3/14' },
  { title: '月次経費レポート作成', status: '確認待ち', category: '経理', assignee: '高橋美咲', date: '3/10' },
  { title: 'NDA契約書最終確認', status: '完了', category: '法務', assignee: '鈴木一郎', date: '3/12' },
  { title: '社内研修プログラム企画', status: '未着手', category: '人事', assignee: '田中太郎', date: '3/20' },
  { title: 'オフィス備品発注', status: '進行中', category: '総務', assignee: '伊藤恵', date: '3/15' },
  { title: '決算準備チェックリスト', status: '未着手', category: '経理', assignee: '高橋美咲', date: '3/31' },
]

export default function TasksPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-[#ECECEF]">タスク</h1>
        <p className="text-[14px] text-[#4E4E56] mt-1">6件のタスク</p>
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-[#111114] overflow-hidden divide-y divide-white/[0.04]">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColors[task.status] }}
            />
            <span className="text-[14px] text-[#ECECEF] flex-1 min-w-0 truncate">
              {task.title}
            </span>
            <span className="text-[12px] text-[#3A3A42] flex-shrink-0">
              {task.category}
            </span>
            <span className="text-[12px] text-[#4E4E56] flex-shrink-0">
              {task.assignee}
            </span>
            <span className="text-[12px] text-[#3A3A42] tabular-nums flex-shrink-0">
              {task.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
