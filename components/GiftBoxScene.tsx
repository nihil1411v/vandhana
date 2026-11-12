'use client'

import { GIFT_PHOTO } from '@/lib/config'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { GIFT_MESSAGE, GIFT_VOUCHER } from '@/lib/config'
import { markGiftOpened } from '@/lib/db'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

type Stage = 'aiming' | 'firing' | 'open'

// Real archery geometry: the bow stands vertically (tips top & bottom), the
// string runs between them, and drawing it back means moving the nock
// HORIZONTALLY toward the archer.
const TOP_TIP = { x: 34, y: 18 }
const BOTTOM_TIP = { x: 34, y: 146 }
const REST_NOCK_X = 50
const NOCK_Y = 82
const BOX_X = 210
const MAX_PULL = 52
const PULL_THRESHOLD = 24
const ARROW_W = 92
const ARROW_H = 22

export default function GiftBoxScene({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('aiming')
  const [pull, setPull] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [flightStart, setFlightStart] = useState(0)

  const handleDrag = (_: any, info: PanInfo) => {
    setPull(Math.max(0, Math.min(MAX_PULL, -info.offset.x)))
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const p = Math.max(0, Math.min(MAX_PULL, -info.offset.x))
    if (p >= PULL_THRESHOLD) {
      setFlightStart(p)
      setStage('firing')
    } else {
      setPull(0)
      setResetKey(k => k + 1)
    }
  }

  const strike = () => {
    setStage('open')
    markGiftOpened()
  }

  const nockX = REST_NOCK_X - pull
  const drawStrength = pull / MAX_PULL

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-5"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        a little gift
      </p>
      <Flourish />

      <div className="relative" style={{ width: 300, height: 190 }}>
        {/* ===== Bow (static, filled SVG limbs — decorative only, never draggable) ===== */}
        {stage !== 'open' && (
          <svg
            viewBox="0 0 300 190"
            width={300}
            height={190}
            className="absolute inset-0 pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="limbGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7a4a2a" />
                <stop offset="45%" stopColor="#c9944f" />
                <stop offset="100%" stopColor="#e8c07a" />
              </linearGradient>
              <linearGradient id="gripGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3a2414" />
                <stop offset="100%" stopColor="#6b4a2a" />
              </linearGradient>
              <radialGradient id="pullGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff9fc0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ff9fc0" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Upper limb — tapered, filled shape (not a stroked line) */}
            <path
              d={`M ${TOP_TIP.x} ${TOP_TIP.y}
                  C 4 26, -10 52, -6 76
                  C 4 68, 10 50, 20 40
                  C 26 30, 30 22, ${TOP_TIP.x} ${TOP_TIP.y} Z`}
              fill="url(#limbGrad)"
              stroke="#3a2414"
              strokeWidth={0.6}
            />
            {/* Lower limb — mirrored */}
            <path
              d={`M ${BOTTOM_TIP.x} ${BOTTOM_TIP.y}
                  C 4 138, -10 112, -6 88
                  C 4 96, 10 114, 20 124
                  C 26 134, 30 142, ${BOTTOM_TIP.x} ${BOTTOM_TIP.y} Z`}
              fill="url(#limbGrad)"
              stroke="#3a2414"
              strokeWidth={0.6}
            />
            {/* Riser / grip at the belly of the bow */}
            <rect x={10} y={76} width={12} height={12} rx={3} fill="url(#gripGrad)" />
            {/* Small heart-shaped inlay on the grip — subtle, not a floating emoji */}
            <path
              d="M 16 80.5 C 15 79, 12.5 79, 12.5 81 C 12.5 82.5, 14 83.5, 16 85.5 C 18 83.5, 19.5 82.5, 19.5 81 C 19.5 79, 17 79, 16 80.5 Z"
              fill="#ffb6c1"
              opacity={0.9}
            />

            {/* Bowstring — two segments converging on the nock */}
            <line
              x1={TOP_TIP.x}
              y1={TOP_TIP.y}
              x2={nockX}
              y2={NOCK_Y}
              stroke="#f2e6d8"
              strokeWidth={1.1 + drawStrength * 0.6}
              opacity={0.85}
            />
            <line
              x1={BOTTOM_TIP.x}
              y1={BOTTOM_TIP.y}
              x2={nockX}
              y2={NOCK_Y}
              stroke="#f2e6d8"
              strokeWidth={1.1 + drawStrength * 0.6}
              opacity={0.85}
            />
            {drawStrength > 0.05 && (
              <circle cx={nockX} cy={NOCK_Y} r={12 + drawStrength * 8} fill="url(#pullGlow)" />
            )}

            {/* Faint flight-path guide */}
            <line
              x1={REST_NOCK_X + 20}
              y1={NOCK_Y}
              x2={BOX_X - 30}
              y2={NOCK_Y}
              stroke="#ff9fc0"
              strokeWidth={1}
              strokeDasharray="3 7"
              opacity={0.2}
            />
          </svg>
        )}

        {/* ===== Draggable arrow (HTML wrapper, SVG artwork inside) ===== */}
        {stage === 'aiming' && (
          <motion.div
            key={resetKey}
            drag="x"
            dragConstraints={{ left: -MAX_PULL, right: 0 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: REST_NOCK_X, top: NOCK_Y - ARROW_H / 2, touchAction: 'none' }}
            initial={{ x: 0 }}
            animate={{ x: 0 }}
          >
            <ArrowGraphic />
          </motion.div>
        )}

        {/* ===== Flying arrow (fired), with a soft fading ghost trail ===== */}
        {stage === 'firing' && (
          <>
            <motion.div
              className="absolute"
              style={{ top: NOCK_Y - ARROW_H / 2, opacity: 0.35 }}
              initial={{ left: REST_NOCK_X - flightStart }}
              animate={{ left: BOX_X - 14 }}
              transition={{ duration: 0.4, ease: 'easeIn', delay: 0.02 }}
            >
              <ArrowGraphic />
            </motion.div>
            <motion.div
              className="absolute"
              style={{ top: NOCK_Y - ARROW_H / 2 }}
              initial={{ left: REST_NOCK_X - flightStart }}
              animate={{ left: BOX_X }}
              transition={{ duration: 0.4, ease: 'easeIn' }}
              onAnimationComplete={strike}
            >
              <ArrowGraphic />
            </motion.div>
          </>
        )}

        {/* ===== Gift box ===== */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: stage === 'open' ? '50%' : BOX_X,
            top: stage === 'open' ? 30 : NOCK_Y - 45,
            transform: stage === 'open' ? 'translateX(-50%)' : 'none',
            width: 130,
            height: 105,
            transition: 'left 0.4s ease, top 0.4s ease',
          }}
        >
          <div
            className="absolute rounded-md"
            style={{
              width: 108,
              height: 76,
              bottom: 0,
              background: 'linear-gradient(180deg, #c4306b 0%, #7a1240 100%)',
              border: '1px solid rgba(255,214,229,0.3)',
              boxShadow: '0 8px 30px rgba(196,30,88,0.3)',
            }}
          />

          <motion.div
            className="absolute rounded-md"
            style={{
              width: 120,
              height: 26,
              top: 50,
              background: 'linear-gradient(180deg, #e0447f 0%, #9c1a52 100%)',
              border: '1px solid rgba(255,214,229,0.3)',
              transformOrigin: 'bottom center',
              zIndex: 5,
            }}
            animate={
              stage === 'open'
                ? { y: -55, rotateX: 100, opacity: 0 }
                : { y: 0, rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.div
            className="absolute"
            style={{ width: 15, height: 102, bottom: 0, background: 'linear-gradient(180deg,#ffe066,#ffb6c1)', zIndex: 6 }}
            animate={stage === 'open' ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute"
            style={{ width: 120, height: 15, top: 68, background: 'linear-gradient(90deg,#ffe066,#ffb6c1)', zIndex: 6 }}
            animate={stage === 'open' ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            className="absolute flex items-center justify-center"
            style={{ top: 30, zIndex: 7, fontSize: 26 }}
            animate={stage === 'open' ? { opacity: 0, y: -20, rotate: 30 } : { opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            🎀
          </motion.div>

          <AnimatePresence>
            {stage === 'open' && (
              <motion.span
                className="absolute"
                style={{ top: -14, fontSize: 24 }}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -16 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              >
                ✨
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {stage === 'aiming' && (
          <motion.p
            className="font-cinzel text-[9px] tracking-[8px] uppercase"
            style={{ color: '#a8305a' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            exit={{ opacity: 0 }}
          >
            draw the string back, then let go
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'open' && (
          <motion.div
            className="flex flex-col items-center gap-6 max-w-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <PhotoFrame file={GIFT_PHOTO} width={128} height={164} rotate={2.5} />
            <p
              className="font-cormorant italic"
              style={{ fontSize: 'clamp(17px, 3.5vw, 22px)', color: '#6b2c42', lineHeight: 1.8 }}
            >
              {GIFT_MESSAGE}
            </p>
            {GIFT_VOUCHER && (
              <p
                className="font-cinzel text-[10px] tracking-[4px] uppercase px-4 py-2"
                style={{ color: '#a8730a', border: '1px solid rgba(196,48,107,0.3)', borderRadius: 999 }}
              >
                {GIFT_VOUCHER}
              </p>
            )}
            <button className="btn-romantic" onClick={onComplete}>
              continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * A precise, self-contained SVG arrow: metallic diamond arrowhead, wood-grain
 * shaft, and three curved feather flights at the nock end. Built as real
 * vector shapes rather than emoji/CSS triangles.
 */
function ArrowGraphic() {
  return (
    <svg width={ARROW_W} height={ARROW_H} viewBox={`0 0 ${ARROW_W} ${ARROW_H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="shaftGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a5a30" />
          <stop offset="50%" stopColor="#d9a866" />
          <stop offset="100%" stopColor="#f0d19a" />
        </linearGradient>
        <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8c8d0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8a8b8" />
        </linearGradient>
        <linearGradient id="featherGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9fc0" />
          <stop offset="100%" stopColor="#c4306b" />
        </linearGradient>
      </defs>

      {/* Fletching — three overlapping curved feathers near the nock */}
      <path d="M 14 11 Q 2 3, 0 -2 Q 10 4, 16 9 Z" fill="url(#featherGrad)" opacity={0.95} />
      <path d="M 14 11 Q 2 19, 0 24 Q 10 18, 16 13 Z" fill="url(#featherGrad)" opacity={0.95} />
      <path d="M 14 11 Q -2 11, -6 11 Q 6 8, 16 11 Z" fill="url(#featherGrad)" opacity={0.85} />

      {/* Nock */}
      <rect x={9} y={9} width={5} height={4} rx={1} fill="#f2e6d8" />

      {/* Shaft */}
      <rect x={14} y={9.5} width={54} height={3} rx={1.5} fill="url(#shaftGrad2)" />

      {/* Diamond arrowhead */}
      <polygon points={`68,6 ${ARROW_W},11 68,16 74,11`} fill="url(#headGrad)" stroke="#a8788a" strokeWidth={0.5} />
    </svg>
  )
}
