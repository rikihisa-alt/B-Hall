'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Home, CheckSquare, FileText, Stamp, Users, Calculator,
  Building2, Scale, ClipboardList, Lightbulb, BookOpen, Bot,
  GraduationCap, ArrowRight, SkipForward,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTutorialStore } from '@/stores/tutorial-store'
import { Button } from '@/components/ui/button'

// ── Icon mapping ──

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  CheckSquare,
  FileText,
  Stamp,
  Users,
  Calculator,
  Building2,
  Scale,
  ClipboardList,
  Lightbulb,
  BookOpen,
  Bot,
}

// ── Animation ──

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
}

export default function WelcomePage() {
  const router = useRouter()
  const { items, skipAllTutorials } = useTutorialStore()

  const handleStart = () => {
    router.push('/tutorial')
  }

  const handleSkip = () => {
    skipAllTutorials()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-6 md:py-8">
        <Image
          src="/logo.png"
          alt="B-Hall"
          width={120}
          height={40}
          className="h-[36px] w-auto object-contain"
          priority
        />
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-32">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4"
              >
                <GraduationCap className="w-8 h-8 text-accent" />
              </motion.div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-text-primary mb-2">
                B-Hallへようこそ！
              </h1>
              <p className="text-[15px] text-text-secondary max-w-md mx-auto">
                セットアップが完了しました。チュートリアルで基本操作を学びましょう。
              </p>
            </div>

            {/* Tutorial Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
            >
              {items.map((item, index) => {
                const Icon = ICON_MAP[item.icon] || Home
                return (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className={cn(
                      'bg-bg-surface border border-border rounded-[16px] shadow-card p-4',
                      'hover:border-accent/30 transition-colors duration-200',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-[18px] h-[18px] text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-text-primary truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-[11px] text-text-muted mt-1">
                          {item.steps.length}ステップ
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <Button variant="primary" size="lg" onClick={handleStart} icon={ArrowRight}>
                チュートリアルを始める
              </Button>
              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-secondary transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                スキップして始める
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
