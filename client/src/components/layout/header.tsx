'use client'

import { Search, Bell, Command } from 'lucide-react'

export function Header() {
  return (
    <header className="h-12 flex items-center px-6 gap-4 shrink-0 border-b border-gray-200/30 bg-white/40 backdrop-blur-sm">
      {/* Search trigger */}
      <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-gray-100/60 hover:bg-gray-100 border border-gray-200/40 transition-all cursor-pointer group">
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[12px] text-gray-400 group-hover:text-gray-500 transition-colors">検索...</span>
        <div className="flex items-center gap-0.5 ml-4">
          <kbd className="text-[10px] text-gray-400 bg-white/80 border border-gray-200/60 rounded px-1 py-0.5 font-mono">⌘</kbd>
          <kbd className="text-[10px] text-gray-400 bg-white/80 border border-gray-200/60 rounded px-1 py-0.5 font-mono">K</kbd>
        </div>
      </button>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <button className="relative p-2 rounded-lg hover:bg-gray-100/60 transition-colors">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
