import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EquipmentItem, FacilityBooking } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード備品データ ──

const now = today()

const SEED_EQUIPMENT: EquipmentItem[] = []

const SEED_BOOKINGS: FacilityBooking[] = []

// ── Store 型定義 ──

interface GAState {
  equipment: EquipmentItem[]
  facilityBookings: FacilityBooking[]
  _hydrated: boolean
}

interface GAActions {
  addEquipment: (data: Partial<EquipmentItem>) => EquipmentItem
  updateEquipment: (id: string, updates: Partial<EquipmentItem>) => void
  deleteEquipment: (id: string, deletedBy: string) => void
  getEquipment: () => EquipmentItem[]
  addBooking: (data: Partial<FacilityBooking>) => FacilityBooking
  updateBooking: (id: string, updates: Partial<FacilityBooking>) => void
  cancelBooking: (id: string, cancelledBy: string) => void
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

      deleteEquipment: (id: string, deletedBy: string) => {
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id
              ? { ...e, deleted_at: today(), updated_at: today(), updated_by: deletedBy }
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

      updateBooking: (id: string, updates: Partial<FacilityBooking>) => {
        set((state) => ({
          facilityBookings: state.facilityBookings.map((b) =>
            b.id === id
              ? { ...b, ...updates, updated_at: today() }
              : b
          ),
        }))
      },

      cancelBooking: (id: string, cancelledBy: string) => {
        set((state) => ({
          facilityBookings: state.facilityBookings.map((b) =>
            b.id === id
              ? { ...b, status: 'cancelled' as const, updated_at: today(), updated_by: cancelledBy }
              : b
          ),
        }))
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
