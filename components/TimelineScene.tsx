'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MEMORIES } from '@/lib/config'
import Flourish from '@/components/Flourish'
import PaperCard from '@/components/PaperCard'

interface Props {
  onComplete: () => void
}

export default function TimelineScene({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const isLast = index >= MEMORIES.length - 1

  const next = () => {
    if (isLast) {
      onComplete()
      return
    }
    setIndex(i => i + 1)
  }

  const prev = () => {
    if (index > 0) {
      setIndex(i => i - 1)
    }
  }

  const memory = MEMORIES[index]

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-5"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        the story so far
      </p>
      <Flourish />

      {/* Progress dots, styled like tiny hearts */}
      <div className="flex gap-3">
        {MEMORIES.map((_, i) => (
          <span
            key={i}
            className="transition-all duration-500"
            style={{
              fontSize: i === index ? 13 : 8,
              color: i <= index ? '#c4306b' : 'rgba(196,48,107,0.22)',
              lineHeight: 1,
            }}
          >
            ♡
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <PaperCard motionKey={index}>
          {memory.video ? (
            <div
              style={{
                width: 190,
                overflow: 'hidden',
                background: '#000',
                border: '6px solid #fffaf7',
                boxShadow: '0 10px 24px rgba(139,58,30,0.25)',
                transform: 'rotate(-1.5deg)',
              }}
            >
              <video src={memory.video} autoPlay loop muted playsInline controls style={{ display: 'block', width: '100%', maxHeight: 250 }} />
            </div>
          ) : (
            memory.photo && <PhotoFrame file={memory.photo} width={128} height={148} rotate={-2} />
          )}
          <p className="font-cinzel text-[10px] tracking-[8px] uppercase" style={{ color: '#a8703a' }}>
            {memory.date}
          </p>
          <h2
            className="font-script"
            style={{ fontSize: 'clamp(26px, 5.4vw, 38px)', color: '#6b2c42', lineHeight: 1.22 }}
          >
            {memory.title}
          </h2>
          <p
            className="font-cormorant italic"
            style={{ fontSize: 'clamp(15px, 2.8vw, 18px)', color: '#8b3050', lineHeight: 1.7 }}
          >
            {memory.description}
          </p>
        </PaperCard>
      </AnimatePresence>

      <div className="flex items-center gap-6">
        <button
          className="btn-romantic"
          onClick={prev}
          style={{ opacity: index === 0 ? 0.25 : 1, pointerEvents: index === 0 ? 'none' : 'auto' }}
        >
          ←
        </button>
        <button className="btn-romantic" onClick={next}>
          {isLast ? 'continue →' : '→'}
        </button>
      </div>
    </motion.div>
  )
}
