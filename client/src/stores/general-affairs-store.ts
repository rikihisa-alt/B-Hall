import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EquipmentItem, FacilityBooking } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード備品データ ──

const now = today()

const SEED_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq-1',
    name: 'MacBook Pro 14インチ',
    category: 'PC',
    serial_number: 'MBP-2025-001',
    assigned_to: 'user-1',
    status: 'in_use',
    purchase_date: '2025-01-15',
    notes: 'M4 Pro チップ搭載モデル',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-2',
    name: 'MacBook Air 13インチ',
    category: 'PC',
    serial_number: 'MBA-2024-012',
    assigned_to: 'user-2',
    status: 'in_use',
    purchase_date: '2024-06-10',
    notes: 'M3 チップ搭載モデル',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-3',
    name: 'ThinkPad X1 Carbon',
    category: 'PC',
    serial_number: 'TP-2024-008',
    assigned_to: 'user-3',
    status: 'in_use',
    purchase_date: '2024-04-01',
    notes: 'Windows 11 Pro',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-4',
    name: 'iPhone 15 Pro',
    category: 'スマホ',
    serial_number: 'IPH-2025-003',
    assigned_to: 'user-5',
    status: 'in_use',
    purchase_date: '2025-02-01',
    notes: '業務用スマートフォン',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-5',
    name: 'Galaxy S24',
    category: 'スマホ',
    serial_number: 'GS-2024-007',
    assigned_to: '',
    status: 'available',
    purchase_date: '2024-08-20',
    notes: '予備端末',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-6',
    name: 'スタンディングデスク FlexiSpot',
    category: 'デスク',
    serial_number: 'DSK-2023-015',
    assigned_to: '',
    status: 'available',
    purchase_date: '2023-11-10',
    notes: '電動昇降式',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-7',
    name: 'Dell U2723QE 27インチ 4Kモニター',
    category: 'モニター',
    serial_number: 'MON-2024-022',
    assigned_to: 'user-1',
    status: 'in_use',
    purchase_date: '2024-03-15',
    notes: 'USB-C 接続対応',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
  {
    id: 'eq-8',
    name: 'Canon PIXUS TS8530 プリンター',
    category: 'その他',
    serial_number: 'PRN-2023-002',
    assigned_to: '',
    status: 'maintenance',
    purchase_date: '2023-05-20',
    notes: 'トナー交換・メンテナンス中',
    created_at: now,
    updated_at: now,
    created_by: 'system',
    updated_by: 'system',
    deleted_at: null,
  },
]

// ── シード施設予約データ ──

const todayDate = new Date().toISOString().split('T')[0]
const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
const dayAfterDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const SEED_BOOKINGS: FacilityBooking[] = [
  {
    id: 'bk-1',
    facility_name: '大会議室A',
    booked_by: 'user-1',
    date: todayDate,
    start_time: '10:00',
    end_time: '11:30',
    purpose: 'プロジェクト進捗会議',
    status: 'confirmed',
    created_at: now,
    updated_at: now,
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'bk-2',
    facility_name: '小会議室B',
    booked_by: 'user-2',
    date: todayDate,
    start_time: '14:00',
    end_time: '15:00',
    purpose: '採用面接',
    status: 'confirmed',
    created_at: now,
    updated_at: now,
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'bk-3',
    facility_name: '大会議室A',
    booked_by: 'user-5',
    date: tomorrowDate,
    start_time: '09:00',
    end_time: '12:00',
    purpose: '経営会議',
    status: 'confirmed',
    created_at: now,
    updated_at: now,
    created_by: 'user-5',
    updated_by: 'user-5',
    deleted_at: null,
  },
  {
    id: 'bk-4',
    facility_name: 'セミナールーム',
    booked_by: 'user-6',
    date: dayAfterDate,
    start_time: '13:00',
    end_time: '17:00',
    purpose: 'セキュリティ研修',
    status: 'confirmed',
    created_at: now,
    updated_at: now,
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface GAState {
  equipment: EquipmentItem[]
  facilityBookings: FacilityBooking[]
  _hydrated: boolean
}

interface GAActions {
  addEquipment: (data: Partial<EquipmentItem>) => EquipmentItem
  updateEquipment: (id: string, updates: Partial<EquipmentItem>) => void
  getEquipment: () => EquipmentItem[]
  addBooking: (data: Partial<FacilityBooking>) => FacilityBooking
  getBookings: () => FacilityBooking[]
  getBookingsByDate: (date: string) => FacilityBooking[]
  setHydrated: () => void
}

type GAStore = GAState & GAActions

// ── Store ──

export const useGAStore = create<GAStore>()(
  persist(
    (set, get) => ({
      equipment: SEED_EQUIPMENT,
      facilityBookings: SEED_BOOKINGS,
      _hydrated: false,

      addEquipment: (data: Partial<EquipmentItem>) => {
        const timestamp = today()
        const newItem: EquipmentItem = {
          id: generateId(),
          name: data.name || '',
          category: data.category || 'その他',
          serial_number: data.serial_number || '',
          assigned_to: data.assigned_to || '',
          status: data.status || 'available',
          purchase_date: data.purchase_date || timestamp.split('T')[0],
          notes: data.notes || '',
          created_at: timestamp,
          updated_at: timestamp,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ equipment: [...state.equipment, newItem] }))
        return newItem
      },

      updateEquipment: (id: string, updates: Partial<EquipmentItem>) => {
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id
              ? { ...e, ...updates, updated_at: today() }
              : e
          ),
        }))
      },

      getEquipment: () => {
        return get().equipment.filter((e) => !e.deleted_at)
      },

      addBooking: (data: Partial<FacilityBooking>) => {
        const timestamp = today()
        const newBooking: FacilityBooking = {
          id: generateId(),
          facility_name: data.facility_name || '',
          booked_by: data.booked_by || '',
          date: data.date || '',
          start_time: data.start_time || '',
          end_time: data.end_time || '',
          purpose: data.purpose || '',
          status: 'confirmed',
          created_at: timestamp,
          updated_at: timestamp,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({
          facilityBookings: [...state.facilityBookings, newBooking],
        }))
        return newBooking
      },

      getBookings: () => {
        return get().facilityBookings.filter((b) => !b.deleted_at && b.status !== 'cancelled')
      },

      getBookingsByDate: (date: string) => {
        return get().facilityBookings.filter(
          (b) => !b.deleted_at && b.status !== 'cancelled' && b.date === date
        )
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-ga',
      partialize: (state) => ({
        equipment: state.equipment,
        facilityBookings: state.facilityBookings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
