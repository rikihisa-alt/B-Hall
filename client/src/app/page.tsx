'use client'

import Link from 'next/link'
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
    color: '#3CB06C',
    count: 4,
  },
  {
    name: '人事',
    desc: '従業員・入退社・社保・手続き',
    href: '/hr',
    icon: Users,
    color: '#8B6CF7',
    count: 3,
  },
  {
    name: '総務',
    desc: '備品・設備・オフィス管理',
    href: '/general-affairs',
    icon: Building2,
    color: '#4A9FE8',
    count: 2,
  },
  {
    name: '契約',
    desc: '契約書・規程・法定文書',
    href: '/documents',
    icon: FolderOpen,
    color: '#E55A5A',
    count: 1,
  },
  {
    name: '申請',
    desc: 'ワークフロー・承認処理',
    href: '/applications',
    icon: FileText,
    color: '#6E7BF7',
    count: 5,
  },
  {
    name: '稟議',
    desc: '決裁プロセス管理',
    href: '/ringi',
    icon: Stamp,
    color: '#D4993D',
    count: 1,
  },
  {
    name: '報告',
    desc: '日報・インシデント・週報',
    href: '/reports',
    icon: ClipboardList,
    color: '#E08744',
  },
  {
    name: 'ドキュメント',
    desc: 'テンプレート・手順書・FAQ',
    href: '/knowledge',
    icon: BookOpen,
    color: '#C9A43E',
  },
  {
    name: '経営',
    desc: '分析・投資判断・可視化',
    href: '/management',
    icon: BarChart3,
    color: '#4A8FE8',
  },
  {
    name: '改善',
    desc: '提案・目安箱・フィードバック',
    href: '/improvements',
    icon: MessageSquare,
    color: '#D46BA3',
  },
  {
    name: 'ジジロボ',
    desc: 'AIアシスタント',
    href: '/assistant',
    icon: Bot,
    color: '#5ABDD6',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8">

      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-[32px] font-bold text-[#ECECEF] tracking-tight">
          ワークスペース
        </h1>
        <p className="text-[15px] text-[#4E4E56] mt-2">
          業務セクションを選んでください
        </p>
      </div>

      {/* Tile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-[800px] w-full">
        {tiles.map(tile => {
          const Icon = tile.icon
          return (
            <Link key={tile.href} href={tile.href}>
              <div className="group relative rounded-2xl bg-[#111114] border border-white/[0.04] hover:border-white/[0.08] p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5">

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${tile.color}14` }}
                >
                  <Icon className="w-6 h-6" style={{ color: tile.color }} />
                </div>

                {/* Text */}
                <h2 className="text-[16px] font-semibold text-[#ECECEF] mb-1 group-hover:text-white transition-colors">
                  {tile.name}
                </h2>
                <p className="text-[13px] text-[#4E4E56] leading-relaxed">
                  {tile.desc}
                </p>

                {/* Count Badge */}
                {tile.count && tile.count > 0 && (
                  <div className="absolute top-5 right-5 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-[#E55A5A] text-white text-[11px] font-bold px-1.5">
                    {tile.count}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
