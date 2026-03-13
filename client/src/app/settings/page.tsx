'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
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

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <div className="max-w-[680px] mx-auto px-10 py-10">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <h1 className="text-[24px] font-semibold text-[#0f172a] tracking-tight">設定</h1>
        <p className="text-[13px] text-[#94a3b8] mt-1">アカウント・組織・システムの設定</p>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Sidebar Navigation */}
        <motion.div className="lg:w-52 shrink-0" variants={fadeUp}>
          <div className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-1.5 space-y-0.5">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  activeSection === item.section
                    ? 'bg-[#6366f1]/[0.08] text-[#6366f1]'
                    : 'text-[#94a3b8] hover:bg-white/50'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span className="text-[13px] font-semibold">{item.title}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {activeSection === 'profile' && (
            <motion.div
              className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-[#0f172a] tracking-tight mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-xl bg-[#6366f1]/[0.08] flex items-center justify-center text-[#6366f1] text-2xl font-semibold">
                  T
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{profileData.name}</h3>
                  <p className="text-[12px] text-[#94a3b8]">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#6366f1] bg-[#6366f1]/[0.08]">
                      {profileData.role}
                    </span>
                    <span className="text-[12px] text-[#94a3b8]">{profileData.department}</span>
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
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-black/[0.04] last:border-0">
                    <span className="text-[12px] text-[#94a3b8]">{field.label}</span>
                    <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{field.value}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 rounded-lg bg-[#6366f1] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#818cf8] transition-all active:scale-[0.98]">
                編集する
              </button>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-[#0f172a] tracking-tight mb-6">通知設定</h2>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2 mb-2">
                  <span className="text-[12px] text-[#94a3b8]">通知項目</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[12px] text-[#94a3b8] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                      メール
                    </span>
                    <span className="text-[12px] text-[#94a3b8] flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
                      アプリ
                    </span>
                  </div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-4 border-b border-black/[0.04] last:border-0">
                    <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.email ? 'bg-[#6366f1] justify-end' : 'bg-[#e2e8f0] justify-start'
                      }`}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </div>
                      <div className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.app ? 'bg-[#6366f1] justify-end' : 'bg-[#e2e8f0] justify-start'
                      }`}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'organization' && (
            <motion.div
              className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-[#0f172a] tracking-tight mb-6">組織設定</h2>
              <div className="space-y-0">
                {[
                  { label: '会社名', value: '株式会社サンプル' },
                  { label: '設立日', value: '2020年4月1日' },
                  { label: '従業員数', value: '42名' },
                  { label: '部署数', value: '6部署' },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-black/[0.04] last:border-0">
                    <span className="text-[12px] text-[#94a3b8]">{field.label}</span>
                    <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{field.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-[#0f172a] tracking-tight mb-6">セキュリティ設定</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/[0.02] border border-black/[0.04]">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight">パスワード</h4>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">最終変更: 2026年1月15日</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#6366f1] bg-[#6366f1]/[0.08] hover:bg-[#6366f1]/[0.12] transition-all">
                    変更
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/[0.02] border border-black/[0.04]">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight">二要素認証</h4>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">認証アプリを使用した二要素認証</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#059669] bg-[#059669]/10">
                    <Check className="w-3 h-3" />
                    有効
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/[0.02] border border-black/[0.04]">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight">アクティブセッション</h4>
                    <p className="text-[12px] text-[#94a3b8] mt-0.5">現在1デバイスからログイン中</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#94a3b8] bg-black/[0.02] border border-black/[0.04] hover:bg-black/[0.04] transition-all">
                    管理
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div
              className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-[#0f172a] tracking-tight mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[12px] text-[#94a3b8] mb-3">テーマ</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'ライト', active: true },
                      { name: 'ダーク', active: false },
                      { name: 'システム', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-lg text-center text-[13px] font-semibold transition-all ${
                          theme.active
                            ? 'bg-[#6366f1]/[0.08] text-[#6366f1] ring-2 ring-[#6366f1]/20'
                            : 'bg-black/[0.02] border border-black/[0.04] text-[#94a3b8] hover:bg-black/[0.04]'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[12px] text-[#94a3b8] mb-3">言語</h4>
                  <div className="bg-black/[0.02] border border-black/[0.04] rounded-lg px-4 py-3 flex items-center justify-between hover:bg-black/[0.04] transition-colors cursor-pointer">
                    <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">日本語</span>
                    <ChevronRight className="w-4 h-4 text-[#e2e8f0]" strokeWidth={1.75} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Settings */}
          <motion.div
            className="rounded-xl bg-white/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] p-6"
            variants={fadeUp}
          >
            <h2 className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">管理者設定</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-lg bg-black/[0.02] hover:bg-black/[0.04] transition-all group text-left"
                >
                  <item.icon className="w-5 h-5 text-[#94a3b8] flex-shrink-0" strokeWidth={1.75} />
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight">{item.title}</h4>
                    <p className="text-[12px] text-[#94a3b8]">{item.description}</p>
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
