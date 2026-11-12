'use client'

import PhotoFrame, { ZoomImg } from '@/components/PhotoFrame'

import { focusOf } from '@/lib/photoFocus'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SCRATCH_MESSAGE, SCRATCH_IMAGE } from '@/lib/config'
import { markScratchRevealed } from '@/lib/db'
import { playSparkle } from '@/lib/sound'
import Flourish from '@/components/Flourish'

interface Props {
  onComplete: () => void
}

export default function ScratchCardScene({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const scratchingRef = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const notifiedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, '#c4306b')
      grad.addColorStop(0.5, '#d4956b')
      grad.addColorStop(1, '#a8703a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = '600 13px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()
    checkProgress()
  }

  const checkProgress = () => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = canvas
    if (width === 0 || height === 0) return
    // Sample a coarse grid instead of every pixel, for performance.
    const step = 8
    let cleared = 0
    let total = 0
    const data = ctx.getImageData(0, 0, width, height).data
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        total++
        const idx = (y * width + x) * 4 + 3 // alpha channel
        if (data[idx] < 40) cleared++
      }
    }
    if (total > 0 && cleared / total > 0.45) {
      setRevealed(true)
      if (!notifiedRef.current) {
        notifiedRef.current = true
        markScratchRevealed()
        playSparkle()
      }
    }
  }

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    scratchingRef.current = true
    const { x, y } = getPos(e)
    scratchAt(x, y)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scratchingRef.current) return
    const { x, y } = getPos(e)
    scratchAt(x, y)
  }
  const onPointerUp = () => {
    scratchingRef.current = false
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        scratch to reveal
      </p>
      <Flourish />

      <div
        ref={wrapRef}
        className="relative rounded-sm overflow-hidden"
        style={{
          width: 'min(85vw, 320px)',
          height: 300,
          border: '1px solid #3a0a20',
          background: 'linear-gradient(165deg, #fffdfb 0%, #fff6f0 45%, #fdeee3 100%)',
        }}
      >
        {/* Hidden content underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          {SCRATCH_IMAGE ? (
            // eslint-disable-next-line @next/next/no-img-element
            <PhotoFrame file={SCRATCH_IMAGE} width={118} height={146} rotate={-3} border={5} />
          ) : null}
          <p
            className="font-cormorant italic"
            style={{ fontSize: 15, color: '#6b2c42', lineHeight: 1.6 }}
          >
            {SCRATCH_MESSAGE}
          </p>
        </div>

        {/* Scratchable canvas overlay */}
        <AnimatePresence>
          {!revealed && (
            <motion.canvas
              ref={canvasRef}
              className="absolute inset-0 touch-none cursor-pointer"
              style={{ width: '100%', height: '100%' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="font-cinzel text-[9px] tracking-[8px] uppercase" style={{ color: '#a8305a' }}>
        {revealed ? 'there it is' : ''}
      </p>

      <button
        className="btn-romantic"
        onClick={onComplete}
        style={{ opacity: revealed ? 1 : 0.35, pointerEvents: revealed ? 'auto' : 'none' }}
      >
        continue
      </button>
    </motion.div>
  )
}
