'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SECRET_HEART_MESSAGES } from '@/lib/config'
import { playSparkle } from '@/lib/sound'

const STORAGE_KEY = 'love_secret_heart_found'
const IDLE_MS = 25000
const MAX_TAPS = 3 // after this many taps the message tucks itself away
const AUTO_CLOSE_MS = 6500 // …or when she stops tapping

export default function SecretHeart() {
  const [found, setFound] = useState(false)
  const [open, setOpen] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [showIdleHint, setShowIdleHint] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintShownRef = useRef(false)
  const tapsRef = useRef(0)
  const [tapCount, setTapCount] = useState(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closeMessage = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    tapsRef.current = 0
    setTapCount(0)
    setOpen(false)
  }
  const armAutoClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(closeMessage, AUTO_CLOSE_MS)
  }
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setFound(true)
    } catch {
      // ignore
    }
  }, [])

  // A gentle, one-time nudge if she's idle for a while and hasn't found it yet —
  // never required, never repeated, never intrusive.
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (hintShownRef.current || found) return
      idleTimer.current = setTimeout(() => {
        if (!hintShownRef.current && !found) {
          hintShownRef.current = true
          setShowIdleHint(true)
          setTimeout(() => setShowIdleHint(false), 4000)
        }
      }, IDLE_MS)
    }
    resetIdle()
    window.addEventListener('pointermove', resetIdle, { passive: true })
    window.addEventListener('keydown', resetIdle)
    window.addEventListener('touchstart', resetIdle, { passive: true })
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      window.removeEventListener('pointermove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      window.removeEventListener('touchstart', resetIdle)
    }
  }, [found])

  const tap = () => {
    setShowIdleHint(false)
    if (!found) {
      setFound(true)
      playSparkle()
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // ignore
      }
      tapsRef.current = 1
      setTapCount(1)
      setOpen(true)
      armAutoClose()
      return
    }
    // Already found — taps step through a few messages, then it tucks away.
    if (open) {
      tapsRef.current += 1
      setTapCount(tapsRef.current)
      if (tapsRef.current > MAX_TAPS) {
        closeMessage()
        return
      }
      setMsgIndex(i => (i + 1) % SECRET_HEART_MESSAGES.length)
      armAutoClose()
    } else {
      tapsRef.current = 1
      setTapCount(1)
      setOpen(true)
      armAutoClose()
    }
  }

  return (
    <div className="fixed z-50" style={{ bottom: 16, left: 16 }}>
      <AnimatePresence>
        {showIdleHint && !open && (
          <motion.p
            className="absolute bottom-full mb-2 left-0 font-cormorant italic whitespace-nowrap"
            style={{ fontSize: 12, color: 'rgba(139,48,88,0.7)' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            psst, down here... ♡
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full mb-3 left-0 px-4 py-3 rounded-lg cursor-pointer"
            style={{
              width: 220,
              background: 'linear-gradient(160deg, #1a0a12 0%, #100609 100%)',
              border: '1px solid rgba(196,48,107,0.25)',
              boxShadow: '0 10px 30px rgba(139,20,60,0.25)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={tap}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                className="font-cormorant italic"
                style={{ fontSize: 13, color: '#ffd7e6', lineHeight: 1.6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {SECRET_HEART_MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>
            <p
              className="font-cinzel text-[7px] tracking-[3px] uppercase mt-2"
              style={{ color: 'rgba(255,214,229,0.4)' }}
            >
              {SECRET_HEART_MESSAGES.length > 1 && tapCount < MAX_TAPS ? 'tap again for more' : 'tap to tuck away'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={tap}
        aria-label="A little secret"
        className="flex items-center justify-center rounded-full"
        style={{
          width: 34,
          height: 34,
          background: 'rgba(20,5,10,0.5)',
          border: '1px solid rgba(196,48,107,0.3)',
          backdropFilter: 'blur(4px)',
          color: found ? '#ff6fa5' : 'rgba(255,111,165,0.55)',
          fontSize: 14,
        }}
        animate={{ scale: showIdleHint ? [1, 1.25, 1] : [1, 1.12, 1] }}
        transition={{ duration: showIdleHint ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {found ? '♥' : '♡'}
      </motion.button>
    </div>
  )
}
