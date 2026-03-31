'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Home, CheckSquare, FileText, Calculator, Bot,
  ArrowRight, SkipForward, Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTutorialStore } from '@/stores/tutorial-store'
import { TUTORIAL_SECTIONS } from '@/lib/tutorial-sections'
import { Button } from '@/components/ui/button'

// ── Icon mapping ──

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  CheckSquare,
  FileText,
  Calculator,
  Bot,
}

// ── Animation ──

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
}

export default function WelcomePage() {
  const router = useRouter()
  const { startTutorial, skipAll } = useTutorialStore()

  const handleStart = () => {
    startTutorial()
    router.push('/')
  }

  const handleSkip = () => {
    skipAll()
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
        <div className="w-full max-w-2xl">
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
                <span className="text-3xl">&#x1F389;</span>
              </motion.div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-text-primary mb-2">
                B-Hallへようこそ！
              </h1>
              <p className="text-[15px] text-text-secondary max-w-md mx-auto">
                セットアップが完了しました。実際に操作しながらB-Hallの使い方を体験しましょう。
              </p>
            </div>

            {/* Tutorial Section Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 mb-8"
            >
              {TUTORIAL_SECTIONS.map((section, index) => {
                const Icon = ICON_MAP[section.iconName] || Home
                return (
                  <motion.div
                    key={section.key}
                    variants={itemVariants}
                    className={cn(
                      'bg-bg-surface border border-border rounded-[16px] shadow-card p-4',
                      'hover:border-accent/30 transition-colors duration-200',
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Number badge */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent text-[14px] font-bold flex items-center justify-center">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-text-primary">
                          {section.title}
                        </p>
                        <p className="text-[12px] text-text-muted mt-0.5">
                          {section.description}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="flex-shrink-0 flex items-center gap-1 text-[11px] text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>約{section.estimatedMinutes}分</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Total time */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-[13px] text-text-muted mb-6"
            >
              全{TUTORIAL_SECTIONS.length}セクション・約{TUTORIAL_SECTIONS.reduce((s, sec) => s + sec.estimatedMinutes, 0)}分で完了
            </motion.p>

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
                スキップしてダッシュボードへ
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
