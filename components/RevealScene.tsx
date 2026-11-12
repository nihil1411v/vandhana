'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const MAX_CLICKS = 20

interface Particle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  size: number
  color: string
  delay: number
  isHeart?: boolean
}

export default function RevealScene({ onComplete }: Props) {
  const [clicks, setClicks] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [burst, setBurst] = useState(false)
  const [vibrating, setVibrating] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const doneRef = useRef(false)

  const progress = clicks / MAX_CLICKS
  const heartScale = 1 + progress * 0.6
  const glowIntensity = 20 + progress * 80
  const glowOpacity = 0.4 + progress * 0.55

  const handleClick = useCallback(() => {
    if (showPhoto) { onComplete(); return }
    if (doneRef.current) return

    setVibrating(true)
    setTimeout(() => setVibrating(false), 120)

    setClicks(c => {
      const next = c + 1
      if (next >= MAX_CLICKS && !doneRef.current) {
        doneRef.current = true
        setTimeout(() => triggerBurst(), 0)
      }
      return next
    })
  }, [])

  const triggerBurst = () => {
    const newParticles: Particle[] = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: 50,
      y: 50,
      tx: (Math.random() - 0.5) * 600,
      ty: (Math.random() - 0.5) * 600,
      size: 4 + Math.random() * 14,
      color: `hsl(${330 + Math.random() * 40}, ${60 + Math.random() * 30}%, ${30 + Math.random() * 30}%)`,
      delay: Math.random() * 0.4,
      isHeart: i % 4 === 0,
    }))
    setParticles(newParticles)
    setBurst(true)

    if (navigator.vibrate) navigator.vibrate([30, 20, 50, 20, 80])

    setTimeout(() => {
      setShowPhoto(true)
    }, 800)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') handleClick()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClick, showPhoto])

  return (
    <motion.div
      className="scene scene-clip flex flex-col items-center justify-center select-none relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      onClick={showPhoto ? onComplete : undefined}
    >
      {/* Background: cute couple illustration (image 2) */}
      <AnimatePresence>
        {!showPhoto && (
          <motion.div
            key="bg-reveal"
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/bg-reveal.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Post-burst background: photo collage (image 3) */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div
            key="bg-photo"
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/bg-photo.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>



      {/* Burst particles */}
      <AnimatePresence>
        {particles.map(p =>
          p.isHeart ? (
            <motion.span
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                fontSize: p.size + 6,
                color: p.color,
                left: '50%',
                top: '50%',
                textShadow: `0 0 ${p.size}px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0, rotate: p.tx > 0 ? 45 : -45 }}
              transition={{ duration: 1.6, delay: p.delay, ease: [0.2, 0.8, 0.4, 1] }}
            >
              ♡
            </motion.span>
          ) : (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                left: '50%',
                top: '50%',
                boxShadow: `0 0 ${p.size}px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0 }}
              transition={{ duration: 1.6, delay: p.delay, ease: [0.2, 0.8, 0.4, 1] }}
            />
          )
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-8 z-10 px-6">
        {/* Header */}
        <AnimatePresence>
          {!burst && (
            <motion.div className="text-center" exit={{ opacity: 0, y: -20 }}>
              <p className="font-cinzel text-[10px] tracking-[12px] uppercase" style={{ color: '#e8a8c0' }}>
                keep tapping the heart
              </p>
              <p className="font-cormorant text-lg italic mt-1" style={{ color: '#ffb6c1' }}>
                a secret is waiting inside
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart: watercolor image (image 1) */}
        <motion.div
          className="relative cursor-pointer"
          style={{ scale: heartScale }}
          transition={{ duration: 0.08 }}
          onClick={handleClick}
          animate={
            burst
              ? { scale: 2.5, opacity: 0 }
              : vibrating
                ? { rotate: (Math.random() - 0.5) * 8 }
                : {}
          }
        >
          {/* Glow behind heart */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -24,
              background: `radial-gradient(ellipse, rgba(196,30,58,${glowOpacity * 0.5}) 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Watercolor heart image */}
          <img
            src="/heart.png"
            alt="heart"
            draggable={false}
            style={{
              width: 160,
              height: 160,
              objectFit: 'contain',
              filter: `drop-shadow(0 0 ${glowIntensity}px rgba(196,30,58,${glowOpacity}))`,
              display: 'block',
              transition: 'filter 0.1s ease',
              userSelect: 'none',
            }}
          />
        </motion.div>

        {/* Progress bar */}
        <AnimatePresence>
          {!burst && (
            <motion.div
              className="flex flex-col items-center gap-3 w-full max-w-xs"
              exit={{ opacity: 0 }}
            >
              <div className="w-full h-px overflow-hidden" style={{ background: 'rgba(100,20,40,0.3)' }}>
                <motion.div
                  className="h-full progress-fill"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="font-cinzel text-[9px] tracking-[6px]" style={{ color: '#e8a8c0' }}>
                {clicks} / {MAX_CLICKS}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal message over photo collage */}
        <AnimatePresence>
          {showPhoto && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <motion.p
                className="font-cormorant text-2xl italic text-center px-4 py-3 rounded-xl"
                style={{
                  color: '#fff',
                  textShadow: '0 2px 20px rgba(196,30,58,0.8), 0 0 40px rgba(0,0,0,0.9)',
                  background: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(4px)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
              >
                
              </motion.p>
              <motion.p
                className="font-cinzel text-[9px] tracking-[10px] uppercase"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                initial={{ opacity: 0 }}
              >
                tap to continue
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}