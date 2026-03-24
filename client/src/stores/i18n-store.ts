import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

/* ────────────────────────────────────────── */
/*  i18n Store                                */
/* ────────────────────────────────────────── */

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'ja',

      setLocale: (locale: Locale) => set({ locale }),

      t: (key: string): string => {
        const { locale } = get()
        // Try current locale
        const value = translations[locale]?.[key]
        if (value) return value
        // Fallback to Japanese
        const fallback = translations.ja?.[key]
        if (fallback) return fallback
        // Fallback to key itself
        return key
      },
    }),
    {
      name: 'b-hall-locale',
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
)

/** Convenience hook */
export function useI18n() {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)
  const t = useI18nStore((s) => s.t)
  return { locale, setLocale, t }
}
