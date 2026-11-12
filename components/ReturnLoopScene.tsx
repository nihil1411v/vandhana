'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LETTER_TEXT, REASONS, HER_NAME } from '@/lib/config'
import Flourish from '@/components/Flourish'

interface Props {
  onRestart: () => void
}

type Panel = null | 'letter' | 'reason'

export default function ReturnLoopScene({ onRestart }: Props) {
  const [panel, setPanel] = useState<Panel>(null)
  const randomReason = useMemo(() => REASONS[Math.floor(Math.random() * REASONS.length)], [])

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop />
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        before you go
      </p>
      <Flourish />

      <p
        className="font-cormorant italic font-light text-center max-w-sm"
        style={{ fontSize: 'clamp(17px, 3.5vw, 22px)', color: '#6b2c42', lineHeight: 1.9 }}
      >
        You can leave it here, or you can stay a little longer. Either way, my heart stays with you.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button className="btn-romantic" onClick={() => setPanel('letter')}>
          read the letter again
        </button>
        <button className="btn-romantic" onClick={() => setPanel('reason')}>
          one more reason
        </button>
        <button className="btn-romantic" onClick={onRestart}>
          start from the beginning
        </button>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center px-6"
            style={{ background: 'rgba(20,8,14,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanel(null)}
          >
            <motion.div
              className="max-w-md w-full rounded-sm px-8 py-9 text-center"
              style={{
                background: 'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
                border: '1px solid rgba(196,130,80,0.22)',
                boxShadow: '0 20px 50px rgba(139,58,30,0.2)',
              }}
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {panel === 'letter' ? (
                <p
                  className="font-cormorant italic whitespace-pre-line"
                  style={{ fontSize: 15, color: '#6b2c42', lineHeight: 1.9 }}
                >
                  {LETTER_TEXT}
                </p>
              ) : (
                <p
                  className="font-cormorant italic"
                  style={{ fontSize: 20, color: '#6b2c42', lineHeight: 1.8 }}
                >
                  {randomReason}
                </p>
              )}
              <button className="btn-romantic mt-6" onClick={() => setPanel(null)}>
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-cormorant italic text-xs" style={{ color: '#a8305a' }}>
        {HER_NAME}, this one is yours to keep. So is the heart that made it.
      </p>
    </motion.div>
  )
}
