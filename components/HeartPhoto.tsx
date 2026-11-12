'use client'

import { motion } from 'framer-motion'
import { ZoomImg } from '@/components/PhotoFrame'

/**
 * A photo cut into the shape of a heart, with a rose-gold rim, a soft glow
 * that follows the heart's outline, and a gentle heartbeat.
 */
export default function HeartPhoto({
  file,
  width = 240,
  beat = true,
  className,
}: {
  file: string
  width?: number
  beat?: boolean
  className?: string
}) {
  const h = Math.round(width * 0.94)
  const rim = Math.max(5, Math.round(width * 0.032))
  return (
    <motion.div
      className={className}
      style={{
        width: width + rim * 2,
        height: h + rim * 2,
        position: 'relative',
        filter: 'drop-shadow(0 0 20px rgba(255,111,165,0.65)) drop-shadow(0 10px 22px rgba(0,0,0,0.45))',
      }}
      animate={beat ? { scale: [1, 1.055, 1, 1.035, 1] } : undefined}
      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,1 C0.12,0.72 0,0.5 0,0.3 C0,0.12 0.13,0 0.28,0 C0.38,0 0.46,0.05 0.5,0.15 C0.54,0.05 0.62,0 0.72,0 C0.87,0 1,0.12 1,0.3 C1,0.5 0.88,0.72 0.5,1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'url(#heart-clip)',
          background: 'linear-gradient(135deg, #fff1d6 0%, #ffb6d0 32%, #ff6fa5 62%, #ffd9a0 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: rim,
          top: rim,
          width,
          height: h,
          overflow: 'hidden',
          clipPath: 'url(#heart-clip)',
        }}
      >
        <ZoomImg file={file} tight />
      </div>
    </motion.div>
  )
}
