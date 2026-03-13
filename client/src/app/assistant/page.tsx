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

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 28 },
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
    <div className="max-w-[720px] mx-auto px-10 py-14 h-full flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#1E293B]">ジジロボ</h1>
            <p className="text-[13px] text-[#94A3B8] font-medium">AIアシスタント</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#059669]/10 text-[#059669] text-[12px] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          オンライン
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <motion.div
        className="rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] p-4 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h3 className="text-[13px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
          よくある質問
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedQuestions.map((q, idx) => {
            const QIcon = q.icon
            return (
              <motion.button
                key={idx}
                variants={itemVariants}
                onClick={() => {
                  setMessage(q.text)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all text-left"
              >
                <QIcon className="w-5 h-5 text-[#94A3B8] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-[#1E293B] truncate">{q.text}</p>
                  <p className="text-[13px] text-[#94A3B8] font-medium">{q.category}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        className="flex-1 rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden min-h-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.2 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className="flex items-end gap-2">
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0 mb-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#6366F1]" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#6366F1] text-white rounded-br-md'
                        : 'bg-[#F8FAFC] text-[#475569] rounded-bl-md'
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
                <div className={`flex items-center gap-1 mt-1 ${msg.role === 'user' ? 'justify-end' : 'ml-9'}`}>
                  <Clock className="w-3 h-3 text-[#CBD5E1]" />
                  <span className="text-[11px] text-[#CBD5E1] font-medium">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#F1F5F9]">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={1}
                className="w-full resize-none rounded-xl bg-[#F8FAFC] border-none px-4 py-3 text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(99,102,241,0.3)] hover:bg-[#818CF8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[13px] text-[#94A3B8] font-medium mt-2 ml-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            ジジロボは社内情報に基づいて回答します。機密情報の取り扱いにご注意ください。
          </p>
        </div>
      </motion.div>
    </div>
  )
}
