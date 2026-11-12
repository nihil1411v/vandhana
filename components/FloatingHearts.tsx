'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const GLYPHS = ['♡', '♡', '✦', 'daisy']
const COLORS = ['#c4306b', '#e0447f', '#d4956b', '#a8305a']

// Reduced from 18 to 8, and slower — the goal is "occasional, hand-drawn"
// rather than a constant stream. "Do not create a heart storm."
export default function FloatingHearts({ count = 8 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 12,
        duration: 20 + Math.random() * 14,
        delay: Math.random() * -30,
        drift: (Math.random() - 0.5) * 40,
        sway: 10 + Math.random() * 12,
        glyph: GLYPHS[i % GLYPHS.length],
        color: COLORS[i % COLORS.length],
        opacity: 0.1 + Math.random() * 0.14,
      })),
    [count]
  )

  if (prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map(item => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{ left: `${item.left}%`, bottom: -40 }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: '-110vh',
            x: [0, item.sway, -item.sway * 0.6, item.drift],
            opacity: [0, item.opacity, item.opacity, 0],
            scale: [0.85, 1, 0.95, 1.02],
            rotate: item.glyph === 'daisy' ? [0, 20, -12, 0] : 0,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {item.glyph === 'daisy' ? (
            <Daisy size={item.size + 4} color={item.color} />
          ) : (
            <span style={{ fontSize: item.size, color: item.color }}>{item.glyph}</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/** A small hand-drawn-feeling daisy — six soft petals around a warm center. */
function Daisy({ size, color }: { size: number; color: string }) {
  const petals = Array.from({ length: 6 })
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {petals.map((_, i) => (
        <ellipse
          key={i}
          cx={20}
          cy={9}
          rx={5}
          ry={9}
          fill={color}
          opacity={0.85}
          transform={`rotate(${i * 60} 20 20)`}
        />
      ))}
      <circle cx={20} cy={20} r={5} fill="#ffe066" opacity={0.9} />
    </svg>
  )
}
