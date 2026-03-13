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
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-sm text-gray-500 mt-1">アカウント・組織・システムの設定</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-2 space-y-1">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === item.section
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:bg-white/60'
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
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  T
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-primary-600 bg-primary-50">
                      {profileData.role}
                    </span>
                    <span className="text-xs text-gray-400">{profileData.department}</span>
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
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500">{field.label}</span>
                    <span className="text-sm font-medium text-gray-800">{field.value}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                編集する
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">通知設定</h2>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">通知項目</span>
                  <div className="flex items-center gap-8">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      メール
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      アプリ
                    </span>
                  </div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.email ? 'bg-primary-500 justify-end' : 'bg-gray-200 justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                      <div className={`w-8 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.app ? 'bg-primary-500 justify-end' : 'bg-gray-200 justify-start'
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
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">組織設定</h2>
              <div className="space-y-4">
                {[
                  { label: '会社名', value: '株式会社サンプル' },
                  { label: '設立日', value: '2020年4月1日' },
                  { label: '従業員数', value: '42名' },
                  { label: '部署数', value: '6部署' },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500">{field.label}</span>
                    <span className="text-sm font-medium text-gray-800">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">セキュリティ設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">パスワード</h4>
                    <p className="text-xs text-gray-400 mt-0.5">最終変更: 2026年1月15日</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all">
                    変更
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">二要素認証</h4>
                    <p className="text-xs text-gray-400 mt-0.5">認証アプリを使用した二要素認証</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-emerald-600 bg-emerald-50">
                    <Check className="w-3 h-3" />
                    有効
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">アクティブセッション</h4>
                    <p className="text-xs text-gray-400 mt-0.5">現在1デバイスからログイン中</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all">
                    管理
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">テーマ</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'ライト', active: true },
                      { name: 'ダーク', active: false },
                      { name: 'システム', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-xl text-center text-sm font-medium transition-all ${
                          theme.active
                            ? 'bg-primary-50 text-primary-600 ring-2 ring-primary-200'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">言語</h4>
                  <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-700">日本語</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">管理者設定</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
                    <item.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                    <p className="text-[11px] text-gray-400">{item.description}</p>
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
