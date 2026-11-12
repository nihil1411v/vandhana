'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Scene } from '@/app/page'

const CHAPTERS: Partial<Record<Scene, { n: string; label: string }>> = {
  splash: { n: '01', label: 'The Beginning' },
  hero: { n: '02', label: 'Wake Up' },
  heart: { n: '03', label: 'A Little Conversation' },
  reveal: { n: '04', label: 'Getting Closer' },
  swipe: { n: '05', label: 'Both Of Us' },
  giftbox: { n: '06', label: 'A Little Something' },
  scratchcard: { n: '07', label: 'Surprise' },
  timeline: { n: '08', label: 'The Story So Far' },
  constellation: { n: '09', label: 'A Small Sky' },
  photostack: { n: '10', label: 'A Stack Of You' },
  agemilestone: { n: '11', label: 'How You Make Me Feel' },
  birthdaycard: { n: '12', label: 'For You' },
  letter: { n: '13', label: 'A Letter' },
  balloonpop: { n: '14', label: 'Pop Them All' },
  cake: { n: '15', label: 'Make A Wish' },
  questions: { n: '16', label: 'Just A Few Questions' },
  reasons: { n: '17', label: '24 Things I Love' },
  museum: { n: '18', label: 'A Small Gallery Of You' },
  observations: { n: '19', label: 'Little Things I Love' },
  tinythings: { n: '20', label: 'Tiny Things I Like' },
  oneminute: { n: '21', label: 'Just Breathe' },
  onething: { n: '22', label: 'One Thing' },
  reel: { n: '23', label: 'My Favourite Frames' },
  fireworks: { n: '24', label: 'Happy Birthday' },
  proposal: { n: '25', label: 'One Question' },
  final: { n: '26', label: 'From Me' },
}

/** A quiet "chapter 09 · our little universe" tag — announces itself briefly on
 *  each scene change, then dims to almost nothing so it never competes with the scene. */
export default function ChapterIndicator({ scene }: { scene: Scene }) {
  const [prominent, setProminent] = useState(true)
  const chapter = CHAPTERS[scene]

  useEffect(() => {
    setProminent(true)
    const t = setTimeout(() => setProminent(false), 2600)
    return () => clearTimeout(t)
  }, [scene])

  if (!chapter) return null

  return (
    <div className="fixed top-5 right-[74px] z-30 pointer-events-none select-none hidden sm:block text-right">
      <AnimatePresence mode="wait">
        <motion.p
          key={scene}
          className="font-cinzel text-right"
          style={{ fontSize: 9, letterSpacing: 4, color: '#e8a8c0' }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: prominent ? 0.85 : 0.28, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          CHAPTER {chapter.n}
          <br />
          <span style={{ fontStyle: 'italic', letterSpacing: 1 }}>{chapter.label}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
