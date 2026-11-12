'use client'

import { useMemo } from 'react'

const HEART_COLORS = ['#c9707a', '#e0a0a0', '#b5453a']

function heartMark(size: number, color: string, rot: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" style={{ transform: `rotate(${rot}deg)` }}>
      <path
        d="M20 33 C 4 22 1 12 6 6 C 10 1 17 2 20 9 C 23 2 30 1 34 6 C 39 12 36 22 20 33 Z"
        fill={color}
      />
    </svg>
  )
}

function flowerMark(size: number) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {petals.map(a => (
        <ellipse key={a} cx={20} cy={10} rx={6} ry={9} fill="#f0b8be" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx={20} cy={20} r={4} fill="#ffd977" />
    </svg>
  )
}

// A tiny seeded PRNG so the scatter is stable between renders instead of
// reshuffling on every re-render.
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

interface Props {
  heartCount?: number
  flowerCount?: number
  seed?: number
}

/** Drop this behind a scene's content (absolute inset-0, z-0) on any light/cream
 *  background to get the reference "scattered hearts on paper" look, toned down
 *  to stay gentle rather than busy. */
export default function PaperHearts({ heartCount = 18, flowerCount = 7, seed = 42 }: Props) {
  const hearts = useMemo(() => {
    const rnd = makeRng(seed)
    return Array.from({ length: heartCount }).map((_, i) => ({
      id: i,
      size: 9 + rnd() * 22,
      left: rnd() * 94 + 3,
      top: rnd() * 94 + 3,
      opacity: 0.5 + rnd() * 0.28,
      rot: (rnd() - 0.5) * 20,
      color: HEART_COLORS[Math.floor(rnd() * HEART_COLORS.length)],
    }))
  }, [heartCount, seed])

  const flowers = useMemo(() => {
    const rnd = makeRng(seed + 1000)
    return Array.from({ length: flowerCount }).map((_, i) => ({
      id: i,
      size: 14 + rnd() * 10,
      left: rnd() * 94 + 3,
      top: rnd() * 94 + 3,
      opacity: 0.5 + rnd() * 0.25,
    }))
  }, [flowerCount, seed])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map(h => (
        <div key={h.id} className="absolute" style={{ left: `${h.left}%`, top: `${h.top}%`, opacity: h.opacity }}>
          {heartMark(h.size, h.color, h.rot)}
        </div>
      ))}
      {flowers.map(f => (
        <div key={f.id} className="absolute" style={{ left: `${f.left}%`, top: `${f.top}%`, opacity: f.opacity }}>
          {flowerMark(f.size)}
        </div>
      ))}
    </div>
  )
}
