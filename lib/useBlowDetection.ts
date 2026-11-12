'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Listens to the mic and calls onBlow() once a blow-like sound is detected.
 * Always provides a manualTrigger() fallback for denied permissions, no mic,
 * or just someone who'd rather tap.
 */
export function useBlowDetection(onBlow: () => void, enabled: boolean = true) {
  const [listening, setListening] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    ctxRef.current?.close().catch(() => {})
  }

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        ctxRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        setListening(true)

        const tick = () => {
          if (doneRef.current) return
          analyser.getByteFrequencyData(data)
          const avg = data.reduce((a, b) => a + b, 0) / data.length
          if (avg > 42) {
            doneRef.current = true
            cleanup()
            onBlow()
            return
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        setPermissionDenied(true)
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  const manualTrigger = () => {
    if (doneRef.current) return
    doneRef.current = true
    cleanup()
    onBlow()
  }

  return { listening, permissionDenied, manualTrigger }
}
