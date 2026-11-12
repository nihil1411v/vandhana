'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ONE_THING_INTRO_LINES, ONE_THING_MESSAGES, ONE_THING_CLOSING, ONE_THING_PHOTOS } from '@/lib/config'
import PhotoFrame from '@/components/PhotoFrame'

interface Props {
  onComplete: () => void
}

type Stage = 'intro' | 'wishes' | 'closing'

export default function OneThingScene({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('intro')
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (stage !== 'intro') return
    if (lineIndex >= ONE_THING_INTRO_LINES.length - 1) {
      const t = setTimeout(() => setStage('wishes'), 2200)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex(i => i + 1), 2200)
    return () => clearTimeout(t)
  }, [stage, lineIndex])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* A single sheet of paper everything is written on */}
      <motion.div
        className="relative w-full rounded-sm px-8 py-9 sm:px-12 sm:py-10 flex flex-col items-center gap-5"
        style={{
          maxWidth: 460,
          minHeight: 260,
          background: 'linear-gradient(160deg, #fffdfb 0%, #fff2f5 100%)',
          border: '1px solid rgba(196,48,107,0.16)',
          boxShadow: '0 20px 50px rgba(139,48,88,0.15)',
        }}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* tiny pressed flower accent */}
        <span
          className="absolute"
          style={{ top: 14, right: 18, fontSize: 16, color: '#d4956b', opacity: 0.6 }}
        >
          ❀
        </span>

        {/* a photo taped to the page — a different one for each part */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: -10, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: stage === 'wishes' ? 2.5 : -2.5 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.9 }}
          >
            <PhotoFrame
              file={ONE_THING_PHOTOS[stage === 'intro' ? 0 : stage === 'wishes' ? 1 : 2]}
              width={132}
              height={162}
              border={5}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.p
              key={lineIndex}
              className="font-cormorant italic font-light text-center"
              style={{ fontSize: 'clamp(19px, 4.4vw, 27px)', color: '#6b2c42', lineHeight: 1.7 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1 }}
            >
              {ONE_THING_INTRO_LINES[lineIndex]}
            </motion.p>
          )}

          {stage === 'wishes' && (
            <motion.div
              key="wishes"
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {ONE_THING_MESSAGES.map((wish, i) => (
                <motion.p
                  key={i}
                  className="font-cormorant italic text-center"
                  style={{ fontSize: 'clamp(15px, 3.2vw, 18px)', color: '#8b3050', lineHeight: 1.8 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.7, duration: 0.9 }}
                >
                  {wish}
                </motion.p>
              ))}
              <motion.button
                className="btn-romantic mt-3"
                onClick={() => setStage('closing')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ONE_THING_MESSAGES.length * 0.7 + 0.8, duration: 0.8 }}
              >
                keep going
              </motion.button>
            </motion.div>
          )}

          {stage === 'closing' && (
            <motion.div
              key="closing"
              className="flex flex-col items-center gap-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <p
                className="font-script text-center"
                style={{ fontSize: 'clamp(26px, 6.5vw, 38px)', color: '#c4306b' }}
              >
                {ONE_THING_CLOSING}
              </p>
              <button className="btn-romantic" onClick={onComplete}>
                continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
