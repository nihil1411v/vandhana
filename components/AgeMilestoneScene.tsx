'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AGE_MILESTONES } from '@/lib/config'
import Flourish from '@/components/Flourish'
import PaperCard from '@/components/PaperCard'

interface Props {
  onComplete: () => void
}

export default function AgeMilestoneScene({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const isLast = index >= AGE_MILESTONES.length - 1

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

  const milestone = AGE_MILESTONES[index]

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        how you make me feel
      </p>
      <Flourish />

      <div className="flex gap-3">
        {AGE_MILESTONES.map((_, i) => (
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
        <PaperCard motionKey={index} maxWidth={400}>
          {milestone.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <PhotoFrame file={milestone.photo} width={150} height={180} rotate={-2} />
          )}
          <p className="font-cinzel text-[10px] tracking-[8px] uppercase" style={{ color: '#a8703a' }}>
            {milestone.age}
          </p>
          <p
            className="font-cormorant italic font-light"
            style={{ fontSize: 'clamp(19px, 4vw, 26px)', color: '#6b2c42', lineHeight: 1.7 }}
          >
            {milestone.text}
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
