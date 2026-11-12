'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UNLOCK_AT, PASSCODE } from '@/lib/config'

interface Props {
  children: React.ReactNode
}

export default function DateLockGate({ children }: Props) {
  const [now, setNow] = useState(() => new Date())
  const [passInput, setPassInput] = useState('')
  const [passOk, setPassOk] = useState(PASSCODE === '')

  useEffect(() => {
    if (!UNLOCK_AT) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const dateLocked = !!UNLOCK_AT && now.getTime() < UNLOCK_AT.getTime()
  const passLocked = !passOk

  if (!dateLocked && !passLocked) {
    return <>{children}</>
  }

  return (
    <div
      className="w-screen h-dvh flex flex-col items-center justify-center gap-8 px-6"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
    >
      <motion.div
        className="text-center flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
          not yet
        </p>

        {dateLocked && UNLOCK_AT && (
          <>
            <p
              className="font-cormorant italic font-light"
              style={{ fontSize: 'clamp(20px, 4.5vw, 30px)', color: '#6b2c42' }}
            >
              Something sweet is waiting for its perfect moment.
            </p>
            <Countdown target={UNLOCK_AT} now={now} />
          </>
        )}

        {!dateLocked && passLocked && (
          <>
            <p
              className="font-cormorant italic font-light"
              style={{ fontSize: 'clamp(20px, 4.5vw, 30px)', color: '#6b2c42' }}
            >
              Enter the passcode to continue.
            </p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="password"
                className="input-romantic"
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setPassOk(passInput === PASSCODE)}
                placeholder="passcode"
                autoFocus
              />
              <button className="btn-romantic" onClick={() => setPassOk(passInput === PASSCODE)}>
                enter
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function Countdown({ target, now }: { target: Date; now: Date }) {
  const diff = Math.max(0, target.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  return (
    <div className="flex gap-6 font-cinzel" style={{ color: '#c4306b' }}>
      <Unit value={days} label="days" />
      <Unit value={hours} label="hrs" />
      <Unit value={mins} label="min" />
      <Unit value={secs} label="sec" />
    </div>
  )
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span style={{ fontSize: 28 }}>{String(value).padStart(2, '0')}</span>
      <span className="text-[8px] tracking-[4px] uppercase mt-1" style={{ color: '#a8305a' }}>
        {label}
      </span>
    </div>
  )
}
