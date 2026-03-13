'use client'

import { useState, useEffect, useRef } from 'react'

export function useCountUp(
  target: number,
  duration: number = 1200,
  delay: number = 0
): number {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp
        const elapsed = timestamp - startTime.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))

        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate)
        }
      }
      rafId.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId.current)
    }
  }, [target, duration, delay])

  return value
}
