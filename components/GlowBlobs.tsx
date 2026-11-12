'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const BLOBS = [
  { color: '#ff9fc0', size: 340, top: '8%', left: '-8%' },
  { color: '#c9a8ff', size: 280, top: '55%', left: '78%' },
  { color: '#ffd28a', size: 260, top: '80%', left: '10%' },
]

// Soft golden-rose "god rays" — the same slow, drifting light-shaft feeling
// as sunbeams through water, re-tinted warm instead of blue. Purely CSS:
// a few wide, blurred, low-opacity wedges that sway and breathe.
const RAYS = [
  { rotate: -14, left: '18%', width: 220, delay: 0 },
  { rotate: 6, left: '48%', width: 160, delay: -6 },
  { rotate: -4, left: '74%', width: 200, delay: -12 },
]

// Tiny drifting bokeh sparkles — the "plankton in the light" layer.
function useSparkles(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 5 + Math.random() * 6,
        delay: Math.random() * -10,
      })),
    [count]
  )
}

export default function GlowBlobs() {
  const prefersReducedMotion = useReducedMotion()
  const items = useMemo(
    () =>
      BLOBS.map((b, i) => ({
        ...b,
        duration: 22 + i * 6,
        delay: i * -7,
        driftX: 40 + i * 12,
        driftY: 30 + i * 10,
      })),
    []
  )
  const sparkles = useSparkles(26)

  if (prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Warm light shafts, like sun through a soft haze */}
      {RAYS.map((r, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute top-0"
          style={{
            left: r.left,
            width: r.width,
            height: '140vh',
            background:
              'linear-gradient(180deg, rgba(255,214,170,0.16) 0%, rgba(255,159,192,0.07) 40%, transparent 80%)',
            filter: 'blur(18px)',
            transformOrigin: 'top center',
            rotate: r.rotate,
          }}
          animate={{ rotate: [r.rotate - 2, r.rotate + 2, r.rotate - 2], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 14, delay: r.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Soft colour blobs */}
      {items.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: 0.16,
            filter: 'blur(70px)',
          }}
          animate={{
            x: [0, b.driftX, 0, -b.driftX, 0],
            y: [0, -b.driftY, 0, b.driftY, 0],
          }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Bokeh sparkle dust */}
      {sparkles.map(s => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: '#ffe8c4',
            boxShadow: '0 0 6px 1px rgba(255,214,170,0.8)',
          }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
