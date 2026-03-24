'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import { useGAStore } from '@/stores/general-affairs-store'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/toast-provider'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Package,
  Monitor,
  Smartphone,
  Laptop,
  Armchair,
  ScreenShare,
  Plus,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  CheckCircle2,
  XCircle,
  Box,
} from 'lucide-react'

const categoryIcons: Record<string, typeof Laptop> = {
  PC: Laptop,
  'スマホ': Smartphone,
  'デスク': Armchair,
  'モニター': ScreenShare,
  'その他': Box,
}

const statusLabels: Record<string, string> = {
  available: '利用可能',
  in_use: '使用中',
  maintenance: 'メンテナンス中',
  disposed: '廃棄済',
}

const statusColors: Record<string, string> = {
  available: '#22C55E',
  in_use: '#3B82F6',
  maintenance: '#F59E0B',
  disposed: '#9CA3AF',
}

const EQUIPMENT_CATEGORIES = ['PC', 'スマホ', 'デスク', '椅子', 'モニター', 'その他']
const FACILITIES = ['大会議室A', '小会議室B', 'セミナールーム', '応接室', 'フリースペース']

export default function GeneralAffairsPage() {
  const { currentUser, getUserName, mounted } = useAuth()
  const { addToast } = useToast()
  const {
    getEquipment,
    addEquipment,
    updateEquipment,
    getBookings,
    getBookingsByDate,
    addBooking,
  } = useGAStore()

  const [activeTab, setActiveTab] = useState<'equipment' | 'bookings'>('equipment')
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Equipment form state
  const [eqName, setEqName] = useState('')
  const [eqCategory, setEqCategory] = useState('PC')
  const [eqSerial, setEqSerial] = useState('')
  const [eqNotes, setEqNotes] = useState('')

  // Booking form state
  const [bkFacility, setBkFacility] = useState(FACILITIES[0])
  const [bkDate, setBkDate] = useState('')
  const [bkStartTime, setBkStartTime] = useState('')
  const [bkEndTime, setBkEndTime] = useState('')
  const [bkPurpose, setBkPurpose] = useState('')

  const equipment = useMemo(() => (mounted ? getEquipment() : []), [mounted, getEquipment])
  const allBookings = useMemo(() => (mounted ? getBookings() : []), [mounted, getBookings])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = useMemo(
    () => (mounted ? getBookingsByDate(todayStr) : []),
    [mounted, getBookingsByDate, todayStr]
  )

  const upcomingBookings = useMemo(
    () =>
      allBookings
        .filter((b) => b.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)),
    [allBookings, todayStr]
  )

  const equipmentStats = useMemo(() => {
    const total = equipment.length
    const inUse = equipment.filter((e) => e.status === 'in_use').length
    const available = equipment.filter((e) => e.status === 'available').length
    const maintenance = equipment.filter((e) => e.status === 'maintenance').length
    return { total, inUse, available, maintenance }
  }, [equipment])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded-[16px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const handleAddEquipment = () => {
    if (!eqName.trim()) return
    addEquipment({
      name: eqName,
      category: eqCategory,
      serial_number: eqSerial,
      notes: eqNotes,
      status: 'available',
      created_by: currentUser?.id || '',
      updated_by: currentUser?.id || '',
    })
    setShowEquipmentModal(false)
    setEqName('')
    setEqSerial('')
    setEqNotes('')
    addToast('success', '備品を登録しました')
  }

  const handleAddBooking = () => {
    if (!bkDate || !bkStartTime || !bkEndTime || !bkPurpose.trim()) return
    addBooking({
      facility_name: bkFacility,
      booked_by: currentUser?.id || '',
      date: bkDate,
      start_time: bkStartTime,
      end_time: bkEndTime,
      purpose: bkPurpose,
      created_by: currentUser?.id || '',
      updated_by: currentUser?.id || '',
    })
    setShowBookingModal(false)
    setBkDate('')
    setBkStartTime('')
    setBkEndTime('')
    setBkPurpose('')
    addToast('success', '施設予約を登録しました')
  }

  const handleAssign = (equipmentId: string) => {
    updateEquipment(equipmentId, {
      assigned_to: currentUser?.id || '',
      status: 'in_use',
      updated_by: currentUser?.id || '',
    })
    addToast('success', '備品を割り当てました')
  }

  const handleReturn = (equipmentId: string) => {
    updateEquipment(equipmentId, {
      assigned_to: '',
      status: 'available',
      updated_by: currentUser?.id || '',
    })
    addToast('success', '備品を返却しました')
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
        <span className="text-text-secondary font-medium">総務・庶務</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-[22px] font-semibold text-text-primary tracking-tight">総務・庶務</h1>
          <p className="text-[13px] text-text-secondary mt-1">備品・設備・施設予約管理</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowEquipmentModal(true)} className="min-h-[44px] md:min-h-0">
            備品登録
          </Button>
          <Button variant="primary" size="sm" icon={Calendar} onClick={() => setShowBookingModal(true)} className="min-h-[44px] md:min-h-0">
            施設予約
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8" variants={staggerContainer} initial="hidden" animate="show">
        {[
          { label: '備品総数', value: equipmentStats.total, suffix: '件', color: '#4F46E5' },
          { label: '使用中', value: equipmentStats.inUse, suffix: '件', color: '#3B82F6' },
          { label: '利用可能', value: equipmentStats.available, suffix: '件', color: '#22C55E' },
          { label: 'メンテナンス', value: equipmentStats.maintenance, suffix: '件', color: '#F59E0B' },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-bg-surface border border-border rounded-[16px] p-4 shadow-card"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <p className="text-xl md:text-[28px] font-bold text-text-primary tracking-[-0.03em]" style={{ fontFamily: 'var(--font-inter)' }}>
              {s.value}<span className="text-[14px] text-text-muted ml-1">{s.suffix}</span>
            </p>
            <p className="text-[12px] text-text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tab Selector */}
      <div className="flex items-center gap-1 mb-6 bg-bg-surface border border-border rounded-[12px] p-1 w-fit">
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-all ${
            activeTab === 'equipment'
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
          }`}
        >
          備品管理
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-all ${
            activeTab === 'bookings'
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
          }`}
        >
          施設予約
        </button>
      </div>

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
          {equipment.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-12 text-center"
            >
              <Package className="w-10 h-10 text-text-muted mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-[14px] text-text-muted mb-4">備品が登録されていません</p>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowEquipmentModal(true)}>
                備品を登録
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.map((item) => {
                const Icon = categoryIcons[item.category] || Box
                return (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ background: `${statusColors[item.status]}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: statusColors[item.status] }} strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-[14px] font-semibold text-text-primary tracking-tight truncate">{item.name}</h3>
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shrink-0 ml-2"
                            style={{
                              background: `${statusColors[item.status]}10`,
                              color: statusColors[item.status],
                              borderColor: `${statusColors[item.status]}25`,
                            }}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </div>
                        <div className="space-y-1 mt-2">
                          <p className="text-[12px] text-text-muted">
                            <span className="text-text-secondary">カテゴリ:</span> {item.category}
                          </p>
                          <p className="text-[12px] text-text-muted">
                            <span className="text-text-secondary">シリアル:</span>{' '}
                            <span style={{ fontFamily: 'var(--font-inter)' }}>{item.serial_number}</span>
                          </p>
                          {item.assigned_to && (
                            <p className="text-[12px] text-text-muted">
                              <span className="text-text-secondary">使用者:</span> {getUserName(item.assigned_to)}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[12px] text-text-muted truncate">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {item.status === 'available' && (
                            <button
                              onClick={() => handleAssign(item.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold text-accent bg-[rgba(79,70,229,0.08)] hover:bg-[rgba(79,70,229,0.14)] transition-colors"
                            >
                              <User className="w-3 h-3" />
                              割り当て
                            </button>
                          )}
                          {item.status === 'in_use' && item.assigned_to === currentUser?.id && (
                            <button
                              onClick={() => handleReturn(item.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.08)] hover:bg-[rgba(245,158,11,0.14)] transition-colors"
                            >
                              <Package className="w-3 h-3" />
                              返却
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
          {/* Today's bookings */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-3">
              本日の予約
            </h2>
            {todayBookings.length === 0 ? (
              <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-8 text-center">
                <Calendar className="w-10 h-10 text-text-muted mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-text-muted">本日の予約はありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-accent" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{booking.facility_name}</h3>
                        <p className="text-[12px] text-text-muted mt-0.5">{booking.purpose}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-semibold text-text-primary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                          {booking.start_time} - {booking.end_time}
                        </p>
                        <p className="text-[12px] text-text-muted">{getUserName(booking.booked_by)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming bookings */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-3">
              今後の予約
            </h2>
            {upcomingBookings.length === 0 ? (
              <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-8 text-center">
                <Calendar className="w-10 h-10 text-text-muted mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-text-muted">今後の予約はありません</p>
              </div>
            ) : (
              <div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden">
                <div className="divide-y divide-border">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-[rgba(59,130,246,0.08)] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-[#3B82F6]" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-text-primary tracking-tight">{booking.facility_name}</p>
                        <p className="text-[12px] text-text-muted">{booking.purpose}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-medium text-text-secondary tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                          {booking.date}
                        </p>
                        <p className="text-[12px] text-text-muted tabular-nums" style={{ fontFamily: 'var(--font-inter)' }}>
                          {booking.start_time} - {booking.end_time}
                        </p>
                      </div>
                      <div className="text-[12px] text-text-muted shrink-0">
                        {getUserName(booking.booked_by)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Equipment Modal */}
      <Modal
        open={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        title="備品登録"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowEquipmentModal(false)}>
              キャンセル
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddEquipment} disabled={!eqName.trim()}>
              登録
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="備品名" required value={eqName} onChange={(e) => setEqName(e.target.value)} placeholder="例: MacBook Pro 14インチ" />
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              カテゴリ <span className="text-accent">*</span>
            </label>
            <select
              className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
              value={eqCategory}
              onChange={(e) => setEqCategory(e.target.value)}
            >
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Input label="シリアル番号" value={eqSerial} onChange={(e) => setEqSerial(e.target.value)} placeholder="例: MBP-2025-001" />
          <Input label="備考" value={eqNotes} onChange={(e) => setEqNotes(e.target.value)} placeholder="備品に関するメモ" />
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="施設予約"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowBookingModal(false)}>
              キャンセル
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddBooking}
              disabled={!bkDate || !bkStartTime || !bkEndTime || !bkPurpose.trim()}
            >
              予約
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              施設 <span className="text-accent">*</span>
            </label>
            <select
              className="bg-bg-base border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary w-full transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] focus:outline-none"
              value={bkFacility}
              onChange={(e) => setBkFacility(e.target.value)}
            >
              {FACILITIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <Input label="日付" required type="date" value={bkDate} onChange={(e) => setBkDate(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="開始時間" required type="time" value={bkStartTime} onChange={(e) => setBkStartTime(e.target.value)} />
            <Input label="終了時間" required type="time" value={bkEndTime} onChange={(e) => setBkEndTime(e.target.value)} />
          </div>
          <Input label="目的" required value={bkPurpose} onChange={(e) => setBkPurpose(e.target.value)} placeholder="例: プロジェクト進捗会議" />
        </div>
      </Modal>
    </motion.div>
  )
}
