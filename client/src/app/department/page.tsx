'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building,
  Users,
  Building2,
  FolderOpen,
  Calculator,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  FileCheck,
  Package,
  Receipt,
  AlertCircle,
  TrendingDown,
  Calendar,
  Shield,
} from 'lucide-react'

const modules = [
  {
    name: '人事・労務',
    description: '従業員管理・入退社・社保・手続き',
    icon: Users,
    href: '/hr',
    color: 'from-violet-500 to-violet-600',
    stats: [
      { label: '従業員数', value: 48 },
      { label: '入社予定', value: 2 },
      { label: '手続き中', value: 3 },
      { label: '有休消化率', value: '62%' },
    ],
    alerts: [
      { text: '佐藤太郎の入社手続き（3/15期限）', type: 'warning' as const },
      { text: '年度末健康診断の未受診者 5名', type: 'info' as const },
    ],
    recentItems: [
      { title: '佐藤太郎 入社手続き', status: '進行中', date: '3/15' },
      { title: '山田花子 異動手続き', status: '完了', date: '3/10' },
      { title: '社会保険 月次届出', status: '確認待ち', date: '3/14' },
    ],
  },
  {
    name: '総務',
    description: '備品・設備・庶務・オフィス管理',
    icon: Building2,
    href: '/general-affairs',
    color: 'from-sky-500 to-sky-600',
    stats: [
      { label: '管理備品', value: 156 },
      { label: '貸出中', value: 23 },
      { label: '発注待ち', value: 4 },
      { label: '修理依頼', value: 2 },
    ],
    alerts: [
      { text: 'プリンタートナー残量低下（3F）', type: 'warning' as const },
    ],
    recentItems: [
      { title: 'ノートPC貸出（鈴木）', status: '貸出中', date: '3/12' },
      { title: 'オフィス清掃手配', status: '完了', date: '3/11' },
      { title: '新入社員用備品セット発注', status: '発注済', date: '3/13' },
    ],
  },
  {
    name: '法務・文書',
    description: '契約書・規程・法定文書の一元管理',
    icon: FolderOpen,
    href: '/documents',
    color: 'from-rose-500 to-rose-600',
    stats: [
      { label: '管理文書', value: 234 },
      { label: '更新期限近', value: 3 },
      { label: '確認待ち', value: 2 },
      { label: '今月追加', value: 8 },
    ],
    alerts: [
      { text: '業務委託契約（A社）更新期限：3/31', type: 'warning' as const },
      { text: '就業規則改定の社内周知未完了', type: 'info' as const },
    ],
    recentItems: [
      { title: 'A社 業務委託契約書（更新）', status: '確認待ち', date: '3/31' },
      { title: 'B社 NDA', status: '締結済', date: '3/08' },
      { title: '就業規則 v3.2', status: '承認済', date: '3/05' },
    ],
  },
  {
    name: '経理・財務',
    description: '取引・請求・支払・資金管理',
    icon: Calculator,
    href: '/accounting',
    color: 'from-teal-500 to-teal-600',
    stats: [
      { label: '現預金', value: '¥12.8M' },
      { label: '未収入金', value: '¥3.2M' },
      { label: '未払金', value: '¥1.8M' },
      { label: '今月支出', value: '¥4.1M' },
    ],
    alerts: [
      { text: 'C社 入金遅延（¥520,000 / 3日超過）', type: 'danger' as const },
    ],
    recentItems: [
      { title: 'D社 請求書発行（¥1,200,000）', status: '発行済', date: '3/12' },
      { title: 'オフィス賃料支払い', status: '支払済', date: '3/10' },
      { title: 'C社 入金確認', status: '遅延', date: '3/10' },
    ],
  },
]

const quickActions = [
  { label: '従業員登録', icon: UserPlus, color: 'bg-violet-500', href: '/hr' },
  { label: '契約書確認', icon: FileCheck, color: 'bg-rose-500', href: '/documents' },
  { label: '備品申請', icon: Package, color: 'bg-sky-500', href: '/general-affairs' },
  { label: '経費処理', icon: Receipt, color: 'bg-teal-500', href: '/accounting' },
]

function getAlertStyle(type: 'warning' | 'info' | 'danger') {
  switch (type) {
    case 'danger': return 'bg-red-50 text-red-700 border-red-200/60'
    case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200/60'
    case 'info': return 'bg-blue-50 text-blue-700 border-blue-200/60'
  }
}

function getAlertIcon(type: 'warning' | 'info' | 'danger') {
  switch (type) {
    case 'danger': return <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />
    case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
    case 'info': return <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case '進行中': case '貸出中': return 'text-blue-600 bg-blue-50'
    case '完了': case '締結済': case '承認済': case '発行済': case '支払済': case '発注済': return 'text-emerald-600 bg-emerald-50'
    case '確認待ち': return 'text-amber-600 bg-amber-50'
    case '遅延': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export default function DepartmentPage() {
  const router = useRouter()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-xl hover:bg-white/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">部門管理</h1>
            <p className="text-sm text-gray-500">人事・総務・法務・経理の専門業務を横断管理</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          クイックアクション
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200/50 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm hover:border-gray-300/50 transition-all duration-200 active:scale-[0.98]"
              >
                <div className={`w-6 h-6 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                {action.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-5">
        {modules.map((mod) => {
          const ModIcon = mod.icon
          return (
            <div key={mod.name} className="glass rounded-2xl overflow-hidden">
              {/* Module Header */}
              <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-sm`}>
                      <ModIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{mod.name}</h3>
                      <p className="text-sm text-gray-500">{mod.description}</p>
                    </div>
                  </div>
                  <Link
                    href={mod.href}
                    className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    開く <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {mod.stats.map((stat) => (
                    <div key={stat.label} className="bg-white/50 rounded-lg px-3 py-2 text-center">
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[11px] text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Alerts */}
                {mod.alerts.length > 0 && (
                  <div className="space-y-2">
                    {mod.alerts.map((alert, idx) => (
                      <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${getAlertStyle(alert.type)}`}>
                        {getAlertIcon(alert.type)}
                        <span>{alert.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Items */}
              <div className="border-t border-gray-100/60 px-5 py-3">
                <p className="text-xs font-medium text-gray-400 mb-2">最近の項目</p>
                <div className="space-y-2">
                  {mod.recentItems.map((item, idx) => (
                    <Link key={idx} href={mod.href}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/60 transition-colors cursor-pointer">
                        <span className="flex-1 text-sm text-gray-700 truncate">{item.title}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
