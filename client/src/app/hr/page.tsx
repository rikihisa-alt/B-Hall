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
  active: { label: '在籍', color: 'text-[#2FBF71] bg-[#2FBF71]/10' },
  leave: { label: '休職中', color: 'text-[#F5A524] bg-[#F5A524]/10' },
  probation: { label: '試用期間', color: 'text-[#60A5FA] bg-[#60A5FA]/10' },
}

const upcomingEvents = [
  { type: '入社', name: '新入社員2名', date: '2026-04-01', icon: UserPlus, color: 'text-[#2FBF71]' },
  { type: '契約更新', name: '山田健太', date: '2026-03-31', icon: Calendar, color: 'text-[#F5A524]' },
  { type: '有休付与', name: '全社員', date: '2026-04-01', icon: Calendar, color: 'text-[#60A5FA]' },
  { type: '健康診断', name: '対象者15名', date: '2026-04-15', icon: AlertCircle, color: 'text-[#FF5D5D]' },
]

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'events' | 'procedures'>('employees')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">人事・労務</h1>
          <p className="text-sm text-[#5A6070] mt-1">従業員情報・手続き・イベント管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-[#A8B0BD] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
            <Filter className="w-4 h-4" />
            フィルタ
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8D9BFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            従業員追加
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#7C8CFF]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">総従業員数</p>
              <p className="text-xl font-bold text-white/90">42名</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#2FBF71]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">今月入社</p>
              <p className="text-xl font-bold text-white/90">2名</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-[#FF5D5D]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">今月退社</p>
              <p className="text-xl font-bold text-white/90">0名</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F5A524]" />
            </div>
            <div>
              <p className="text-xs text-[#5A6070]">手続き未完了</p>
              <p className="text-xl font-bold text-white/90">3件</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
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
                ? 'bg-white/[0.08] text-white'
                : 'text-[#5A6070] hover:text-[#A8B0BD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <>
          {/* Search */}
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Search className="w-4 h-4 text-[#5A6070]" />
            <input
              type="text"
              placeholder="従業員を検索..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-[#5A6070]"
            />
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoEmployees.map((emp) => {
              const status = statusConfig[emp.status]
              return (
                <div
                  key={emp.id}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C8CFF] to-[#6366F1] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                      {emp.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white/90 group-hover:text-[#7C8CFF] transition-colors">
                          {emp.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#A8B0BD] mt-0.5">{emp.position}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#5A6070]">
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
            <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center ${event.color}`}>
                  <event.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5A6070] font-medium">{event.type}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white/90">{event.name}</h3>
                </div>
                <span className="text-sm text-[#A8B0BD]">{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'procedures' && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#4B5263]" />
          </div>
          <h3 className="text-sm font-semibold text-[#A8B0BD] mb-1">手続き管理</h3>
          <p className="text-xs text-[#5A6070]">社保・雇保・年末調整等の手続き管理はこちらに表示されます</p>
        </div>
      )}
    </div>
  )
}
