'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REEL_INTRO, REEL_OUTRO, REEL_SLIDES } from '@/lib/config'
import { focusOf } from '@/lib/photoFocus'

const SLIDE_MS = 5600

interface Props {
  onComplete: () => void
}

/**
 * A slow, cinematic photo reel — each frame drifts and zooms gently (Ken Burns)
 * over a blurred glow of itself, with one line of text that fades in under it.
 * Auto-advances; tap to skip ahead; after the last frame, tap to continue.
 */
export default function MemoryReelScene({ onComplete }: Props) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  const last = REEL_SLIDES.length - 1
  const slide = REEL_SLIDES[i]

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => (i >= last ? setDone(true) : setI(i + 1)), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i, done, last])

  const tap = () => {
    if (done) onComplete()
    else if (i < last) setI(i + 1)
    else setDone(true)
  }

  const zoomIn = i % 2 === 0
  const drift = i % 4 < 2 ? -14 : 14

  return (
    <div
      className="scene scene-clip overflow-hidden select-none cursor-pointer"
      style={{ height: '100dvh', background: 'radial-gradient(ellipse at center, #2a0c1a 0%, #08030a 78%)' }}
      onClick={tap}
    >
      <AnimatePresence initial={false}>
        {!done && (
          <motion.div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            {/* the photo's own colours, blurred, glowing behind it */}
            <div
              className="absolute"
              style={{
                inset: '-12%',
                backgroundImage: `url(/photos/${slide.photo})`,
                backgroundSize: 'cover',
                backgroundPosition: focusOf(slide.photo),
                filter: 'blur(34px) brightness(0.55) saturate(1.5)',
              }}
            />

            <div
              className="relative overflow-hidden"
              style={{
                width: 'min(84vw, calc(min(54dvh, 480px) * 0.8))',
                aspectRatio: '4 / 5',
                borderRadius: 4,
                boxShadow:
                  '0 0 0 1px rgba(255,214,226,0.35), 0 30px 80px rgba(0,0,0,0.6), 0 0 90px rgba(255,111,165,0.3)',
              }}
            >
              <motion.img
                src={`/photos/${slide.photo}`}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focusOf(slide.photo) }}
                initial={{ scale: zoomIn ? 1 : 1.15, x: 0 }}
                animate={{ scale: zoomIn ? 1.15 : 1, x: drift }}
                transition={{ duration: (SLIDE_MS + 1400) / 1000, ease: 'linear' }}
              />
              {/* soft rose light across the frame */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(160deg, rgba(255,140,180,0.16) 0%, transparent 45%, rgba(120,20,60,0.28) 100%)' }}
              />
            </div>

            <motion.p
              className="relative font-script text-center"
              style={{
                maxWidth: 340,
                fontSize: 'clamp(24px, 6.4vw, 34px)',
                lineHeight: 1.35,
                color: '#ffe3ee',
                textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 30px rgba(255,111,165,0.45)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.4 }}
            >
              {slide.line}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* header + progress hearts */}
      {!done && (
        <div className="absolute left-0 right-0 flex flex-col items-center gap-3 z-10" style={{ top: 'max(5dvh, 28px)' }}>
          <p className="font-cinzel text-[9px] tracking-[6px] uppercase text-center px-6" style={{ color: '#e8a8c0' }}>
            {REEL_INTRO}
          </p>
          <div className="flex gap-2">
            {REEL_SLIDES.map((_, k) => (
              <span
                key={k}
                style={{
                  fontSize: k === i ? 13 : 9,
                  lineHeight: 1,
                  color: k <= i ? '#ff6fa5' : 'rgba(255,182,193,0.28)',
                  transition: 'all 0.6s',
                }}
              >
                {k <= i ? '♥' : '♡'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* after the last frame */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
          >
            <motion.span
              style={{ fontSize: 54, color: '#ff6fa5', filter: 'drop-shadow(0 0 18px rgba(255,111,165,0.7))' }}
              animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ♥
            </motion.span>
            <p
              className="font-script"
              style={{ fontSize: 'clamp(28px, 7.5vw, 42px)', color: '#ffe3ee', lineHeight: 1.35, maxWidth: 340, textShadow: '0 0 30px rgba(255,111,165,0.5)' }}
            >
              {REEL_OUTRO}
            </p>
            <motion.p
              className="font-cinzel text-[9px] tracking-[10px] uppercase"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              tap to continue
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
