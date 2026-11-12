'use client'

import { LETTER_PHOTO } from '@/lib/config'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LETTER_TEXT } from '@/lib/config'
import Flourish from '@/components/Flourish'
import CornerHearts from '@/components/CornerHearts'
import { playChime } from '@/lib/sound'

interface Props {
  onComplete: () => void
}

export default function LetterScene({ onComplete }: Props) {
  const [broken, setBroken] = useState(false)
  const [opened, setOpened] = useState(false)

  const breakSeal = () => {
    if (broken) return
    setBroken(true)
    setTimeout(() => {
      setOpened(true)
      playChime()
    }, 900)
  }

  return (
    <motion.div
      className="px-6"
      style={{
        width: '100vw',
        height: '100dvh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 10,
        WebkitOverflowScrolling: 'touch',
        background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: '100%', paddingTop: 48, paddingBottom: 48 }}
      >
      <AnimatePresence mode="wait">
        {!opened && (
          <motion.div
            key="envelope"
            className="flex flex-col items-center gap-8 cursor-pointer select-none"
            onClick={breakSeal}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
              a sealed letter
            </p>
      <Flourish />

            {/* Envelope */}
            <div
              className="relative"
              style={{
                width: 'min(78vw, 320px)',
                height: 'min(78vw, 320px)',
                maxWidth: 320,
                maxHeight: 320,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, #1a0a10 0%, #0d0508 100%)',
                  border: '1px solid #3a0a20',
                }}
              />
              {/* Envelope flap */}
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  height: '55%',
                  background: 'linear-gradient(180deg, #24101a 0%, #150810 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderBottom: '1px solid #3a0a20',
                }}
              />

              {/* Wax seal */}
              <motion.div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  width: 64,
                  height: 64,
                  marginLeft: -32,
                  marginTop: -32,
                  background: 'radial-gradient(circle at 35% 30%, #b3122b 0%, #6b0a1a 60%, #4a0712 100%)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                  zIndex: 5,
                }}
                animate={
                  broken
                    ? { scale: [1, 1.15, 0], rotate: 20, opacity: [1, 1, 0] }
                    : { scale: [1, 1.04, 1] }
                }
                transition={
                  broken
                    ? { duration: 0.8, ease: 'easeIn' }
                    : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <span style={{ color: '#2a0508', fontSize: 22 }}>♡</span>
              </motion.div>
            </div>

            <motion.p
              className="font-cormorant italic text-lg tracking-widest"
              style={{ color: '#a8305a' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {broken ? 'opening…' : 'break the seal'}
            </motion.p>
          </motion.div>
        )}

        {opened && (
          <motion.div
            key="letter"
            className="flex flex-col items-center gap-8 max-w-md w-full"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            <div
              className="relative w-full rounded-sm px-6 py-8 sm:px-10 sm:py-10"
              style={{
                background: 'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
                border: '1px solid rgba(196,130,80,0.2)',
                boxShadow: '0 16px 40px rgba(139,58,30,0.16)',
              }}
            >
              <CornerHearts />
              <div className="flex justify-center mb-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <PhotoFrame file={LETTER_PHOTO} width={158} height={188} rotate={-2.5} />
              </div>
              <p
                className="font-cormorant italic font-light whitespace-pre-line"
                style={{ fontSize: 'clamp(14px, 2.8vw, 18px)', color: '#6b2c42', lineHeight: 1.9 }}
              >
                {LETTER_TEXT}
              </p>
            </div>

            <button className="btn-romantic flex-shrink-0" onClick={onComplete}>
              continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  )
}
