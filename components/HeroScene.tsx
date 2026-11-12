'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HER_NAME, HERO_HEART_PHOTO } from '@/lib/config'
import HeartPhoto from '@/components/HeartPhoto'

interface Props {
  onComplete: () => void
}

function useTypewriter(text: string, start: boolean, speed = 60) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!start) return
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [start, text, speed])
  return out
}

/** Deterministic (so server and browser always agree) */
const SPARKS = Array.from({ length: 36 }).map((_, i) => {
  const a = (i / 36) * Math.PI * 2 + (i % 3) * 0.17
  const r = 120 + ((i * 53) % 150)
  return {
    dx: Math.round(Math.cos(a) * r),
    dy: Math.round(Math.sin(a) * r * 0.85 - 18),
    size: 9 + ((i * 7) % 13),
    glyph: i % 4 === 0 ? '✦' : i % 5 === 0 ? '♡' : '♥',
    delay: (i % 7) * 0.035,
    rot: (i * 47) % 360,
    hue: i % 3 === 0 ? '#ffe3a8' : i % 2 ? '#ff8fb8' : '#ffb6d0',
  }
})
const STARS = Array.from({ length: 34 }).map((_, i) => ({
  left: (i * 37) % 100,
  top: (i * 61) % 100,
  size: 1 + (i % 3),
  delay: (i % 9) * 0.4,
}))

export default function HeroScene({ onComplete }: Props) {
  const [awake, setAwake] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const typedName = useTypewriter(HER_NAME, textVisible, 62)
  const scrollAccRef = useRef(0)
  const openedRef = useRef(false)

  const wake = () => {
    if (openedRef.current) return
    openedRef.current = true
    try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.([30, 80, 30, 200, 30, 80, 30]) } catch { /* not supported */ }
    setAwake(true)
    setTimeout(() => setTextVisible(true), 950)
    setTimeout(() => setSubVisible(true), 1900)
    setTimeout(() => {
      setLeaving(true)
      setTimeout(onComplete, 1000)
    }, 4700)
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      scrollAccRef.current += Math.abs(e.deltaY)
      if (scrollAccRef.current > 60) wake()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') wake()
    }
    let startY = 0
    const ts = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const te = (e: TouchEvent) => { if (startY - e.changedTouches[0].clientY > 30) wake() }
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKey)
    window.addEventListener('touchstart', ts, { passive: true })
    window.addEventListener('touchend', te, { passive: true })
    const autoTimer = setTimeout(wake, 2600)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('touchstart', ts)
      window.removeEventListener('touchend', te)
      clearTimeout(autoTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const beat = { scale: [1, 1.09, 1, 1.05, 1] }

  return (
    <motion.div
      className="scene bg-black flex items-center justify-center cursor-pointer select-none"
      onClick={wake}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.05 : 1 }}
      transition={{ duration: leaving ? 1 : 0.7, ease: 'easeInOut' }}
      style={{ height: '100dvh' }}
    >
      {/* night sky + rose light that blooms the moment the heart wakes */}
      <div
        className="absolute inset-0"
        style={{
          background: awake
            ? 'radial-gradient(ellipse at 50% 46%, #5a1632 0%, #26091a 45%, #0a0307 85%)'
            : 'radial-gradient(ellipse at 50% 46%, #1b0612 0%, #07020a 70%)',
          transition: 'background 1.1s ease',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: '90vmax', height: '90vmax', left: '-30vmax', top: '-35vmax', background: 'radial-gradient(circle, rgba(255,80,140,0.22) 0%, transparent 62%)', animation: 'aurora-drift 16s ease-in-out infinite' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: '80vmax', height: '80vmax', right: '-30vmax', bottom: '-34vmax', background: 'radial-gradient(circle, rgba(255,170,90,0.14) 0%, transparent 62%)', animation: 'aurora-drift 22s ease-in-out infinite reverse' }}
      />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, background: '#ffd7e6', animation: `twinkle 3.4s ease-in-out ${s.delay}s infinite` }}
        />
      ))}

      {/* the heart stage */}
      <div className="relative flex flex-col items-center z-10" style={{ gap: 18 }}>
        <div className="relative flex items-center justify-center" style={{ width: 320, height: 270 }}>
          {/* shockwave rings */}
          {awake &&
            [0, 0.16, 0.34].map((d, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{ width: 120, height: 120, border: '2px solid rgba(255,140,185,0.7)', boxShadow: '0 0 30px rgba(255,111,165,0.5)' }}
                initial={{ scale: 0.4, opacity: 0.9 }}
                animate={{ scale: 5.2, opacity: 0 }}
                transition={{ duration: 1.5, delay: d, ease: 'easeOut' }}
              />
            ))}

          {/* hearts, petals and sparks bursting outward */}
          {awake &&
            SPARKS.map((p, i) => (
              <motion.span
                key={i}
                className="absolute pointer-events-none"
                style={{ fontSize: p.size, color: p.hue, lineHeight: 1, filter: 'drop-shadow(0 0 7px rgba(255,111,165,0.9))' }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{ x: p.dx, y: p.dy, opacity: [0, 1, 0], scale: [0.3, 1.2, 0.8], rotate: p.rot }}
                transition={{ duration: 1.7, delay: p.delay, ease: 'easeOut', times: [0, 0.25, 1] }}
              >
                {p.glyph}
              </motion.span>
            ))}

          {/* sleeping heart: draws itself, then beats like a pulse */}
          <AnimatePresence>
            {!awake && (
              <motion.div
                key="sleep"
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...beat }}
                exit={{ scale: 1.7, opacity: 0 }}
                transition={{ opacity: { duration: 0.8 }, scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
              >
                <svg width="150" height="140" viewBox="0 0 100 94" style={{ filter: 'drop-shadow(0 0 18px rgba(255,111,165,0.8))' }}>
                  <motion.path
                    d="M50,90 C12,64 2,46 2,29 C2,13 14,3 28,3 C38,3 46,8 50,17 C54,8 62,3 72,3 C86,3 98,13 98,29 C98,46 88,64 50,90 Z"
                    fill="rgba(255,90,150,0.18)"
                    stroke="#ff7fb0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* awake: her face blooms out of the heart */}
          {awake && (
            <>
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 240, height: 240, background: 'radial-gradient(circle, rgba(255,111,165,0.55) 0%, transparent 68%)' }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.35, 1.1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute"
                initial={{ scale: 0.15, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 0.22 }}
              >
                <HeartPhoto file={HERO_HEART_PHOTO} width={206} />
              </motion.div>
            </>
          )}
        </div>

        {/* words */}
        <div className="flex flex-col items-center" style={{ minHeight: 120, gap: 10 }}>
          <AnimatePresence mode="wait">
            {!awake ? (
              <motion.div
                key="prompt"
                className="flex flex-col items-center"
                style={{ gap: 8 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <p className="font-cormorant italic" style={{ fontSize: 'clamp(18px,4.6vw,22px)', color: '#ffd7e6' }}>
                  okay. ready?
                </p>
                <motion.p
                  className="font-cinzel uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.45em', color: 'rgba(255,200,220,0.6)' }}
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  tap the heart
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="name" className="flex flex-col items-center" style={{ gap: 12 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p
                  className="font-script text-center"
                  style={{
                    minHeight: 'clamp(52px, 12vw, 72px)',
                    fontSize: 'clamp(46px, 12vw, 70px)',
                    lineHeight: 1.05,
                    background: 'linear-gradient(95deg, #ffd7e6 0%, #ffffff 45%, #ffb6d0 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    filter: 'drop-shadow(0 0 16px rgba(255,111,165,0.8))',
                  }}
                >
                  {typedName}
                </p>
                <motion.p
                  className="font-cinzel uppercase text-center"
                  style={{ fontSize: 11, letterSpacing: '0.45em', color: '#ffe3a8', textShadow: '0 0 14px rgba(255,200,120,0.6)' }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: subVisible ? 1 : 0, y: subVisible ? 0 : 6 }}
                  transition={{ duration: 0.9 }}
                >
                  this one's for you ♡
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
