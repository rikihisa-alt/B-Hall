import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment } from '@/types'
import { generateId } from '@/lib/id'

// ── Store 型定義 ──

interface CommentState {
  comments: Comment[]
  _hydrated: boolean
}

interface CommentActions {
  addComment: (
    parentType: Comment['parent_type'],
    parentId: string,
    authorId: string,
    content: string
  ) => Comment
  getComments: (
    parentType: Comment['parent_type'],
    parentId: string
  ) => Comment[]
  deleteComment: (id: string) => void
  setHydrated: () => void
}

type CommentStore = CommentState & CommentActions

// ── シードデータ ──

const now = new Date().toISOString()
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

const SEED_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    parent_type: 'task',
    parent_id: 'task-1',
    author_id: 'user-1',
    content: '入社手続きの書類一式を準備しました。確認をお願いします。',
    attachments: [],
    created_at: twoHoursAgo,
    updated_at: twoHoursAgo,
    created_by: 'user-1',
    updated_by: 'user-1',
    deleted_at: null,
  },
  {
    id: 'comment-2',
    parent_type: 'task',
    parent_id: 'task-1',
    author_id: 'user-2',
    content: '確認しました。社会保険の手続きも並行して進めます。',
    attachments: [],
    created_at: oneHourAgo,
    updated_at: oneHourAgo,
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'comment-3',
    parent_type: 'task',
    parent_id: 'task-1',
    author_id: 'user-3',
    content: '経理側の給与設定も完了次第ご連絡します。',
    attachments: [],
    created_at: now,
    updated_at: now,
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
]

// ── Store ──

export const useCommentStore = create<CommentStore>()(
  persist(
    (set, get) => ({
      comments: SEED_COMMENTS,
      _hydrated: false,

      addComment: (parentType, parentId, authorId, content) => {
        const timestamp = new Date().toISOString()
        const newComment: Comment = {
          id: generateId(),
          parent_type: parentType,
          parent_id: parentId,
          author_id: authorId,
          content,
          attachments: [],
          created_at: timestamp,
          updated_at: timestamp,
          created_by: authorId,
          updated_by: authorId,
          deleted_at: null,
        }
        set((state) => ({
          comments: [...state.comments, newComment],
        }))
        return newComment
      },

      getComments: (parentType, parentId) => {
        return get()
          .comments.filter(
            (c) =>
              c.parent_type === parentType &&
              c.parent_id === parentId &&
              c.deleted_at === null
          )
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
      },

      deleteComment: (id) => {
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === id
              ? { ...c, deleted_at: new Date().toISOString() }
              : c
          ),
        }))
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-comments',
      partialize: (state) => ({
        comments: state.comments,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
