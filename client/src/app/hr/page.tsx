'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  Filter,
  Search,
  UserCircle,
  Building2,
  Calendar,
  Shield,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserMinus,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  department: string
  position: string
  joinDate: string
  employmentType: string
  status: 'active' | 'leave' | 'probation'
  avatar: string
}

const demoEmployees: Employee[] = [
  { id: 'EMP-001', name: '田中太郎', department: '開発部', position: 'シニアエンジニア', joinDate: '2022-04-01', employmentType: '正社員', status: 'active', avatar: 'T' },
  { id: 'EMP-002', name: '佐藤花子', department: '人事部', position: '部長', joinDate: '2020-01-15', employmentType: '正社員', status: 'active', avatar: 'S' },
  { id: 'EMP-003', name: '鈴木一郎', department: '営業部', position: '課長', joinDate: '2021-07-01', employmentType: '正社員', status: 'active', avatar: 'S' },
  { id: 'EMP-004', name: '高橋美咲', department: '経理部', position: '担当', joinDate: '2024-04-01', employmentType: '正社員', status: 'probation', avatar: 'T' },
  { id: 'EMP-005', name: '山田健太', department: '開発部', position: 'エンジニア', joinDate: '2023-10-01', employmentType: '契約社員', status: 'active', avatar: 'Y' },
  { id: 'EMP-006', name: '伊藤恵', department: '総務部', position: '担当', joinDate: '2022-09-01', employmentType: '正社員', status: 'leave', avatar: 'I' },
  { id: 'EMP-007', name: '渡辺翔', department: '開発部', position: 'リードエンジニア', joinDate: '2021-04-01', employmentType: '正社員', status: 'active', avatar: 'W' },
  { id: 'EMP-008', name: '中村優子', department: '法務部', position: '担当', joinDate: '2024-01-15', employmentType: '正社員', status: 'active', avatar: 'N' },
]

const statusConfig = {
  active: { label: '在籍', color: 'text-emerald-600 bg-emerald-50' },
  leave: { label: '休職中', color: 'text-amber-600 bg-amber-50' },
  probation: { label: '試用期間', color: 'text-blue-600 bg-blue-50' },
}

const upcomingEvents = [
  { type: '入社', name: '新入社員2名', date: '2026-04-01', icon: UserPlus, color: 'text-emerald-500' },
  { type: '契約更新', name: '山田健太', date: '2026-03-31', icon: Calendar, color: 'text-amber-500' },
  { type: '有休付与', name: '全社員', date: '2026-04-01', icon: Calendar, color: 'text-blue-500' },
  { type: '健康診断', name: '対象者15名', date: '2026-04-15', icon: AlertCircle, color: 'text-red-500' },
]

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'events' | 'procedures'>('employees')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">人事・労務</h1>
          <p className="text-sm text-gray-500 mt-1">従業員情報・手続き・イベント管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-gray-600 hover:bg-white/80 transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            従業員追加
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">総従業員数</p>
              <p className="text-xl font-bold text-gray-900">42名</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">今月入社</p>
              <p className="text-xl font-bold text-gray-900">2名</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">今月退社</p>
              <p className="text-xl font-bold text-gray-900">0名</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">手続き未完了</p>
              <p className="text-xl font-bold text-gray-900">3件</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {[
          { key: 'employees' as const, label: '従業員一覧' },
          { key: 'events' as const, label: '予定イベント' },
          { key: 'procedures' as const, label: '手続き管理' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white shadow-sm text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <>
          {/* Search */}
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="従業員を検索..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoEmployees.map((emp) => {
              const status = statusConfig[emp.status]
              return (
                <div
                  key={emp.id}
                  className="glass rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                      {emp.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {emp.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{emp.position}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {emp.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {emp.employmentType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {emp.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <div key={idx} className="glass rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${event.color}`}>
                  <event.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">{event.type}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{event.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'procedures' && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">手続き管理</h3>
          <p className="text-xs text-gray-400">社保・雇保・年末調整等の手続き管理はこちらに表示されます</p>
        </div>
      )}
    </div>
  )
}
