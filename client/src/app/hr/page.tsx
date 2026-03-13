'use client'

import Link from 'next/link'
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  UserCheck,
  ClipboardList,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react'

const today = [
  { name: '入退社手続き', desc: '佐藤太郎 入社（3/15 期限）', icon: UserPlus,  count: 2, href: '/hr' },
  { name: '届出・申請',   desc: '社保届出・雇保手続き',       icon: FileText,  count: 3, href: '/hr' },
  { name: '勤怠確認',     desc: '月次勤怠の確認・承認',       icon: Calendar,  count: 0, href: '/hr' },
  { name: '異動・評価',   desc: '人事異動・昇格管理',         icon: UserCheck, count: 1, href: '/hr' },
]

const manage = [
  { name: '従業員一覧', meta: '42名 在籍',          icon: Users,         href: '/hr' },
  { name: '組織図',      meta: '部署・チーム構成',    icon: ClipboardList, href: '/hr' },
  { name: '雇用契約',    meta: '契約更新 1件期限近',  icon: FileText,      href: '/hr' },
]

const systems = [
  { name: '社会保険', meta: '加入・喪失管理',    icon: Shield,   href: '/hr' },
  { name: '年末調整', meta: '次回 12月',         icon: Calendar, href: '/hr' },
  { name: '健康診断', meta: '4月実施 未受診5名', icon: Heart,    href: '/hr' },
  { name: '就業規則', meta: 'v3.2 最新',         icon: FileText, href: '/hr' },
]

export default function HRPage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B6CF714' }}>
          <Users className="w-6 h-6 text-[#8B6CF7]" />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#ECECEF] tracking-tight">人事</h1>
          <p className="text-[14px] text-[#4E4E56]">従業員・入退社・社保・手続き</p>
        </div>
      </div>

      {/* 今日の処理 */}
      <section className="mb-10">
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">今日の処理</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {today.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                    <p className="text-[12px] text-[#3A3A42] mt-0.5">{item.desc}</p>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[12px] font-semibold text-[#E55A5A] tabular-nums">{item.count}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 管理 */}
      <section className="mb-10">
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">管理</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {manage.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <p className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[13px] text-[#3A3A42]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 制度・法定 */}
      <section>
        <h2 className="text-[11px] font-medium text-[#3A3A42] tracking-wide mb-3 px-1">制度・法定</h2>
        <div className="rounded-xl border border-white/[0.04] bg-[#111114] divide-y divide-white/[0.04]">
          {systems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <Icon className="w-[18px] h-[18px] text-[#4E4E56] group-hover:text-[#6E7BF7] transition-colors shrink-0" />
                  <p className="flex-1 text-[14px] text-[#ECECEF] group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[13px] text-[#3A3A42]">{item.meta}</span>
                  <ChevronRight className="w-4 h-4 text-[#2A2A32] group-hover:text-[#4E4E56] transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
