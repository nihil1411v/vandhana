'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { setQuestionAnswer } from '@/lib/db'
import { HER_NAME } from '@/lib/config'
import HeartPhoto from '@/components/HeartPhoto'
import { notifyBackend } from '@/lib/notify'
import { playHeartSwell, playPlayfulTease } from '@/lib/sound'
import Flourish from '@/components/Flourish'
import CornerHearts from '@/components/CornerHearts'

interface Props {
  onComplete: () => void
  mode?: 'warmup' | 'proposal'
}

const MAX_DODGES = 4
const DODGE_LINES = [
  'Oops 🥺',
  "It's shy too, just like me. Please be patient with it.",
  'One more try… it really doesn\'t want to be pressed 🥹',
  "Alright, I'll stop teasing. Press whatever your heart tells you. I'll understand, always.",
]

type QuestionType = 'input' | 'yesno' | 'special' | 'forever'

interface Question {
  id: string
  label: string
  text: string
  type: QuestionType
  reply?: string
  noReply?: string
}

const QUESTIONS: Question[] = [
  {
    id: 'dream',
    label: 'Question One',
    text: 'Where would your heart love to go someday?',
    type: 'input',
    reply: "That sounds beautiful. I hope life takes you there, someday soon.",
  },
  {
    id: 'food',
    label: 'Question Two',
    text: "What's your favourite food?",
    type: 'input',
    reply: "Noted, with a smile. I hope you get to eat it today, on your birthday.",
  },
  {
    id: 'habit',
    label: 'Question Three',
    text: "What's one small thing that always makes your day better?",
    type: 'input',
    reply: "That's such a lovely answer. I hope life gives you plenty of it.",
  },
  {
    id: 'special',
    label: 'Question Four',
    text: 'Are you ready to see something special?',
    type: 'special',
    noReply: "That's okay. Take all the time you need. I'll be right here.",
  },
  {
    id: 'forever',
    label: 'The Question',
    text: `${HER_NAME.charAt(0).toUpperCase()}${HER_NAME.slice(1)}, can I be your boyfriend?`,
    type: 'forever',
  },
]

export default function QuestionsScene({ onComplete, mode = 'warmup' }: Props) {
  const list = useMemo(
    () => QUESTIONS.filter(q => (mode === 'proposal' ? q.type === 'forever' : q.type !== 'forever')),
    [mode]
  )
  const [qIndex, setQIndex] = useState(0)
  const [phase, setPhase] = useState<'question' | 'reply' | 'transitioning'>('question')
  const [inputVal, setInputVal] = useState('')
  const [noClicks, setNoClicks] = useState(0)
  const [yesLabel, setYesLabel] = useState('YES')
  const [yesScale, setYesScale] = useState(1)
  const [noScale, setNoScale] = useState(1)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [reaction, setReaction] = useState<'sparkle' | 'hearts' | null>(null)
  const [shake, setShake] = useState(false)
  const [ending, setEnding] = useState<null | 'yes' | 'no'>(null)
  const noClicksRef = useRef(0)
  const noRef = useRef<HTMLButtonElement>(null)

  // Refs so keydown handler always sees latest values without re-registering
  const inputValRef = useRef(inputVal)
  const currentRef = useRef(list[qIndex])
  const phaseRef = useRef(phase)

  useEffect(() => { inputValRef.current = inputVal }, [inputVal])
  useEffect(() => { currentRef.current = list[qIndex] }, [qIndex, list])
  useEffect(() => { phaseRef.current = phase }, [phase])

  const current = list[qIndex]

  const advanceQ = useCallback(() => {
    setPhase('transitioning')
    setInputVal('')
    setTimeout(() => {
      setQIndex(prev => {
        const next = prev + 1
        if (next >= list.length) {
          onComplete()
          return prev
        }
        setPhase('question')
        setNoClicks(0)
        noClicksRef.current = 0
        setYesLabel('YES')
        setYesScale(1)
        setNoScale(1)
        setNoPos({ x: 0, y: 0 })
        setReaction(null)
        return next
      })
    }, 1000)
  }, [onComplete])

  const handleInputSubmit = useCallback(() => {
    const val = inputValRef.current
    if (!val.trim()) return
    localStorage.setItem(`love_${currentRef.current.id}`, val)
    setQuestionAnswer(currentRef.current.id as any, val)
    setReaction('sparkle')
    setPhase('reply')
    setTimeout(advanceQ, 2500)
  }, [advanceQ])

  const handleYes = useCallback(() => {
    if (currentRef.current.type === 'special') {
      localStorage.setItem('love_special', 'yes')
      setQuestionAnswer('special', 'yes')
      setReaction('hearts')
      playHeartSwell()
    }
    if (currentRef.current.type === 'forever') {
      setQuestionAnswer('forever', 'yes')
      notifyBackend('finished the questions')
      setReaction('hearts')
      playHeartSwell()
      setEnding('yes')
      setTimeout(onComplete, 5200)
    } else {
      advanceQ()
    }
  }, [advanceQ, onComplete])

  const handleNo = useCallback(() => {
    if (currentRef.current.type === 'special') {
      localStorage.setItem('love_special', 'no')
      setQuestionAnswer('special', 'no')
      setShake(true)
      playPlayfulTease()
      // Let the shake actually play before the card flips to the reply text.
      setTimeout(() => {
        setShake(false)
        setPhase('reply')
        setTimeout(advanceQ, 2500)
      }, 500)
      return
    }

    // One honest tap on No ends the question right away. No dodging, no teasing.
    setQuestionAnswer('forever', 'no')
    notifyBackend('finished the questions')
    setEnding('no')
    setTimeout(onComplete, 4200)
  }, [advanceQ, onComplete])

  // Single stable keydown listener — no re-registration on every keystroke
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentRef.current.type === 'input' && phaseRef.current === 'question') {
        handleInputSubmit()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleInputSubmit])

  return (
    <motion.div
      className="scene flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)', perspective: 1200 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop strength={0.35} />
      {/* Reaction burst overlay */}
      <AnimatePresence>
        {reaction && (
          <ReactionBurst key={`${qIndex}-${reaction}`} kind={reaction} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${qIndex}-${phase}`}
          className="relative flex flex-col items-center gap-8 z-10 px-8 py-10 w-full max-w-md text-center mx-6 rounded-sm"
          style={{
            background: 'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
            border: '1px solid rgba(196,130,80,0.22)',
            boxShadow: '0 20px 50px rgba(139,58,30,0.18)',
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, rotateY: -12, y: 16 }}
          animate={{
            opacity: phase === 'transitioning' ? 0 : 1,
            rotateY: phase === 'transitioning' ? 12 : shake ? [0, -2, 2, -1.5, 1.5, 0] : 0,
            y: phase === 'transitioning' ? -12 : 0,
          }}
          exit={{ opacity: 0, rotateY: 12, y: -16 }}
          transition={{ duration: shake ? 0.5 : 1.2, ease: 'easeInOut' }}
        >
          <CornerHearts />

          {/* Label */}
          <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#a8305a' }}>
            {current.label}
          </p>
      <Flourish />

          {/* Question */}
          <p
            className="font-cormorant italic font-light"
            style={{
              fontSize: 'clamp(22px, 5vw, 38px)',
              color: '#6b2c42',
              lineHeight: 1.6,
            }}
          >
            {current.text}
          </p>

          {/* Decorative line */}
          <div className="w-16 h-px" style={{ background: 'rgba(139,58,30,0.25)' }} />

          {/* Controls */}
          {phase === 'question' && !ending && (
            <>
              {current.type === 'input' && (
                <div className="w-full flex flex-col items-center gap-6">
                  <input
                    className="input-romantic w-full"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="write here…"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleInputSubmit()}
                  />
                  <button className="btn-romantic" onClick={handleInputSubmit}>
                    →
                  </button>
                </div>
              )}

              {current.type === 'special' && (
                <div className="flex gap-4 flex-wrap justify-center">
                  <button className="btn-yes" onClick={handleYes}>YES</button>
                  <button className="btn-no" onClick={handleNo}>NO</button>
                </div>
              )}

              {current.type === 'forever' && (
                <ForeverButtons
                  yesLabel={yesLabel}
                  yesScale={yesScale}
                  noScale={noScale}
                  noPos={noPos}
                  onYes={handleYes}
                  onNo={handleNo}
                  noClicks={noClicks}
                />
              )}
            </>
          )}

          {/* Reply */}
          {phase === 'reply' && current.reply && (
            <motion.p
              className="font-cormorant italic"
              style={{
                fontSize: 'clamp(18px, 3.5vw, 26px)',
                color: '#ff6fa5',
                lineHeight: 1.8,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              {phase === 'reply' && (current.reply || current.noReply)}
            </motion.p>
          )}
          {phase === 'reply' && !current.reply && current.noReply && (
            <motion.p
              className="font-cormorant italic"
              style={{
                fontSize: 'clamp(18px, 3.5vw, 26px)',
                color: '#ff6fa5',
                lineHeight: 1.8,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              {current.noReply}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {ending && <ProposalEnding kind={ending} />}
      </AnimatePresence>
    </motion.div>
  )
}

function ReactionBurst({ kind }: { kind: 'sparkle' | 'hearts' }) {
  const glyph = kind === 'hearts' ? '♡' : '✦'
  const color = kind === 'hearts' ? '#ff6fa5' : '#ffe066'
  const count = kind === 'hearts' ? 16 : 12

  const particles = Array.from({ length: count }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3
    const dist = 70 + Math.random() * 60
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, delay: Math.random() * 0.15 }
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ fontSize: kind === 'hearts' ? 16 : 12, color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
        >
          {glyph}
        </motion.span>
      ))}
    </div>
  )
}

function ForeverButtons({
  yesLabel,
  yesScale,
  noScale,
  noPos,
  onYes,
  onNo,
  noClicks,
}: {
  yesLabel: string
  yesScale: number
  noScale: number
  noPos: { x: number; y: number }
  onYes: () => void
  onNo: () => void
  noClicks: number
}) {
  return (
    <div className="flex items-center gap-6 flex-wrap justify-center" style={{ minHeight: 80 }}>
      <button className="btn-yes" onClick={onYes} style={{ whiteSpace: 'nowrap' }}>
        {yesLabel}
      </button>

      <button className="btn-no" onClick={onNo}>
        NO
      </button>
      {noClicks > 0 && (
        <motion.p
          key={noClicks}
          className="font-cormorant italic w-full text-center"
          style={{ fontSize: 15, color: '#a8305a', marginTop: 6 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {DODGE_LINES[Math.min(noClicks, DODGE_LINES.length) - 1]}
        </motion.p>
      )}
    </div>
  )
}

const BURST = Array.from({ length: 34 }).map((_, i) => {
  const a = (i / 34) * Math.PI * 2 + (i % 3) * 0.2
  const r = 140 + ((i * 59) % 190)
  return { dx: Math.round(Math.cos(a) * r), dy: Math.round(Math.sin(a) * r * 0.9), size: 12 + ((i * 7) % 16), glyph: i % 4 === 0 ? '✦' : '♥', delay: (i % 8) * 0.05 }
})

function ProposalEnding({ kind }: { kind: 'yes' | 'no' }) {
  const name = HER_NAME.charAt(0).toUpperCase() + HER_NAME.slice(1)
  const yes = kind === 'yes'
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center text-center px-8"
      style={{
        background: yes
          ? 'radial-gradient(ellipse at 50% 42%, #7a1c45 0%, #3a0c24 55%, #14040d 100%)'
          : 'radial-gradient(ellipse at 50% 40%, #fff6f0 0%, #ffe3ec 60%, #f6cddb 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1 }}
    >
      {yes &&
        BURST.map((b, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ top: '40%', left: '50%', fontSize: b.size, color: i % 4 === 0 ? '#ffe3a8' : '#ff8fb8', filter: 'drop-shadow(0 0 8px rgba(255,111,165,0.9))' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
            animate={{ x: b.dx, y: b.dy, opacity: [0, 1, 0], scale: [0.3, 1.2, 0.8] }}
            transition={{ duration: 2.4, delay: 0.3 + b.delay, ease: 'easeOut', repeat: 1, repeatDelay: 0.6 }}
          >
            {b.glyph}
          </motion.span>
        ))}
      {yes && (
        <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.3 }}>
          <HeartPhoto file="us-watercolor.jpg" width={230} />
        </motion.div>
      )}
      <motion.p
        className="font-script"
        style={{ fontSize: 'clamp(34px, 8vw, 58px)', marginTop: yes ? 26 : 0, lineHeight: 1.15, color: yes ? '#ffe3ee' : '#a8305a', textShadow: yes ? '0 0 26px rgba(255,111,165,0.7)' : 'none' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: yes ? 1.1 : 0.4, duration: 1.2 }}
      >
        {yes ? `Thank you, ${name}.` : `Thank you for being honest, ${name}.`}
      </motion.p>
      <motion.p
        className="font-cormorant italic"
        style={{ fontSize: 'clamp(17px, 4vw, 22px)', marginTop: 14, maxWidth: 420, lineHeight: 1.7, color: yes ? '#ffd7e6' : '#6b2c42' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: yes ? 2 : 1.2, duration: 1.2 }}
      >
        {yes
          ? "You've just made me the happiest person alive. I'll try, every single day, to deserve that smile."
          : "That means more to me than you know. Happy birthday. I hope today is full of everything that makes you smile."}
      </motion.p>
    </motion.div>
  )
}
