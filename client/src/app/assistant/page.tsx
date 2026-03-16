'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, pageTransition } from '@/lib/animation'
import { useChatStore } from '@/stores/chat-store'
import {
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  Trash2,
} from 'lucide-react'

/* ── Quick Actions ── */

const quickActions = [
  '今日のタスクは？',
  '承認待ちは？',
  '今月の経費は？',
  '全体の状況は？',
]

/* ── Typing Indicator ── */

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-end gap-2">
          <Bot className="w-4 h-4 text-accent shrink-0 mb-1" strokeWidth={1.75} />
          <div className="px-4 py-3 bg-white border border-border rounded-[16px] rounded-bl-sm shadow-card">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-text-muted animate-[bounce_1.4s_ease-in-out_infinite]" />
              <span className="w-2 h-2 rounded-full bg-text-muted animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="w-2 h-2 rounded-full bg-text-muted animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */

export default function AssistantPage() {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const messages = useChatStore((s) => s.messages)
  const isTyping = useChatStore((s) => s.isTyping)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const clearHistory = useChatStore((s) => s.clearHistory)

  // Auto-scroll to bottom on new messages or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const text = message.trim()
    if (!text || isTyping) return
    sendMessage(text)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (text: string) => {
    if (isTyping) return
    sendMessage(text)
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">
          ホーム
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">AIアシスタント</span>
      </nav>

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.1)] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl md:text-[22px] font-bold text-text-primary tracking-tight">ジジロボ</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">AIアシスタント</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 md:gap-3">
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-text-muted text-[12px] font-medium hover:text-text-secondary hover:border-border-hover transition-all min-h-[36px] md:min-h-0"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            履歴クリア
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(79,70,229,0.08)] text-accent text-[12px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            オンライン
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        className="flex-1 bg-bg-surface border border-border rounded-[16px] shadow-card flex flex-col overflow-hidden min-h-0"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
      >
        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[80%]">
                  <div className="flex items-end gap-2">
                    {msg.role === 'assistant' && (
                      <Bot className="w-4 h-4 text-accent shrink-0 mb-1" strokeWidth={1.75} />
                    )}
                    <div
                      className={`px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-accent text-white rounded-[16px] rounded-br-sm'
                          : 'bg-white border border-border text-text-secondary rounded-[16px] rounded-bl-sm shadow-card'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      msg.role === 'user' ? 'justify-end' : 'ml-6'
                    }`}
                  >
                    <span
                      className="text-[11px] text-text-muted"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pt-2 pb-0 flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((text) => (
            <button
              key={text}
              onClick={() => handleQuickAction(text)}
              disabled={isTyping}
              className="px-3 py-1.5 rounded-full bg-[rgba(79,70,229,0.06)] border border-[rgba(79,70,229,0.15)] text-accent text-[12px] font-medium hover:bg-[rgba(79,70,229,0.12)] hover:border-[rgba(79,70,229,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {text}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border mt-2">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                disabled={isTyping}
                className="w-full rounded-full bg-bg-elevated border border-border px-5 py-3 text-[14px] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 disabled:opacity-60 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shrink-0 shadow-[0_0_12px_rgba(79,70,229,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[12px] text-text-muted mt-2 ml-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            ジジロボは社内情報に基づいて回答します。機密情報の取り扱いにご注意ください。
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
