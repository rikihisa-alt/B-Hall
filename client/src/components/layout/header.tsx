'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { USER_ROLE_LABELS } from '@/lib/constants'

export function Header() {
  const { currentUser, mounted } = useAuth()

  const avatarInitial = mounted && currentUser ? currentUser.avatar_initial : '田'
  const roleLabel = mounted && currentUser ? USER_ROLE_LABELS[currentUser.role] : ''

  return (
    <header className="h-16 border-b border-border bg-bg-surface flex items-center px-6 shrink-0 z-[200]">
      {/* Left side — Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <Image
          src="/logo.png"
          alt="B-Hall"
          width={240}
          height={40}
          className="h-[40px] w-auto object-contain"
          priority
        />
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side — notification bell + user avatar */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-bg-elevated transition-colors cursor-pointer relative">
          <Bell className="w-[18px] h-[18px] text-text-secondary" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        </button>

        {/* User avatar with role badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-muted text-accent text-[13px] font-semibold flex items-center justify-center cursor-pointer">
            {avatarInitial}
          </div>
          {mounted && currentUser && (
            <div className="hidden sm:flex flex-col">
              <span className="text-[12px] font-medium text-text-primary leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {roleLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
