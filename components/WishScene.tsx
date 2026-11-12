'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { markWishMade } from '@/lib/db'
import { playBlowWhoosh } from '@/lib/sound'
import { useBlowDetection } from '@/lib/useBlowDetection'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

export default function WishScene({ onComplete }: Props) {
  const [extinguished, setExtinguished] = useState(false)

  const extinguish = () => {
    if (extinguished) return
    setExtinguished(true)
    markWishMade()
    playBlowWhoosh()
  }

  const { listening, permissionDenied, manualTrigger } = useBlowDetection(extinguish, !extinguished)

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-10"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        make a wish
      </p>
      <Flourish />

      <Candle lit={!extinguished} />

      <p
        className="font-cormorant italic text-center max-w-sm"
        style={{ fontSize: 'clamp(16px, 3.2vw, 20px)', color: '#a8305a', lineHeight: 1.8 }}
      >
        {extinguished
          ? 'Whatever you wished for, I hope it comes true.'
          : permissionDenied
          ? 'Tap the candle to blow it out.'
          : listening
          ? 'Blow into the mic, or tap the candle.'
          : 'Getting ready…'}
      </p>

      {!extinguished && (
        <button className="btn-romantic" onClick={manualTrigger}>
          {permissionDenied ? 'tap to blow out' : 'or tap here'}
        </button>
      )}

      {extinguished && (
        <button className="btn-romantic" onClick={onComplete}>
          continue
        </button>
      )}
    </motion.div>
  )
}

function Candle({ lit }: { lit: boolean }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: 80 }}>
      {/* Flame */}
      <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {lit ? (
          <motion.div
            style={{
              width: 16,
              height: 30,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: 'radial-gradient(circle at 50% 70%, #fff3b0 0%, #ffb02e 40%, #d9480f 80%)',
              filter: 'drop-shadow(0 0 12px rgba(255,150,50,0.7))',
              transformOrigin: 'bottom center',
            }}
            animate={{
              scaleY: [1, 1.08, 0.95, 1.05, 1],
              scaleX: [1, 0.95, 1.05, 0.97, 1],
              rotate: [0, 2, -2, 1, 0],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.4, 0] }}
            transition={{ duration: 1.5 }}
            style={{ fontSize: 12, color: '#888' }}
          >
            ~
          </motion.div>
        )}
      </div>

      {/* Wick */}
      <div style={{ width: 2, height: 8, background: '#2a1a10' }} />

      {/* Candle body */}
      <div
        style={{
          width: 30,
          height: 90,
          background: 'linear-gradient(180deg, #fdf3e0 0%, #e8d9bd 100%)',
          borderRadius: '2px 2px 4px 4px',
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.15)',
        }}
      />

      {/* Holder */}
      <div style={{ width: 60, height: 10, background: '#3a0a20', borderRadius: 2, marginTop: -2 }} />
    </div>
  )
}
