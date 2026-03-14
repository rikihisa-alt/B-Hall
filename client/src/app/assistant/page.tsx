'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, pageTransition } from '@/lib/animation'
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Calculator,
  Users,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'

/* ── Mock Data ── */

const suggestedQuestions = [
  { icon: FileText, text: '経費申請の手順を教えて', category: '申請・承認' },
  { icon: Calculator, text: '今月の経費精算状況は？', category: '経理' },
  { icon: Users, text: '入社手続きに必要な書類は？', category: '人事' },
  { icon: HelpCircle, text: '有給休暇の残日数は？', category: '労務' },
]

const chatHistory = [
  {
    role: 'assistant' as const,
    content: 'こんにちは！ジジロボです。B-Hallに関することなら何でもお気軽にご質問ください。業務手順の確認、申請の作成サポート、社内ルールの質問などお手伝いします。',
    time: '10:00',
  },
  {
    role: 'user' as const,
    content: '経費申請のやり方を教えてください',
    time: '10:02',
  },
  {
    role: 'assistant' as const,
    content: '経費申請の手順をご案内します。\n\n1. サイドバーから「業務統制」→「申請・承認」を開きます\n2. 右上の「新規申請」ボタンをクリック\n3. 申請種別で「経費精算」を選択\n4. 必要事項（日付、金額、用途、勘定科目）を入力\n5. 領収書を添付\n6. 承認者を確認して「申請」をクリック\n\n承認者への通知は自動で送信されます。承認状況は「申請・承認」画面で確認できます。',
    time: '10:02',
  },
]

export default function AssistantPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chatHistory)

  const handleSend = () => {
    if (!message.trim()) return
    setMessages([
      ...messages,
      { role: 'user' as const, content: message, time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) },
      {
        role: 'assistant' as const,
        content: 'ありがとうございます。確認しますので少々お待ちください...\n\n（※デモ版のため、実際のAI応答は開発中です）',
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">AIアシスタント</span>
      </nav>

      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.1)] flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">ジジロボ</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">AIアシスタント</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(79,70,229,0.08)] text-accent text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          オンライン
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <motion.div
        className="bg-bg-surface border border-border rounded-[16px] p-5 shadow-card mb-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-3">
          よくある質問
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedQuestions.map((q, idx) => {
            const QIcon = q.icon
            return (
              <motion.button
                key={idx}
                variants={fadeUp}
                onClick={() => {
                  setMessage(q.text)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-bg-elevated border border-border hover:border-[rgba(79,70,229,0.3)] transition-all text-left group"
              >
                <QIcon className="w-5 h-5 text-text-muted group-hover:text-accent shrink-0 transition-colors" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-text-primary tracking-tight truncate">{q.text}</p>
                  <p className="text-[11px] text-text-muted">{q.category}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        className="flex-1 bg-bg-surface border border-border rounded-[16px] shadow-card flex flex-col overflow-hidden min-h-0"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className="flex items-end gap-2">
                  {msg.role === 'assistant' && (
                    <Bot className="w-4 h-4 text-accent shrink-0 mb-1" strokeWidth={1.75} />
                  )}
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-2xl rounded-br-sm'
                        : 'bg-bg-elevated border border-border text-text-secondary rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${msg.role === 'user' ? 'justify-end' : 'ml-6'}`}>
                  <Clock className="w-3 h-3 text-text-muted" strokeWidth={1.75} />
                  <span className="text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={1}
                className="w-full resize-none rounded-[10px] bg-bg-elevated border border-border px-4 py-3 text-[14px] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-[10px] bg-accent flex items-center justify-center text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shrink-0 shadow-[0_0_12px_rgba(79,70,229,0.2)]"
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
