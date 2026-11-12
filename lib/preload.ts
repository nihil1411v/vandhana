'use client'

// ============================================================
// ⚡ ASSET PRELOADER
// ------------------------------------------------------------
// Starts the moment the site opens and downloads photos + songs
// while the opening "tap to begin" screen is playing, so scenes
// never wait on the network.
//
//  1. CRITICAL  — gate photo wall, background images, and the first
//                 few songs. The "open it" button waits for these.
//  2. BACKGROUND — every other photo, then the rest of the songs in
//                 story order (the next scenes' songs jump the queue).
//
// Songs are downloaded fully and kept as in-memory blob URLs, so the
// audio element starts instantly instead of streaming on demand.
// ============================================================

type Listener = () => void

export interface PreloadOptions {
  criticalImages: string[]
  otherImages: string[]
  criticalAudio: string[]
  otherAudio: string[]
}

const listeners = new Set<Listener>()
const imageRefs = new Map<string, HTMLImageElement>() // keep decoded images alive
const audioBlobs = new Map<string, string>() // src -> blob: URL
const finished = new Set<string>() // downloaded or failed (never retried)

let criticalKeys = new Set<string>()
let started = false
let audioQueue: string[] = []
let audioWorkers = 0
const AUDIO_CONCURRENCY = 2

function emit() {
  listeners.forEach(fn => fn())
}

export function subscribePreload(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function getCriticalProgress() {
  let done = 0
  criticalKeys.forEach(k => {
    if (finished.has(k)) done++
  })
  const total = criticalKeys.size
  return { done, total, ready: started && total > 0 && done >= total }
}

/** The src to give an <audio> element: the in-memory copy when we have it. */
export function getCachedAudioSrc(src: string) {
  return audioBlobs.get(src) ?? src
}

/** Move these songs to the front of the download queue (used for upcoming scenes). */
export function bumpAudio(srcs: string[]) {
  const wanted = srcs.filter(s => !finished.has(s))
  if (!wanted.length) return
  audioQueue = [...wanted, ...audioQueue.filter(s => !wanted.includes(s))]
  pumpAudio()
}

function saveDataOn() {
  try {
    const c = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
    return !!c?.saveData
  } catch {
    return false
  }
}

function loadImage(url: string) {
  return new Promise<void>(resolve => {
    if (finished.has(url)) return resolve()
    const img = new Image()
    img.decoding = 'async'
    const finish = () => {
      finished.add(url)
      emit()
      resolve()
    }
    img.onload = () => {
      imageRefs.set(url, img)
      // decode now so the first paint in a scene is instant
      if (typeof img.decode === 'function') img.decode().catch(() => {}).finally(finish)
      else finish()
    }
    img.onerror = finish
    img.src = url
  })
}

async function loadAudio(src: string) {
  if (finished.has(src)) return
  try {
    const res = await fetch(src)
    if (res.ok) {
      const blob = await res.blob()
      audioBlobs.set(src, URL.createObjectURL(blob))
    }
  } catch {
    /* the audio element will just stream it normally */
  }
  finished.add(src)
  emit()
}

async function pool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let i = 0
  const run = async () => {
    while (i < items.length) {
      const item = items[i++]
      await worker(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
}

function pumpAudio() {
  while (audioWorkers < AUDIO_CONCURRENCY && audioQueue.length) {
    const next = audioQueue.shift()!
    if (finished.has(next)) continue
    audioWorkers++
    loadAudio(next).finally(() => {
      audioWorkers--
      pumpAudio()
    })
  }
}

export function startPreload(opts: PreloadOptions) {
  if (started || typeof window === 'undefined') return
  started = true

  const uniq = (a: string[]) => Array.from(new Set(a))
  const critImgs = uniq(opts.criticalImages)
  const critAud = uniq(opts.criticalAudio)
  criticalKeys = new Set([...critImgs, ...critAud])
  const otherImgs = uniq(opts.otherImages).filter(u => !criticalKeys.has(u))
  const otherAud = uniq(opts.otherAudio).filter(u => !criticalKeys.has(u))
  emit()

  // critical songs first in the queue, then the rest in story order
  // (on Data Saver, only the critical songs + just-in-time bumps are fetched)
  audioQueue = saveDataOn() ? [...critAud] : [...critAud, ...otherAud]
  pumpAudio()

  // images: critical first, then everything else
  pool(critImgs, 8, loadImage).then(() => pool(otherImgs, 4, loadImage))
}
