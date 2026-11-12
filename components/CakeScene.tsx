'use client'

import PhotoFrame from '@/components/PhotoFrame'
import { CAKE_BUNTING, CAKE_CUT_PHOTO } from '@/lib/config'

import { useMemo, useState } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { HER_AGE, CAKE_SLICE_MESSAGE } from '@/lib/config'
import { markCakeBlown } from '@/lib/db'
import { playBlowWhoosh, playChime } from '@/lib/sound'
import { useBlowDetection } from '@/lib/useBlowDetection'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

type Stage = 'lit' | 'blown' | 'cutting' | 'cut'

const KNIFE_TRAVEL = 78
const CUT_THRESHOLD = 56

/** A party garland of her photos strung across the top of the scene. */
function Bunting({ photos }: { photos: string[] }) {
  const flagT = [0.06, 0.14, 0.22, 0.38, 0.46, 0.54, 0.62, 0.78, 0.86, 0.94]
  const photoT = photos.length === 1 ? [0.5] : [0.3, 0.7]
  const yAt = (t: number) => 8 * ((1 - t) ** 2 + t ** 2) + 104 * t * (1 - t)
  return (
    <motion.div
      className="relative"
      style={{ width: 'min(88vw, 340px)', height: 112 }}
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <svg viewBox="0 0 340 112" width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
        <path d="M0,8 Q170,52 340,8" fill="none" stroke="#c98aa0" strokeWidth="1.4" />
        {flagT.map((t, i) => {
          const x = 340 * t
          const y = yAt(t)
          return <polygon key={i} points={`${x - 9},${y} ${x + 9},${y} ${x},${y + 19}`} fill={i % 3 === 0 ? '#f7a8c4' : i % 3 === 1 ? '#ffd7a8' : '#ffc2d6'} opacity={0.95} />
        })}
      </svg>
      {photos.map((f, i) => (
        <motion.div
          key={f}
          className="absolute"
          style={{ left: `${photoT[i] * 100}%`, top: yAt(photoT[i]) - 4, marginLeft: -35, transformOrigin: '50% 0%' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: [i % 2 ? 5 : -5, i % 2 ? 2 : -2, i % 2 ? 5 : -5] }}
          transition={{ duration: 4.5 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute left-1/2 -top-1 -translate-x-1/2 rounded-sm" style={{ width: 9, height: 14, background: '#d4956b', zIndex: 2 }} />
          <PhotoFrame file={f} width={62} height={78} border={4} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function CakeScene({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('lit')
  const [knifeY, setKnifeY] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [heartsBurst, setHeartsBurst] = useState(false)

  const blowOut = () => {
    if (stage !== 'lit') return
    setStage('blown')
    markCakeBlown()
    playBlowWhoosh()
    window.dispatchEvent(new Event('love-story-music-cue'))
  }

  const { listening, permissionDenied, manualTrigger } = useBlowDetection(blowOut, stage === 'lit')

  const candleCount = Math.max(1, Math.min(HER_AGE, 20))
  const candles = useMemo(
    () =>
      Array.from({ length: candleCount }).map((_, i) => ({
        left: 10 + i * (80 / Math.max(1, candleCount - 1)),
      })),
    [candleCount]
  )

  const risingHearts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: 20 + Math.random() * 60,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1,
        size: 10 + Math.random() * 8,
      })),
    []
  )

  const handleDrag = (_: any, info: PanInfo) => {
    setKnifeY(Math.max(0, Math.min(KNIFE_TRAVEL, info.offset.y)))
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const y = Math.max(0, Math.min(KNIFE_TRAVEL, info.offset.y))
    if (y >= CUT_THRESHOLD) {
      setStage('cutting')
      setTimeout(() => {
        setStage('cut')
        playChime()
        setTimeout(() => setHeartsBurst(true), 250)
      }, 550)
    } else {
      setKnifeY(0)
      setResetKey(k => k + 1)
    }
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-4"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        {stage === 'cut' ? 'sweet as ever' : stage === 'lit' ? 'make a wish' : `${HER_AGE} candles`}
      </p>
      <Flourish />

      {stage !== 'cut' && <Bunting photos={CAKE_BUNTING} />}

      {stage !== 'cut' && (
        <div className="relative flex flex-col items-center" style={{ width: 220 }}>
          {/* Warm ambient glow while the candles are lit */}
          {stage === 'lit' && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: -20,
                width: 200,
                height: 140,
                background: 'radial-gradient(ellipse, rgba(255,176,46,0.25) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Candles */}
          <div className="relative w-full" style={{ height: 60 }}>
            {candles.map((c, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${c.left}%`, bottom: 0, transform: 'translateX(-50%)' }}
              >
                <div style={{ height: 16, display: 'flex', alignItems: 'flex-end' }}>
                  {stage === 'lit' ? (
                    <motion.div
                      style={{
                        width: 6,
                        height: 10,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 50% 70%, #fff3b0 0%, #ffb02e 50%, #d9480f 90%)',
                        filter: 'drop-shadow(0 0 6px rgba(255,150,50,0.8))',
                      }}
                      animate={{ scaleY: [1, 1.15, 0.9, 1], rotate: [0, 4, -4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
                    />
                  ) : (
                    <span style={{ fontSize: 8, color: '#888' }}>~</span>
                  )}
                </div>
                <div style={{ width: 3, height: 24, background: `hsl(${(i * 47) % 360}, 55%, 70%)` }} />
              </div>
            ))}
          </div>

          {/* Cake body + knife-cutting interaction */}
          <div className="relative" style={{ width: '100%' }}>
            {(stage === 'blown' || stage === 'cutting') && (
              <>
                {/* Dashed cut guide */}
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: -70,
                    bottom: 0,
                    width: 0,
                    borderLeft: '2px dashed rgba(196,48,107,0.35)',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                  }}
                />
                {/* Draggable knife */}
                <motion.div
                  key={resetKey}
                  drag={stage === 'blown' ? 'y' : false}
                  dragConstraints={{ top: 0, bottom: KNIFE_TRAVEL }}
                  dragElastic={0.15}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    left: '50%',
                    top: -70,
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    touchAction: 'none',
                  }}
                  animate={stage === 'cutting' ? { y: KNIFE_TRAVEL + 10 } : { y: knifeY }}
                  transition={stage === 'cutting' ? { duration: 0.5, ease: 'easeIn' } : { duration: 0 }}
                >
                  <span style={{ fontSize: 34, display: 'block', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>
                    🔪
                  </span>
                </motion.div>
              </>
            )}

            <div
              style={{
                width: '100%',
                height: 60,
                background: 'linear-gradient(180deg, #fdf3e0 0%, #f0d9b5 100%)',
                borderRadius: '6px 6px 0 0',
                boxShadow: 'inset 0 -8px 12px rgba(139,10,26,0.15)',
              }}
            />
            <div
              style={{
                width: '108%',
                marginLeft: '-4%',
                height: 46,
                background: 'linear-gradient(180deg, #8b0010 0%, #5a0712 100%)',
                borderRadius: '4px',
                marginTop: -2,
              }}
            />
          </div>
        </div>
      )}

      {stage === 'cut' && (
        <div className="relative flex flex-col items-center gap-6">
          {/* Rising hearts from the cake */}
          {heartsBurst && (
            <div className="absolute inset-0 pointer-events-none" style={{ top: -20 }}>
              {risingHearts.map((h, i) => (
                <motion.span
                  key={i}
                  className="absolute"
                  style={{ left: `${h.left}%`, bottom: 0, fontSize: h.size, color: '#c4306b' }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -90 - Math.random() * 40, opacity: [0, 0.9, 0] }}
                  transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut' }}
                >
                  ♡
                </motion.span>
              ))}
            </div>
          )}

          <motion.div
            className="flex items-end gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ fontSize: 50 }}>🎂</span>
            <motion.span
              style={{ fontSize: 44 }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              🍰
            </motion.span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 3 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <PhotoFrame file={CAKE_CUT_PHOTO} width={128} height={158} />
          </motion.div>

          {/* The hidden note, revealed underneath the slice */}
          <motion.div
            className="rounded-sm px-6 py-5 max-w-xs text-center"
            style={{
              background: 'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
              border: '1px solid rgba(196,130,80,0.22)',
              boxShadow: '0 10px 30px rgba(139,58,30,0.16)',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-cinzel text-[8px] tracking-[6px] uppercase mb-2" style={{ color: '#a8703a' }}>
              found underneath
            </p>
            <p className="font-cormorant italic" style={{ fontSize: 17, color: '#6b2c42', lineHeight: 1.7 }}>
              {CAKE_SLICE_MESSAGE}
            </p>
          </motion.div>
        </div>
      )}

      {stage !== 'cut' && (
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            className="font-cormorant italic text-center max-w-sm"
            style={{ fontSize: 'clamp(16px, 3.2vw, 20px)', color: '#a8305a', lineHeight: 1.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {stage === 'lit' &&
              (permissionDenied
                ? 'Close your eyes, make a wish, then tap the cake ✨'
                : listening
                ? 'Close your eyes, make a wish... then blow softly ✨'
                : 'Getting ready…')}
            {stage === 'blown' && 'Go on... cut the first piece 🍰'}
            {stage === 'cutting' && 'Mm, careful now…'}
          </motion.p>
        </AnimatePresence>
      )}

      {stage === 'lit' && (
        <button className="btn-romantic" onClick={manualTrigger}>
          {permissionDenied ? 'tap to blow out' : 'or tap here'}
        </button>
      )}

      {stage === 'cut' && (
        <button className="btn-romantic" onClick={onComplete}>
          continue
        </button>
      )}
    </motion.div>
  )
}
