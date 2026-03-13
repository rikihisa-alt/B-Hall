'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Users,
  Building2,
  FolderOpen,
  FileText,
  Stamp,
  ClipboardList,
  BookOpen,
  BarChart3,
  MessageSquare,
  Bot,
} from 'lucide-react'

const tiles = [
  {
    name: '経理',
    desc: '経費・請求・支払・資金管理',
    href: '/accounting',
    icon: Calculator,
    color: '#059669',
    bg: '#ECFDF5',
    count: 4,
  },
  {
    name: '人事',
    desc: '従業員・入退社・社保・手続き',
    href: '/hr',
    icon: Users,
    color: '#7C3AED',
    bg: '#F5F3FF',
    count: 3,
  },
  {
    name: '総務',
    desc: '備品・設備・オフィス管理',
    href: '/general-affairs',
    icon: Building2,
    color: '#0284C7',
    bg: '#F0F9FF',
    count: 2,
  },
  {
    name: '契約',
    desc: '契約書・規程・法定文書',
    href: '/documents',
    icon: FolderOpen,
    color: '#DC2626',
    bg: '#FEF2F2',
    count: 1,
  },
  {
    name: '申請',
    desc: 'ワークフロー・承認処理',
    href: '/applications',
    icon: FileText,
    color: '#6366F1',
    bg: '#EEF2FF',
    count: 5,
  },
  {
    name: '稟議',
    desc: '決裁プロセス管理',
    href: '/ringi',
    icon: Stamp,
    color: '#D97706',
    bg: '#FFFBEB',
    count: 1,
  },
  {
    name: '報告',
    desc: '日報・インシデント・週報',
    href: '/reports',
    icon: ClipboardList,
    color: '#EA580C',
    bg: '#FFF7ED',
  },
  {
    name: 'ドキュメント',
    desc: 'テンプレート・手順書・FAQ',
    href: '/knowledge',
    icon: BookOpen,
    color: '#CA8A04',
    bg: '#FEFCE8',
  },
  {
    name: '経営',
    desc: '分析・投資判断・可視化',
    href: '/management',
    icon: BarChart3,
    color: '#0369A1',
    bg: '#F0F9FF',
  },
  {
    name: '改善',
    desc: '提案・目安箱・フィードバック',
    href: '/improvements',
    icon: MessageSquare,
    color: '#DB2777',
    bg: '#FDF2F8',
  },
  {
    name: 'ジジロボ',
    desc: 'AIアシスタント',
    href: '/assistant',
    icon: Bot,
    color: '#0891B2',
    bg: '#ECFEFF',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-10">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.05 }}
        className="text-center mb-16"
      >
        <h1 className="text-[36px] font-bold text-[#1E293B] tracking-tight">
          ワークスペース
        </h1>
        <p className="text-[16px] text-[#94A3B8] mt-3 font-medium">
          業務セクションを選んでください
        </p>
      </motion.div>

      {/* Bento Tile Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[880px] w-full"
      >
        {tiles.map(tile => {
          const Icon = tile.icon
          return (
            <motion.div key={tile.href} variants={cardVariant}>
              <Link href={tile.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group relative rounded-3xl bg-white p-7 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: tile.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: tile.color }} />
                  </div>

                  {/* Text */}
                  <h2 className="text-[17px] font-bold text-[#1E293B] mb-1.5 tracking-tight">
                    {tile.name}
                  </h2>
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed font-medium">
                    {tile.desc}
                  </p>

                  {/* Count Badge */}
                  {tile.count && tile.count > 0 && (
                    <div className="absolute top-6 right-6 min-w-[24px] h-6 flex items-center justify-center rounded-full bg-[#E11D48] text-white text-[12px] font-bold px-2 shadow-[0_2px_8px_rgba(225,29,72,0.3)]">
                      {tile.count}
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
