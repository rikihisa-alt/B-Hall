'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home, CheckSquare, FileText, Calculator, Bot,
  Check, Play, RotateCcw, GraduationCap, PartyPopper, Trash2,
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

// ── Main Component ──

export default function TutorialPage() {
  const router = useRouter()
  const {
    completedSections,
    goToSection,
    startTutorial,
    resetTutorials,
    getProgress,
  } = useTutorialStore()

  const progress = getProgress()
  const allDone = progress.completed === progress.total

  const handleStartSection = (index: number) => {
    goToSection(index)
    const section = TUTORIAL_SECTIONS[index]
    if (section?.steps[0]?.route) {
      router.push(section.steps[0].route)
    } else {
      router.push('/')
    }
  }

  const handleStartAll = () => {
    startTutorial()
    router.push('/')
  }

  const handleReset = () => {
    resetTutorials()
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-accent" />
          <h1 className="text-[20px] font-bold text-text-primary">チュートリアル</h1>
        </div>
        <p className="text-[13px] text-text-secondary">
          各セクションを実際に操作しながら、B-Hallの使い方を学びましょう。
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-text-primary">
            全体の進捗
          </span>
          <span className="text-[13px] text-text-muted">
            {progress.completed} / {progress.total} セクション完了
          </span>
        </div>
        <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-[#6366F1]"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {allDone ? (
        /* ── All Complete ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-8 text-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-[20px] font-bold text-text-primary mb-2">
            すべてのチュートリアルを完了しました！
          </h2>
          <p className="text-[14px] text-text-secondary mb-6 max-w-md mx-auto">
            B-Hallの基本操作はマスターしました。さっそく業務を始めましょう。
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push('/')} icon={Home}>
              ダッシュボードへ
            </Button>
          </div>
        </motion.div>
      ) : (
        /* ── Start all button ── */
        <div className="mb-6">
          <Button variant="primary" size="md" onClick={handleStartAll} icon={Play}>
            チュートリアルを始める
          </Button>
        </div>
      )}

      {/* Section Cards */}
      <div className="space-y-3 mb-8">
        {TUTORIAL_SECTIONS.map((section, index) => {
          const Icon = ICON_MAP[section.iconName] || Home
          const isCompleted = completedSections.includes(section.key)

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-bg-surface border rounded-[16px] shadow-card p-5 transition-colors',
                isCompleted ? 'border-success/30' : 'border-border hover:border-accent/30',
              )}
            >
              <div className="flex items-center gap-4">
                {/* Status icon */}
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                    isCompleted ? 'bg-success/10' : 'bg-accent/10',
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <Icon className="w-5 h-5 text-accent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-[14px] font-semibold',
                        isCompleted ? 'text-text-muted line-through' : 'text-text-primary',
                      )}
                    >
                      {section.title}
                    </p>
                    {isCompleted && (
                      <span className="text-[11px] text-success font-medium bg-success/8 px-2 py-0.5 rounded-full">
                        完了
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {section.description} — {section.steps.length}ステップ・約{section.estimatedMinutes}分
                  </p>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <button
                      onClick={() => handleStartSection(index)}
                      className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-accent/5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      もう一度
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartSection(index)}
                      className={cn(
                        'flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2 rounded-[10px] transition-all',
                        'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]',
                        'hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(79,70,229,0.3)]',
                      )}
                    >
                      <Play className="w-3.5 h-3.5" />
                      開始
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Reset button */}
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-danger transition-colors py-2"
        >
          <Trash2 className="w-3 h-3" />
          全セクションをリセット
        </button>
      </div>
    </div>
  )
}
