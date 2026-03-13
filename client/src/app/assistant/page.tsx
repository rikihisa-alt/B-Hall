'use client'

import { useState } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Calculator,
  Users,
  HelpCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

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
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/executive" className="p-2 rounded-xl hover:bg-white/60 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ジジロボ</h1>
            <p className="text-sm text-gray-500">AIアシスタント</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          オンライン
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="glass rounded-2xl p-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          よくある質問
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedQuestions.map((q, idx) => {
            const QIcon = q.icon
            return (
              <button
                key={idx}
                onClick={() => {
                  setMessage(q.text)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 border border-gray-100/60 hover:bg-white hover:shadow-sm transition-all text-left"
              >
                <QIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{q.text}</p>
                  <p className="text-[11px] text-gray-400">{q.category}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className="flex items-end gap-2">
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shrink-0 mb-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white/80 border border-gray-100/60 text-gray-700 rounded-bl-md'
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
                  <Clock className="w-3 h-3 text-gray-300" />
                  <span className="text-[11px] text-gray-300">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100/60">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={1}
                className="w-full resize-none rounded-xl bg-white/60 border border-gray-200/50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 ml-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ジジロボは社内情報に基づいて回答します。機密情報の取り扱いにご注意ください。
          </p>
        </div>
      </div>
    </div>
  )
}
