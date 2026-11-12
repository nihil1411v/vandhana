'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { YOUR_PHOTO, HER_PHOTO, MERGE_CAPTION } from '@/lib/config'
import { playHeartSwell } from '@/lib/sound'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

export default function SwipeScene({ onComplete }: Props) {
  const [merged, setMerged] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [burst, setBurst] = useState(false)
  const touchStartX = useRef(0)
  const isDragging = useRef(false)
  const dragX = useMotionValue(0)

  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3
        const dist = 60 + Math.random() * 70
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, delay: Math.random() * 0.2 }
      }),
    []
  )

  const doMerge = () => {
    if (merged) return
    setMerged(true)
    playHeartSwell()
    setTimeout(() => setBurst(true), 700)
    setTimeout(() => setShowCaption(true), 1700)
    setTimeout(() => onComplete(), 4000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50) doMerge()
  }
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    touchStartX.current = e.clientX
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const dx = e.clientX - touchStartX.current
    if (dx > 40) doMerge()
    dragX.set(0)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = Math.max(0, e.clientX - touchStartX.current)
    dragX.set(Math.min(dx, 150))
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center gap-9 select-none"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <AnimatePresence>
        {!merged && (
          <motion.div
            className="text-center z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.5 }}
          >
            <p className="font-cinzel text-[10px] tracking-[14px] uppercase" style={{ color: '#8b3050' }}>
              put us in one frame
            </p>
            <Flourish />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polaroid pair */}
      <div
        className="relative z-10"
        style={{ width: 'clamp(300px, 82vw, 600px)', height: 'clamp(210px, 44vw, 300px)' }}
      >
        <PolaroidCard
          side="left"
          label="me"
          photo={YOUR_PHOTO}
          merged={merged}
          idlePhase={0}
        />

        {/* Center divider / bow, sits between the two while apart */}
        <AnimatePresence>
          {!merged && (
            <motion.div
              className="absolute pointer-events-none flex flex-col items-center justify-center gap-1"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6 } }}
            >
              <svg width={28} height={20} viewBox="0 0 28 20">
                <path
                  d="M14 6 C 10 -1, 0 0, 2 7 C 3 11, 10 10, 14 6 C 18 10, 25 11, 26 7 C 28 0, 18 -1, 14 6 Z"
                  fill="#ff9fc0"
                  opacity={0.85}
                />
                <circle cx={14} cy={7} r={2.4} fill="#ffe066" />
              </svg>
              <div style={{ width: 1, height: 28, borderLeft: '1.5px dashed rgba(255,182,193,0.4)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merge sparkle/heart burst */}
        <AnimatePresence>
          {burst && (
            <div
              className="absolute pointer-events-none"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: -50,
                  top: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(ellipse, rgba(255,159,192,0.55) 0%, transparent 70%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.5], scale: [0, 1.4, 1] }}
                transition={{ duration: 1.3 }}
              />
              {hearts.map((h, i) => (
                <motion.span
                  key={i}
                  className="absolute"
                  style={{ fontSize: 13, color: '#ff6fa5' }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                  animate={{ x: h.dx, y: h.dy, opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.3, delay: h.delay, ease: 'easeOut' }}
                >
                  ♡
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>

        <PolaroidCard
          side="right"
          label="you"
          photo={HER_PHOTO}
          merged={merged}
          idlePhase={0.6}
        />
      </div>

      {/* Swipe hint */}
      <AnimatePresence>
        {!merged && (
          <motion.div
            className="flex items-center gap-4 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="font-cinzel text-[9px] tracking-[8px] uppercase" style={{ color: '#a8305a' }}>
              swipe, or tap the button
            </p>
            <motion.span
              style={{ color: '#a8305a', fontSize: 18 }}
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption under the merged result */}
      <AnimatePresence>
        {showCaption && (
          <motion.p
            className="font-script text-center z-10"
            style={{ fontSize: 'clamp(26px, 5.5vw, 40px)', color: '#8b3050' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >
            {MERGE_CAPTION}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Also tap/click to merge on desktop */}
      {!merged && (
        <button
          onClick={doMerge}
          className="btn-romantic absolute bottom-12 opacity-40 hover:opacity-90 z-10"
          style={{ fontSize: 9 }}
        >
          bring them together
        </button>
      )}
    </motion.div>
  )
}

function PolaroidCard({
  side,
  label,
  photo,
  merged,
  idlePhase,
}: {
  side: 'left' | 'right'
  label: string
  photo: string
  merged: boolean
  idlePhase: number
}) {
  return (
    <motion.div
      className="absolute top-0"
      style={{ width: '45%', height: '100%', [side]: 0 } as React.CSSProperties}
      animate={{
        [side]: merged ? '6%' : '0%',
        y: merged ? 0 : [0, -6, 0],
        rotate: side === 'left' ? (merged ? -4 : -2) : merged ? 4 : 2,
      }}
      transition={{
        [side]: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 3.2, repeat: merged ? 0 : Infinity, ease: 'easeInOut', delay: idlePhase },
        rotate: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
      } as any}
    >
      {/* Polaroid paper frame */}
      <div
        className="w-full h-full rounded-sm flex flex-col p-2"
        style={{
          background: 'linear-gradient(160deg, #fffaf7 0%, #fdeef1 100%)',
          boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
        }}
      >
        {/* Little washi-tape accent */}
        <div
          className="absolute rounded-sm"
          style={{
            top: -8,
            left: '50%',
            transform: `translateX(-50%) rotate(${side === 'left' ? -4 : 4}deg)`,
            width: 34,
            height: 14,
            background: 'rgba(255,182,193,0.55)',
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        />

        {/* Photo area */}
        <div
          className="relative flex-1 rounded-[2px] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3a1220 0%, #1a0812 100%)' }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <ZoomImg file={photo} />
          ) : (
            <span style={{ fontSize: 34, color: '#ff6fa5' }}>♡</span>
          )}
        </div>

        {/* Handwritten-style caption strip */}
        <p
          className="font-script text-center pt-1"
          style={{ fontSize: 16, color: '#8b3050', lineHeight: 1 }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  )
}
