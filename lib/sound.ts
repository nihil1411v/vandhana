'use client'

// ============================================================
// 🔊 SOUND ENGINE
// ------------------------------------------------------------
// The site's ambience is now handled by the generative music
// engine in lib/music.ts. This file keeps only the one accent
// sound that stays (the balloon pop) plus the audio-unlock call
// used on the opening tap. The old bell/chime/whoosh accents are
// kept as no-op exports so existing scene components don't need
// to change their imports.
// ============================================================

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
    masterGain = ctx.createGain()
    masterGain.gain.value = 1
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  return ctx
}

/** Called on the very first tap so autoplay restrictions don't block anything later. */
export function unlockAudio() {
  getCtx()
}

/**
 * The one sound kept exactly as-is on request: a bright, quick balloon pop.
 * Everything else on the site is now silent aside from the background music.
 */
export function playPop() {
  const audioCtx = getCtx()
  if (!audioCtx || !masterGain) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(720, audioCtx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(190, audioCtx.currentTime + 0.13)
  gain.gain.setValueAtTime(0.16, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.16)
  osc.connect(gain)
  gain.connect(masterGain)
  osc.start()
  osc.stop(audioCtx.currentTime + 0.18)
}

// ---- Retired accent sounds -------------------------------------------
// Kept as no-ops so existing scene components can still import/call them
// without edits; the background music now carries all of the site's
// emotional ambience instead of one-off accent sounds.
export function playChime() {}
export function playSparkle() {}
export function playBlowWhoosh() {}
export function playPageTurn() {}
export function playHeartSwell() {}
export function playPlayfulTease() {}
export function playPetalTouch() {}
