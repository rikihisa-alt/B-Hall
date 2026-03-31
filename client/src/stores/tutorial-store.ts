import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ──

export interface TutorialState {
  isActive: boolean
  currentSection: number
  currentStep: number
  completedSections: string[]
  skipped: boolean
  _hydrated: boolean
}

interface TutorialActions {
  startTutorial: () => void
  nextStep: () => void
  skipSection: () => void
  skipAll: () => void
  endTutorial: () => void
  goToSection: (sectionIndex: number) => void
  resetTutorials: () => void
  getProgress: () => { completed: number; total: number; percentage: number }
  setHydrated: () => void
}

export type TutorialStore = TutorialState & TutorialActions

// Total number of sections
const TOTAL_SECTIONS = 5

// ── Store ──

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentSection: 0,
      currentStep: 0,
      completedSections: [],
      skipped: false,
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      startTutorial: () => {
        set({
          isActive: true,
          currentSection: 0,
          currentStep: 0,
          skipped: false,
        })
      },

      nextStep: () => {
        const { currentSection, currentStep, completedSections } = get()
        // We import sections lazily to avoid circular deps
        const { TUTORIAL_SECTIONS } = require('@/lib/tutorial-sections')
        const section = TUTORIAL_SECTIONS[currentSection]
        if (!section) return

        if (currentStep < section.steps.length - 1) {
          // Next step within same section
          set({ currentStep: currentStep + 1 })
        } else {
          // Complete current section
          const newCompleted = completedSections.includes(section.key)
            ? completedSections
            : [...completedSections, section.key]

          if (currentSection < TUTORIAL_SECTIONS.length - 1) {
            // Move to next section
            set({
              completedSections: newCompleted,
              currentSection: currentSection + 1,
              currentStep: 0,
            })
          } else {
            // All sections done
            set({
              completedSections: newCompleted,
              isActive: false,
            })
          }
        }
      },

      skipSection: () => {
        const { currentSection, completedSections } = get()
        const { TUTORIAL_SECTIONS } = require('@/lib/tutorial-sections')
        const section = TUTORIAL_SECTIONS[currentSection]
        if (!section) return

        const newCompleted = completedSections.includes(section.key)
          ? completedSections
          : [...completedSections, section.key]

        if (currentSection < TUTORIAL_SECTIONS.length - 1) {
          set({
            completedSections: newCompleted,
            currentSection: currentSection + 1,
            currentStep: 0,
          })
        } else {
          set({
            completedSections: newCompleted,
            isActive: false,
          })
        }
      },

      skipAll: () => {
        set({
          isActive: false,
          skipped: true,
          completedSections: Array.from({ length: TOTAL_SECTIONS }, (_, i) => {
            const { TUTORIAL_SECTIONS } = require('@/lib/tutorial-sections')
            return TUTORIAL_SECTIONS[i]?.key ?? ''
          }).filter(Boolean),
        })
      },

      endTutorial: () => {
        set({ isActive: false })
      },

      goToSection: (sectionIndex: number) => {
        set({
          isActive: true,
          currentSection: sectionIndex,
          currentStep: 0,
        })
      },

      resetTutorials: () => {
        set({
          isActive: false,
          currentSection: 0,
          currentStep: 0,
          completedSections: [],
          skipped: false,
        })
      },

      getProgress: () => {
        const { completedSections } = get()
        return {
          completed: completedSections.length,
          total: TOTAL_SECTIONS,
          percentage:
            TOTAL_SECTIONS > 0
              ? Math.round((completedSections.length / TOTAL_SECTIONS) * 100)
              : 0,
        }
      },
    }),
    {
      name: 'b-hall-tutorial',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
