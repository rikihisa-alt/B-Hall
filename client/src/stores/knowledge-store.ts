import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KnowledgeArticle, KnowledgeType } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シードナレッジ ──

const SEED_ARTICLES: KnowledgeArticle[] = []


// ── Store 型定義 ──

interface KnowledgeState {
  articles: KnowledgeArticle[]
  _hydrated: boolean
}

interface KnowledgeActions {
  addArticle: (data: Partial<KnowledgeArticle>) => KnowledgeArticle
  updateArticle: (id: string, data: Partial<KnowledgeArticle>) => void
  deleteArticle: (id: string) => void
  publishArticle: (id: string) => void
  togglePublish: (id: string) => void
  incrementViewCount: (id: string) => void
  getArticles: () => KnowledgeArticle[]
  searchArticles: (query: string) => KnowledgeArticle[]
  getArticlesByType: (type: KnowledgeType) => KnowledgeArticle[]
  setHydrated: () => void
}

type KnowledgeStore = KnowledgeState & KnowledgeActions

// ── Store ──

export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set, get) => ({
      articles: SEED_ARTICLES,
      _hydrated: false,

      addArticle: (data: Partial<KnowledgeArticle>) => {
        const now = today()
        const newArticle: KnowledgeArticle = {
          id: generateId(),
          title: data.title || '',
          type: data.type || 'manual',
          content: data.content || '',
          department: data.department || '',
          tags: data.tags || [],
          author_id: data.author_id || '',
          version: 1,
          is_published: data.is_published || false,
          view_count: 0,
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ articles: [...state.articles, newArticle] }))
        return newArticle
      },

      updateArticle: (id: string, data: Partial<KnowledgeArticle>) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...data, updated_at: today() } : a
          ),
        }))
      },

      deleteArticle: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, deleted_at: today() } : a
          ),
        }))
      },

      publishArticle: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, is_published: true, updated_at: today() } : a
          ),
        }))
      },

      togglePublish: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, is_published: !a.is_published, updated_at: today() } : a
          ),
        }))
      },

      incrementViewCount: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, view_count: a.view_count + 1 } : a
          ),
        }))
      },

      getArticles: () => {
        return get().articles.filter((a) => !a.deleted_at)
      },

      searchArticles: (query: string) => {
        const q = query.toLowerCase()
        return get().articles.filter(
          (a) =>
            !a.deleted_at &&
            (a.title.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q) ||
              a.tags.some((t) => t.toLowerCase().includes(q)))
        )
      },

      getArticlesByType: (type: KnowledgeType) => {
        return get().articles.filter((a) => !a.deleted_at && a.type === type)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-knowledge',
      partialize: (state) => ({
        articles: state.articles,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
