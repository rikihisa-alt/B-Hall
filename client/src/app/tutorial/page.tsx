'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, CheckSquare, FileText, Stamp, Users, Calculator,
  Building2, Scale, ClipboardList, Lightbulb, BookOpen, Bot,
  Check, ChevronRight, ExternalLink, SkipForward, PartyPopper,
  GraduationCap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTutorialStore, type TutorialItem } from '@/stores/tutorial-store'
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

// ── Main Component ──

export default function TutorialPage() {
  const router = useRouter()
  const {
    items,
    completeTutorialStep,
    completeTutorial,
    skipAllTutorials,
    getProgress,
  } = useTutorialStore()

  const [activeKey, setActiveKey] = useState<string>(() => {
    const first = items.find((i) => !i.completed)
    return first?.key ?? items[0]?.key ?? 'dashboard'
  })

  const [showClear, setShowClear] = useState(false)

  const progress = getProgress()
  const activeItem = items.find((i) => i.key === activeKey) ?? items[0]

  // Auto-advance when section is completed
  useEffect(() => {
    if (activeItem?.completed && showClear) {
      const timer = setTimeout(() => {
        setShowClear(false)
        const nextIncomplete = items.find((i) => !i.completed)
        if (nextIncomplete) {
          setActiveKey(nextIncomplete.key)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [activeItem?.completed, showClear, items])

  const handleStepToggle = useCallback(
    (stepIndex: number) => {
      if (!activeItem) return
      if (activeItem.steps[stepIndex].completed) return

      completeTutorialStep(activeItem.key, stepIndex)

      // Check if all steps are now done
      const updatedItems = useTutorialStore.getState().items
      const updatedItem = updatedItems.find((i) => i.key === activeItem.key)
      if (updatedItem?.completed) {
        setShowClear(true)
      }
    },
    [activeItem, completeTutorialStep]
  )

  const handleSkipSection = useCallback(() => {
    if (!activeItem) return
    completeTutorial(activeItem.key)
    const nextIncomplete = useTutorialStore.getState().items.find((i) => !i.completed)
    if (nextIncomplete) {
      setActiveKey(nextIncomplete.key)
    }
  }, [activeItem, completeTutorial])

  const handleSkipAll = useCallback(() => {
    skipAllTutorials()
    router.push('/')
  }, [skipAllTutorials, router])

  const allDone = progress.completed === progress.total

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-accent" />
          <h1 className="text-[20px] font-bold text-text-primary">チュートリアル</h1>
        </div>
        <p className="text-[13px] text-text-secondary">
          各セクションのステップを完了して、B-Hallの使い方を学びましょう。
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
        <AllCompleteBanner />
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar - Section List */}
          <div className="w-full md:w-[260px] flex-shrink-0">
            <div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden">
              {/* Mobile horizontal scroll */}
              <div className="md:hidden flex overflow-x-auto gap-1 p-2 scrollbar-hide">
                {items.map((item) => (
                  <SectionTab
                    key={item.key}
                    item={item}
                    isActive={item.key === activeKey}
                    onClick={() => setActiveKey(item.key)}
                    compact
                  />
                ))}
              </div>
              {/* Desktop vertical list */}
              <div className="hidden md:block p-2 space-y-0.5">
                {items.map((item) => (
                  <SectionTab
                    key={item.key}
                    item={item}
                    isActive={item.key === activeKey}
                    onClick={() => setActiveKey(item.key)}
                  />
                ))}
              </div>
            </div>

            {/* Skip buttons */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={handleSkipSection}
                className="flex items-center justify-center gap-1.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors py-1.5"
              >
                <SkipForward className="w-3 h-3" />
                このセクションをスキップ
              </button>
              <button
                onClick={handleSkipAll}
                className="flex items-center justify-center gap-1.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors py-1.5"
              >
                <SkipForward className="w-3 h-3" />
                すべてスキップ
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeItem && (
                  <SectionContent
                    item={activeItem}
                    onStepToggle={handleStepToggle}
                    showClear={showClear && activeItem.completed}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section Tab ──

function SectionTab({
  item,
  isActive,
  onClick,
  compact,
}: {
  item: TutorialItem
  isActive: boolean
  onClick: () => void
  compact?: boolean
}) {
  const Icon = ICON_MAP[item.icon] || Home

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all',
          isActive
            ? 'bg-accent/10 text-accent'
            : item.completed
              ? 'bg-success/8 text-success'
              : 'text-text-muted hover:bg-bg-elevated',
        )}
      >
        {item.completed ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Icon className="w-3.5 h-3.5" />
        )}
        <span className={cn(item.completed && !isActive && 'line-through')}>{item.title}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
        isActive
          ? 'bg-accent/10 text-accent'
          : item.completed
            ? 'text-success hover:bg-bg-elevated'
            : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center',
          isActive
            ? 'bg-accent/15'
            : item.completed
              ? 'bg-success/10'
              : 'bg-bg-elevated',
        )}
      >
        {item.completed ? (
          <Check className="w-3.5 h-3.5 text-success" />
        ) : (
          <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-accent' : 'text-text-muted')} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-[13px] font-medium truncate',
            item.completed && !isActive && 'line-through text-text-muted',
          )}
        >
          {item.title}
        </p>
      </div>
      {isActive && (
        <ChevronRight className="w-3.5 h-3.5 text-accent/60 flex-shrink-0" />
      )}
    </button>
  )
}

// ── Section Content ──

function SectionContent({
  item,
  onStepToggle,
  showClear,
}: {
  item: TutorialItem
  onStepToggle: (stepIndex: number) => void
  showClear: boolean
}) {
  const Icon = ICON_MAP[item.icon] || Home
  const completedSteps = item.steps.filter((s) => s.completed).length

  return (
    <div className="bg-bg-surface border border-border rounded-[16px] shadow-card overflow-hidden">
      {/* Section Header */}
      <div className="p-5 md:p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-text-primary">{item.title}</h2>
            <p className="text-[13px] text-text-secondary">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${(completedSteps / item.steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-[12px] text-text-muted flex-shrink-0">
            {completedSteps}/{item.steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="p-5 md:p-6">
        <AnimatePresence mode="wait">
          {showClear ? (
            <motion.div
              key="clear"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3">
                <PartyPopper className="w-7 h-7 text-success" />
              </div>
              <p className="text-[17px] font-bold text-text-primary mb-1">クリア！</p>
              <p className="text-[13px] text-text-secondary">
                次のセクションに移動します...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {item.steps.map((step, index) => (
                <StepRow
                  key={index}
                  step={step}
                  index={index}
                  href={item.href}
                  onToggle={() => onStepToggle(index)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Step Row ──

function StepRow({
  step,
  index,
  href,
  onToggle,
}: {
  step: { title: string; description: string; completed: boolean }
  index: number
  href: string
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border transition-all',
        step.completed
          ? 'bg-success/5 border-success/20'
          : 'bg-bg-base border-border hover:border-accent/30',
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        disabled={step.completed}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all',
          step.completed
            ? 'bg-success border-success'
            : 'border-border hover:border-accent',
        )}
      >
        {step.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-[14px] font-medium',
            step.completed ? 'text-text-muted line-through' : 'text-text-primary',
          )}
        >
          {step.title}
        </p>
        <p className="text-[12px] text-text-muted mt-0.5">{step.description}</p>
      </div>

      {/* Link */}
      {!step.completed && (
        <Link
          href={href}
          className="flex-shrink-0 flex items-center gap-1 text-[12px] text-accent hover:text-accent/80 transition-colors mt-0.5"
        >
          <span className="hidden sm:inline">開く</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
    </motion.div>
  )
}

// ── All Complete Banner ──

function AllCompleteBanner() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface border border-border rounded-[16px] shadow-card p-8 text-center"
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
      <Button variant="primary" size="lg" onClick={() => router.push('/')} icon={Home}>
        ダッシュボードへ
      </Button>
    </motion.div>
  )
}
