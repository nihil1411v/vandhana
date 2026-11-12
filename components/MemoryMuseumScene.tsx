'use client'

import { MUSEUM_PHOTO } from '@/lib/config'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MUSEUM_PHOTO_CAPTION, MUSEUM_TABLE_NOTE, MUSEUM_FINAL_LINES, MEMORIES, PHOTO_STACK } from '@/lib/config'
import Flourish from '@/components/Flourish'
import PaperCard from '@/components/PaperCard'

interface Props {
  onComplete: () => void
}

type ExhibitId = 'photo' | 'table' | 'frame'
const ORDER: ExhibitId[] = ['photo', 'table', 'frame']

export default function MemoryMuseumScene({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [frameLine, setFrameLine] = useState(0)
  const [uncovered, setUncovered] = useState(false)
  const exhibit = ORDER[step]
  const isLast = step >= ORDER.length - 1

  const next = () => {
    if (exhibit === 'frame') {
      if (!uncovered) {
        setUncovered(true)
        return
      }
      if (frameLine < MUSEUM_FINAL_LINES.length - 1) {
        setFrameLine(l => l + 1)
        return
      }
      onComplete()
      return
    }
    setStep(s => s + 1)
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        a small gallery of you
      </p>
      <Flourish />

      <div className="flex gap-3">
        {ORDER.map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: i === step ? 13 : 8,
              color: i <= step ? '#c4306b' : 'rgba(196,48,107,0.22)',
            }}
          >
            ♡
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {exhibit === 'photo' && (
          <PaperCard motionKey="photo" maxWidth={380}>
            <p className="font-cinzel text-[9px] tracking-[6px] uppercase" style={{ color: '#a8703a' }}>
              exhibit i
            </p>
            <div
              className="w-48 h-60 rounded-[2px] flex items-center justify-center overflow-hidden mt-2"
              style={{ background: 'linear-gradient(160deg, #3a2416 0%, #1a0f0a 100%)', border: '6px solid #fffaf7', boxShadow: '0 12px 28px rgba(139,58,30,0.28)', transform: 'rotate(-1.5deg)' }}
            >
              {PHOTO_STACK[0]?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <ZoomImg file={MUSEUM_PHOTO} />
              ) : (
                <span style={{ fontSize: 26, color: '#d4956b' }}>♡</span>
              )}
            </div>
            <p className="font-script mt-2" style={{ fontSize: 22, color: '#c4306b' }}>
              {MUSEUM_PHOTO_CAPTION}
            </p>
          </PaperCard>
        )}

        {exhibit === 'table' && (
          <PaperCard motionKey="table" maxWidth={420}>
            <p className="font-cinzel text-[9px] tracking-[6px] uppercase" style={{ color: '#a8703a' }}>
              exhibit ii — a small table of moments
            </p>
            <div className="flex flex-col gap-3 w-full mt-2">
              {MEMORIES.map((m, i) => (
                <div key={i} className="flex items-baseline gap-3 justify-center">
                  <span className="font-cinzel" style={{ fontSize: 9, letterSpacing: 2, color: '#c4306b', minWidth: 70, textAlign: 'right' }}>
                    {m.date.toUpperCase()}
                  </span>
                  <span className="font-cormorant italic" style={{ fontSize: 15, color: '#6b2c42' }}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-cormorant italic mt-3" style={{ fontSize: 14, color: '#8b3050' }}>
              {MUSEUM_TABLE_NOTE}
            </p>
          </PaperCard>
        )}

        {exhibit === 'frame' && (
          <PaperCard motionKey="frame" maxWidth={380}>
            <p className="font-cinzel text-[9px] tracking-[6px] uppercase" style={{ color: '#a8703a' }}>
              exhibit iii — the covered frame
            </p>
            <div
              className="relative w-full flex items-center justify-center mt-2"
              style={{ minHeight: 110 }}
            >
              {!uncovered ? (
                <motion.div
                  className="rounded-sm flex items-center justify-center cursor-pointer"
                  style={{ width: '100%', height: 100, background: 'linear-gradient(160deg,#c9a8ff 0%,#a870d8 100%)' }}
                  onClick={next}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="font-cinzel text-[9px] tracking-[6px] uppercase" style={{ color: '#fff8f0' }}>
                    tap to uncover
                  </span>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={frameLine}
                    className="font-cormorant italic text-center"
                    style={{ fontSize: 19, color: '#6b2c42', lineHeight: 1.7 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.7 }}
                  >
                    {MUSEUM_FINAL_LINES[frameLine]}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </PaperCard>
        )}
      </AnimatePresence>

      <button className="btn-romantic" onClick={next}>
        {exhibit === 'frame' && uncovered && frameLine >= MUSEUM_FINAL_LINES.length - 1
          ? 'continue →'
          : exhibit === 'frame' && !uncovered
          ? 'uncover it'
          : 'next exhibit →'}
      </button>
    </motion.div>
  )
}
