'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PLACES } from '@/lib/config'
import { addVisitedStar, getDB } from '@/lib/db'
import Flourish from '@/components/Flourish'
import PhotoFrame from '@/components/PhotoFrame'

interface Props {
  onComplete: () => void
}

function useBackgroundStars(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 1.8,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * -5,
      })),
    [count]
  )
}

export default function ConstellationScene({ onComplete }: Props) {
  const initialVisited = useMemo(() => new Set(getDB().starsVisited), [])
  const [visited, setVisited] = useState<Set<number>>(initialVisited)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const backgroundStars = useBackgroundStars(70)
  const allVisited = visited.size >= PLACES.length

  const open = (i: number) => {
    setOpenIndex(i)
    if (!visited.has(i)) {
      addVisitedStar(i)
      setVisited(prev => new Set(prev).add(i))
    }
  }

  return (
    <motion.div
      className="scene scene-clip relative flex flex-col items-center justify-center px-6 gap-5 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #2a0a1a 0%, #140810 65%, #0a0308 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* faint twinkling sky */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundStars.map(s => (
          <motion.span
            key={s.id}
            className="absolute rounded-full"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, background: '#ffe3ec' }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <p className="relative font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#e8a8c0' }}>
        a small sky
      </p>
      <div className="relative">
        <Flourish />
      </div>
      <p className="relative font-cormorant italic text-center max-w-xs" style={{ fontSize: 14, color: '#c98aa0' }}>
        tap a star. each one holds a small piece of my heart.
      </p>

      {/* the constellation itself */}
      <div className="relative w-full" style={{ maxWidth: 520, height: 'min(46dvh, 380px)', minHeight: 260 }}>
        {/* glowing threads joining one star to the next */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PLACES.slice(0, -1).map((p, i) => {
            const q = PLACES[i + 1]
            const lit = visited.has(i) && visited.has(i + 1)
            return (
              <motion.line
                key={i}
                x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                stroke={lit ? 'rgba(255,200,220,0.75)' : 'rgba(255,182,193,0.22)'}
                strokeWidth={lit ? 1.6 : 1}
                strokeDasharray={lit ? undefined : '3 5'}
                vectorEffect="non-scaling-stroke"
                style={{ filter: lit ? 'drop-shadow(0 0 4px rgba(255,159,192,0.9))' : undefined }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.6 + i * 0.7 }}
              />
            )
          })}
        </svg>
        {PLACES.map((place, i) => {
          const isVisited = visited.has(i)
          return (
            <motion.button
              key={i}
              className="absolute flex items-center justify-center"
              style={{ left: `${place.x}%`, top: `${place.y}%`, translateX: '-50%', translateY: '-50%' }}
              onClick={() => open(i)}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.6 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              whileTap={{ scale: 0.85 }}
            >
              <span
                style={{
                  fontSize: isVisited ? 22 : 18,
                  color: isVisited ? '#ffd7e6' : '#ff9fc0',
                  filter: `drop-shadow(0 0 ${isVisited ? 16 : 8}px rgba(255,159,192,${isVisited ? 0.9 : 0.5}))`,
                }}
              >
                ✦
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(10,3,6,0.72)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative rounded-sm px-8 py-8 text-center"
              style={{
                maxWidth: 380,
                maxHeight: '92dvh',
                overflowY: 'auto',
                background: 'linear-gradient(165deg, #3a1020 0%, #1a0510 100%)',
                border: '1px solid rgba(255,182,193,0.25)',
                boxShadow: '0 0 60px rgba(255,111,165,0.25)',
              }}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              {PLACES[openIndex].photo && (
                <div className="flex justify-center mb-5">
                  <PhotoFrame file={PLACES[openIndex].photo as string} width={150} height={184} rotate={-2} />
                </div>
              )}
              <span style={{ fontSize: 20, color: '#ffb6c1' }}>✦</span>
              <p className="font-cinzel text-[10px] tracking-[6px] uppercase mt-3" style={{ color: '#e8a8c0' }}>
                {PLACES[openIndex].name}
              </p>
              <p className="font-cormorant italic mt-4" style={{ fontSize: 18, color: '#ffe3ec', lineHeight: 1.8 }}>
                {PLACES[openIndex].memory}
              </p>
              <button className="btn-romantic mt-6" onClick={() => setOpenIndex(null)}>
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="btn-romantic relative"
        onClick={onComplete}
        animate={{ opacity: allVisited ? 1 : 0.55 }}
      >
        {allVisited ? 'continue →' : 'skip ahead →'}
      </motion.button>
    </motion.div>
  )
}
