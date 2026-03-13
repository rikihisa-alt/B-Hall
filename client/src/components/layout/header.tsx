'use client'

import { Bell, Search, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 glass-strong border-b border-gray-200/30 flex items-center px-6 gap-4 shrink-0">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-white/60 transition-colors">
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="タスク、申請、文書を検索..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/60 border border-gray-200/50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 rounded-xl hover:bg-white/60 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-white text-sm font-semibold">田</span>
        </div>
      </div>
    </header>
  )
}
