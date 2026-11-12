'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ONE_MINUTE_PHOTOS, PAUSE_SECONDS, PICKUP_LINES } from '@/lib/config'
import { focusOf } from '@/lib/photoFocus'
import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

interface Props {
  onComplete: () => void
}

const SECONDS_PER_PHOTO = 8

export default function OneMinuteScene({ onComplete }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const ready = elapsed >= PAUSE_SECONDS

  useEffect(() => {
    const tick = setInterval(() => setElapsed(e => (e < PAUSE_SECONDS ? e + 1 : e)), 1000)
    const breathe = setInterval(() => setPhase(p => (p === 'in' ? 'out' : 'in')), 4000)
    return () => {
      clearInterval(tick)
      clearInterval(breathe)
    }
  }, [])

  const progress = Math.min(1, elapsed / PAUSE_SECONDS)
  const idx = Math.floor(elapsed / SECONDS_PER_PHOTO) % ONE_MINUTE_PHOTOS.length
  const current = ONE_MINUTE_PHOTOS[idx]
  const lineIdx = Math.floor(elapsed / 10) % PICKUP_LINES.length
  const line = PICKUP_LINES[lineIdx]

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8 overflow-hidden"
      style={{ background: '#0a0308', height: '100dvh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* her photo, blurred into a slow glow of colour behind everything */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute"
          style={{
            inset: '-14%',
            backgroundImage: `url(/photos/${current})`,
            backgroundSize: 'cover',
            backgroundPosition: focusOf(current),
            filter: 'blur(38px) brightness(0.42) saturate(1.5)',
          }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,3,8,0.78) 100%)' }} />

      <p className="relative font-cinzel text-[9px] tracking-[14px] uppercase" style={{ color: '#f3b8cf' }}>
        just breathe
      </p>

      <div className="relative flex items-center justify-center" style={{ width: 'min(86vw, 330px)', height: 'min(86vw, 330px)' }}>
        {/* a slow ring of her other photos, drifting around */}
        <div className="absolute inset-0" style={{ animation: 'orbit-spin 70s linear infinite' }}>
          {ONE_MINUTE_PHOTOS.map((f, i) => {
            const a = (i / ONE_MINUTE_PHOTOS.length) * Math.PI * 2 - Math.PI / 2
            const left = Math.round((50 + Math.cos(a) * 46) * 100) / 100
            const top = Math.round((50 + Math.sin(a) * 46) * 100) / 100
            return (
              <div
                key={f}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: 50,
                  height: 50,
                  marginLeft: -25,
                  marginTop: -25,
                  animation: 'orbit-spin 70s linear infinite reverse',
                  opacity: i === idx ? 1 : 0.55,
                  transition: 'opacity 1.5s',
                  filter: i === idx ? 'drop-shadow(0 0 10px rgba(255,159,192,0.9))' : undefined,
                }}
              >
                <PhotoFrame file={f} width={44} height={44} border={3} round />
              </div>
            )
          })}
        </div>

        {/* progress ring */}
        <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx={100} cy={100} r={84} stroke="rgba(255,182,193,0.14)" strokeWidth={1.5} fill="none" />
          <motion.circle
            cx={100}
            cy={100}
            r={84}
            stroke="#ff9fc0"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray={2 * Math.PI * 84}
            strokeDashoffset={2 * Math.PI * 84 * (1 - progress)}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,159,192,0.7))' }}
          />
        </svg>

        {/* the breathing circle — a different photo of her every few breaths */}
        <motion.div
          className="relative rounded-full overflow-hidden"
          style={{
            width: '56%',
            aspectRatio: '1 / 1',
            border: '3px solid rgba(255,220,232,0.85)',
            boxShadow: '0 0 50px rgba(255,111,165,0.5)',
          }}
          animate={{ scale: phase === 'in' ? 1.12 : 0.92 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        >
          <AnimatePresence>
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
            >
              <ZoomImg file={current} tight />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative flex flex-col items-center" style={{ gap: 10, minHeight: 118 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            className="font-cormorant italic"
            style={{ fontSize: 18, color: '#ffd7e6', letterSpacing: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {phase === 'in' ? 'breathe in...' : 'breathe out...'}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIdx}
            className="font-cormorant italic text-center"
            style={{ fontSize: 'clamp(19px, 4.4vw, 24px)', color: '#ffe3ee', lineHeight: 1.55, maxWidth: 400, minHeight: 74, textShadow: '0 2px 16px rgba(0,0,0,0.7), 0 0 24px rgba(255,111,165,0.4)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.9 }}
          >
            {line}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.button
        className="btn-romantic relative"
        onClick={onComplete}
        animate={{ opacity: ready ? 1 : 0.3 }}
        style={{ pointerEvents: ready ? 'auto' : 'none' }}
      >
        {ready ? 'continue →' : 'stay a little longer'}
      </motion.button>
    </motion.div>
  )
}
