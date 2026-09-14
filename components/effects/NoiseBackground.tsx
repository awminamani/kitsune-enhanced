'use client'

import { useEffect, useState } from 'react'

/** Very subtle animated noise via a repeating gradient pattern that shifts. */
export default function NoiseBackground({ opacity = 0.02 }: { opacity?: number }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    setEnabled(mq.matches)
    const fn = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 4px)',
        opacity,
        animation: enabled ? 'aurora 45s ease-in-out infinite alternate' : 'none',
        willChange: 'background-position',
      }}
    />
  )
}
