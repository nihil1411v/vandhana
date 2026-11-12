'use client'

// ============================================================
// 💾 SMALL LOCAL "DATABASE"
// ------------------------------------------------------------
// There's no server here, so this is a single JSON object kept
// in the browser's localStorage under one key. Every scene reads
// and writes through the helpers below instead of touching
// localStorage directly, so all her answers end up in one place
// you can inspect, export, or read from FinalScene.
// ============================================================

const DB_KEY = 'love_story_db_v1'

export interface QuestionAnswers {
  dream?: string
  food?: string
  habit?: string
  special?: 'yes' | 'no'
  forever?: 'yes'
}

export interface LoveDB {
  questions: QuestionAnswers
  reply?: string
  wishMade?: boolean
  starsVisited: number[]
  photosFlipped: number[]
  reasonsViewed: number[]
  giftOpened?: boolean
  scratchRevealed?: boolean
  balloonsPopped: number[]
  cakeBlown?: boolean
  fireworksWatched?: boolean
  startedAt?: string
  updatedAt?: string
}

function emptyDB(): LoveDB {
  return {
    questions: {},
    starsVisited: [],
    photosFlipped: [],
    reasonsViewed: [],
    balloonsPopped: [],
  }
}

function readDB(): LoveDB {
  if (typeof window === 'undefined') return emptyDB()
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) return emptyDB()
    const parsed = JSON.parse(raw)
    return { ...emptyDB(), ...parsed }
  } catch {
    return emptyDB()
  }
}

function writeDB(db: LoveDB) {
  if (typeof window === 'undefined') return
  try {
    db.updatedAt = new Date().toISOString()
    if (!db.startedAt) db.startedAt = db.updatedAt
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    // storage full / disabled — fail silently, experience still works
  }
}

/** Read the whole database. */
export function getDB(): LoveDB {
  return readDB()
}

/** Merge a partial update into the database. */
export function updateDB(patch: Partial<LoveDB>): LoveDB {
  const db = readDB()
  const merged = { ...db, ...patch }
  writeDB(merged)
  return merged
}

/** Save one answer from the Questions scene. */
export function setQuestionAnswer(key: keyof QuestionAnswers, value: string) {
  const db = readDB()
  db.questions = { ...db.questions, [key]: value }
  writeDB(db)
}

/** Save her written reply. */
export function setReply(text: string) {
  updateDB({ reply: text })
}

/** Mark that the candle wish was made. */
export function markWishMade() {
  updateDB({ wishMade: true })
}

/** Record a constellation star she's opened. */
export function addVisitedStar(index: number) {
  const db = readDB()
  if (!db.starsVisited.includes(index)) db.starsVisited.push(index)
  writeDB(db)
}

/** Record a photo-stack card she's flipped. */
export function addFlippedPhoto(index: number) {
  const db = readDB()
  if (!db.photosFlipped.includes(index)) db.photosFlipped.push(index)
  writeDB(db)
}

/** Record a "why I love you" reason she's seen. */
export function addReasonViewed(index: number) {
  const db = readDB()
  if (!db.reasonsViewed.includes(index)) db.reasonsViewed.push(index)
  writeDB(db)
}

/** Mark that she opened the gift box. */
export function markGiftOpened() {
  updateDB({ giftOpened: true })
}

/** Mark that she fully scratched off the scratch card. */
export function markScratchRevealed() {
  updateDB({ scratchRevealed: true })
}

/** Record a balloon she's popped. */
export function addBalloonPopped(index: number) {
  const db = readDB()
  if (!db.balloonsPopped.includes(index)) db.balloonsPopped.push(index)
  writeDB(db)
}

/** Mark that the birthday cake candles were blown out. */
export function markCakeBlown() {
  updateDB({ cakeBlown: true })
}

/** Mark that she watched the fireworks finale. */
export function markFireworksWatched() {
  updateDB({ fireworksWatched: true })
}

/** Human-readable export, handy for the browser console: window.exportLoveDB() */
export function exportDBAsText(): string {
  const db = readDB()
  const lines: string[] = []
  lines.push('--- Her answers ---')
  if (db.questions.dream) lines.push(`Dream place: ${db.questions.dream}`)
  if (db.questions.food) lines.push(`Favourite food: ${db.questions.food}`)
  if (db.questions.habit) lines.push(`Something she does often: ${db.questions.habit}`)
  if (db.questions.special) lines.push(`Said to "ready to see something special?": ${db.questions.special}`)
  if (db.questions.forever) lines.push(`Said yes to forever: ${db.questions.forever}`)
  if (db.wishMade) lines.push('Made a wish: yes')
  if (db.starsVisited.length) lines.push(`Stars visited: ${db.starsVisited.length}`)
  if (db.photosFlipped.length) lines.push(`Photos flipped: ${db.photosFlipped.length}`)
  if (db.reasonsViewed.length) lines.push(`Reasons viewed: ${db.reasonsViewed.length}`)
  if (db.giftOpened) lines.push('Opened the gift: yes')
  if (db.scratchRevealed) lines.push('Revealed the scratch card: yes')
  if (db.balloonsPopped.length) lines.push(`Balloons popped: ${db.balloonsPopped.length}`)
  if (db.cakeBlown) lines.push('Blew out the cake candles: yes')
  if (db.fireworksWatched) lines.push('Watched the fireworks: yes')
  if (db.reply) lines.push(`Her reply: ${db.reply}`)
  lines.push(`Started: ${db.startedAt ?? 'n/a'}`)
  lines.push(`Last updated: ${db.updatedAt ?? 'n/a'}`)
  return lines.join('\n')
}

if (typeof window !== 'undefined') {
  // Small dev convenience — open devtools console and run exportLoveDB()
  ;(window as any).exportLoveDB = () => {
    const text = exportDBAsText()
    console.log(text)
    return text
  }
}
