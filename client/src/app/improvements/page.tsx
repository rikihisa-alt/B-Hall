'use client'

import Link from 'next/link'
import {
  MessageSquare,
  Lightbulb,
  EyeOff,
  Clock,
  CheckCircle2,
  ArrowRight,
  ThumbsUp,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 改善
   セクション構成:
     今日の処理   → 新規提案・匿名投稿・対応中・実施済確認
     最近の提案   → ステータス付きリスト
     管理         → 一覧リンク
───────────────────────────────── */

const todayActions = [
  {
    name: '新規提案',
    sub: '改善アイデアを投稿',
    icon: Lightbulb,
    gradient: 'from-pink-500 to-pink-600',
    badge: 0,
    href: '/improvements',
  },
  {
    name: '匿名投稿',
    sub: '匿名で意見を送る',
    icon: EyeOff,
    gradient: 'from-violet-500 to-violet-600',
    badge: 0,
    href: '/improvements',
  },
  {
    name: '対応中の提案',
    sub: '進行状況を確認',
    icon: Clock,
    gradient: 'from-blue-500 to-blue-600',
    badge: 3,
    href: '/improvements',
  },
  {
    name: '実施済確認',
    sub: '効果を振り返る',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 0,
    href: '/improvements',
  },
]

const recentProposals = [
  {
    title: 'リモートワーク申請フローの簡素化',
    status: '検討中',
    statusColor: 'text-[#F5A524] bg-[#F5A524]/10',
    votes: 8,
    href: '/improvements',
  },
  {
    title: '社内勉強会の月次開催',
    status: '実施決定',
    statusColor: 'text-[#2FBF71] bg-[#2FBF71]/10',
    votes: 15,
    href: '/improvements',
  },
  {
    title: '経費精算のモバイル対応',
    status: '対応中',
    statusColor: 'text-[#60A5FA] bg-[#60A5FA]/10',
    votes: 12,
    href: '/improvements',
  },
]

export default function ImprovementsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">改善</h1>
          <p className="text-[13px] text-[#5A6070]">提案・目安箱・フィードバック</p>
        </div>
      </div>

      {/* ── 今日の処理 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          今日の処理
        </p>
        <div className="grid grid-cols-2 gap-3">
          {todayActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.name} href={action.href}>
                <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {action.badge > 0 && (
                      <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#FF5D5D] text-white text-[10px] font-bold px-1 leading-none ring-2 ring-[#0F1115]">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-white/85 group-hover:text-white transition-colors">{action.name}</p>
                  <p className="text-[11px] text-[#4B5263] mt-0.5">{action.sub}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 最近の提案 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          最近の提案
        </p>
        <div className="space-y-1">
          {recentProposals.map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">{item.title}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${item.statusColor}`}>
                  {item.status}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  {item.votes}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 管理 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          管理
        </p>
        <div className="space-y-1">
          <Link href="/improvements">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">提案一覧</p>
              </div>
              <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">全28件</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <EyeOff className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">匿名投稿一覧</p>
              </div>
              <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">12件</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/improvements">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">実施済み</p>
              </div>
              <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">8件</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
