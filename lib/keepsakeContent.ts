import {
  HER_NAME,
  REASONS,
  MEMORIES,
  LETTER_TEXT,
  PLACES,
  PHOTO_STACK,
  AGE_MILESTONES,
  BALLOON_MESSAGE,
  BIRTHDAY_CARD_COVER,
  BIRTHDAY_CARD_TEXT,
  GIFT_MESSAGE,
  GIFT_VOUCHER,
  SCRATCH_MESSAGE,
  CAKE_SLICE_MESSAGE,
  FIREWORKS_MESSAGE,
} from '@/lib/config'
import { getDB } from '@/lib/db'

export interface KeepsakeEntry {
  sub?: string
  text: string
}

export interface KeepsakeSection {
  heading: string
  entries: KeepsakeEntry[]
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Builds every section of the keepsake from the site's config + her live local answers. */
export function getKeepsakeSections(): KeepsakeSection[] {
  const db = getDB()
  const sections: KeepsakeSection[] = []

  sections.push({ heading: 'The Letter', entries: [{ text: LETTER_TEXT }] })

  sections.push({
    heading: BIRTHDAY_CARD_COVER || 'The Birthday Card',
    entries: [{ text: BIRTHDAY_CARD_TEXT }],
  })

  sections.push({
    heading: 'Reasons I Love You',
    entries: REASONS.map((r, i) => ({ text: `${i + 1}. ${r}` })),
  })

  sections.push({
    heading: 'Our Story So Far',
    entries: MEMORIES.map(m => ({ sub: m.date, text: `${m.title} — ${m.description}` })),
  })

  sections.push({
    heading: 'Places That Matter',
    entries: PLACES.map(p => ({ sub: p.name, text: p.memory })),
  })

  sections.push({
    heading: 'A Little Stack of Us',
    entries: PHOTO_STACK.map((c, i) => ({ text: `${i + 1}. ${c.message}` })),
  })

  sections.push({
    heading: 'Who You\u2019ve Become',
    entries: AGE_MILESTONES.map(m => ({ sub: m.age, text: m.text })),
  })

  const celebrationEntries: KeepsakeEntry[] = [
    { sub: 'The Gift', text: GIFT_MESSAGE },
  ]
  if (GIFT_VOUCHER) celebrationEntries.push({ text: GIFT_VOUCHER })
  celebrationEntries.push({ sub: 'The Scratch Card', text: SCRATCH_MESSAGE })
  celebrationEntries.push({ sub: 'The Cake', text: CAKE_SLICE_MESSAGE })
  celebrationEntries.push({ sub: 'The Balloons Spelled Out', text: BALLOON_MESSAGE.join(' ') })
  celebrationEntries.push({ sub: 'The Fireworks', text: FIREWORKS_MESSAGE })
  sections.push({ heading: 'Little Celebration Moments', entries: celebrationEntries })

  const answerEntries: KeepsakeEntry[] = []
  if (db.questions.dream) answerEntries.push({ sub: 'Dream place', text: db.questions.dream })
  if (db.questions.food) answerEntries.push({ sub: 'Favourite food', text: db.questions.food })
  if (db.questions.habit) answerEntries.push({ sub: 'A little habit', text: db.questions.habit })
  if (db.questions.special) {
    answerEntries.push({
      sub: 'Ready for something special?',
      text: db.questions.special === 'yes' ? 'She said yes.' : 'She said no (but stayed anyway).',
    })
  }
  if (db.questions.forever) answerEntries.push({ sub: 'Forever?', text: 'Yes.' })
  if (!answerEntries.length) {
    answerEntries.push({ text: 'No answers recorded on this device yet.' })
  }
  const stats = [
    db.wishMade ? 'Made a wish' : '',
    db.cakeBlown ? 'Blew out the candles' : '',
    db.giftOpened ? 'Opened the gift' : '',
    db.scratchRevealed ? 'Revealed the scratch card' : '',
    db.fireworksWatched ? 'Watched the fireworks' : '',
    db.starsVisited.length ? `Opened ${db.starsVisited.length} constellation memories` : '',
    db.photosFlipped.length ? `Flipped ${db.photosFlipped.length} photos` : '',
    db.reasonsViewed.length ? `Read ${db.reasonsViewed.length} reasons` : '',
    db.balloonsPopped.length ? `Popped ${db.balloonsPopped.length} balloons` : '',
  ].filter(Boolean)
  if (stats.length) answerEntries.push({ sub: 'Along the way, she also...', text: stats.join(' \u00b7 ') })
  sections.push({ heading: 'What You Told Me', entries: answerEntries })

  sections.push({
    heading: 'What She Said Back',
    entries: [{ text: db.reply || 'No reply written on this device yet.' }],
  })

  return sections
}

const SHARED_STYLE = `
  body { background:#140810; margin:0; font-family: Georgia, 'Times New Roman', serif; color:#3a1420; }
  .kp-cover { text-align:center; padding: 90px 40px; background: radial-gradient(ellipse at top, #4a1830 0%, #2a1020 55%, #140810 100%); color:#ffe3ec; }
  .kp-cover .kp-label { letter-spacing:6px; font-size:12px; color:#e8a8c0; text-transform:uppercase; }
  .kp-cover h1 { font-style:italic; font-weight:300; font-size:52px; margin:18px 0; color:#ffd7e6; }
  .kp-cover .kp-date { font-size:12px; color:#c98aa0; }
  .kp-page { background:#fff8f5; padding: 48px 56px; border-bottom: 2px solid #f0d8de; page-break-after: always; }
  .kp-heading { font-size:22px; color:#8b0032; font-style:italic; text-align:center; margin:0 0 8px; }
  .kp-rule { width:80px; height:2px; background:#e8a8c0; margin: 0 auto 26px; }
  .kp-sub { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#b5406a; margin: 18px 0 4px; }
  .kp-text { font-size:15px; line-height:1.8; color:#4a1425; white-space:pre-line; margin:0 0 10px; }
  .kp-footer { text-align:center; padding: 30px; color:#c98aa0; font-style:italic; font-size:13px; background:#fff8f5; }
`

/** Full standalone HTML document — used for the downloadable .html keepsake file. */
export function buildKeepsakeDownloadHtml(): string {
  const sections = getKeepsakeSections()
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const pages = sections
    .map(
      s => `
      <section class="kp-page">
        <h2 class="kp-heading">${esc(s.heading)}</h2>
        <div class="kp-rule"></div>
        ${s.entries
          .map(
            e => `
              ${e.sub ? `<div class="kp-sub">${esc(e.sub)}</div>` : ''}
              <p class="kp-text">${esc(e.text)}</p>
            `
          )
          .join('')}
      </section>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${esc(HER_NAME)} — Keepsake</title>
<style>${SHARED_STYLE}</style>
</head>
<body>
  <div class="kp-cover">
    <div class="kp-label">A Keepsake For</div>
    <h1>${esc(HER_NAME)}</h1>
    <div class="kp-date">${esc(dateStr)}</div>
  </div>
  ${pages}
  <div class="kp-footer">With all my heart. 🤍</div>
</body>
</html>`
}

/** Inner content only (no doctype/html wrapper) — used for the on-page hidden print view. */
export function buildKeepsakePrintInnerHtml(): string {
  const sections = getKeepsakeSections()
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const pages = sections
    .map(
      s => `
      <section class="kp-page">
        <h2 class="kp-heading">${esc(s.heading)}</h2>
        <div class="kp-rule"></div>
        ${s.entries
          .map(
            e => `
              ${e.sub ? `<div class="kp-sub">${esc(e.sub)}</div>` : ''}
              <p class="kp-text">${esc(e.text)}</p>
            `
          )
          .join('')}
      </section>`
    )
    .join('')

  return `
    <div class="kp-cover">
      <div class="kp-label">A Keepsake For</div>
      <h1>${esc(HER_NAME)}</h1>
      <div class="kp-date">${esc(dateStr)}</div>
    </div>
    ${pages}
    <div class="kp-footer">With all my heart. \u{1F90D}</div>
  `
}
