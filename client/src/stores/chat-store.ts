import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage } from '@/types'
import { generateId } from '@/lib/id'
import { generateJijiRoboResponse } from '@/lib/jijirobo'
import type { StoreData } from '@/lib/jijirobo'
import { useTaskStore } from '@/stores/task-store'
import { useApplicationStore } from '@/stores/application-store'
import { useRingiStore } from '@/stores/ringi-store'
import { useEmployeeStore } from '@/stores/employee-store'
import { useAccountingStore } from '@/stores/accounting-store'
import { useNotificationStore } from '@/stores/notification-store'
import { useDocumentStore } from '@/stores/document-store'
import { useReportStore } from '@/stores/report-store'
import { useImprovementStore } from '@/stores/improvement-store'
import { useKnowledgeStore } from '@/stores/knowledge-store'
import { useGAStore } from '@/stores/general-affairs-store'

// ── Store Types ──

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  _hydrated: boolean
}

interface ChatActions {
  addMessage: (msg: ChatMessage) => void
  clearHistory: () => void
  sendMessage: (text: string) => void
  setHydrated: () => void
}

type ChatStore = ChatState & ChatActions

// ── Gather Store Snapshots ──

function gatherStoreData(): StoreData {
  const taskState = useTaskStore.getState()
  const appState = useApplicationStore.getState()
  const ringiState = useRingiStore.getState()
  const empState = useEmployeeStore.getState()
  const accState = useAccountingStore.getState()
  const notifState = useNotificationStore.getState()
  const docState = useDocumentStore.getState()
  const reportState = useReportStore.getState()
  const impState = useImprovementStore.getState()
  const knowledgeState = useKnowledgeStore.getState()
  const gaState = useGAStore.getState()

  return {
    tasks: taskState.tasks,
    applications: appState.applications,
    ringis: ringiState.ringis,
    employees: empState.employees,
    transactions: accState.transactions,
    invoices: accState.invoices,
    payments: accState.payments,
    notifications: notifState.notifications,
    documents: docState.documents,
    reports: reportState.reports,
    improvements: impState.improvements,
    articles: knowledgeState.articles,
    equipment: gaState.equipment,
    facilityBookings: gaState.facilityBookings,
  }
}

// ── Welcome Message ──

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'こんにちは！ジジロボです。B-Hallの業務についてお手伝いします。タスク、申請、稟議、経理、人事など、何でも聞いてください！',
  timestamp: new Date().toISOString(),
}

// ── Store ──

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [WELCOME_MESSAGE],
      isTyping: false,
      _hydrated: false,

      addMessage: (msg: ChatMessage) => {
        set((state) => ({ messages: [...state.messages, msg] }))
      },

      clearHistory: () => {
        set({
          messages: [
            {
              ...WELCOME_MESSAGE,
              timestamp: new Date().toISOString(),
            },
          ],
          isTyping: false,
        })
      },

      sendMessage: (text: string) => {
        const userMessage: ChatMessage = {
          id: generateId(),
          role: 'user',
          content: text,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
        }))

        // Random delay 500-1500ms
        const delay = 500 + Math.random() * 1000

        setTimeout(() => {
          const stores = gatherStoreData()
          const responseContent = generateJijiRoboResponse(text, stores)

          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: responseContent,
            timestamp: new Date().toISOString(),
          }

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isTyping: false,
          }))
        }, delay)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-chat',
      partialize: (state) => ({
        messages: state.messages,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
