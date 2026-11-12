'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OBSERVATIONS, OBSERVATIONS_COVER_TITLE, OBSERVATIONS_COVER_SUBTITLE, OBSERVATIONS_CLOSING_LINES } from '@/lib/config'
import { playPageTurn } from '@/lib/sound'
import Flourish from '@/components/Flourish'
import CornerHearts from '@/components/CornerHearts'
import RomanticPaper from '@/components/RomanticPaper'
import ScrapbookTape from '@/components/ScrapbookTape'
import FlowerDoodle from '@/components/FlowerDoodle'

interface Props {
  onComplete: () => void
}

type Stage = 'cover' | 'notes' | 'closing'

export default function ObservationsScene({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('cover')
  const [index, setIndex] = useState(0)
  const [unfolded, setUnfolded] = useState(false)
  const isLast = index >= OBSERVATIONS.length - 1
  const current = OBSERVATIONS[index]

  const openCover = () => {
    playPageTurn()
    setStage('notes')
  }

  const unfold = () => {
    if (unfolded) return
    setUnfolded(true)
    playPageTurn()
  }

  const next = () => {
    if (!unfolded) {
      unfold()
      return
    }
    if (isLast) {
      setStage('closing')
      return
    }
    setIndex(i => i + 1)
    setUnfolded(false)
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <AnimatePresence mode="wait">
        {stage === 'cover' && (
          <motion.div
            key="cover"
            className="flex flex-col items-center gap-8 cursor-pointer select-none"
            onClick={openCover}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
              a small notebook
            </p>
            <Flourish />
            <motion.div
              className="relative flex flex-col items-center justify-center gap-4 rounded-sm px-8 py-16"
              style={{
                width: 'min(78vw, 300px)',
                background: 'linear-gradient(160deg, #d4956b 0%, #b5744a 100%)',
                border: '1px solid rgba(139,58,30,0.3)',
                boxShadow: '0 20px 50px rgba(139,58,30,0.25)',
              }}
              animate={{ rotate: [0, -1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FlowerDoodle size={22} style={{ position: 'absolute', top: 14, right: 16, opacity: 0.6 }} />
              <p
                className="font-cormorant italic font-light text-center"
                style={{ fontSize: 21, color: '#fff8f0', lineHeight: 1.5 }}
              >
                {OBSERVATIONS_COVER_TITLE}
              </p>
              <p className="font-cormorant italic text-center" style={{ fontSize: 13, color: '#fde8d8' }}>
                {OBSERVATIONS_COVER_SUBTITLE}
              </p>
            </motion.div>
            <motion.p
              className="font-cinzel text-[9px] tracking-[8px] uppercase"
              style={{ color: '#a8305a' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              tap to open
            </motion.p>
          </motion.div>
        )}

        {stage === 'notes' && (
          <motion.div
            key="notes"
            className="flex flex-col items-center gap-8 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-cinzel text-[9px] tracking-[8px] uppercase" style={{ color: '#8b3050' }}>
              note {index + 1} of {OBSERVATIONS.length}
            </p>

            <motion.div
              className="cursor-pointer w-full max-w-md flex justify-center"
              onClick={unfold}
              animate={{ rotate: unfolded ? 0 : (index % 2 === 0 ? -1.5 : 1.5) }}
            >
              <RomanticPaper
                maxWidth={420}
                className="px-8"
                rotate={0}
              >
                <ScrapbookTape rotate={index % 2 === 0 ? -5 : 4} />
                <motion.div
                  animate={{ height: unfolded ? 'auto' : 64, paddingTop: unfolded ? 40 : 0, paddingBottom: unfolded ? 40 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {!unfolded && (
                    <div className="flex items-center justify-center h-16">
                      <span className="font-cormorant italic" style={{ fontSize: 14, color: '#a8703a' }}>
                        tap to unfold
                      </span>
                    </div>
                  )}
                  <AnimatePresence>
                    {unfolded && (
                      <motion.div
                        className="flex flex-col items-center gap-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <CornerHearts />
                        {current.photo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <PhotoFrame file={current.photo} width={150} height={180} rotate={2} />
                        )}
                        <p className="font-cormorant italic" style={{ fontSize: 18, color: '#6b2c42', lineHeight: 1.8 }}>
                          {current.text}
                        </p>
                        {current.annotation && (
                          <p className="font-script" style={{ fontSize: 20, color: '#c4306b' }}>
                            {current.annotation}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </RomanticPaper>
            </motion.div>

            {unfolded && (
              <motion.button
                className="btn-romantic"
                onClick={next}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {isLast ? 'that\u2019s all of them' : 'next'}
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === 'closing' && (
          <motion.div
            key="closing"
            className="flex flex-col items-center gap-5 max-w-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {OBSERVATIONS_CLOSING_LINES.map((line, i) => (
              <motion.p
                key={i}
                className="font-cormorant italic"
                style={{ fontSize: i === OBSERVATIONS_CLOSING_LINES.length - 1 ? 24 : 18, color: '#6b2c42', lineHeight: 1.8 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.9, duration: 0.8 }}
              >
                {line}
              </motion.p>
            ))}
            <motion.button
              className="btn-romantic mt-4"
              onClick={onComplete}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: OBSERVATIONS_CLOSING_LINES.length * 0.9 + 0.5, duration: 0.8 }}
            >
              continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
