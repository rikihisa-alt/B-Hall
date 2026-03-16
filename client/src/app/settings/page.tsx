'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/components/ui/toast-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Check,
  Mail,
  Smartphone,
  Users,
  Database,
  Key,
  Globe,
  FileText,
  Workflow,
  Monitor,
  LogOut,
  Construction,
} from 'lucide-react'

/* ── Types ── */

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

const roleLabels: Record<string, string> = {
  ceo: '経営者',
  exec: '役員',
  admin: '管理者',
  mgr: '部門責任者',
  acc: '経理担当',
  hr: '人事担当',
  labor: '労務担当',
  ga: '総務担当',
  legal: '法務担当',
  staff: '一般従業員',
  viewer: '閲覧専用',
  audit: '監査',
}

interface NotificationSetting {
  label: string
  key: string
  email: boolean
  app: boolean
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { label: 'タスク割当通知', key: 'task_assigned', email: true, app: true },
  { label: '承認依頼通知', key: 'approval_requested', email: true, app: true },
  { label: '期限リマインダー', key: 'deadline', email: true, app: true },
  { label: 'コメント通知', key: 'comment', email: false, app: true },
  { label: '日報リマインダー', key: 'daily_report', email: true, app: false },
  { label: 'システムメンテナンス', key: 'system', email: true, app: true },
]

export default function SettingsPage() {
  const { currentUser, users, mounted } = useAuth()
  const { addToast } = useToast()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')

  // Security
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Session management
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Air', browser: 'Chrome', location: '東京', lastActive: 'アクティブ', isCurrent: true },
    { id: '2', device: 'iPhone 15', browser: 'Safari', location: '東京', lastActive: '3日前', isCurrent: false },
    { id: '3', device: 'Windows PC', browser: 'Edge', location: '大阪', lastActive: '1週間前', isCurrent: false },
  ])

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([])

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name)
      setProfileEmail(currentUser.email)
    }
  }, [currentUser])

  useEffect(() => {
    // Load notification settings from localStorage
    const saved = localStorage.getItem('b-hall-notification-settings')
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved))
      } catch {
        setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS)
      }
    } else {
      setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS)
    }
  }, [])

  const handleSaveProfile = () => {
    if (!profileName.trim() || !profileEmail.trim()) return
    // Update auth store
    const store = useAuthStore.getState()
    if (currentUser) {
      const updatedUsers = store.users.map((u) =>
        u.id === currentUser.id
          ? { ...u, name: profileName.trim(), email: profileEmail.trim(), updated_at: new Date().toISOString() }
          : u
      )
      const updatedUser = updatedUsers.find((u) => u.id === currentUser.id)
      useAuthStore.setState({ users: updatedUsers, currentUser: updatedUser || currentUser })
    }
    setEditingProfile(false)
    addToast('success', 'プロフィールを更新しました')
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('error', 'すべてのフィールドを入力してください')
      return
    }
    if (newPassword !== confirmPassword) {
      addToast('error', '新しいパスワードが一致しません')
      return
    }
    if (newPassword.length < 8) {
      addToast('error', 'パスワードは8文字以上にしてください')
      return
    }
    // Simulated
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    addToast('success', 'パスワードを変更しました')
  }

  const toggleNotification = (key: string, field: 'email' | 'app') => {
    const updated = notificationSettings.map((s) =>
      s.key === key ? { ...s, [field]: !s[field] } : s
    )
    setNotificationSettings(updated)
    localStorage.setItem('b-hall-notification-settings', JSON.stringify(updated))
    addToast('success', '通知設定を更新しました')
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48 animate-pulse" />
        <div className="h-96 bg-bg-elevated rounded-[16px] animate-pulse" />
      </div>
    )
  }

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
          <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-1.5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-0.5">
            {settingsSections.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-all flex-shrink-0 lg:flex-shrink lg:w-full min-h-[44px] lg:min-h-0 ${
                  activeSection === item.section
                    ? 'bg-[rgba(79,70,229,0.08)] text-accent'
                    : 'text-text-muted hover:bg-bg-elevated'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span className="text-[13px] font-semibold whitespace-nowrap">{item.title}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Profile */}
          {activeSection === 'profile' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">プロフィール設定</h2>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-[12px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center text-accent text-2xl font-semibold">
                  {currentUser?.avatar_initial || 'U'}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{currentUser?.name}</h3>
                  <p className="text-[12px] text-text-muted">{currentUser?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-accent bg-[rgba(79,70,229,0.08)]">
                      {roleLabels[currentUser?.role || ''] || currentUser?.role}
                    </span>
                    <span className="text-[12px] text-text-muted">{currentUser?.department}</span>
                  </div>
                </div>
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <Input
                    label="氏名"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                  <Input
                    label="メールアドレス"
                    required
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <span className="text-[12px] text-text-muted">所属会社</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">株式会社Backlly</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <span className="text-[12px] text-text-muted">部署</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{currentUser?.department}</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-[12px] text-text-muted">ロール</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">
                      {roleLabels[currentUser?.role || ''] || currentUser?.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                      保存
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditingProfile(false)
                      setProfileName(currentUser?.name || '')
                      setProfileEmail(currentUser?.email || '')
                    }}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-0">
                    {[
                      { label: '氏名', value: currentUser?.name },
                      { label: 'メールアドレス', value: currentUser?.email },
                      { label: '所属会社', value: '株式会社Backlly' },
                      { label: '部署', value: currentUser?.department },
                      { label: 'ロール', value: roleLabels[currentUser?.role || ''] || currentUser?.role },
                    ].map((field) => (
                      <div key={field.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                        <span className="text-[12px] text-text-muted">{field.label}</span>
                        <span className="text-[14px] font-semibold text-text-primary tracking-tight">{field.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-6"
                    onClick={() => setEditingProfile(true)}
                  >
                    編集する
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {/* Organization */}
          {activeSection === 'organization' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">組織設定</h2>

              <div className="space-y-0 mb-6">
                {[
                  { label: '会社名', value: '株式会社Backlly' },
                  { label: '従業員数', value: `${users.length}名` },
                  { label: 'プラン', value: 'ビジネスプラン' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <span className="text-[12px] text-text-muted">{field.label}</span>
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{field.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">ユーザー一覧</h3>
              <div className="bg-bg-elevated border border-border rounded-[12px] overflow-hidden">
                <div className="divide-y divide-border">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-semibold text-accent">{user.avatar_initial}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-text-primary tracking-tight">{user.name}</p>
                        <p className="text-[11px] text-text-muted">{user.email}</p>
                      </div>
                      <span className="text-[11px] text-text-muted bg-bg-base px-2 py-0.5 rounded-md shrink-0">
                        {roleLabels[user.role] || user.role}
                      </span>
                      <span className="text-[11px] text-text-muted shrink-0">{user.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
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
                  <div key={setting.key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">{setting.label}</span>
                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => toggleNotification(setting.key, 'email')}
                        className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                          setting.email ? 'bg-accent justify-end' : 'bg-bg-elevated justify-start'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </button>
                      <button
                        onClick={() => toggleNotification(setting.key, 'app')}
                        className={`w-8 h-[18px] rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                          setting.app ? 'bg-accent justify-end' : 'bg-bg-elevated justify-start'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">セキュリティ設定</h2>
              <div className="space-y-5">
                {/* Password Change */}
                <div className="p-5 rounded-[12px] bg-bg-elevated border border-border">
                  <h4 className="text-[14px] font-semibold text-text-primary tracking-tight mb-4">パスワード変更</h4>
                  <div className="space-y-3">
                    <Input
                      label="現在のパスワード"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="現在のパスワードを入力"
                    />
                    <Input
                      label="新しいパスワード"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="8文字以上"
                    />
                    <Input
                      label="新しいパスワード（確認）"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="もう一度入力"
                    />
                    <Button variant="primary" size="sm" onClick={handleChangePassword}>
                      パスワードを変更
                    </Button>
                  </div>
                </div>

                {/* 2FA */}
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

                {/* Active Sessions */}
                <div className="flex items-center justify-between p-4 rounded-[10px] bg-bg-elevated border border-border">
                  <div>
                    <h4 className="text-[14px] font-semibold text-text-primary tracking-tight">アクティブセッション</h4>
                    <p className="text-[12px] text-text-muted mt-0.5">現在{sessions.length}デバイスからログイン中</p>
                  </div>
                  <button
                    onClick={() => setSessionModalOpen(true)}
                    className="px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-text-secondary bg-bg-elevated border border-border hover:bg-[rgba(0,0,0,0.03)] hover:border-accent/30 transition-all cursor-pointer"
                  >
                    管理
                  </button>
                </div>
              </div>

              {/* Session Management Modal */}
              <Modal
                open={sessionModalOpen}
                onClose={() => setSessionModalOpen(false)}
                title="セッション管理"
                footer={
                  <Button variant="ghost" onClick={() => setSessionModalOpen(false)}>閉じる</Button>
                }
              >
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-[12px] bg-bg-base border border-border"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-bg-elevated flex items-center justify-center shrink-0">
                        <Monitor className="w-[18px] h-[18px] text-text-muted" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-text-primary tracking-tight">
                          {session.device} &middot; {session.browser}
                        </p>
                        <p className="text-[12px] text-text-secondary mt-0.5">
                          {session.location} &middot;{' '}
                          {session.isCurrent ? (
                            <span className="text-[#22C55E] font-semibold">{session.lastActive}</span>
                          ) : (
                            session.lastActive
                          )}
                        </p>
                      </div>
                      {session.isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)]">
                          <Check className="w-3 h-3" />
                          現在のセッション
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSessions((prev) => prev.filter((s) => s.id !== session.id))
                            addToast('success', 'セッションを終了しました')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-danger bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.12)] transition-all cursor-pointer"
                        >
                          <LogOut className="w-3 h-3" />
                          ログアウト
                        </button>
                      )}
                    </div>
                  ))}
                  {sessions.length <= 1 && (
                    <p className="text-[13px] text-text-muted text-center py-4">他のアクティブセッションはありません</p>
                  )}
                </div>
              </Modal>
            </motion.div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <motion.div
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
              variants={fadeUp}
            >
              <h2 className="text-[14px] font-semibold text-text-primary tracking-tight mb-6">表示・テーマ設定</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">テーマ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Shiraki 白木', active: true, toast: '' },
                      { name: 'ダーク', active: false, toast: 'ダークテーマは今後対応予定です' },
                      { name: 'システム', active: false, toast: 'システムテーマは今後対応予定です' },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          if (theme.active) return
                          addToast('info', theme.toast)
                        }}
                        className={`p-4 rounded-[10px] text-center text-[13px] font-semibold transition-all cursor-pointer ${
                          theme.active
                            ? 'bg-[rgba(79,70,229,0.08)] text-accent ring-2 ring-accent/20'
                            : 'bg-bg-elevated border border-border text-text-secondary hover:bg-[rgba(0,0,0,0.03)] hover:border-accent/30 active:scale-[0.98]'
                        }`}
                      >
                        {theme.name}
                        {theme.active && (
                          <span className="block text-[10px] mt-1 text-accent/70">使用中</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">言語</h4>
                  <div className="bg-bg-elevated border border-border rounded-[10px] px-4 py-3 flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-text-primary tracking-tight">日本語</span>
                    <span className="text-[11px] text-text-muted bg-bg-base px-2 py-0.5 rounded-md">デフォルト</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Settings (always visible) */}
          <motion.div
            className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6"
            variants={fadeUp}
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">管理者設定</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(245,158,11,0.08)] text-[10px] font-semibold text-[#F59E0B] border border-[rgba(245,158,11,0.18)]">
                <Construction className="w-2.5 h-2.5" strokeWidth={2} />
                準備中
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advancedSettings.map((item) => (
                <div
                  key={item.title}
                  className="relative flex items-center gap-3 p-4 rounded-[10px] bg-bg-elevated border border-border text-left group"
                >
                  <item.icon className="w-5 h-5 text-text-muted/50 flex-shrink-0" strokeWidth={1.75} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-medium text-text-secondary tracking-tight">{item.title}</h4>
                    </div>
                    <p className="text-[12px] text-text-muted">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-text-muted bg-bg-base px-2 py-0.5 rounded-md shrink-0">
                    今後対応
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
