'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Calculator,
  Users,
  HelpCircle,
  Clock,
} from 'lucide-react'

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

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
}

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
    <div className="max-w-[680px] mx-auto px-10 py-10 h-full flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-[#34d399]" strokeWidth={1.75} />
          <div>
            <h1 className="text-[24px] font-semibold text-[#f1f5f9] tracking-tight">ジジロボ</h1>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">AIアシスタント</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#059669]/10 text-[#059669] text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          オンライン
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <motion.div
        className="rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-4 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h3 className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider mb-3">
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
              >
                <QIcon className="w-5 h-5 text-[#64748b] shrink-0" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#f1f5f9] tracking-tight truncate">{q.text}</p>
                  <p className="text-[12px] text-[#94a3b8]">{q.category}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        className="flex-1 rounded-xl bg-white/[0.04] backdrop-blur-3xl ring-1 ring-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden min-h-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.2 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className="flex items-end gap-2">
                  {msg.role === 'assistant' && (
                    <Bot className="w-4 h-4 text-[#34d399] shrink-0 mb-1" strokeWidth={1.75} />
                  )}
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#34d399] text-[#0f172a] rounded-2xl rounded-br-sm'
                        : 'bg-white/[0.04] text-[#cbd5e1] rounded-2xl rounded-bl-sm'
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
                  <Clock className="w-3 h-3 text-[#475569]" strokeWidth={1.75} />
                  <span className="text-[11px] text-[#475569]">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={1}
                className="w-full resize-none rounded-lg bg-white/[0.04] border-none px-4 py-3 text-[14px] text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#34d399]/20 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-lg bg-[#34d399] flex items-center justify-center text-[#0f172a] hover:bg-[#6ee7b7] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[12px] text-[#94a3b8] mt-2 ml-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            ジジロボは社内情報に基づいて回答します。機密情報の取り扱いにご注意ください。
          </p>
        </div>
      </motion.div>
    </div>
  )
}
