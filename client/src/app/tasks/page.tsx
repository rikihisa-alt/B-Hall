'use client'

import { motion } from 'framer-motion'

const statusColors: Record<string, string> = {
  '未着手': '#94A3B8',
  '進行中': '#0284C7',
  '確認待ち': '#D97706',
  '完了': '#059669',
}

const tasks = [
  { title: '新入社員オンボーディング準備', status: '進行中', category: '人事', assignee: '佐藤花子', date: '3/14' },
  { title: '月次経費レポート作成', status: '確認待ち', category: '経理', assignee: '高橋美咲', date: '3/10' },
  { title: 'NDA契約書最終確認', status: '完了', category: '法務', assignee: '鈴木一郎', date: '3/12' },
  { title: '社内研修プログラム企画', status: '未着手', category: '人事', assignee: '田中太郎', date: '3/20' },
  { title: 'オフィス備品発注', status: '進行中', category: '総務', assignee: '伊藤恵', date: '3/15' },
  { title: '決算準備チェックリスト', status: '未着手', category: '経理', assignee: '高橋美咲', date: '3/31' },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 28 },
  },
}

export default function TasksPage() {
  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <h1 className="text-[24px] font-bold text-[#1E293B]">タスク</h1>
        <p className="text-[14px] text-[#94A3B8] font-medium mt-1">6件のタスク</p>
      </motion.div>

      <motion.div
        className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#F1F5F9]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFBFC] transition-colors cursor-pointer"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColors[task.status] }}
            />
            <span className="text-[15px] font-semibold text-[#1E293B] flex-1 min-w-0 truncate">
              {task.title}
            </span>
            <span className="text-[13px] text-[#94A3B8] font-medium flex-shrink-0">
              {task.category}
            </span>
            <span className="text-[13px] text-[#64748B] font-medium flex-shrink-0">
              {task.assignee}
            </span>
            <span className="text-[13px] text-[#CBD5E1] tabular-nums font-medium flex-shrink-0">
              {task.date}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
