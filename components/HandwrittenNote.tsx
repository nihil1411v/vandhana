'use client'

import { motion } from 'framer-motion'
import RomanticPaper from '@/components/RomanticPaper'
import ScrapbookTape from '@/components/ScrapbookTape'
import FlowerDoodle from '@/components/FlowerDoodle'

interface Props {
  children: React.ReactNode
  rotate?: number
  withTape?: boolean
  withFlower?: boolean
  maxWidth?: number
  onClick?: () => void
}

/** A single handwritten-feeling scrapbook note: paper, an optional tape strip, an optional tiny flower. */
export default function HandwrittenNote({ children, rotate = 0, withTape = true, withFlower = false, maxWidth = 380, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : undefined}
      whileHover={onClick ? { scale: 1.02, rotate: rotate * 0.4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <RomanticPaper rotate={rotate} maxWidth={maxWidth} className="px-6 py-6">
        {withTape && <ScrapbookTape />}
        {withFlower && (
          <FlowerDoodle size={18} style={{ position: 'absolute', top: 10, right: 12 }} />
        )}
        {children}
      </RomanticPaper>
    </motion.div>
  )
}
