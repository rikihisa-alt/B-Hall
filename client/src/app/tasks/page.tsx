'use client'

import { motion } from 'framer-motion'

const statusColors: Record<string, string> = {
  '未着手': '#64748b',
  '進行中': '#38bdf8',
  '確認待ち': '#fbbf24',
  '完了': '#34d399',
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

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
}

export default function TasksPage() {
  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">タスク</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">6件のタスク</p>
      </motion.div>

      <motion.div
        className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden divide-y divide-white/[0.06]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.06] hover:-translate-y-px transition-all duration-150 cursor-pointer"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColors[task.status] }}
            />
            <span className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight flex-1 min-w-0 truncate">
              {task.title}
            </span>
            <span className="text-[12px] text-[#94a3b8] flex-shrink-0">
              {task.category}
            </span>
            <span className="text-[12px] text-[#94a3b8] flex-shrink-0">
              {task.assignee}
            </span>
            <span className="text-[12px] text-[#94a3b8] tabular-nums flex-shrink-0">
              {task.date}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
