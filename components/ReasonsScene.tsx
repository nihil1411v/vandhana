'use client'


import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { REASONS, REASON_PHOTOS } from '@/lib/config'
import HeartPhoto from '@/components/HeartPhoto'
import PhotoBackdrop from '@/components/PhotoBackdrop'
import { addReasonViewed } from '@/lib/db'
import Flourish from '@/components/Flourish'
import PaperCard from '@/components/PaperCard'
import PaperHearts from '@/components/PaperHearts'

interface Props {
  onComplete: () => void
}

export default function ReasonsScene({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const isLast = index >= REASONS.length - 1

  useEffect(() => {
    addReasonViewed(index)
  }, [index])

  const next = () => {
    if (isLast) {
      onComplete()
      return
    }
    setIndex(i => i + 1)
  }

  const prev = () => {
    if (index > 0) setIndex(i => i - 1)
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop strength={0.32} />
      <PaperHearts />
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        {REASONS.length} things I love about you
      </p>
      <Flourish />

      <p className="font-cormorant italic" style={{ fontSize: 13, color: '#a8305a' }}>
        reason {index + 1} of {REASONS.length}
      </p>

      <AnimatePresence mode="wait">
        <PaperCard motionKey={index} maxWidth={520}>
          <HeartPhoto file={REASON_PHOTOS[index % REASON_PHOTOS.length]} width={150} />
          <span style={{ fontSize: 22, color: '#d4956b' }}>❝</span>
          <p
            className="font-cormorant italic font-light"
            style={{ fontSize: 'clamp(20px, 4.2vw, 28px)', color: '#6b2c42', lineHeight: 1.7 }}
          >
            {REASONS[index]}
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
          {isLast ? 'continue →' : 'another reason →'}
        </button>
      </div>
    </motion.div>
  )
}
