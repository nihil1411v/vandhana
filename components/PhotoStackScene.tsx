'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomImg } from '@/components/PhotoFrame'
import { PHOTO_STACK } from '@/lib/config'
import { addFlippedPhoto, getDB } from '@/lib/db'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

const CARD_W = 'min(66vw, 268px)'
const CARD_H = 'calc(min(66vw, 268px) * 1.3)'

/**
 * A row of big polaroids you swipe through (or step through with the arrows).
 * Each photo is shown whole, in a proper 4:5 frame; tap a card to turn it over.
 */
export default function PhotoStackScene({ onComplete }: Props) {
  const initialFlipped = useMemo(() => new Set(getDB().photosFlipped), [])
  const [seen, setSeen] = useState<Set<number>>(initialFlipped)
  const [turned, setTurned] = useState<Set<number>>(new Set())
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const raf = useRef<number | null>(null)
  const allSeen = seen.size >= PHOTO_STACK.length

  const flip = (i: number) => {
    setTurned(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
    if (!seen.has(i)) {
      addFlippedPhoto(i)
      setSeen(prev => new Set(prev).add(i))
    }
  }

  const goTo = useCallback((i: number) => {
    const el = trackRef.current?.children[Math.max(0, Math.min(PHOTO_STACK.length - 1, i))] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [])

  const onScroll = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const t = trackRef.current
      if (!t) return
      const mid = t.scrollLeft + t.clientWidth / 2
      let best = 0
      let bestD = Infinity
      Array.from(t.children).forEach((c, i) => {
        const el = c as HTMLElement
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
        if (d < bestD) { bestD = d; best = i }
      })
      setActive(best)
    })
  }

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current) }, [])

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center gap-5"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <p className="font-cinzel text-[10px] tracking-[10px] uppercase" style={{ color: '#a8305a' }}>
        a stack of you
      </p>
      <Flourish />
      <p className="font-cormorant italic text-center px-6" style={{ fontSize: 15, color: '#8b3a5a' }}>
        swipe through. tap one to flip it.
      </p>

      <div className="relative flex items-center justify-center" style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(50% - 50vw)' }}>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex w-full overflow-x-auto"
          style={{
            gap: 18,
            padding: `14px calc(50% - ${'min(33vw, 134px)'}) 46px`,
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {PHOTO_STACK.map((card, i) => {
            const isTurned = turned.has(i)
            const isActive = active === i
            return (
              <motion.div
                key={i}
                className="shrink-0"
                style={{ width: CARD_W, height: CARD_H, scrollSnapAlign: 'center', perspective: 1100, cursor: 'pointer' }}
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 5 : -5 }}
                animate={{ opacity: isActive ? 1 : 0.72, y: 0, rotate: isActive ? 0 : i % 2 ? 2 : -2, scale: isActive ? 1 : 0.9 }}
                transition={{ duration: 0.55, delay: i < 3 ? i * 0.12 : 0, ease: 'easeOut' }}
                onClick={() => (isActive ? flip(i) : goTo(i))}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isTurned ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* front: a proper polaroid — the photo fills a 4:5 frame */}
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: '#fffaf7',
                      padding: '12px 12px 0',
                      boxShadow: '0 16px 38px rgba(139,48,88,0.3)',
                      borderRadius: 2,
                    }}
                  >
                    <div className="relative flex-1 overflow-hidden" style={{ background: '#ead9d9' }}>
                      <ZoomImg file={card.photo} />
                    </div>
                    <div className="flex items-center justify-center" style={{ height: 46 }}>
                      <span className="font-script" style={{ fontSize: 22, color: '#c4306b' }}>
                        {isActive ? 'tap to flip ♡' : '♡'}
                      </span>
                    </div>
                  </div>

                  {/* back: what I remember */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      padding: 22,
                      background: 'linear-gradient(160deg, #6b0a1a 0%, #2a0509 100%)',
                      boxShadow: '0 16px 38px rgba(139,0,50,0.35)',
                      borderRadius: 2,
                    }}
                  >
                    <span style={{ fontSize: 22, color: '#ffb6c1', marginBottom: 12 }}>♡</span>
                    <p className="font-cormorant italic" style={{ fontSize: 'clamp(18px, 4.6vw, 21px)', color: '#ffe8e8', lineHeight: 1.65 }}>
                      {card.message}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="previous photo"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.75)', color: '#a8305a', boxShadow: '0 6px 16px rgba(168,48,90,0.22)', opacity: active === 0 ? 0.35 : 1 }}
          onClick={() => goTo(active - 1)}
        >
          ←
        </button>
        <div className="flex gap-2">
        {PHOTO_STACK.map((_, i) => (
          <span
            key={i}
            style={{ fontSize: i === active ? 15 : 10, lineHeight: 1, color: seen.has(i) ? '#c4306b' : 'rgba(196,48,107,0.35)', transition: 'all 0.4s' }}
          >
            {seen.has(i) ? '♥' : '♡'}
          </span>
        ))}
        </div>
        <button
          aria-label="next photo"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.75)', color: '#a8305a', boxShadow: '0 6px 16px rgba(168,48,90,0.22)', opacity: active === PHOTO_STACK.length - 1 ? 0.35 : 1 }}
          onClick={() => goTo(active + 1)}
        >
          →
        </button>
      </div>

      <motion.button className="btn-romantic" onClick={onComplete} animate={{ opacity: allSeen ? 1 : 0.6 }}>
        {allSeen ? 'continue →' : 'continue anyway →'}
      </motion.button>
    </motion.div>
  )
}
