'use client'

import { useEffect, useState } from 'react'

/** Animated ambient gradient background. Pure CSS, GPU-friendly. */
export default function Aurora({ className = '' }: { className?: string }) {
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
      className={`pointer-events-none fixed inset-0 opacity-40 ${className}`}
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 20% 50%, rgba(139,92,246,0.18), transparent 60%),' +
          'radial-gradient(ellipse 60% 40% at 80% 30%, rgba(6,182,212,0.14), transparent 60%),' +
          'radial-gradient(ellipse 50% 35% at 50% 80%, rgba(236,72,153,0.10), transparent 60%)',
        filter: 'blur(40px)',
        animation: enabled ? 'aurora 30s ease-in-out infinite alternate' : 'none',
        willChange: 'background-position',
      }}
    />
  )
}
