'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BALLOON_MESSAGE } from '@/lib/config'
import { addBalloonPopped } from '@/lib/db'
import { playPop } from '@/lib/sound'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

interface Burst {
  id: number
  x: number
  y: number
  color: string
}

// Warm, pastel, party-cute palette instead of the dark red/black used elsewhere —
// balloons should feel like an actual birthday party, not a gothic love letter.
const COLORS = ['#ff9fc0', '#ffd7e6', '#ffb6c1', '#ffe066', '#e8a8c0', '#ff8fb3']

export default function BalloonPopScene({ onComplete }: Props) {
  const [popped, setPopped] = useState<Set<number>>(new Set())
  const [bursts, setBursts] = useState<Burst[]>([])
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const burstIdRef = useRef(0)

  const layout = useMemo(
    () =>
      BALLOON_MESSAGE.map((_, i) => ({
        left: 6 + ((i * 37) % 88),
        delay: (i % 6) * 0.3,
        color: COLORS[i % COLORS.length],
        driftDuration: 4.5 + (i % 4) * 0.8,
        sway: 10 + (i % 5) * 4,
        rotateSway: 5 + (i % 4) * 2,
        isHeart: i % 3 === 1,
        stringWiggle: (i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 3),
      })),
    []
  )

  const pop = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (popped.has(i)) return
    setPopped(prev => new Set(prev).add(i))
    addBalloonPopped(i)
    playPop()

    const fieldRect = fieldRef.current?.getBoundingClientRect()
    const btnRect = e.currentTarget.getBoundingClientRect()
    if (fieldRect) {
      const id = burstIdRef.current++
      const x = btnRect.left + btnRect.width / 2 - fieldRect.left
      const y = btnRect.top + btnRect.height / 2 - fieldRect.top
      setBursts(prev => [...prev, { id, x, y, color: layout[i].color }])
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id))
      }, 700)
    }
  }

  const allPopped = popped.size >= BALLOON_MESSAGE.length

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop strength={0.4} />
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase z-10" style={{ color: '#8b3050' }}>
        pop them all
      </p>
      <Flourish />

      {/* Assembled message so far */}
      <div className="flex flex-wrap justify-center gap-2 max-w-md z-10" style={{ minHeight: 60 }}>
        {BALLOON_MESSAGE.map((word, i) => (
          <span
            key={i}
            className="font-cinzel text-xs tracking-widest uppercase"
            style={{
              color: popped.has(i) ? '#6b2c42' : 'transparent',
              transition: 'color 0.4s',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Balloon field */}
      <div ref={fieldRef} className="relative w-full flex-1" style={{ minHeight: 320, maxWidth: 480, overflow: 'hidden' }}>
        {BALLOON_MESSAGE.map((word, i) => (
          <AnimatePresence key={i}>
            {!popped.has(i) && (
              <motion.button
                className="absolute flex flex-col items-center cursor-pointer"
                style={{ left: `${layout[i].left}%`, top: 0 }}
                initial={{ y: 340, opacity: 0, rotate: 0 }}
                animate={{
                  y: [340, 0],
                  x: [0, layout[i].sway, -layout[i].sway * 0.7, layout[i].sway * 0.4, 0],
                  rotate: [0, -layout[i].rotateSway, layout[i].rotateSway, -layout[i].rotateSway * 0.5, 0],
                  opacity: 1,
                }}
                exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.15 } }}
                transition={{
                  y: { duration: layout[i].driftDuration, delay: layout[i].delay, repeat: Infinity, ease: 'easeInOut' },
                  x: { duration: layout[i].driftDuration * 0.8, delay: layout[i].delay, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: layout[i].driftDuration * 0.9, delay: layout[i].delay, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.4 },
                }}
                onClick={e => pop(i, e)}
              >
                <BalloonShape color={layout[i].color} isHeart={layout[i].isHeart} />
                <CurlyString wiggle={layout[i].stringWiggle} />
              </motion.button>
            )}
          </AnimatePresence>
        ))}

        {/* Pop bursts */}
        <AnimatePresence>
          {bursts.map(b => (
            <PopBurst key={b.id} x={b.x} y={b.y} color={b.color} />
          ))}
        </AnimatePresence>
      </div>

      <p className="font-cinzel text-[9px] tracking-[8px] uppercase z-10" style={{ color: '#a8305a' }}>
        {popped.size}/{BALLOON_MESSAGE.length} popped
      </p>

      <button
        className="btn-romantic z-10"
        onClick={onComplete}
        style={{ opacity: allPopped ? 1 : 0.35, pointerEvents: allPopped ? 'auto' : 'none' }}
      >
        continue
      </button>
    </motion.div>
  )
}

/** A realistic-ish balloon: glossy round shape with a highlight and a knot, or a heart-shaped variant. */
function BalloonShape({ color, isHeart }: { color: string; isHeart: boolean }) {
  if (isHeart) {
    return (
      <svg width={52} height={50} viewBox="0 0 52 50" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`heartGrad-${color}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </radialGradient>
        </defs>
        <path
          d="M26 46 C 8 32, 0 22, 0 13 C 0 4, 8 -1, 15 3 C 20 6, 24 11, 26 15
             C 28 11, 32 6, 37 3 C 44 -1, 52 4, 52 13 C 52 22, 44 32, 26 46 Z"
          fill={`url(#heartGrad-${color})`}
        />
        {/* knot */}
        <polygon points="23,45 29,45 26,50" fill={color} opacity={0.9} />
      </svg>
    )
  }
  return (
    <div className="relative" style={{ width: 46, height: 58 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: `radial-gradient(circle at 32% 26%, #ffffff 0%, ${color}dd 30%, ${color} 75%)`,
          boxShadow: `inset -8px -10px 14px rgba(0,0,0,0.18)`,
        }}
      />
      {/* gloss highlight */}
      <div
        className="absolute"
        style={{
          top: '18%',
          left: '24%',
          width: 10,
          height: 16,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          transform: 'rotate(-20deg)',
        }}
      />
      {/* knot */}
      <div
        className="absolute"
        style={{
          left: '50%',
          bottom: -6,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `7px solid ${color}`,
        }}
      />
    </div>
  )
}

/** A gently curved ribbon instead of a straight thread. */
function CurlyString({ wiggle }: { wiggle: number }) {
  return (
    <svg width={20} height={30} style={{ overflow: 'visible', marginTop: -2 }}>
      <path
        d={`M 10 0 Q ${10 + wiggle} 12, 10 18 Q ${10 - wiggle} 24, 10 30`}
        fill="none"
        stroke="rgba(196,48,107,0.5)"
        strokeWidth={1.2}
      />
    </svg>
  )
}

/** A little heart-confetti pop, triggered at the balloon's exact on-screen position. */
function PopBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.3
        const dist = 26 + Math.random() * 18
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, isHeart: i % 2 === 0 }
      }),
    []
  )
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {/* flash ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ left: -18, top: -18, width: 36, height: 36, border: `2px solid ${color}` }}
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ fontSize: p.isHeart ? 12 : 6, color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy + 10, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {p.isHeart ? '♡' : '●'}
        </motion.span>
      ))}
      <motion.p
        className="absolute font-cinzel text-[10px] tracking-widest uppercase"
        style={{ left: -20, top: -34, color: '#6b2c42', width: 60, textAlign: 'center' }}
        initial={{ opacity: 0, y: 4, scale: 0.8 }}
        animate={{ opacity: 1, y: -8, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        pop!
      </motion.p>
    </div>
  )
}
