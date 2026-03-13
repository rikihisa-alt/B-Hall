'use client'

import { Search, Bell } from 'lucide-react'

/* ─────────────────────────────────
   Header: 最小限のクローム
   - ⌘K 検索トリガー（常時アクセス可能）
   - 通知ベル
   - それ以外は不要
───────────────────────────────── */

export function Header() {
  return (
    <header className="h-10 flex items-center px-5 gap-3 shrink-0 border-b border-white/[0.03]">
      <button className="flex items-center gap-2 h-[26px] px-2.5 rounded-md bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.06] transition-all cursor-pointer group">
        <Search className="w-3 h-3 text-[#2E323B] group-hover:text-[#4B5263] transition-colors" />
        <span className="text-[11px] text-[#2E323B] group-hover:text-[#4B5263] transition-colors">検索...</span>
        <kbd className="text-[9px] text-[#1E2028] bg-white/[0.03] border border-white/[0.05] rounded px-1 py-[1px] font-mono leading-none ml-1.5">⌘K</kbd>
      </button>
      <div className="flex-1" />
      <button className="relative p-1.5 rounded-md hover:bg-white/[0.03] transition-colors">
        <Bell className="w-[13px] h-[13px] text-[#2E323B]" />
        <span className="absolute top-0.5 right-0.5 w-[5px] h-[5px] bg-[#FF5D5D] rounded-full ring-[1.5px] ring-[#0F1115]" />
      </button>
    </header>
  )
}
