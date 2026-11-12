'use client'

import { HER_NAME, SENDER_NAME } from '@/lib/config'



import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { VOICE_MESSAGE_FILE } from '@/lib/config'
import { getDB } from '@/lib/db'
import { notifyBackend } from '@/lib/notify'
import { playChime } from '@/lib/sound'
import Flourish from '@/components/Flourish'

const CLOSING_LINES: Record<'yes' | 'no' | 'default', string> = {
  yes: "Thank you, Vandhana. My heart has never felt so full.",
  no: "Thank you for being honest with me. That means more than you know.",
  default: 'This was all for you, and for your birthday. I hope it made you feel as special as you are to me.',
}

export default function FinalScene() {
  const [special, setSpecial] = useState<'yes' | 'no' | 'default'>('default')
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const db = getDB()
    if (db.questions.special === 'yes' || db.questions.special === 'no') {
      setSpecial(db.questions.special)
    }

    notifyBackend('reached the final scene')

    const t = setTimeout(() => {
      setBurst(true)
      playChime()
    }, 900)
    return () => clearTimeout(t)
  }, [])

  const petals = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 120,
        size: 8 + Math.random() * 10,
        symbol: Math.random() > 0.5 ? '♡' : '❀',
      })),
    []
  )

  const stagger = (i: number) => ({ delay: 0.6 + i * 0.8, duration: 1.8, ease: 'easeOut' as const })

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center gap-10 px-6 overflow-y-auto"
      data-has-fixed-cta
      style={{ background: 'radial-gradient(ellipse at top, #4a1830 0%, #2a1020 45%, #140810 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      {/* Petal / heart burst */}
      {burst && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {petals.map(p => (
            <motion.span
              key={p.id}
              className="absolute"
              style={{ left: `${p.left}%`, top: -20, fontSize: p.size, color: '#c41e3a' }}
              initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
              animate={{
                y: '110vh',
                x: p.drift,
                opacity: [0, 1, 1, 0],
                rotate: 180,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            >
              {p.symbol}
            </motion.span>
          ))}
        </div>
      )}

      {/* Ambient heartbeat rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none border"
          style={{ borderColor: `rgba(139,0,0,${0.15 - i * 0.04})`, inset: 0 }}
          animate={{
            scale: [1, 1.5, 2.5],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
      </div>

      <div className="flex flex-col items-center gap-10 z-10 max-w-md w-full text-center pt-12 pb-32">
        {/* Label */}
        <motion.p
          className="font-cinzel text-[9px] tracking-[14px] uppercase"
          style={{ color: '#e8a8c0' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(0)}
        >
          one more thing
        </motion.p>
        <Flourish />

        {/* Main text */}
        <motion.h1
          className="font-script text-gradient-romantic"
          style={{
            fontSize: 'clamp(46px, 11vw, 92px)',
            lineHeight: 1.15,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(1)}
        >
          Here is my heart.
        </motion.h1>

        {/* Personal message */}
        <motion.div
          className="text-center px-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(3)}
        >
          <p
            className="font-cormorant italic font-light"
            style={{
              fontSize: 'clamp(18px, 3.5vw, 24px)',
              color: '#ffb6c1',
              lineHeight: 2,
            }}
          >
            {CLOSING_LINES[special]}<br />
            Happy birthday, {HER_NAME}.
          </p>
        </motion.div>

        {VOICE_MESSAGE_FILE && (
          <motion.div
            className="w-full flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(3.5)}
          >
            <p className="font-cinzel text-[8px] tracking-[8px] uppercase" style={{ color: '#ffb6c1' }}>
              hear it from me
            </p>
            <audio controls src={`/sounds/${VOICE_MESSAGE_FILE}`} style={{ width: '100%', maxWidth: 320 }} />
          </motion.div>
        )}

        {/* Signature */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(5)}
        >
          <div className="w-8 h-px" style={{ background: '#2a0a18' }} />
          <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#ffb6c1' }}>
            from {SENDER_NAME || 'me'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
