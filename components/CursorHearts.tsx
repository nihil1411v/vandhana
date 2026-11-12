'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heart {
  id: number
  x: number
  y: number
  glyph: string
  color: string
  size: number
  tx: number // where it drifts to (px, relative to where it was born)
  ty: number
  life: number // seconds
}

const GLYPHS = ['♡', '♡', '♡', '✦']
const COLORS = ['#ff9fc0', '#ffb6c1', '#ffd7e6', '#ff6fa5', '#e8a8c0']
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

/**
 * A soft trail of tiny pink hearts and sparkles that follows the pointer
 * (mouse or finger), plus a little ring of hearts that bursts out wherever
 * she taps or clicks.
 */
export default function CursorHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])
  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const idRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const spawn = (items: Omit<Heart, 'id'>[]) => {
      const born = items.map(h => ({ ...h, id: idRef.current++ }))
      setHearts(prev => [...prev, ...born].slice(-34))
      const longest = Math.max(...born.map(b => b.life)) * 1000 + 80
      setTimeout(() => {
        const dead = new Set(born.map(b => b.id))
        setHearts(prev => prev.filter(h => !dead.has(h.id)))
      }, longest)
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const dist = Math.hypot(e.clientX - lastRef.current.x, e.clientY - lastRef.current.y)
      if (now - lastRef.current.t < 65 && dist < 24) return
      lastRef.current = { x: e.clientX, y: e.clientY, t: now }
      spawn([
        {
          x: e.clientX, y: e.clientY,
          glyph: pick(GLYPHS), color: pick(COLORS),
          size: 12 + Math.random() * 6,
          tx: (Math.random() - 0.5) * 10, ty: -22, life: 0.75,
        },
      ])
    }

    const onDown = (e: PointerEvent) => {
      const n = 9
      spawn(
        Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
          const r = 38 + Math.random() * 34
          return {
            x: e.clientX, y: e.clientY,
            glyph: pick(GLYPHS), color: pick(COLORS),
            size: 14 + Math.random() * 8,
            tx: Math.cos(a) * r, ty: Math.sin(a) * r - 12, life: 0.95,
          }
        })
      )
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      <AnimatePresence>
        {hearts.map(h => (
          <motion.span
            key={h.id}
            className="absolute"
            style={{
              left: h.x,
              top: h.y,
              marginLeft: -h.size / 2,
              marginTop: -h.size / 2,
              fontSize: h.size,
              lineHeight: 1,
              color: h.color,
              filter: `drop-shadow(0 0 4px ${h.color}88)`,
            }}
            initial={{ opacity: 0.9, scale: 0.5, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.15, x: h.tx, y: h.ty }}
            transition={{ duration: h.life, ease: 'easeOut' }}
          >
            {h.glyph}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
