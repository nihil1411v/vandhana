'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { motion } from 'framer-motion'

interface Props {
  photo?: string // filename in /public/photos/, or blank for a placeholder heart
  caption?: string
  rotate?: number
  width?: number
  height?: number
  onClick?: () => void
}

/** A physical-feeling Polaroid: cream paper frame, dark photo well, handwritten caption strip. */
export default function PolaroidPhoto({ photo, caption, rotate = 0, width = 140, height = 170, onClick }: Props) {
  return (
    <motion.div
      className="relative"
      style={{ width, height, cursor: onClick ? 'pointer' : undefined }}
      initial={{ opacity: 0, rotate: rotate - 3, y: 8 }}
      animate={{ opacity: 1, rotate, y: 0 }}
      whileHover={onClick ? { scale: 1.03, rotate: 0 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      transition={{ duration: 0.6 }}
    >
      <div
        className="w-full h-full rounded-sm flex flex-col p-2"
        style={{
          background: 'linear-gradient(160deg, #fffaf7 0%, #fdeee3 100%)',
          boxShadow: '0 10px 26px rgba(139,58,30,0.22)',
        }}
      >
        <div
          className="relative flex-1 rounded-[2px] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3a2416 0%, #1a0f0a 100%)' }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <ZoomImg file={photo} />
          ) : (
            <span style={{ fontSize: 26, color: '#d4956b' }}>♡</span>
          )}
        </div>
        {caption && (
          <p className="font-script text-center pt-1" style={{ fontSize: 14, color: '#8b3050', lineHeight: 1.1 }}>
            {caption}
          </p>
        )}
      </div>
    </motion.div>
  )
}
