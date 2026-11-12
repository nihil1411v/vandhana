'use client'

import { getCachedAudioSrc, bumpAudio } from '@/lib/preload'

export type TrackId =
  | 'helloViolin'
  | 'snehithane'
  | 'munbe'
  | 'vizhiVeekura'
  | 'ennaSolla'
  | 'aedho'
  | 'idhazhin'
  | 'ohPenne'
  | 'beautifulClip'
  | 'enKadhalSolla'
  | 'yaarIndha'
  | 'yaaroNenjai'
  | 'oruDevathai'
  | 'neePartha'
  | 'birthdayWish'
  | 'happyBirthday'
  | 'kadhaippoma'
  | 'unVizhigalil'
  | 'lifeOfRam'
  | 'pachai'
  | 'maruvaarthai'
  | 'vaan'
  | 'anbil'
  | 'birthdayWishLove'
  | 'kaathalae'
  | 'ennodu'

export type MusicMood =
  | 'dream'
  | 'anticipation'
  | 'conversation'
  | 'courtship'
  | 'joy'
  | 'tender'
  | 'nostalgic'
  | 'night'
  | 'confession'
  | 'admiration'
  | 'peaceful'
  | 'wish'
  | 'commitment'
  | 'celebration'
  | 'silence'

export interface SceneMusic {
  track: TrackId | null
  volume: number
  fadeSeconds: number
  mood: MusicMood
  title: string
  whisper: string
  startOnCue?: boolean
}

export interface MusicSnapshot {
  playing: boolean
  muted: boolean
  volume: number
  track: TrackId | null
  title: string
  whisper: string
  mood: MusicMood
}

const TRACKS: Record<TrackId, { src: string; title: string }> = {
  helloViolin: { src: '/music/hello-violin.mp3', title: 'Hello (violin BGM)' },
  snehithane: { src: '/music/snehithane-esraj-cover.mp3', title: 'Snehithane (esraj cover)' },
  munbe: { src: '/music/munbe-vaa.m4a', title: 'Munbe Vaa' },
  vizhiVeekura: { src: '/music/vizhi-veekura.m4a', title: 'Vizhi Veekura' },
  ennaSolla: { src: '/music/enna-solla.m4a', title: 'Enna Solla' },
  aedho: { src: '/music/aedho-saigirai.m4a', title: 'Aedho Saigirai' },
  idhazhin: { src: '/music/idhazhin-oram.m4a', title: 'Idhazhin Oram' },
  ohPenne: { src: '/music/oh-penne.m4a', title: 'Oh Penne' },
  beautifulClip: { src: '/music/beautiful-clip.m4a', title: 'Beautiful — short clip' },
  enKadhalSolla: { src: '/music/en-kadhal-solla.m4a', title: 'En Kadhal Solla' },
  yaarIndha: { src: '/music/yaar-indha-saalai-oram.m4a', title: 'Yaar Indha Saalai Oram' },
  yaaroNenjai: { src: '/music/yaaro-en-nenjai.m4a', title: 'Yaaro En Nenjai Theendiyathu' },
  oruDevathai: { src: '/music/oru-devathai.m4a', title: 'Oru Devathai' },
  neePartha: { src: '/music/nee-partha-vizhigal.m4a', title: 'Nee Partha Vizhigal' },
  birthdayWish: { src: '/music/birthday-wish-bgm.m4a', title: 'Birthday Wish — love BGM' },
  happyBirthday: { src: '/music/happy-birthday-bgm.m4a', title: 'Happy Birthday — BGM' },
  kadhaippoma: { src: '/music/kadhaippoma.m4a', title: 'Kadhaippoma' },
  unVizhigalil: { src: '/music/un-vizhigalil.m4a', title: 'Un Vizhigalil' },
  lifeOfRam: { src: '/music/life-of-ram-instrumental.mp3', title: 'The Life of Ram — flute instrumental' },
  pachai: { src: '/music/pachai-kiligal.mp3', title: 'Pachai Kiligal' },
  maruvaarthai: { src: '/music/maruvaarthai.m4a', title: 'Maruvaarthai' },
  vaan: { src: '/music/vaan-varuvaan.mp3', title: 'Vaan Varuvaan' },
  anbil: { src: '/music/anbil-avan.mp3', title: 'Anbil Avan' },
  birthdayWishLove: { src: '/music/birthday-wish-love-bgm.m4a', title: 'Birthday Wish 🤍 Love BGM' },
  kaathalae: { src: '/music/kaathalae-kaathalae.m4a', title: 'Kaathalae Kaathalae' },
  ennodu: { src: '/music/ennodu-nee-irundhaal.m4a', title: 'Ennodu Nee Irundhaal' },
}

// Soundtrack philosophy:
// - Every chapter gets a distinct track/clip so the story keeps moving musically.
// - The uploaded Azhagiye track is intentionally removed from the soundtrack.
// - The site uses original captions inspired by each song's emotional meaning;
//   it does not display copyrighted song lyrics.
// - Very short birthday/status clips are used only in moments where a short burst
//   of music is intentional. Tracks never loop.
const SCENE_MUSIC: Record<string, SceneMusic> = {
  // CH 01 — The beginning — an invitation toward love.
  splash: {
    track: 'munbe', volume: 0.16, fadeSeconds: 4.8, mood: 'dream',
    title: 'Munbe Vaa',
    whisper: 'before the story had a name, there was already a quiet feeling asking you to come a little closer.',
  },

  // CH 02 — Wake up — playful attraction and getting pulled into a new feeling.
  hero: {
    track: 'vizhiVeekura', volume: 0.16, fadeSeconds: 3.2, mood: 'courtship',
    title: 'Vizhi Veekura',
    whisper: 'some people change the rhythm of an ordinary day just by looking at you.',
  },

  // CH 03 — A little conversation — new love struggling to become words.
  heart: {
    track: 'ennaSolla', volume: 0.17, fadeSeconds: 2.8, mood: 'conversation',
    title: 'Enna Solla',
    whisper: 'sometimes the eyes understand what the heart is still too shy to say.',
  },

  // CH 04 — Getting closer — emotional awakening and the feeling that someone is changing you.
  reveal: {
    track: 'aedho', volume: 0.17, fadeSeconds: 2.6, mood: 'anticipation',
    title: 'Aedho Saigirai',
    whisper: 'without trying, you made ordinary moments feel completely different.',
  },

  // CH 05 — Our moments — a bright, direct declaration of affection.
  swipe: {
    track: 'idhazhin', volume: 0.17, fadeSeconds: 2.5, mood: 'joy',
    title: 'Idhazhin Oram',
    whisper: 'there are moments when affection stops hiding and simply becomes happiness.',
  },

  // CH 06 — A little something — longing for nearness and shared time.
  giftbox: {
    track: 'ohPenne', volume: 0.15, fadeSeconds: 3.2, mood: 'tender',
    title: 'Oh Penne',
    whisper: 'the nicest gift is not a thing — it is the wish to stay close and share more ordinary days.',
  },

  // CH 07 — Surprise — short uploaded status clip used only as a tiny musical sparkle.
  scratchcard: {
    track: 'beautifulClip', volume: 0.14, fadeSeconds: 1.6, mood: 'joy',
    title: 'Beautiful — little sparkle',
    whisper: 'just a tiny sparkle before the next page opens.',
  },

  // CH 08 — Our story so far — love that is difficult to put into words.
  timeline: {
    track: 'enKadhalSolla', volume: 0.15, fadeSeconds: 3.4, mood: 'nostalgic',
    title: 'En Kadhal Solla',
    whisper: 'some feelings grow quietly until even the silence starts sounding like a confession.',
  },

  // CH 09 — Our little universe — glances, silence, and the thrill of a new connection.
  constellation: {
    track: 'yaarIndha', volume: 0.16, fadeSeconds: 3.8, mood: 'night',
    title: 'Yaar Indha Saalai Oram',
    whisper: 'sometimes two people say everything without saying anything at all.',
  },

  // CH 10 — A stack of us — seeing the beloved in everything.
  photostack: {
    track: 'yaaroNenjai', volume: 0.14, fadeSeconds: 3.0, mood: 'admiration',
    title: 'Yaaro En Nenjai Theendiyathu',
    whisper: 'once someone reaches the heart, little details start reminding you of them everywhere.',
  },

  // CH 11 — Who you've become — awe, enchantment, and the feeling of being changed by a person.
  agemilestone: {
    track: 'oruDevathai', volume: 0.15, fadeSeconds: 3.6, mood: 'admiration',
    title: 'Oru Devathai',
    whisper: 'there are people who make time feel strange — even a normal moment can suddenly feel unreal.',
  },

  // CH 12 — For you — remembering meaningful moments with a soft, yearning tone.
  birthdaycard: {
    track: 'neePartha', volume: 0.14, fadeSeconds: 3.6, mood: 'nostalgic',
    title: 'Nee Partha Vizhigal',
    whisper: 'sometimes one look becomes a memory you keep returning to long after the moment is gone.',
  },

  // CH 13 — What I couldn't say out loud — direct presence and devotion.
  letter: {
    track: 'ennodu', volume: 0.14, fadeSeconds: 4.2, mood: 'confession',
    title: 'Ennodu Nee Irundhaal',
    whisper: 'the heart keeps coming back to one simple thought: having you beside me would already mean so much.',
  },

  // CH 14 — Pop them all — a short birthday burst, then the retained balloon-pop interaction.
  balloonpop: {
    track: 'birthdayWish', volume: 0.13, fadeSeconds: 0.8, mood: 'celebration',
    title: 'Birthday Wish — little BGM',
    whisper: '',
  },

  // CH 15 — Make a wish — a second short birthday clip, used only during the cake action.
  cake: {
    track: 'happyBirthday', volume: 0.13, fadeSeconds: 0.8, mood: 'celebration',
    title: 'Happy Birthday — little BGM',
    whisper: 'this part can stay simple: one candle, one wish, one moment worth remembering.',
    startOnCue: false,
  },

  // CH 16 — Just a few questions — conversation belongs here.
  questions: {
    track: 'kadhaippoma', volume: 0.14, fadeSeconds: 2.8, mood: 'conversation',
    title: 'Kadhaippoma',
    whisper: 'some of the best closeness is simply having one more thing to talk about.',
  },

  // CH 17 — Why I love you — being captivated by the beloved's eyes and presence.
  reasons: {
    track: 'unVizhigalil', volume: 0.14, fadeSeconds: 3.5, mood: 'admiration',
    title: 'Un Vizhigalil',
    whisper: 'sometimes the heart does not need a grand reason; being close can already feel like enough.',
  },

  // CH 18 — Our little museum — spacious reflection and memory.
  museum: {
    track: 'lifeOfRam', volume: 0.09, fadeSeconds: 5.2, mood: 'peaceful',
    title: 'The Life of Ram — flute instrumental',
    whisper: 'walk slowly through the memories; some moments become more precious the longer you keep them.',
  },

  // CH 19 — Things you don't know about yourself — simple happiness and warmth.
  observations: {
    track: 'pachai', volume: 0.10, fadeSeconds: 2.6, mood: 'joy',
    title: 'Pachai Kiligal',
    whisper: 'a gentle reminder that happiness can live in the smallest, simplest details.',
  },

  // CH 20 — 100 tiny things — anticipation of all the little moments still ahead.
  tinythings: {
    track: 'vaan', volume: 0.11, fadeSeconds: 3.4, mood: 'anticipation',
    title: 'Vaan Varuvaan',
    whisper: 'the sweetest part of a story is knowing there are still many little moments waiting ahead.',
  },

  // CH 21 — Just breathe — quiet longing and staying with what matters.
  oneminute: {
    track: 'helloViolin', volume: 0.16, fadeSeconds: 1.4, mood: 'peaceful',
    title: 'Hello (violin BGM)',
    whisper: 'just breathe for a minute. I hope something here makes you smile.',
  },

  // CH 22 — One thing — partnership, endurance, and choosing to face life together.
  onething: {
    track: 'anbil', volume: 0.12, fadeSeconds: 4.0, mood: 'commitment',
    title: 'Anbil Avan',
    whisper: 'the meaningful promise is not perfection; it is choosing to walk through every kind of day together.',
  },

  // CH 23 — The reel — a slow, tender photo montage; the music carries the feeling.
  reel: {
    track: 'oruDevathai', volume: 0.14, fadeSeconds: 3.6, mood: 'tender',
    title: 'Oru Devathai',
    whisper: 'every frame is just a way of saying: I see you, and I always have.',
  },

  // CH 24 — Birthday fireworks — use the exact uploaded love-birthday BGM.
  fireworks: {
    track: 'birthdayWishLove', volume: 0.13, fadeSeconds: 1.4, mood: 'celebration',
    title: 'Birthday Wish 🤍 Love BGM',
    whisper: 'no big speech here — just a little burst of love for the person this whole story was made for.',
  },

  // CH 25 — The proposal: En Kadhal Solla ("to tell my love") — this is the question the whole story was building toward.
  proposal: {
    track: 'enKadhalSolla', volume: 0.14, fadeSeconds: 1.4, mood: 'confession',
    title: 'En Kadhal Solla',
    whisper: 'this is the part I was most nervous about.',
  },

  // CH 26 — Everything I haven't said — full-circle romantic wholeness.
  final: {
    track: 'kaathalae', volume: 0.10, fadeSeconds: 6.0, mood: 'confession',
    title: 'Kaathalae Kaathalae',
    whisper: 'after every memory and every almost-said feeling, the story settles into one quiet truth: love changed the way everything looks.',
  },

  // EPILOGUE — no extra track is introduced after the main soundtrack.
  reply: {
    track: 'snehithane', volume: 0.18, fadeSeconds: 1.4, mood: 'confession',
    title: 'your turn',
    whisper: 'take your time. there is no hurry at all.',
    startOnCue: true,
  },
  keepsake: {
    track: 'snehithane', volume: 0.18, fadeSeconds: 1.4, mood: 'confession',
    title: 'keep this forever',
    whisper: 'something to keep, whatever you decide.',
  },
  returnloop: {
    track: 'snehithane', volume: 0.18, fadeSeconds: 1.4, mood: 'confession',
    title: 'before you go',
    whisper: 'thank you for staying till the end.',
  },
}

const VOL_KEY = 'love-story-music-volume'
const MUTE_KEY = 'love-story-music-muted'

let audioPair: [HTMLAudioElement, HTMLAudioElement] | null = null
let activeIndex = 0
let activeTrack: TrackId | null = null
let running = false
let playing = false
let muted = false
let userVolume = 1
let sceneTargetVolume = 0.16
let currentMeta: SceneMusic = SCENE_MUSIC.splash
let duckRestore: (() => void) | null = null
const listeners = new Set<() => void>()

function notify() { listeners.forEach(fn => fn()) }

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function loadPrefs() {
  if (typeof window === 'undefined') return
  // A missing value must mean "normal volume" — Number(null) is 0, which used to start
  // every first visit silently (and then saved that silence). Mute is a separate switch.
  const raw = window.localStorage.getItem(VOL_KEY)
  const storedVolume = raw === null || raw.trim() === '' ? NaN : parseFloat(raw)
  userVolume = Number.isFinite(storedVolume) && storedVolume >= 0.08 ? Math.min(1, storedVolume) : 1
  muted = window.localStorage.getItem(MUTE_KEY) === '1'
}

function savePrefs() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(VOL_KEY, String(userVolume))
  window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
}

/** Song files in story order (used by the preloader to download them ahead of time). */
export function getStoryTrackSrcs(): string[] {
  const out: string[] = []
  for (const meta of Object.values(SCENE_MUSIC)) {
    if (!meta.track) continue
    const src = TRACKS[meta.track].src
    if (!out.includes(src)) out.push(src)
  }
  return out
}

/** Tell the preloader which songs the next few scenes need, so they download first. */
function bumpUpcoming(sceneId: string) {
  const ids = Object.keys(SCENE_MUSIC)
  const i = ids.indexOf(sceneId)
  if (i < 0) return
  const srcs: string[] = []
  for (const id of ids.slice(i, i + 4)) {
    const t = SCENE_MUSIC[id].track
    if (t) srcs.push(TRACKS[t].src)
  }
  bumpAudio(srcs)
}

function makeAudio(index: number) {
  // No src here — setting one would start a second download of the first song.
  const audio = new Audio()
  audio.preload = 'auto'
  audio.loop = true
  audio.volume = 0
  audio.addEventListener('ended', () => {
    audio.pause()
    audio.currentTime = 0
    if (index === activeIndex) {
      playing = false
      activeTrack = null
      notify()
    }
  })
  return audio
}

function ensureAudio() {
  if (typeof window === 'undefined') return null
  if (!audioPair) audioPair = [makeAudio(0), makeAudio(1)]
  return audioPair
}

function effectiveVolume(target = sceneTargetVolume) {
  // scene targets are written as quiet 'bed' levels; lift them so music is always clearly audible
  return muted ? 0 : Math.min(0.55, Math.max(0.22, target * 1.9)) * userVolume
}

const tweenToken = new WeakMap<HTMLAudioElement, number>()
const stamp = new WeakMap<HTMLAudioElement, number>()
let stampCounter = 0
let needsGesture = false

function tweenVolume(audio: HTMLAudioElement, to: number, ms: number) {
  const token = (tweenToken.get(audio) || 0) + 1
  tweenToken.set(audio, token)
  const from = audio.volume
  if (ms <= 0) {
    audio.volume = Math.max(0, Math.min(1, to))
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    if (tweenToken.get(audio) !== token) return // a newer fade took over
    const p = Math.min(1, (now - start) / ms)
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function updateMoodDocument() {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.storyMood = currentMeta.mood
  }
}

function setMeta(sceneId: string) {
  currentMeta = SCENE_MUSIC[sceneId] ?? SCENE_MUSIC.splash
  sceneTargetVolume = currentMeta.volume
  updateMoodDocument()
}

function stopPair(seconds = 0.6) {
  const pair = ensureAudio()
  if (!pair) return
  const ms = Math.max(0, seconds * 1000)
  pair.forEach(audio => tweenVolume(audio, 0, ms))
  window.setTimeout(() => pair.forEach(audio => { audio.pause(); audio.currentTime = 0 }), ms + 40)
}

function startTrack(track: TrackId, fadeSeconds: number) {
  const pair = ensureAudio()
  if (!pair) return
  const nextIndex = activeIndex === 0 ? 1 : 0
  const next = pair[nextIndex]
  const prev = pair[activeIndex]
  // the preloaded in-memory copy when ready, otherwise the normal network URL
  const src = getCachedAudioSrc(TRACKS[track].src)

  if (activeTrack === track && !prev.paused) {
    tweenVolume(prev, effectiveVolume(), 700)
    playing = true
    notify()
    return
  }

  // short, smooth crossfade — the new song is audible straight away
  const ms = Math.max(700, Math.min(1700, fadeSeconds * 1000))
  const target = effectiveVolume()

  next.pause()
  next.muted = false
  next.src = src
  next.currentTime = 0
  next.loop = true
  next.volume = target * 0.4
  next.load()
  stamp.set(next, ++stampCounter)

  const playPromise = next.play()
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch((err: unknown) => {
      // only a genuine autoplay block needs a tap — an interrupted play() (quick scene change) is fine
      if ((err as { name?: string } | null)?.name === 'NotAllowedError') {
        needsGesture = true
        playing = false
        notify()
      }
    })
  }

  tweenVolume(next, target, ms)
  tweenVolume(prev, 0, ms)
  const prevStamp = stamp.get(prev)
  setTimeout(() => {
    // only silence the old element if it hasn't been reused for a newer song
    if (stamp.get(prev) === prevStamp && prev !== pair[activeIndex]) {
      prev.pause()
      prev.currentTime = 0
    }
  }, ms + 160)

  activeIndex = nextIndex
  activeTrack = track
  playing = true
  notify()
}

/** Called on the first tap / key press: starts the music if the browser had blocked it. */
export function retryIfBlocked() {
  if (!running) return
  const pair = ensureAudio()
  if (!pair) return
  const active = pair[activeIndex]
  if (needsGesture || (activeTrack && active.paused && playing)) {
    needsGesture = false
    if (currentMeta.track) startTrack(currentMeta.track, 0.8)
  } else if (!activeTrack && currentMeta.track) {
    startTrack(currentMeta.track, 0.8)
  }
}

/**
 * Called on the opening tap. Plays both audio elements silently for an instant so
 * browsers (iOS Safari especially) treat them as user-unlocked; the real song can then
 * start a moment later, when the next screen appears, without needing another tap.
 */
export function primeAudio() {
  const pair = ensureAudio()
  if (!pair) return
  pair.forEach(audio => {
    audio.muted = true
    audio.src = getCachedAudioSrc(TRACKS[currentMeta.track ?? 'munbe'].src)
    const release = () => {
      // startTrack un-mutes an element it takes over — if so, leave it playing
      if (!audio.muted) return
      audio.pause()
      audio.currentTime = 0
      audio.muted = false
    }
    const p = audio.play()
    if (p && typeof p.then === 'function') p.then(release).catch(() => { audio.muted = false })
    else release()
  })
}

export function beginMusic() {
  loadPrefs()
  ensureAudio()
  running = true
  playing = false
  updateMoodDocument()
  notify()
}

export function playChapterMusic(sceneId: string) {
  if (!running) return
  setMeta(sceneId)
  bumpUpcoming(sceneId)

  if (!currentMeta.track) {
    stopPair(currentMeta.fadeSeconds)
    playing = false
    activeTrack = null
    notify()
    return
  }

  startTrack(currentMeta.track, currentMeta.fadeSeconds)
  notify()
}

export function triggerSceneMusicCue() {
  if (!running || !currentMeta.track) return
  startTrack(currentMeta.track, currentMeta.fadeSeconds)
  notify()
}

export function fadeOut(seconds = 2) {
  const pair = ensureAudio()
  if (!pair) return
  pair.forEach(audio => tweenVolume(audio, 0, Math.max(0, seconds * 1000)))
}

export function pauseMusic() {
  const pair = ensureAudio()
  if (!pair) return
  pair.forEach(audio => tweenVolume(audio, 0, 350))
  setTimeout(() => pair.forEach(audio => audio.pause()), 400)
  playing = false
  notify()
}

export function resumeMusic() {
  if (!running) return
  if (!activeTrack && currentMeta.track) {
    startTrack(currentMeta.track, Math.min(2.2, currentMeta.fadeSeconds))
    return
  }
  if (!activeTrack) return
  const pair = ensureAudio()
  if (!pair) return
  const active = pair[activeIndex]
  active.play().then(() => {
    tweenVolume(active, effectiveVolume(), 900)
    playing = true
    notify()
  }).catch(() => notify())
}

export function togglePlaying() {
  if (playing) pauseMusic()
  else resumeMusic()
}

export function isPlaying() { return playing }

export function setMuted(next: boolean) {
  muted = next
  savePrefs()
  const pair = ensureAudio()
  if (pair) pair.forEach(audio => tweenVolume(audio, effectiveVolume(audio === pair[activeIndex] ? sceneTargetVolume : 0), 500))
  notify()
}

export function toggleMuted() { setMuted(!muted) }
export function isMuted() { return muted }

export function setUserVolume(v: number) {
  userVolume = Math.min(1, Math.max(0, v))
  savePrefs()
  if (running) {
    const pair = ensureAudio()
    if (pair) pair[activeIndex].volume = effectiveVolume()
  }
  notify()
}

export function getUserVolume() { return userVolume }

export function getMusicSnapshot(): MusicSnapshot {
  return {
    playing,
    muted,
    volume: userVolume,
    track: activeTrack,
    title: currentMeta.title,
    whisper: currentMeta.whisper,
    mood: currentMeta.mood,
  }
}
