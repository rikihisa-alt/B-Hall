'use client'

import Link from 'next/link'
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  FileText,
  PieChart,
  ArrowRight,
  AlertCircle,
  Clock,
  Shield,
  Target,
} from 'lucide-react'

/* ─────────────────────────────────
   Workspace: 経営管理
   セクション構成:
     指標    → 月間売上・営業利益・従業員数・リスク
     分析    → 月次レポート・収支分析・部門別分析・投資判断支援
     注意事項 → アラート
───────────────────────────────── */

const metrics = [
  { label: '月間売上', value: '\u00A58.4M', change: '+12.3%', positive: true },
  { label: '営業利益', value: '\u00A51.53M', change: '18.2%', positive: true },
  { label: '従業員', value: '48名', change: '', positive: true },
  { label: 'リスク', value: '3件', change: '', positive: false },
]

const analysis = [
  { name: '月次レポート', sub: '3月度 作成中', icon: FileText, href: '/management' },
  { name: '収支分析', sub: '費目別・推移', icon: PieChart, href: '/management' },
  { name: '部門別分析', sub: '負荷・進捗', icon: BarChart3, href: '/management' },
  { name: '投資判断支援', sub: '稟議・ROI', icon: Target, href: '/management' },
]

const alerts = [
  { text: '高額稟議 1件が未決裁（オフィス移転 ¥15M）', type: 'warning' as const },
  { text: '離職率 2.1% — 前月比 +0.3pt', type: 'info' as const },
]

function getAlertStyle(type: 'danger' | 'warning' | 'info') {
  switch (type) {
    case 'danger': return 'bg-[#FF5D5D]/8 text-[#FF5D5D] border-[#FF5D5D]/15'
    case 'warning': return 'bg-[#F5A524]/8 text-[#F5A524] border-[#F5A524]/15'
    case 'info': return 'bg-[#60A5FA]/8 text-[#60A5FA] border-[#60A5FA]/15'
  }
}

export default function ManagementPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">

      {/* ── Workspace Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white/90 tracking-tight">経営管理</h1>
          <p className="text-[13px] text-[#5A6070]">分析・投資判断・経営可視化</p>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] ${getAlertStyle(alert.type)}`}>
            {alert.type === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{alert.text}</span>
          </div>
        ))}
      </div>

      {/* ── 主要指標 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          主要指標
        </p>
        <div className="grid grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white/[0.04] rounded-xl p-4">
              <p className="text-xs text-[#5A6070]">{m.label}</p>
              <p className="text-xl font-bold text-white/90 mt-1">{m.value}</p>
              {m.change && (
                <p className={`text-xs mt-1 ${m.positive ? 'text-[#2FBF71]' : 'text-[#FF5D5D]'}`}>
                  {m.change}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 分析 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          分析
        </p>
        <div className="space-y-1">
          {analysis.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">{item.name}</p>
                  </div>
                  <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">{item.sub}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 注意事項 ── */}
      <section>
        <p className="text-[10px] font-semibold text-[#3A3F4B] uppercase tracking-[0.1em] px-1 mb-3">
          注意事項
        </p>
        <div className="space-y-1">
          <Link href="/management">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#F5A524]/10 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#F5A524]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">高額稟議 未決裁</p>
              </div>
              <span className="text-[12px] text-[#F5A524]">1件</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">離職率モニタリング</p>
              </div>
              <span className="text-[12px] text-[#60A5FA]">2.1%</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/management">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-[#5A6070] group-hover:text-[#7C8CFF] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#A8B0BD] group-hover:text-white/90 transition-colors">資金繰り予測</p>
              </div>
              <span className="text-[12px] text-[#3A3F4B] group-hover:text-[#5A6070] transition-colors">3ヶ月先まで</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E323B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
