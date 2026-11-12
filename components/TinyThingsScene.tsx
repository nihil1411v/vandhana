'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TINY_THINGS, SPECIAL_TINY_THING_INDICES, SPECIAL_TINY_THING_BONUS } from '@/lib/config'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

const TILT = [-6, 4, -2, 7, -8, 3, -4, 6, -3, 5]
const HUES = ['#c4306b', '#a8305a', '#e0447f', '#8b3050', '#d4956b']

export default function TinyThingsScene({ onComplete }: Props) {
  const [shown, setShown] = useState(1)
  const [paused, setPaused] = useState(false)
  const [bonus, setBonus] = useState<string | null>(null)
  const done = shown >= TINY_THINGS.length

  useEffect(() => {
    if (done || paused) return
    const t = setTimeout(() => {
      const nextIndex = shown // index of the item about to be revealed
      if (SPECIAL_TINY_THING_INDICES.includes(nextIndex)) {
        setPaused(true)
        setBonus(SPECIAL_TINY_THING_BONUS)
        setTimeout(() => {
          setBonus(null)
          setPaused(false)
          setShown(s => s + 1)
        }, 2200)
        return
      }
      setShown(s => s + 1)
    }, 650)
    return () => clearTimeout(t)
  }, [shown, paused, done])

  const skipToEnd = () => {
    setPaused(false)
    setBonus(null)
    setShown(TINY_THINGS.length)
  }

  const visible = TINY_THINGS.slice(0, shown)

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop strength={0.42} />
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        tiny things I like
      </p>
      <Flourish />

      <div
        className="w-full flex-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 overflow-y-auto"
        style={{ maxWidth: 640, maxHeight: '46vh', padding: '8px 4px' }}
      >
        <AnimatePresence>
          {visible.map((thing, i) => (
            <motion.span
              key={i}
              className="font-cormorant italic"
              style={{
                fontSize: i === visible.length - 1 ? 18 : 13.5,
                color: HUES[i % HUES.length],
                opacity: i === visible.length - 1 ? 1 : 0.55,
                transform: `rotate(${TILT[i % TILT.length]}deg)`,
                display: 'inline-block',
              }}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: i === visible.length - 1 ? 1 : 0.55, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {thing}
              {i < visible.length - 1 ? ',' : ''}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {bonus && (
          <motion.p
            className="font-script text-center"
            style={{ fontSize: 22, color: '#c4306b' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {bonus}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="font-cormorant italic" style={{ fontSize: 12, color: '#a8703a' }}>
        {shown} of {TINY_THINGS.length}
      </p>

      <div className="flex items-center gap-6">
        {!done && (
          <button className="btn-romantic" onClick={skipToEnd} style={{ opacity: 0.7 }}>
            skip ahead
          </button>
        )}
        {done && (
          <button className="btn-romantic" onClick={onComplete}>
            continue →
          </button>
        )}
      </div>
    </motion.div>
  )
}
