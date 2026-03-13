'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 28 },
  },
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <div className="max-w-[720px] mx-auto px-10 py-14">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <h1 className="text-[24px] font-bold text-[#1E293B]">設定</h1>
        <p className="text-[13px] text-[#64748B] font-medium mt-1">アカウント・組織・システムの設定</p>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Sidebar Navigation */}
        <motion.div className="lg:w-52 shrink-0" variants={itemVariants}>
          <div className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-2 space-y-1">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === item.section
                    ? 'bg-[#6366F1]/[0.08] text-[#6366F1]'
                    : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[13px] font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {activeSection === 'profile' && (
            <motion.div
              className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
              variants={itemVariants}
            >
              <h2 className="text-[15px] font-semibold text-[#1E293B] mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] text-2xl font-bold">
                  T
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1E293B]">{profileData.name}</h3>
                  <p className="text-[13px] text-[#64748B] font-medium">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-[#6366F1] bg-[#EEF2FF]">
                      {profileData.role}
                    </span>
                    <span className="text-[13px] text-[#94A3B8] font-medium">{profileData.department}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-0">
                {[
                  { label: '氏名', value: profileData.name },
                  { label: 'メールアドレス', value: profileData.email },
                  { label: '所属会社', value: profileData.company },
                  { label: '部署', value: profileData.department },
                  { label: 'ロール', value: profileData.role },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
                    <span className="text-[13px] text-[#64748B] font-medium">{field.label}</span>
                    <span className="text-[15px] font-semibold text-[#1E293B]">{field.value}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-[13px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(99,102,241,0.3)] hover:bg-[#818CF8] transition-all active:scale-[0.98]">
                編集する
              </button>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
              variants={itemVariants}
            >
              <h2 className="text-[15px] font-semibold text-[#1E293B] mb-6">通知設定</h2>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2 mb-2">
                  <span className="text-[13px] font-medium text-[#64748B]">通知項目</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[13px] text-[#94A3B8] font-medium flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      メール
                    </span>
                    <span className="text-[13px] text-[#94A3B8] font-medium flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      アプリ
                    </span>
                  </div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
                    <span className="text-[15px] font-semibold text-[#1E293B]">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.email ? 'bg-[#6366F1] justify-end' : 'bg-[#E2E8F0] justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                      <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.app ? 'bg-[#6366F1] justify-end' : 'bg-[#E2E8F0] justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'organization' && (
            <motion.div
              className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
              variants={itemVariants}
            >
              <h2 className="text-[15px] font-semibold text-[#1E293B] mb-6">組織設定</h2>
              <div className="space-y-0">
                {[
                  { label: '会社名', value: '株式会社サンプル' },
                  { label: '設立日', value: '2020年4月1日' },
                  { label: '従業員数', value: '42名' },
                  { label: '部署数', value: '6部署' },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
                    <span className="text-[13px] text-[#64748B] font-medium">{field.label}</span>
                    <span className="text-[15px] font-semibold text-[#1E293B]">{field.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
              variants={itemVariants}
            >
              <h2 className="text-[15px] font-semibold text-[#1E293B] mb-6">セキュリティ設定</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1E293B]">パスワード</h4>
                    <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5">最終変更: 2026年1月15日</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl text-[13px] font-semibold text-[#6366F1] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all">
                    変更
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1E293B]">二要素認証</h4>
                    <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5">認証アプリを使用した二要素認証</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#059669] bg-[#059669]/10">
                    <Check className="w-3 h-3" />
                    有効
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1E293B]">アクティブセッション</h4>
                    <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5">現在1デバイスからログイン中</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl text-[13px] font-medium text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all">
                    管理
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div
              className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
              variants={itemVariants}
            >
              <h2 className="text-[15px] font-semibold text-[#1E293B] mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[13px] font-medium text-[#64748B] mb-3">テーマ</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'ライト', active: true },
                      { name: 'ダーク', active: false },
                      { name: 'システム', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-xl text-center text-[13px] font-semibold transition-all ${
                          theme.active
                            ? 'bg-[#6366F1]/[0.08] text-[#6366F1] ring-2 ring-[#6366F1]/20'
                            : 'bg-[#F8FAFC] border border-[#F1F5F9] text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-medium text-[#64748B] mb-3">言語</h4>
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                    <span className="text-[15px] font-semibold text-[#1E293B]">日本語</span>
                    <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Settings */}
          <motion.div
            className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-6"
            variants={itemVariants}
          >
            <h2 className="text-[13px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">管理者設定</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-[#F1F5F9] hover:border-[#E2E8F0] transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center flex-shrink-0 group-hover:border-[#E2E8F0] transition-colors">
                    <item.icon className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1E293B]">{item.title}</h4>
                    <p className="text-[13px] text-[#94A3B8] font-medium">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
