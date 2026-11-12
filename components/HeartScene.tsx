'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const NAME = 'vandhana'

const STEPS = [
  { text: 'Do you want to know what\'s inside my heart?' },
  { text: `it's you.` },
  { text: 'Do you really want to know what\'s inside my heart?' },
  { text: `only you, ${NAME}. only ever you.` },
  { text: 'still want to know?' },
  { text: `ask me a thousand times, ${NAME}, and the answer will always be you.` },
]

export default function HeartScene({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [beating, setBeating] = useState(false)  // ← added
  const [displayText, setDisplayText] = useState(STEPS[0].text)
  const [textKey, setTextKey] = useState(0)
  const stepRef = useRef(step)

  const handleClick = () => {
    if (stepRef.current >= STEPS.length - 1) {
      onComplete()
      return
    }

    // ← added beat trigger
    setBeating(true)
    setTimeout(() => setBeating(false), 1000)

    const next = stepRef.current + 1
    stepRef.current = next
    setStep(next)
    setTimeout(() => {
      setDisplayText(STEPS[next].text)
      setTextKey(k => k + 1)
    }, 300)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleClick()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center select-none"
      style={{
        backgroundImage: 'url(/heart-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff5f7',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Soft overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,240,245,0.15)' }}
      />

      {/* Ambient particles */}
      <FloatingParticles />

      <div className="flex flex-col items-center z-10 px-6 max-w-lg w-full" style={{ gap: '8px' }}>
        {/* Heart image — click only here */}
        <motion.div
          className="heart-container relative flex items-center justify-center cursor-pointer"
          onClick={handleClick}
          // ← swapped to beating-aware animation
          animate={beating
            ? { scale: [1, 1.12, 1, 1.08, 1] }
            : { scale: [1, 1.025, 1] }
          }
          transition={beating
            ? { duration: 0.8, ease: 'easeInOut' }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={beating ? {} : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <img
            src="/heart-img.png"
            alt="heart"
            style={{
              width: 220 + step * 10,
              height: 'auto',
              filter: `drop-shadow(0 0 ${20 + step * 8}px rgba(220,60,120,${0.45 + step * 0.08}))`,
              transition: 'filter 1s ease, width 0.5s ease',
              display: 'block',
            }}
          />

          {/* ← added radial flash overlay on beat */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: beating ? [0, 0.6, 0] : 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'radial-gradient(ellipse, rgba(220,80,120,0.3) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={textKey}
            style={{
              fontFamily: "'Inspiration', cursive",
              color: '#8b2350',
              fontSize: 'clamp(32px, 6.5vw, 52px)',
              maxWidth: 460,
              textAlign: 'center',
              lineHeight: 1.6,
              letterSpacing: '0.03em',
              textShadow: '0 1px 14px rgba(255, 159, 192, 0.9)',
              margin: 0,
              padding: 0,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
          >
            {displayText}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => {
        const isHeart = i % 3 === 0
        return isHeart ? (
          <motion.span
            key={i}
            className="absolute"
            style={{
              fontSize: 10 + (i % 3) * 3,
              color: `rgba(${215 + i * 3},${90 + i * 6},${140},0.55)`,
              left: `${8 + i * 9}%`,
              bottom: `${12 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -90 - i * 18, -170 - i * 18],
              opacity: [0, 0.7, 0],
              x: [(i % 2 === 0 ? 10 : -10), 0],
              rotate: [0, i % 2 === 0 ? 15 : -15],
            }}
            transition={{
              duration: 4.5 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          >
            ♡
          </motion.span>
        ) : (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background: `rgba(${200 + i * 5},${80 + i * 8},${120},0.5)`,
              left: `${10 + i * 9}%`,
              bottom: `${15 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -80 - i * 20, -160 - i * 20],
              opacity: [0, 0.6, 0],
              x: [(i % 2 === 0 ? 10 : -10), 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}