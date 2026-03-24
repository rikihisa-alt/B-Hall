import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Document, DocumentCategory } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード文書 ──

const now = today()

const SEED_DOCUMENTS: Document[] = []

// ── Store 型定義 ──

interface DocumentState {
  documents: Document[]
  _hydrated: boolean
}

interface DocumentActions {
  addDocument: (data: Partial<Document>) => Document
  updateDocument: (id: string, data: Partial<Document>) => void
  deleteDocument: (id: string) => void
  getDocuments: () => Document[]
  getDocumentsByCategory: (category: DocumentCategory) => Document[]
  searchDocuments: (query: string) => Document[]
  setHydrated: () => void
}

type DocumentStore = DocumentState & DocumentActions

// ── Store ──

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: SEED_DOCUMENTS,
      _hydrated: false,

      addDocument: (data: Partial<Document>) => {
        const now = today()
        const newDoc: Document = {
          id: generateId(),
          title: data.title || '',
          category: data.category || 'other',
          description: data.description || '',
          department: data.department || '',
          tags: data.tags || [],
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          file_type: data.file_type || '',
          file_url: data.file_url || '',
          version: data.version || 1,
          expiry_date: data.expiry_date || null,
          status: data.status || 'active',
          related_entity_type: data.related_entity_type || '',
          related_entity_id: data.related_entity_id || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ documents: [...state.documents, newDoc] }))
        return newDoc
      },

      updateDocument: (id: string, data: Partial<Document>) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...data, updated_at: today() } : d
          ),
        }))
      },

      deleteDocument: (id: string) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, deleted_at: today() } : d
          ),
        }))
      },

      getDocuments: () => {
        return get().documents.filter((d) => !d.deleted_at)
      },

      getDocumentsByCategory: (category: DocumentCategory) => {
        return get().documents.filter((d) => !d.deleted_at && d.category === category)
      },

      searchDocuments: (query: string) => {
        const q = query.toLowerCase()
        return get().documents.filter(
          (d) =>
            !d.deleted_at &&
            (d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.tags.some((t) => t.toLowerCase().includes(q)))
        )
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-documents',
      partialize: (state) => ({
        documents: state.documents,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
