'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FIREWORKS_MESSAGE } from '@/lib/config'
import { markFireworksWatched } from '@/lib/db'

interface Props {
  onComplete: () => void
}

interface RGB {
  r: number
  g: number
  b: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rgb: RGB
  alpha: number
  decay: number
  size: number
  isRocket?: boolean
  targetY?: number
  burstPalette?: RGB[]
  isHeart?: boolean
  trail?: { x: number; y: number }[]
}

const PALETTES: RGB[][] = [
  [{ r: 255, g: 92, b: 138 }, { r: 255, g: 209, b: 102 }, { r: 255, g: 255, b: 255 }],
  [{ r: 196, g: 30, b: 58 }, { r: 255, g: 159, b: 192 }, { r: 255, g: 232, b: 163 }],
  [{ r: 139, g: 92, b: 246 }, { r: 255, g: 143, b: 216 }, { r: 255, g: 255, b: 255 }],
  [{ r: 255, g: 176, b: 46 }, { r: 255, g: 92, b: 138 }, { r: 255, g: 243, b: 176 }],
  [{ r: 92, g: 225, b: 230 }, { r: 255, g: 159, b: 192 }, { r: 255, g: 255, b: 255 }],
]

const MAX_PARTICLES = 260

function randRange(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function heartDir(t: number): { x: number; y: number } {
  // Classic parametric heart curve, normalized to a unit-ish direction vector.
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  const len = Math.hypot(x, y) || 1
  return { x: x / len, y: y / len }
}

export default function FireworksScene({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const lastLaunchRef = useRef(0)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    markFireworksWatched()
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 1600)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // Cap device pixel ratio — an uncapped DPR on a 3x phone screen makes the
    // full-canvas fade-fill (done every frame) several times more expensive
    // than it needs to be. This was the main cause of the stutter.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Paint the base night sky once — we fade toward this, not toward black,
    // so trails read as smoke against a deep sky rather than a flat void.
    const bg = { r: 8, g: 3, b: 12 }

    const launchRocket = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (particlesRef.current.length > MAX_PARTICLES * 0.6) return // back off if busy
      const startX = randRange(w * 0.15, w * 0.85)
      const targetY = randRange(h * 0.15, h * 0.5)
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      particlesRef.current.push({
        x: startX,
        y: h + 10,
        vx: randRange(-0.3, 0.3),
        vy: -randRange(6.5, 9),
        rgb: palette[0],
        alpha: 1,
        decay: 0,
        size: 2.2,
        isRocket: true,
        targetY,
        burstPalette: palette,
        trail: [],
      })
    }

    const explode = (x: number, y: number, palette: RGB[]) => {
      const isHeart = Math.random() < 0.35
      const count = isHeart ? 40 : 30
      for (let i = 0; i < count; i++) {
        let dx: number
        let dy: number
        if (isHeart) {
          const t = (Math.PI * 2 * i) / count
          const d = heartDir(t)
          dx = d.x
          dy = d.y
        } else {
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.15
          dx = Math.cos(angle)
          dy = Math.sin(angle)
        }
        const speed = isHeart ? randRange(2.4, 3.4) : randRange(1.6, 5)
        particlesRef.current.push({
          x,
          y,
          vx: dx * speed,
          vy: dy * speed,
          rgb: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          decay: randRange(0.014, 0.026),
          size: randRange(1.4, 2.4),
          isHeart,
        })
      }
      // A handful of lingering glitter sparks
      const glitterCount = 10
      for (let i = 0; i < glitterCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = randRange(0.4, 1.4)
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rgb: { r: 255, g: 255, b: 255 },
          alpha: 1,
          decay: randRange(0.008, 0.016),
          size: randRange(0.8, 1.4),
        })
      }
    }

    const tick = (time: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // Fade toward the night-sky color instead of clearing — gives soft trails
      // without needing per-particle shadow blur (which is the expensive part).
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, 0.28)`
      ctx.fillRect(0, 0, w, h)

      if (time - lastLaunchRef.current > randRange(850, 1500)) {
        lastLaunchRef.current = time
        launchRocket()
      }

      const gravity = 0.045
      const next: Particle[] = []

      for (const p of particlesRef.current) {
        if (p.isRocket && p.trail) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 5) p.trail.shift()
        }

        p.x += p.vx
        p.y += p.vy
        p.vy += p.isRocket ? gravity * 0.4 : gravity
        p.vx *= 0.99
        p.vy *= 0.995

        if (p.isRocket) {
          if (p.vy >= -0.5 || p.y <= (p.targetY ?? 0)) {
            explode(p.x, p.y, p.burstPalette ?? PALETTES[0])
            continue
          }
        } else {
          p.alpha -= p.decay
        }

        if (p.alpha > 0.03 && p.y < h + 30) {
          next.push(p)
        }
      }
      // Hard cap as a safety net so a slow device never accumulates forever
      particlesRef.current = next.length > MAX_PARTICLES ? next.slice(next.length - MAX_PARTICLES) : next

      // Additive blending gives a natural glow with zero extra draw calls —
      // this replaces the old per-particle shadowBlur, which was the single
      // biggest cost on the previous version.
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particlesRef.current) {
        if (p.isRocket && p.trail) {
          for (let i = 0; i < p.trail.length; i++) {
            const t = p.trail[i]
            const a = (i / p.trail.length) * 0.4
            ctx.fillStyle = `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, ${a})`
            ctx.beginPath()
            ctx.arc(t.x, t.y, p.size * 0.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.fillStyle = `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, ${Math.max(0, p.alpha)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      clearTimeout(textTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      particlesRef.current = []
    }
  }, [])

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-10"
      style={{ background: '#08030c' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop tone="dark" strength={0.6} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {showText && (
        <motion.h2
          className="font-cormorant italic font-light text-center z-10 text-gradient-romantic"
          style={{ fontSize: 'clamp(28px, 7vw, 48px)', lineHeight: 1.3 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          {FIREWORKS_MESSAGE}
        </motion.h2>
      )}

      {showText && (
        <motion.button
          className="btn-romantic z-10"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          continue
        </motion.button>
      )}
    </motion.div>
  )
}
