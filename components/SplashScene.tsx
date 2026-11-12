'use client'

import { SPLASH_PHOTO } from '@/lib/config'

import HeartPhoto from '@/components/HeartPhoto'


import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { HER_NAME } from '@/lib/config'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

export default function SplashScene({ onComplete }: Props) {
  const [burst, setBurst] = useState(true)

  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 160,
        size: 8 + Math.random() * 9,
        color: ['#c4306b', '#ffb02e', '#ff6fa5', '#ffe066', '#a8305a'][Math.floor(Math.random() * 5)],
        shape: Math.random() > 0.5 ? '50%' : '2px',
        isHeart: Math.random() < 0.3,
      })),
    []
  )

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-6 cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 1, filter: 'brightness(1.7) saturate(0.55)' }}
      animate={{ opacity: 1, filter: 'brightness(1) saturate(1)' }}
      transition={{ duration: 2.2, ease: 'easeOut' }}
      onClick={onComplete}
    >
      {burst && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {pieces.map(p =>
            p.isHeart ? (
              <motion.span
                key={p.id}
                className="absolute"
                style={{ left: `${p.left}%`, top: -20, fontSize: p.size + 4, color: p.color }}
                initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
                animate={{ y: '110vh', x: p.drift, opacity: [0, 0.8, 0.8, 0], rotate: 200 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                onAnimationComplete={() => setBurst(false)}
              >
                ♡
              </motion.span>
            ) : (
              <motion.span
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.left}%`,
                  top: -20,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: p.shape,
                  opacity: 0.85,
                }}
                initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
                animate={{ y: '110vh', x: p.drift, opacity: [0, 0.8, 0.8, 0], rotate: 360 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                onAnimationComplete={() => setBurst(false)}
              />
            )
          )}
        </div>
      )}

      <motion.div
        className="z-10"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.4, ease: 'easeOut' }}
      >
        <HeartPhoto file={SPLASH_PHOTO} width={164} />
      </motion.div>

      <motion.p
        className="font-cinzel text-[10px] tracking-[10px] uppercase z-10"
        style={{ color: '#a8305a' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        
      </motion.p>
      <Flourish />

      <motion.h1
        className="font-script text-center z-10"
        style={{ fontSize: 'clamp(38px, 11vw, 78px)', lineHeight: 1.15, color: '#c4306b' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 1.1 }}
      >
        Happy Birthday
      </motion.h1>
      <motion.h2
        className="font-cormorant italic font-light text-center z-10"
        style={{ fontSize: 'clamp(24px, 6vw, 42px)', color: '#8b3050', lineHeight: 1.2, marginTop: -6 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {HER_NAME} 💕
      </motion.h2>

      <motion.p
        className="font-cinzel text-[9px] tracking-[8px] uppercase z-10"
        style={{ color: '#a8305a' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ delay: 2, duration: 2.5, repeat: Infinity }}
      >
        tap to begin
      </motion.p>
    </motion.div>
  )
}
