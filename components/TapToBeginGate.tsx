'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { unlockAudio, playPageTurn } from '@/lib/sound'
import { HER_NAME, WALL_PHOTOS } from '@/lib/config'
import { ZoomImg } from '@/components/PhotoFrame'
import { focusOf } from '@/lib/photoFocus'
import HeartPhoto from '@/components/HeartPhoto'

interface Props {
  onBegin: () => void
}

const TILT = [-2.6, 1.9, -1.3, 2.7, -2.1, 1.4, -0.8, 2.2]
const DUR = [74, 92, 66, 84, 70, 98]

/** Columns of polaroids drifting slowly up and down — a living wall of her. */
function PhotoWall() {
  return (
    <div className="absolute inset-0 flex overflow-hidden" style={{ padding: '0 2px' }}>
      {Array.from({ length: 6 }).map((_, k) => {
        const tiles = WALL_PHOTOS.filter((_, i) => i % 6 === k)
        const list = [...tiles, ...tiles]
        return (
          <div key={k} className="wall-col" style={{ flex: 1, minWidth: 0, padding: '0 5px' }}>
            <div style={{ animation: `${k % 2 ? 'wall-down' : 'wall-up'} ${DUR[k]}s linear infinite`, willChange: 'transform' }}>
              {list.map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fffaf7',
                    padding: '5px 5px 15px',
                    marginBottom: 14,
                    borderRadius: 2,
                    boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
                    transform: `rotate(${TILT[(i + k) % 8]}deg)`,
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden' }}>
                    <ZoomImg file={`${f}.jpg`} dir="photos/t" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function TapToBeginGate({ onBegin }: Props) {
  const [leaving, setLeaving] = useState(false)
  const [step, setStep] = useState(0)
  const [floaters, setFloaters] = useState<
    { id: number; left: number; delay: number; dur: number; size: number; glyph: string; sway: number }[]
  >([])

  useEffect(() => {
    // random values are made after mount so server and browser HTML agree
    setFloaters(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: -Math.random() * 14,
        dur: 11 + Math.random() * 9,
        size: 10 + Math.random() * 16,
        glyph: Math.random() > 0.3 ? '♡' : '✦',
        sway: (Math.random() - 0.5) * 80,
      }))
    )
    const timers = [
      setTimeout(() => setStep(1), 1500), // her name
      setTimeout(() => setStep(2), 3000), // "I made a little dream for you..."
      setTimeout(() => setStep(3), 4300), // "happy birthday"
      setTimeout(() => setStep(4), 5300), // "open my heart"
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const orbit = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        return {
          left: Math.round((50 + Math.cos(a) * 49) * 100) / 100,
          top: Math.round((50 + Math.sin(a) * 45) * 100) / 100,
          glyph: i % 3 === 0 ? '✦' : '♡',
          size: i % 3 === 0 ? 11 : 13 + (i % 2) * 4,
          delay: (i * 0.3) % 3,
        }
      }),
    []
  )

  const begin = () => {
    if (leaving || step < 4) return
    unlockAudio()
    playPageTurn()
    // AmbientAudio listens for this event to unlock and begin the soundtrack on this tap.
    window.sessionStorage.setItem('love-story-audio-started', '1')
    window.dispatchEvent(new Event('love-story-begin'))
    try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.([30, 80, 30]) } catch { /* not supported */ }
    setLeaving(true)
    setTimeout(onBegin, 1150)
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{ background: '#12040b', cursor: step >= 4 ? 'pointer' : 'default' }}
      onClick={begin}
    >
      {/* 1 — the living wall of photos */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0.25 : 0.9 }}
        transition={{ duration: leaving ? 1 : 2.4 }}
      >
        <PhotoWall />
      </motion.div>

      {/* 2 — rose light + darkness so the heart and words glow */}
      <div
        className="absolute pointer-events-none"
        style={{ width: '90vmax', height: '90vmax', left: '-25vmax', top: '-30vmax', background: 'radial-gradient(circle, rgba(255,80,140,0.34) 0%, transparent 62%)', animation: 'aurora-drift 18s ease-in-out infinite' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: '80vmax', height: '80vmax', right: '-30vmax', bottom: '-34vmax', background: 'radial-gradient(circle, rgba(255,170,90,0.22) 0%, transparent 62%)', animation: 'aurora-drift 24s ease-in-out infinite reverse' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 72% 58% at 50% 50%, rgba(18,4,12,0.93) 0%, rgba(18,4,12,0.72) 48%, rgba(18,4,12,0.1) 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(18,4,12,0.9) 0%, transparent 20%, transparent 78%, rgba(18,4,12,0.92) 100%)' }}
      />

      {/* 3 — hearts and sparks floating up */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floaters.map(f => (
          <span
            key={f.id}
            className="gate-float absolute"
            style={{
              left: `${f.left}%`,
              bottom: -30,
              fontSize: f.size,
              color: f.glyph === '✦' ? '#ffe3a8' : '#ff8fb8',
              filter: 'drop-shadow(0 0 6px rgba(255,111,165,0.8))',
              animation: `gate-float ${f.dur}s linear ${f.delay}s infinite`,
              ['--sway' as string]: `${f.sway}px`,
            }}
          >
            {f.glyph}
          </span>
        ))}
      </div>

      {/* 4 — the heart, the name, the words */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ gap: 14 }}
        animate={leaving ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 1.1 }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: 320, height: 292 }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={leaving ? { opacity: 0, scale: 11 } : { opacity: 1, scale: 1 }}
          transition={leaving ? { duration: 1.15, ease: 'easeIn' } : { duration: 1.9, delay: 0.5, type: 'spring', damping: 14, stiffness: 60 }}
        >
          {/* orbiting hearts and sparks */}
          <div className="absolute inset-0" style={{ animation: 'orbit-spin 46s linear infinite' }}>
            {orbit.map((o, i) => (
              <span
                key={i}
                className="absolute"
                style={{
                  left: `${o.left}%`,
                  top: `${o.top}%`,
                  fontSize: o.size,
                  lineHeight: 1,
                  marginLeft: -o.size / 2,
                  marginTop: -o.size / 2,
                  color: o.glyph === '✦' ? '#ffe3a8' : '#ffb0cf',
                  filter: 'drop-shadow(0 0 5px rgba(255,111,165,0.9))',
                  animation: `twinkle 3s ease-in-out ${o.delay}s infinite`,
                }}
              >
                {o.glyph}
              </span>
            ))}
          </div>
          <HeartPhoto file="us-watercolor.jpg" width={236} />
        </motion.div>

        <div className="flex flex-col items-center" style={{ gap: 10, minHeight: 190 }}>
          <AnimatePresence>
            {step >= 1 && (
              <motion.p
                className="font-script text-center"
                style={{
                  fontSize: 'clamp(46px, 13vw, 66px)',
                  lineHeight: 1.05,
                  background: 'linear-gradient(95deg, #ffd7e6 0%, #ffffff 45%, #ffb6d0 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 16px rgba(255,111,165,0.75))',
                }}
                initial={{ opacity: 0, y: 14, letterSpacing: '0.2em' }}
                animate={{ opacity: leaving ? 0 : 1, y: 0, letterSpacing: '0.02em' }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
              >
                {HER_NAME}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 2 && (
              <motion.p
                className="font-cormorant italic text-center"
                style={{ fontSize: 'clamp(17px, 4.6vw, 21px)', color: '#ffd7e6', lineHeight: 1.6, textShadow: '0 2px 14px rgba(0,0,0,0.8)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: leaving ? 0 : 1, y: 0 }}
                transition={{ duration: 1.1 }}
              >
                I made you something…
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.p
                className="font-cinzel uppercase text-center"
                style={{ fontSize: 11, letterSpacing: '0.45em', color: '#ffe3a8', textShadow: '0 0 14px rgba(255,200,120,0.6)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: leaving ? 0 : 1, y: 0 }}
                transition={{ duration: 1.1 }}
              >
                
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                className="font-cinzel uppercase"
                style={{
                  marginTop: 10,
                  padding: '13px 30px',
                  fontSize: 10,
                  letterSpacing: '0.42em',
                  color: '#fff',
                  borderRadius: 999,
                  border: '1px solid rgba(255,214,226,0.65)',
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: leaving ? 0 : 1,
                  y: 0,
                  boxShadow: ['0 0 0 rgba(255,111,165,0)', '0 0 28px rgba(255,111,165,0.7)', '0 0 0 rgba(255,111,165,0)'],
                }}
                transition={{ opacity: { duration: 1 }, y: { duration: 1 }, boxShadow: { duration: 2.4, repeat: Infinity } }}
              >
                open it
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 5 — the bloom of light she walks into when she taps */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 46%, #fff9f4 0%, #ffe3ee 55%, #ffd0e0 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 1 : 0 }}
        transition={{ duration: 0.75, delay: leaving ? 0.35 : 0 }}
      />
    </div>
  )
}
