'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, MessageSquare } from 'lucide-react'
import { useCommentStore } from '@/stores/comment-store'
import { useAuth } from '@/hooks/use-auth'
import { formatRelative } from '@/lib/date'
import type { Comment } from '@/types'

interface CommentListProps {
  parentType: 'task' | 'application' | 'ringi'
  parentId: string
}

export function CommentList({ parentType, parentId }: CommentListProps) {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState('')
  const { currentUser, getUserById } = useAuth()
  const { comments, addComment, deleteComment, getComments } = useCommentStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-bg-elevated shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-bg-elevated rounded w-1/3" />
              <div className="h-4 bg-bg-elevated rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const filteredComments = getComments(parentType, parentId)

  const handleSubmit = () => {
    if (!content.trim() || !currentUser) return
    addComment(parentType, parentId, currentUser.id, content.trim())
    setContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-4">
      {/* コメント一覧 */}
      {filteredComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-[10px] bg-bg-elevated flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
          </div>
          <p className="text-[13px] text-text-muted">コメントはまだありません</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              authorName={getUserById(comment.author_id)?.name ?? '不明'}
              authorInitial={getUserById(comment.author_id)?.avatar_initial ?? '?'}
              isOwn={currentUser?.id === comment.author_id}
              onDelete={() => deleteComment(comment.id)}
            />
          ))}
        </AnimatePresence>
      )}

      {/* 入力エリア */}
      <div className="flex gap-3 pt-2 border-t border-border">
        {currentUser && (
          <div className="w-8 h-8 rounded-full bg-[rgba(79,70,229,0.1)] flex items-center justify-center shrink-0 mt-1">
            <span className="text-[12px] font-bold text-accent">
              {currentUser.avatar_initial}
            </span>
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="コメントを入力..."
            rows={2}
            className="w-full bg-bg-base border border-border rounded-[10px] px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-text-muted">
              Cmd + Enter で送信
            </p>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[8px] bg-accent text-white text-[12px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-hover active:scale-[0.97] transition-all"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={2} />
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 個別コメントアイテム ──

function CommentItem({
  comment,
  authorName,
  authorInitial,
  isOwn,
  onDelete,
}: {
  comment: Comment
  authorName: string
  authorInitial: string
  isOwn: boolean
  onDelete: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex gap-3 group"
    >
      <div className="w-8 h-8 rounded-full bg-[rgba(79,70,229,0.1)] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[12px] font-bold text-accent">
          {authorInitial}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-text-primary">
            {authorName}
          </span>
          <span className="text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
            {formatRelative(comment.created_at)}
          </span>
        </div>
        <p className="text-[13px] text-text-secondary mt-0.5 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
      {isOwn && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 mt-1 p-1.5 rounded-[6px] text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-all"
          title="削除"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      )}
    </motion.div>
  )
}
