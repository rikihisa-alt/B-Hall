import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sections, toolItems } from '@/lib/navigation'

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

interface NavStore {
  desktopOrder: string[]
  mobileOrder: string[]
  setDesktopOrder: (order: string[]) => void
  setMobileOrder: (order: string[]) => void
  resetOrder: () => void
  _hydrated: boolean
}

/* ────────────────────────────────────────── */
/*  Default order                             */
/* ────────────────────────────────────────── */

const DEFAULT_ORDER: string[] = [
  ...sections.map((s) => s.key),
  ...toolItems.map((t) => t.key),
]

/* ────────────────────────────────────────── */
/*  Store                                     */
/* ────────────────────────────────────────── */

export const useNavStore = create<NavStore>()(
  persist(
    (set) => ({
      desktopOrder: DEFAULT_ORDER,
      mobileOrder: DEFAULT_ORDER,
      _hydrated: false,

      setDesktopOrder: (order) => set({ desktopOrder: order }),
      setMobileOrder: (order) => set({ mobileOrder: order }),
      resetOrder: () =>
        set({
          desktopOrder: DEFAULT_ORDER,
          mobileOrder: DEFAULT_ORDER,
        }),
    }),
    {
      name: 'b-hall-nav',
      onRehydrateStorage: () => () => {
        useNavStore.setState({ _hydrated: true })
      },
    },
  ),
)

export { DEFAULT_ORDER }
