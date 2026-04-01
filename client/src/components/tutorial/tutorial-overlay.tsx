'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, SkipForward, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTutorialStore } from '@/stores/tutorial-store'
import { TUTORIAL_SECTIONS } from '@/lib/tutorial-sections'
import type { TutorialStep as StepDef } from '@/lib/tutorial-sections'

// ── Confetti particles for section complete ──

function ConfettiEffect() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    rotation: Math.random() * 360,
    color: ['#4F46E5', '#6366F1', '#818CF8', '#34D399', '#FBBF24', '#F472B6'][
      i % 6
    ],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[10001]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: '-10px',
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: 'easeIn',
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  )
}

// ── Main Overlay Component ──

export function TutorialOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    isActive,
    currentSection,
    currentStep,
    nextStep,
    skipSection,
    skipAll,
    endTutorial,
  } = useTutorialStore()

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [ready, setReady] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const prevSectionRef = useRef(currentSection)

  // Get current section and step data
  const section = TUTORIAL_SECTIONS[currentSection]
  const step: StepDef | undefined = section?.steps[currentStep]

  // Show confetti when section changes
  useEffect(() => {
    if (currentSection > prevSectionRef.current && isActive) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2500)
      prevSectionRef.current = currentSection
      return () => clearTimeout(timer)
    }
    prevSectionRef.current = currentSection
  }, [currentSection, isActive])

  // Navigate to the required route when step changes
  useEffect(() => {
    if (!isActive || !step) return

    if (step.route && pathname !== step.route) {
      router.push(step.route)
      setReady(false)
    } else {
      // Small delay to allow DOM to render after navigation
      const timer = setTimeout(() => {
        setReady(true)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isActive, step, pathname, router])

  // Mark ready after route change
  useEffect(() => {
    if (!isActive || !step) return
    if (!step.route || pathname === step.route) {
      const timer = setTimeout(() => setReady(true), 400)
      return () => clearTimeout(timer)
    }
  }, [pathname, isActive, step])

  // Execute step action when step becomes ready
  useEffect(() => {
    if (!ready || !step?.action) return
    try {
      step.action()
    } catch {
      // ignore action errors
    }
  }, [ready, currentSection, currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  // Find target element and measure its position
  const measureTarget = useCallback(() => {
    if (!step?.targetSelector) {
      setTargetRect(null)
      return
    }
    const el = document.querySelector(step.targetSelector)
    if (el) {
      setTargetRect(el.getBoundingClientRect())
    } else {
      setTargetRect(null)
    }
  }, [step])

  useEffect(() => {
    if (!ready) return
    measureTarget()

    // Re-measure on scroll/resize
    const handleUpdate = () => measureTarget()
    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)
    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [ready, measureTarget])

  // Handle next
  const handleNext = useCallback(() => {
    setReady(false)
    setTargetRect(null)
    nextStep()
  }, [nextStep])

  // Handle skip section
  const handleSkipSection = useCallback(() => {
    setReady(false)
    setTargetRect(null)
    skipSection()
  }, [skipSection])

  if (!isActive || !section || !step) return null

  const totalSteps = section.steps.length
  const sectionCount = TUTORIAL_SECTIONS.length
  const isLastStep = currentStep === totalSteps - 1
  const isLastSection = currentSection === sectionCount - 1

  // Calculate tooltip position — always clamped inside viewport
  const getTooltipStyle = (): React.CSSProperties => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600
    const tooltipW = 360
    const tooltipH = 260 // approximate
    const pad = 16

    // Mobile: fixed at bottom
    if (vw < 768) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        maxWidth: 'none',
      }
    }

    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: tooltipW,
      }
    }

    const pos = step.position ?? 'bottom'
    const gap = 16
    let top = 0
    let left = 0

    switch (pos) {
      case 'bottom':
        top = targetRect.bottom + gap
        left = targetRect.left + targetRect.width / 2 - tooltipW / 2
        break
      case 'top':
        top = targetRect.top - gap - tooltipH
        left = targetRect.left + targetRect.width / 2 - tooltipW / 2
        break
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipH / 2
        left = targetRect.left - gap - tooltipW
        break
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipH / 2
        left = targetRect.right + gap
        break
    }

    // Clamp to viewport
    left = Math.max(pad, Math.min(left, vw - tooltipW - pad))
    top = Math.max(pad, Math.min(top, vh - tooltipH - pad))

    return { position: 'fixed', top, left, width: tooltipW }
  }

  return (
    <>
      {showConfetti && <ConfettiEffect />}

      <AnimatePresence>
        {ready && (
          <motion.div
            key={`overlay-${currentSection}-${currentStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000]"
          >
            {/* Dark overlay with spotlight cutout */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="tutorial-spotlight">
                  <rect width="100%" height="100%" fill="white" />
                  {targetRect && (
                    <rect
                      x={targetRect.left - 8}
                      y={targetRect.top - 8}
                      width={targetRect.width + 16}
                      height={targetRect.height + 16}
                      rx="12"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.5)"
                mask="url(#tutorial-spotlight)"
              />
            </svg>

            {/* Highlight ring around target */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute pointer-events-none rounded-xl"
                style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  boxShadow: '0 0 0 4px rgba(79,70,229,0.4), 0 0 24px rgba(79,70,229,0.15)',
                }}
              />
            )}

            {/* Tooltip */}
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={getTooltipStyle()}
              className="bg-white rounded-[16px] shadow-xl p-5 z-[10001] pointer-events-auto"
            >
              {/* Section progress dots */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  {TUTORIAL_SECTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        i < currentSection
                          ? 'bg-emerald-400'
                          : i === currentSection
                            ? 'bg-[#4F46E5]'
                            : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 ml-auto">
                  {currentSection + 1}/{sectionCount}
                </span>
              </div>

              {/* Section label */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span className="text-[11px] font-semibold text-[#4F46E5] uppercase tracking-wider">
                  {section.title}
                </span>
              </div>

              {/* Step title */}
              <h3 className="text-[16px] font-bold text-gray-900 mb-1.5">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Step dots within section */}
              <div className="flex items-center gap-1 mb-4">
                {section.steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i <= currentStep
                        ? 'bg-[#4F46E5] w-4'
                        : 'bg-gray-200 w-2'
                    )}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkipSection}
                  className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  <SkipForward className="w-3 h-3" />
                  スキップ
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      skipAll()
                    }}
                    className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    全てスキップ
                  </button>
                  <button
                    onClick={handleNext}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white transition-all',
                      'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]',
                      'hover:-translate-y-[1px] hover:shadow-[0_0_16px_rgba(79,70,229,0.4)]',
                      'active:translate-y-0'
                    )}
                  >
                    {isLastStep && isLastSection ? (
                      '完了'
                    ) : (
                      <>
                        次へ
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={endTutorial}
              className="fixed top-4 right-4 z-[10002] w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors pointer-events-auto"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
