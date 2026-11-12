'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  motionKey?: string | number
  maxWidth?: number
  rotate?: number
  className?: string
}

/**
 * A warm, physical-feeling paper surface — off-white, faint grain, soft
 * shadow, a hint of imperfection. This replaces the earlier "dark box on
 * a light scene" pattern used for notes/cards throughout the site: paper
 * should look like paper, not like a floating panel of black glass.
 */
export default function RomanticPaper({ children, motionKey, maxWidth = 420, rotate = 0, className = '' }: Props) {
  return (
    <motion.div
      key={motionKey}
      className={`relative rounded-sm ${className}`}
      style={{
        maxWidth,
        width: '100%',
        background:
          'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
        boxShadow: '0 14px 40px rgba(139,58,30,0.14), 0 2px 6px rgba(139,58,30,0.08)',
        border: '1px solid rgba(196,130,80,0.18)',
      }}
      initial={{ opacity: 0, y: 14, rotate: rotate - 0.6 }}
      animate={{ opacity: 1, y: 0, rotate }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Faint paper grain, via layered radial noise */}
      <div
        className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #8b3a10 0.5px, transparent 0.5px), radial-gradient(circle at 70% 60%, #8b3a10 0.5px, transparent 0.5px), radial-gradient(circle at 40% 80%, #8b3a10 0.5px, transparent 0.5px)',
          backgroundSize: '3px 3px, 4px 4px, 5px 5px',
        }}
      />
      {children}
    </motion.div>
  )
}
