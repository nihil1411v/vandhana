'use client'

import { CARD_COVER_PHOTO } from '@/lib/config'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BIRTHDAY_CARD_COVER, BIRTHDAY_CARD_TEXT } from '@/lib/config'
import Flourish from '@/components/Flourish'
import CornerHearts from '@/components/CornerHearts'
import { playChime } from '@/lib/sound'

interface Props {
  onComplete: () => void
}

export default function BirthdayCardScene({ onComplete }: Props) {
  const [open, setOpen] = useState(false)

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
          {!open && (
            <motion.div
              key="cover"
              className="flex flex-col items-center gap-8 cursor-pointer select-none"
              onClick={() => {
                setOpen(true)
                playChime()
              }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
                a card for you
              </p>
      <Flourish />

              <motion.div
                className="flex flex-col items-center justify-center gap-4 rounded-sm"
                style={{
                  width: 'min(78vw, 280px)',
                  height: 360,
                  background: 'linear-gradient(160deg, #6b0a1a 0%, #2a0509 100%)',
                  border: '1px solid #3a0a20',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
                animate={{ rotate: [0, -1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div style={{ padding: 6, background: 'linear-gradient(135deg, #f5d9a8, #c89b5a 50%, #f5d9a8)', boxShadow: '0 10px 26px rgba(0,0,0,0.5)' }}>
                  <div style={{ width: 150, height: 184, overflow: 'hidden' }}>
                    <ZoomImg file={CARD_COVER_PHOTO} />
                  </div>
                </div>
                <p
                  className="font-cormorant italic font-light text-center px-4"
                  style={{ fontSize: 24, color: '#ffe8e8' }}
                >
                  {BIRTHDAY_CARD_COVER}
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

          {open && (
            <motion.div
              key="inside"
              className="flex flex-col items-center gap-8 max-w-md w-full"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
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
                <p
                  className="font-cormorant italic font-light whitespace-pre-line"
                  style={{ fontSize: 'clamp(14px, 2.8vw, 18px)', color: '#6b2c42', lineHeight: 1.9 }}
                >
                  {BIRTHDAY_CARD_TEXT}
                </p>
              </div>

              <button className="btn-romantic" onClick={onComplete}>
                continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
