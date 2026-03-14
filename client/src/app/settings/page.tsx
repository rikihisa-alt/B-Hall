'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
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

/* ── Types & Data ── */

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
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">設定</span>
      </nav>

      {/* Header */}
      <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">設定</h1>
        <p className="text-[13px] text-text-secondary mt-1">アカウント・組織・システムの設定</p>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Sidebar Navigation */}
        <motion.div className="lg:w-52 shrink-0" variants={fadeUp}>
          <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-1.5 space-y-0.5">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-all ${
                  activeSection === item.section
                    ? 'bg-[rgba(79,70,229,0.08)] text-accent'
                    : 'text-text-muted hover:bg-bg-elevated'
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
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-[12px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center text-accent text-2xl font-semibold">
                  T
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{profileData.name}</h3>
                  <p className="text-[12px] text-text-muted">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-accent bg-[rgba(79,70,229,0.08)]">
                      {profileData.role}
                    </span>
                    <span className="text-[12px] text-text-muted">{profileData.department}</span>
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
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <span className="text-[12px] text-text-muted">{field.label}</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{field.value}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 rounded-[10px] bg-accent text-white text-[13px] font-semibold px-4 py-2 hover:bg-accent-hover transition-all active:scale-[0.98] shadow-[0_0_12px_rgba(79,70,229,0.2)]">
                編集する
              </button>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">通知設定</h2>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2 mb-2">
                  <span className="text-[12px] text-text-muted">通知項目</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[12px] text-text-muted flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                      メール
                    </span>
                    <span className="text-[12px] text-text-muted flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
                      アプリ
                    </span>
                  </div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.email ? 'bg-accent justify-end' : 'bg-bg-elevated justify-start'
                      }`}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </div>
                      <div className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                        setting.app ? 'bg-accent justify-end' : 'bg-bg-elevated justify-start'
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
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">組織設定</h2>
              <div className="space-y-0">
                {[
                  { label: '会社名', value: '株式会社サンプル' },
                  { label: '設立日', value: '2020年4月1日' },
                  { label: '従業員数', value: '42名' },
                  { label: '部署数', value: '6部署' },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <span className="text-[12px] text-text-muted">{field.label}</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{field.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">セキュリティ設定</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-[10px] bg-bg-elevated border border-border">
                  <div>
                    <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">パスワード</h4>
                    <p className="text-[12px] text-text-muted mt-0.5">最終変更: 2026年1月15日</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-accent bg-[rgba(79,70,229,0.08)] hover:bg-[rgba(79,70,229,0.12)] transition-all">
                    変更
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-[10px] bg-bg-elevated border border-border">
                  <div>
                    <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">二要素認証</h4>
                    <p className="text-[12px] text-text-muted mt-0.5">認証アプリを使用した二要素認証</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)]">
                    <Check className="w-3 h-3" />
                    有効
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-[10px] bg-bg-elevated border border-border">
                  <div>
                    <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">アクティブセッション</h4>
                    <p className="text-[12px] text-text-muted mt-0.5">現在1デバイスからログイン中</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-text-secondary bg-bg-elevated border border-border hover:bg-[rgba(0,0,0,0.03)] transition-all">
                    管理
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">テーマ</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'ライト', active: true },
                      { name: 'ダーク', active: false },
                      { name: 'システム', active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-[10px] text-center text-[13px] font-semibold transition-all ${
                          theme.active
                            ? 'bg-[rgba(79,70,229,0.08)] text-accent ring-2 ring-accent/20'
                            : 'bg-bg-elevated border border-border text-text-muted hover:bg-[rgba(0,0,0,0.03)]'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">言語</h4>
                  <div className="bg-bg-elevated border border-border rounded-[10px] px-4 py-3 flex items-center justify-between hover:bg-[rgba(0,0,0,0.03)] transition-colors cursor-pointer">
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">日本語</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Settings */}
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
            variants={fadeUp}
          >
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-4">管理者設定</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-[10px] bg-bg-elevated border border-border hover:border-[rgba(79,70,229,0.3)] transition-all group text-left"
                >
                  <item.icon className="w-5 h-5 text-text-muted group-hover:text-accent flex-shrink-0 transition-colors" strokeWidth={1.75} />
                  <div>
                    <h4 className="text-[14px] font-medium text-text-primary tracking-tight">{item.title}</h4>
                    <p className="text-[12px] text-text-muted">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
