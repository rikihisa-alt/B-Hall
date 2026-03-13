'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  ChevronRight,
  Check,
  Users,
  FileText,
  Workflow,
} from 'lucide-react'

type SettingsSection = 'profile' | 'organization' | 'notifications' | 'security' | 'appearance'

interface SettingItem {
  icon: typeof User
  title: string
  description: string
  section: SettingsSection
}

const settingsSections: SettingItem[] = [
  { icon: User, title: 'プロフィール', description: '名前、メール、プロフィール画像の設定', section: 'profile' },
  { icon: Building2, title: '組織設定', description: '会社情報、部署、チーム構成の管理', section: 'organization' },
  { icon: Bell, title: '通知設定', description: '通知方法、頻度、対象の設定', section: 'notifications' },
  { icon: Shield, title: 'セキュリティ', description: 'パスワード、二要素認証、セッション管理', section: 'security' },
  { icon: Palette, title: '表示・テーマ', description: 'テーマ、言語、表示設定のカスタマイズ', section: 'appearance' },
]

const advancedSettings = [
  { icon: Users, title: 'ロール・権限管理', description: 'ユーザーロールと権限の設定' },
  { icon: Workflow, title: 'ワークフロー設定', description: '承認ルート、自動化ルールの管理' },
  { icon: FileText, title: 'テンプレート管理', description: 'タスク・申請テンプレートの管理' },
  { icon: Database, title: 'データ管理', description: 'エクスポート・インポート・バックアップ' },
  { icon: Key, title: 'API設定', description: 'APIキー、外部連携の管理' },
  { icon: Globe, title: 'ドメイン・SSO', description: 'カスタムドメイン、シングルサインオン設定' },
]

const profileData = {
  name: '田中太郎',
  email: 'tanaka@example.com',
  role: '管理者',
  department: '開発部',
  company: '株式会社サンプル',
}

const notificationSettings = [
  { label: 'タスク割当通知', email: true, app: true },
  { label: '承認依頼通知', email: true, app: true },
  { label: '期限リマインダー', email: true, app: true },
  { label: 'コメント通知', email: false, app: true },
  { label: '日報リマインダー', email: true, app: false },
  { label: 'システムメンテナンス', email: true, app: true },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white/90">設定</h1>
        <p className="text-sm text-[#6B7280] mt-1">アカウント・組織・システムの設定</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-2 space-y-1">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === item.section
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#6B7280] hover:text-[#A8B0BD] hover:bg-white/[0.05]'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7C8CFF] to-[#6366F1] flex items-center justify-center text-[#0F1115] text-2xl font-bold shadow-md">
                  T
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90">{profileData.name}</h3>
                  <p className="text-sm text-[#6B7280]">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-[#7C8CFF] bg-[#7C8CFF]/10">
                      {profileData.role}
                    </span>
                    <span className="text-xs text-[#5A6070]">{profileData.department}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: '氏名', value: profileData.name },
                  { label: 'メールアドレス', value: profileData.email },
                  { label: '所属会社', value: profileData.company },
                  { label: '部署', value: profileData.department },
                  { label: 'ロール', value: profileData.role },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                    <span className="text-sm text-[#6B7280]">{field.label}</span>
                    <span className="text-sm font-medium text-[#A8B0BD]">{field.value}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-4 py-2.5 rounded-xl bg-[#7C8CFF] text-[#0F1115] text-sm font-medium hover:bg-[#8B9AFF] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                編集する
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-6">通知設定</h2>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2 mb-2">
                  <span className="text-sm font-medium text-[#6B7280]">通知項目</span>
                  <div className="flex items-center gap-8">
                    <span className="text-xs text-[#5A6070] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      メール
                    </span>
                    <span className="text-xs text-[#5A6070] flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      アプリ
                    </span>
                  </div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                    <span className="text-sm text-[#A8B0BD]">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.email ? 'bg-[#7C8CFF] justify-end' : 'bg-white/[0.10] justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                      <div className={`w-8 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.app ? 'bg-[#7C8CFF] justify-end' : 'bg-white/[0.10] justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'organization' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-6">組織設定</h2>
              <div className="space-y-4">
                {[
                  { label: '会社名', value: '株式会社サンプル' },
                  { label: '設立日', value: '2020年4月1日' },
                  { label: '従業員数', value: '42名' },
                  { label: '部署数', value: '6部署' },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                    <span className="text-sm text-[#6B7280]">{field.label}</span>
                    <span className="text-sm font-medium text-[#A8B0BD]">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-6">セキュリティ設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-medium text-[#A8B0BD]">パスワード</h4>
                    <p className="text-xs text-[#5A6070] mt-0.5">最終変更: 2026年1月15日</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7C8CFF] bg-[#7C8CFF]/10 hover:bg-[#7C8CFF]/20 transition-all">
                    変更
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-medium text-[#A8B0BD]">二要素認証</h4>
                    <p className="text-xs text-[#5A6070] mt-0.5">認証アプリを使用した二要素認証</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-[#2FBF71] bg-[#2FBF71]/10">
                    <Check className="w-3 h-3" />
                    有効
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-medium text-[#A8B0BD]">アクティブセッション</h4>
                    <p className="text-xs text-[#5A6070] mt-0.5">現在1デバイスからログイン中</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A8B0BD] bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                    管理
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-[#A8B0BD] mb-3">テーマ</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'ライト', active: false },
                      { name: 'ダーク', active: true },
                      { name: 'システム', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-xl text-center text-sm font-medium transition-all ${
                          theme.active
                            ? 'bg-[#7C8CFF]/15 text-[#7C8CFF] ring-2 ring-[#7C8CFF]/30'
                            : 'bg-white/[0.03] border border-white/[0.06] text-[#6B7280] hover:bg-white/[0.05] hover:text-[#A8B0BD]'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A8B0BD] mb-3">言語</h4>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/[0.05] transition-colors cursor-pointer">
                    <span className="text-sm text-[#A8B0BD]">日本語</span>
                    <ChevronRight className="w-4 h-4 text-[#5A6070]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-[#5A6070] uppercase tracking-wider mb-4">管理者設定</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-colors">
                    <item.icon className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#A8B0BD]">{item.title}</h4>
                    <p className="text-[11px] text-[#5A6070]">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
