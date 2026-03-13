'use client'

import { Search, Bell } from 'lucide-react'

export function Header() {
  return (
    <header className="h-12 flex items-center px-6 gap-4 shrink-0 border-b border-white/[0.06]">
      {/* Search trigger — Raycast style */}
      <button className="flex items-center gap-2.5 h-[32px] px-3 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.10] transition-all cursor-pointer group">
        <Search className="w-3.5 h-3.5 text-[#5A6070] group-hover:text-[#7B8392] transition-colors" />
        <span className="text-[12px] text-[#5A6070] group-hover:text-[#7B8392] transition-colors">検索...</span>
        <div className="flex items-center gap-0.5 ml-3">
          <kbd className="text-[10px] text-[#4B5263] bg-white/[0.04] border border-white/[0.08] rounded-[4px] px-1.5 py-0.5 font-mono leading-none">⌘</kbd>
          <kbd className="text-[10px] text-[#4B5263] bg-white/[0.04] border border-white/[0.08] rounded-[4px] px-1.5 py-0.5 font-mono leading-none">K</kbd>
        </div>
      </button>

      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="relative p-2 rounded-[8px] hover:bg-white/[0.05] transition-colors">
          <Bell className="w-4 h-4 text-[#5A6070]" />
          <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#FF5D5D] rounded-full ring-2 ring-[#0F1115]" />
        </button>
      </div>
    </header>
  )
}
