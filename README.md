# 💕 Cinematic Love Story — Next.js

A deeply emotional, interactive romantic experience built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

> **Note:** this project has grown a lot across many rounds of edits — the scene list below reflects an earlier point in development and the exact wording/order has since evolved (Hero is now a waking heart rather than an eye, several scenes changed background theme, and `Letter`, `One Minute`, `One Thing`, and `Return Loop` were added later). For the true, current, authoritative flow, see the `switch` statement in `app/page.tsx` — that's always accurate; this file is a general guide, not a spec.

## ✨ Scenes (current flow, in order)

Splash → Hero → Heart → Reveal → Swipe → Gift Box → Scratch Card → Timeline → Constellation → Photo Stack → Age Milestone → Birthday Card → **Letter** → Balloon Pop → Cake → Questions → Reasons → **One Minute** → **One Thing** → Fireworks → Final → Reply → Keepsake → **Return Loop**

New in this round:
- **Letter** — a separate, more intimate love letter (distinct from the Birthday Card), sealed with wax, opened by breaking the seal. This component existed in the project for a while but wasn't wired into `page.tsx` — it is now.
- **One Minute** — a deliberately non-interactive pause: one photo, soft ambient particles, a slow 60-second timer with no skip button, by design (a breathing-room beat before the finale). Configure via `PAUSE_PHOTO` / `PAUSE_SECONDS`.
- **One Thing** — a minimal dark scene: a handful of sentence fragments reveal one at a time, then a list of wishes for her. Configure via `ONE_THING_INTRO_LINES` / `ONE_THING_MESSAGES` / `ONE_THING_CLOSING`.
- **Return Loop** — the true final screen, after Keepsake. Offers to reread the letter, see one more reason, or restart from the beginning, instead of the experience just ending.

`WishScene.tsx` still exists in the project but is intentionally left unwired — its single-candle wish moment is now fully covered by the Cake scene's built-in blow-and-wish sequence, so re-adding it would mean asking her to blow out a candle twice in one session.

## ✨ Original scene list (kept for reference — see note above)

1. **Splash** — Confetti burst and "Happy Birthday {name}" typography, the very first thing she sees
2. **Hero** — Cinematic eye-opening animation, her name typed out letter by letter
3. **Heart** — Multi-step heart dialogue with pulse effects
4. **Reveal** — Click-buildup with particle burst reveal
5. **Swipe** — Two Polaroid-style memory cards you swipe together into one
6. **Gift Box** — Untie the ribbon, open the lid, a message (and optional voucher) pops out
7. **Scratch Card** — Canvas-based scratch-off overlay revealing a hidden message/photo
8. **Timeline** — A walk through your relationship's milestones
9. **Constellation** — A night sky of places that matter, tap each star for a memory
10. **Photo Stack** — A scattered pile of photo cards; tap one to flip it and reveal a message, tap again to flip it back
11. **Age Milestone** — Reflective lines tied to different points in time, "here's what I love about who you've become"
12. **Birthday Card** — Opens like an actual greeting card, cover taps open to reveal the message inside
13. **Balloon Pop** — Tap balloons to pop them; together the revealed words spell out a birthday message
14. **Cake** — Candles matching her age, blow them out (mic-based detection, tap fallback), then cut a slice to reveal a message baked in
15. **Questions** — 5 personalized questions (answers saved to the local database)
16. **Reasons** — A shuffled "why I love you" flipbook (20+ reasons), swipe or tap through them, right before the finale
17. **Fireworks** — Animated firework bursts over a night sky with a closing birthday message
18. **Final** — Grand reveal with your message, photo, petal burst, and optional voice note
19. **Reply** — Her turn to write something back, with a real way to send it to you (WhatsApp link, native share sheet, or copy-to-send)
20. **Keepsake** — Downloads a real multi-page PDF booklet with every page's text from the whole site (letter, card, reasons, timeline, memories, milestones, her answers, her reply) so nothing is lost once the tab closes

There's also an optional **date/passcode lock** that can gate the whole experience until a specific moment, and **ambient background music** that gradually builds in volume the longer she stays.

Ambient floating hearts drift softly across every scene, buttons are pill-shaped with a warm glow, and a few scenes now use a small `❦` flourish divider under their labels — the goal was to move away from a flat templated look toward something that actually feels handcrafted and romantic.

**Note:** `LetterScene.tsx` (the sealed wax-letter) and the original generic `WishScene.tsx` (single candle, no age/cake) are still in the project but not wired into the flow anymore — the Birthday Card and Cake scenes replaced them for this version. Swap them back into `app/page.tsx` any time if you'd prefer the plain romantic version instead of the birthday one.

## 💾 The local "database"

Every phase now saves through `lib/db.ts` — a small helper that keeps one JSON object in the browser's `localStorage` (`love_story_db_v1`), instead of scattering separate keys everywhere. It tracks:

- her answers from the Questions scene (dream place, favourite food, habit, the "special" yes/no, forever yes)
- whether she made a wish and blew out the cake candles
- which constellation stars she opened
- which photo cards she flipped
- which "why I love you" reasons she's seen
- which balloons she popped
- whether she opened the gift and revealed the scratch card
- whether she watched the fireworks
- her written reply

FinalScene and KeepsakeScene both read straight from this database. There's no real backend — everything lives only in her browser — but it's now one clean place instead of loose keys. You can inspect it anytime from the browser console on the deployed site:

```js
exportLoveDB()   // prints and returns a readable summary of everything saved
```

## 📬 Getting her answers automatically (optional)

Set `NOTIFY_WEBHOOK_URL` in `lib/config.ts` (a free [Formspree](https://formspree.io) endpoint works great, no code needed) and her answers get emailed to you automatically at three points: right after she finishes the Questions scene, whenever she saves/sends her Reply, and once she reaches the Final scene (a full snapshot). Leave it blank and everything still works — you'd just need `exportLoveDB()` on her device instead.

## ⚙️ One file for everything personal

Almost all customization still lives in `lib/config.ts`:

```ts
export const HER_NAME = 'her name'
export const UNLOCK_AT = null
export const PASSCODE = ''
export const REASONS = [ /* 20+ short reasons, shuffled + swipeable */ ]
export const MEMORIES = [ /* timeline milestones */ ]
export const PLACES = [ /* constellation stars */ ]
export const PHOTO_STACK = [ { photo: 'us-1.webp', message: '...' }, /* ... */ ] // drop images in /public/photos/
export const YOUR_PHOTO = ''          // e.g. 'me.webp' — drop into /public/photos/, shown on the Swipe scene
export const HER_PHOTO = ''           // e.g. 'her.webp' — same folder
export const MERGE_CAPTION = 'A moment, made of both of us.'
export const LETTER_TEXT = `...`
export const VOICE_MESSAGE_FILE = ''
export const AMBIENT_MUSIC_FILE = ''
export const AMBIENT_MUSIC_START_VOLUME = 0.12
export const AMBIENT_MUSIC_MAX_VOLUME = 0.35
export const AMBIENT_MUSIC_BUILD_SECONDS = 90
export const YOUR_WHATSAPP_NUMBER = ''
export const NOTIFY_WEBHOOK_URL = ''

// Birthday scenes
export const HER_AGE = 25                    // sets candle count on the cake
export const AGE_MILESTONES = [ /* ... */ ]   // reflective lines
export const BALLOON_MESSAGE = ['HAPPY', 'BIRTHDAY', /* ... */]  // one word per balloon
export const BIRTHDAY_CARD_COVER = 'Happy Birthday'
export const BIRTHDAY_CARD_TEXT = `...`
export const GIFT_MESSAGE = '...'
export const GIFT_VOUCHER = ''                // optional line describing a real gift
export const SCRATCH_MESSAGE = '...'
export const SCRATCH_IMAGE = ''               // optional photo filename in /public/photos/
export const CAKE_SLICE_MESSAGE = '...'
export const FIREWORKS_MESSAGE = `Happy Birthday, ${HER_NAME}.`
```

### About the Photo Stack
Each card in `PHOTO_STACK` needs a `photo` filename (put the actual image in `/public/photos/`) and a `message` that appears when it's flipped. Leave `photo: ''` on any card to show a placeholder heart instead of a missing image — handy while you're still collecting photos.

### About the Cake scene (candle blow)
Just like the mic logic used elsewhere, it asks for microphone access and listens for a blow sound to extinguish all the candles at once. If she denies mic access, or is on a device without one, there's always a "tap to blow" fallback button — nothing gets stuck. The candle count matches `HER_AGE`, capped at 20 candles for very large ages so the layout stays readable.

### About the Scratch Card
It's a real HTML canvas she scratches with a finger or mouse (`destination-out` compositing, no external library). Once roughly 45% of the overlay is cleared, it automatically fades away to reveal the rest — she doesn't have to scratch every pixel.

### About the Keepsake
"Download keepsake PDF" builds a real multi-page PDF (via [jsPDF](https://github.com/parallax/jsPDF), bundled as a dependency) with a page for every piece of writing in the site: the letter, the birthday card, all the reasons, the timeline, the constellation memories, the photo-stack captions, the age milestones, the gift/scratch/cake/fireworks messages, her question answers, her activity stats, and her written reply. It's generated and downloaded entirely in her browser — nothing is uploaded anywhere.

### About her Reply
There's no real backend here, so replies aren't stored anywhere central by default. The Reply scene gives her three ways to actually get it to you, in this order of preference:
1. **WhatsApp** — if you set `YOUR_WHATSAPP_NUMBER`, tapping opens a pre-filled WhatsApp message to you.
2. **Native share sheet** — on phones, if no WhatsApp number is set, she gets the OS share sheet (Messages, WhatsApp, email, whatever she picks).
3. **Copy to send** — as a fallback on desktop or unsupported browsers, she can copy the text and paste it into a message to you herself.

"Save" also writes to the local database above as a backup — it isn't sent anywhere on its own.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Change the name
In `components/HeartScene.tsx`:
```ts
const NAME = 'Her Name Here'  // ← change this
```

### Add real photos
In `components/RevealScene.tsx` and `components/FinalScene.tsx`:
- Replace the placeholder `<div>` with `<Image src="/photos/her.webp" ... />`
- Drop your images into `/public/photos/`

### Add your personal message
In `components/FinalScene.tsx`, edit the message text:
```tsx
Every heartbeat is yours.<br />
Every dream carries your name.<br />
...
```

### Customize the swipe photos
Set `YOUR_PHOTO` and `HER_PHOTO` in `lib/config.ts` to filenames in `/public/photos/` — same pattern as `PHOTO_STACK`. Leave either blank to show a soft placeholder heart instead of a missing image.

## 🎵 Adding Heartbeat Sound (Optional)

1. Drop `heartbeat.mp3` into `/public/sounds/`
2. In `RevealScene.tsx`, add to `handleClick`:
```ts
const audio = new Audio('/sounds/heartbeat.mp3')
audio.volume = 0.3
audio.play()
```

## 🎨 Color Palette

| Token | Value | Use |
|-------|-------|-----|
| `#000000` | Pure black | Backgrounds |
| `#8b0000` | Deep red | Accents, hearts |
| `#c41e3a` | Crimson | Heart glow |
| `#d4a0a0` | Muted rose | Text |
| `#3a0a20` | Dark rose | Borders |

## 📁 Structure

```
love-story/
├── app/
│   ├── layout.tsx       # Root layout + fonts
│   ├── page.tsx         # Scene orchestrator (state machine)
│   └── globals.css      # Global styles + animations
├── components/
│   ├── HeroScene.tsx    # Eye-opening cinematic intro
│   ├── HeartScene.tsx   # Heart dialogue (5 steps)
│   ├── RevealScene.tsx  # Click buildup → burst
│   ├── SwipeScene.tsx   # Swipe right to merge
│   ├── QuestionsScene.tsx # 5 interactive questions
│   └── FinalScene.tsx   # Grand finale reveal
└── public/
    └── sounds/          # Optional: heartbeat.mp3
```

## 💡 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to [vercel.com](https://vercel.com).

---

*Made with love.* ♡

## Soundtrack revision — September 2026

The music layer was revised so the 24 main chapters use a distinct song/clip per chapter. The supplied `Azhagiye` track was removed. New uploaded songs were integrated according to their emotional themes, and the UI continues to use original captions rather than reproducing song lyrics.
