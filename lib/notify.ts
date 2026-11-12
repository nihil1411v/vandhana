import { NOTIFY_WEBHOOK_URL, HER_NAME } from './config'
import { getDB } from './db'

/**
 * Sends a snapshot of her answers to the configured webhook (see
 * NOTIFY_WEBHOOK_URL in lib/config.ts). If it's not configured, this
 * silently does nothing — the app keeps working fully offline either way.
 *
 * Never throws: a network hiccup here should never interrupt her experience.
 */
export async function notifyBackend(event: string, extra?: Record<string, unknown>) {
  if (!NOTIFY_WEBHOOK_URL) return

  try {
    const db = getDB()
    const payload = {
      _subject: `💌 ${HER_NAME} — ${event}`,
      event,
      timestamp: new Date().toISOString(),
      dream: db.questions.dream ?? '',
      food: db.questions.food ?? '',
      habit: db.questions.habit ?? '',
      special_answer: db.questions.special ?? '',
      said_forever: db.questions.forever ?? '',
      made_a_wish: db.wishMade ? 'yes' : 'no',
      stars_visited: db.starsVisited.length,
      photos_flipped: db.photosFlipped.length,
      reasons_viewed: db.reasonsViewed.length,
      gift_opened: db.giftOpened ? 'yes' : 'no',
      scratch_revealed: db.scratchRevealed ? 'yes' : 'no',
      balloons_popped: db.balloonsPopped.length,
      cake_blown: db.cakeBlown ? 'yes' : 'no',
      fireworks_watched: db.fireworksWatched ? 'yes' : 'no',
      her_reply: db.reply ?? '',
      ...extra,
    }

    await fetch(NOTIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // fail silently — offline, blocked, or misconfigured. Never block her flow.
  }
}
