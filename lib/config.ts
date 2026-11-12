// ============================================================
// 💕 ONE PLACE TO EDIT EVERYTHING PERSONAL
// ============================================================

export const HER_NAME = 'vandhana'

// Your name, as you'd like it to appear when you sign off. Leave '' to sign as "me".
export const SENDER_NAME = ''
const WHO = SENDER_NAME || 'me'

// Optional: the video from her story. Put the file in /public/video/ and set it here,
// e.g. export const HER_VIDEO = '/video/her-video.mp4'. Leave '' to show a photo instead.
export const HER_VIDEO = ''

// Optional: lock the whole experience until a specific date/time.
// Leave as null to disable the lock entirely.
// Example: new Date('2026-09-14T00:00:00')
export const UNLOCK_AT: Date | null = null
//export const UNLOCK_AT: Date | null = new Date('2026-11-14T00:00:00')

// Optional: require a simple passcode before entering (in addition to,
// or instead of, the date lock). Leave as '' to disable.
export const PASSCODE = ''

// "Why I love you" — shown one at a time in ReasonsScene.
// Add as many as you want.
export const REASONS: string[] = [
  "Neenga smile pannina podhum, my whole day super aagidum.",
  "The way you express yourself, so honestly, with nothing hidden. It's one of the most beautiful things about you.",
  "You do the smallest things so sweetly, and I don't think you even notice. I always do.",
  "That kuzhandhai manasu of yours. The child inside you is my favourite part of you.",
  "I think poverty is not the worst thing in the world, blindness is, because blind people cannot see your beauty.",
  "My heart does a little drumroll every time your name shows up. Mridangam level, honestly.",
  "I could talk about you for hours and never run out of words. Ask my friends, they're tired of it.",
  "They say love takes time. Mine took one smile, and it never asked my permission.",
  "You're gentle, and that is rare. I hope the world is just as gentle with you.",
  "The way your whole face lights up when you're happy. I'd do a lot just to see it once more.",
  "My phone has plenty of storage, but no space for anyone else's photos. Only yours. 🙈",
  "I once tried to list your flaws. I'm still stuck on the first line, and it's blank. Maybe you can help me.",
  "Every one says nobody is perfect then i found you.You are perfect in all the way.",
  "I love you without knowing how, or when, or from where.",
  "Maybe I met all those other people just so I'd know, without any doubt, what it feels like when it's you.",
  "I don't want to complete you. You're already whole. I only want to walk beside you, wherever you choose to go.",
  "I want to be a place where you always feel safe.",
  "You came like the first rain comes: no announcement, and suddenly everything smells like hope.",
  "I'm so happy you exist. Truly. Thank you for being born today.",
  "I have loved you, and I love you, and I shall love you forever.",
  "I want to be the reason you smile, every single day. That is my biggest wish.",
  "My heart is, and always will be yours.",
  "Grow old along with me! The best is yet to be.",
  "Last one, and the truest: I love you, Vandhana. Quietly, slowly, with my whole heart.",
]

// One portrait for each reason above (same order).
export const REASON_PHOTOS: string[] = [
  'her-face1.jpg', 'her-red2.jpg', 'her-bw4.jpg', 'her-hand2.jpg', 'her-violet.jpg', 'her-saree3.jpg',
  'her-moody.jpg', 'her-face2.jpg', 'her-bw5.jpg', 'her-palms.jpg', 'her-face3.jpg', 'her-bw6.jpg',
  'her-face4.jpg', 'her-hand.jpg', 'her-face5.jpg', 'her-forest.jpg', 'her-face6.jpg', 'her-sel-bracelet.jpg',
  'her-face7.jpg', 'her-campus.jpg', 'her-face8.jpg', 'her-sel-white.jpg', 'her-rocks.jpg', 'her-sel-navy.jpg',
]

// Memory timeline — edit these to your real milestones.
export interface Memory {
  photo?: string
  video?: string
  date: string
  title: string
  description: string
}

export const MEMORIES: Memory[] = [
  {
    photo: 'her-sel-bracelet.jpg',
    date: '2023, one morning',
    title: 'At the school gate',
    description: "This is where I first saw you, in front of the school, in the morning light. I was in 11th std. I didn't know an ordinary morning could quietly change everything.",
  },
  {
    photo: 'her-green2.jpg',
    date: 'since then',
    title: 'A few hellos',
    description: "We've only spoken a few times. I was nervous every single time, and I still remember each like a small treasure even though i got ghosted.",
  },
  {
    photo: 'her-saree2.jpg',
    date: 'one special day',
    title: 'The drawing competition',
    description: "You entered the drawing competition. I entered too. Somehow that day became one I'll carry with me forever.",
  },
  {
    photo: 'her-hand2.jpg',
    date: 'one ordinary day',
    video: HER_VIDEO,
    title: 'The video',
    description: "You posted a tiny video in your story. It was so sweet. I've watched it more than a thousand times, and it still feels like the first.",
  },
  {
    photo: 'her-sel-white.jpg',
    date: 'today',
    title: 'Your birthday',
    description: "So I made this for you. Pirandha naal vazhthukkal, Vandhana. And at the end, there's one thing I've been wanting to ask you.",
  },
]

// The sealed letter, read after breaking the wax seal.
export const LETTER_TEXT = `Hi ${HER_NAME},

It's ${WHO}. We've only spoken a few times, so this may come as a surprise, and I'm sorry if it feels sudden. Mannichidunga. I just couldn't keep it inside my heart any longer.

I first saw you in front of the school one morning in 2023, when I was in 11th std. I don't know what happened to me that day. The morning simply felt different, as if the whole world had quietly turned a little softer.

Since then, I started taking the same road every morning, only hoping to see you. Even a few seconds were enough to light up my whole day. I never said anything, because I never wanted to trouble you or make you uncomfortable. I just kept you in my heart, quietly, the way one keeps a prayer.

What I love most about you is how honestly you express yourself, the sweet way you do even the smallest things, and that kuzhandhai manasu, the child inside you. To me, it's the most beautiful thing about you.

I can't tell you when it happened. Somewhere along the way you became the first thought of my mornings and the last thought of my nights, and your happiness slowly became my own.

Today is your birthday, so I wanted to give you something that comes straight from my heart. Every photo here is from your Instagram. I hope that's okay. I only wanted you to see yourself the way I see you: soft, bright, and impossible to forget.

There's one question waiting for you at the end. Please answer it exactly as you feel. Whatever your answer is, I will respect it, and I'll still be grateful that I told you.

Pirandha naal vazhthukkal, ${HER_NAME}. May this year hold you gently, and may every day give you a reason to smile. Romba nandri for reading this.

Yours, quietly and always,
${WHO}`

// Constellation of places — shown as stars on a night sky, tap each for a memory.
// x/y are percentages (0-100) of the sky area.
export interface PlaceStar {
  photo?: string
  x: number
  y: number
  name: string
  memory: string
}

export const PLACES: PlaceStar[] = [
  { x: 22, y: 30, photo: 'her-campus.jpg', name: 'What your smile does', memory: "It makes the whole world go quiet. All my worries disappear for a moment, and I just stand there, happy." },
  { x: 55, y: 18, photo: 'her-bench.jpg', name: 'What I am scared of', memory: "That this may feel like too much. If it does, I'm sorry. I only couldn't keep it in my heart any longer." },
  { x: 75, y: 45, photo: 'her-rocks.jpg', name: 'What I hope for', memory: "That you're happy, truly. Whatever you decide, that is the one wish I will always keep for you." },
  { x: 38, y: 62, photo: 'her-sel-navy.jpg', name: 'What I want you to know', memory: "That you can take all the time you need. There's no rush and no pressure at all. Love that is real can wait." },
]

// Photo stack — a scattered pile of cards. Each one shows a photo on the front;
// tapping it flips it over to reveal a short message, tapping again flips it back.
// Put images in /public/photos/ and reference the filename here. Leave `photo`
// blank to show a placeholder heart instead of a missing image.
export interface StackCard {
  photo: string // e.g. 'us-1.jpg' — file must exist in /public/photos/
  message: string
}

export const PHOTO_STACK: StackCard[] = [
  { photo: 'her-bench2.jpg', message: "Vandhana, every time you smile, my whole day glows a little brighter." },
  { photo: 'her-pillar.jpg', message: "When something good happens, you're the first person I want to tell. You always have been." },
  { photo: 'her-maroon.jpg', message: "Love looks not with the eyes, but with the mind." },
  { photo: 'her-tea5.jpg', message: "They say love at first sight isn't real. Then I saw you at the school gate." },
  { photo: 'her-white.jpg', message: "Children have always liked the princess story, but they never knew what was her name. I think the princess was, is and will always be you." },
  { photo: 'her-bw2.jpg', message: "When you love someone, you love the person as they are, and not as you'd like them to be." },
  { photo: 'her-necklace.jpg', message: "Warning: looking at your photos for too long causes heart stop. I'm afraid I'm already a patient." },
  { photo: 'her-ivy.jpg', message: "Are you a library book? Because I've been wanting to take you home since 11th std." },
  { photo: 'her-stripes.jpg', message: "Can I be with you forever, Vandhana? There's no hurry. I'll wait for your answer, however long it takes." },
]

// Photo-merge scene — two Polaroid-style cards that come together. Put images
// in /public/photos/ and reference the filenames here. Leave either blank to
// show a soft placeholder heart in its place instead of a missing image.
export const YOUR_PHOTO = 'wc-him.jpg' // you — from the watercolor portrait
export const HER_PHOTO = 'wc-her.jpg' // her — from the watercolor portrait
export const MERGE_CAPTION = 'Us, in watercolour. Soft, and just a little dreamlike.'

// Optional voice message — drop an mp3 into /public/sounds/ and set the filename here.
// Leave as '' to hide the voice message player.
export const VOICE_MESSAGE_FILE = ''


// Optional ambient background music — drop an mp3 into /public/sounds/ and set filename.
// Leave as '' to disable. Volume gradually builds the longer she stays on the page.
export const AMBIENT_MUSIC_FILE = ''
export const AMBIENT_MUSIC_START_VOLUME = 0.12
export const AMBIENT_MUSIC_MAX_VOLUME = 0.35
export const AMBIENT_MUSIC_BUILD_SECONDS = 90 // time to reach max volume

// Where her "reply" can be sent when she uses the share button.
// If you give a WhatsApp number (international format, no + or spaces, e.g. '919876543210'),
// the reply scene will offer a direct "send on WhatsApp" option.
// If left blank, she'll get the native share sheet (or copy-to-clipboard fallback) instead.
export const YOUR_WHATSAPP_NUMBER = ''

// ============================================================
// 📬 AUTOMATIC ANSWERS DELIVERY (optional but recommended)
// ------------------------------------------------------------
// Without this, her answers only exist in HER browser's storage —
// you'd have to open dev tools on her exact device to see them.
// Set this up once and her answers get emailed to you automatically,
// the moment she finishes the Questions scene and again if she replies.
//
// FREE, NO-CODE SETUP (takes ~2 minutes):
// 1. Go to https://formspree.io and sign up with your email (free tier is enough).
// 2. Click "New Form", give it any name, and copy the endpoint it gives you —
//    it looks like: https://formspree.io/f/xxxxxxxx
// 3. Paste that URL below.
// 4. The first time she completes it, Formspree will send you a confirmation
//    email to verify your address — approve it, then everything after
//    lands directly in your inbox.
//
// Leave this blank to skip it entirely — the app still works fully offline,
// you'd just need to check her browser's console instead (exportLoveDB()).
export const NOTIFY_WEBHOOK_URL = 'https://formspree.io/f/xoeqjqdv'

// ============================================================
// 🎂 BIRTHDAY SCENES
// ============================================================

// Her age — sets how many candles appear on the cake.
export const HER_AGE = 19 // born 14 Nov 2007

// Age / year milestones — reflective lines shown one at a time.
export interface AgeMilestone {
  photo?: string
  age: string // e.g. '18', '21', 'This year'
  text: string
}


export const AGE_MILESTONES: AgeMilestone[] = [
  { photo: 'her-glow.jpg', age: 'when I think of you', text: "I carry your heart with me (I carry it in my heart)." },
  { photo: 'her-necklace.jpg', age: 'when I see you', text: "They say don't stare at the sun for too long. Nobody warned me about you, cause you glow even more." },
  { photo: 'her-warm.jpg', age: 'when we talk', text: "Kadhal vandha kavidhai varum, they say. For me it's an awkward silence and a very red face." },
  { photo: 'her-yellow.jpg', age: 'every morning', text: "I took the same road every morning for you. Honestly, that road should be thanking you." },
]

// Balloon-pop message — each word is one balloon; popping them all spells this out.
export const BALLOON_MESSAGE: string[] = [
  'HAPPY', 'BIRTHDAY', HER_NAME.toUpperCase(), '🥰', 'YOU', 'ARE', 'MY', 'FAVOURITE', 'SUNRISE', 'EVERY', 'MORNING', '💖',
]

// Birthday card — opened like a card instead of a sealed letter.
export const BIRTHDAY_CARD_COVER = `Happy ${HER_AGE}th Birthday, ${HER_NAME}`
export const BIRTHDAY_CARD_TEXT = `Pirandha naal vazhthukkal, ${HER_NAME}!

Today the world celebrates the day you arrived, and I'm celebrating it a little more quietly, in my heart, with a smile I can't hide.

I hope your day is full of laughter, your favourite people, and a cake sweet enough to match your smile. You deserve every bit of it, and so many more smiles than one day can hold.

You make ordinary mornings feel worth waking up for. Thank you for being exactly who you are.

May this year be gentle with you, and may every dream you've been quietly carrying find its way home. And if there's a small corner in those dreams for me, I would be the happiest person alive.

Please enjoy your day. Eat the cake, laugh out loud, and be your beautiful self.

With all my heart,
${WHO}`

// Gift box scene.
export const GIFT_MESSAGE = "A tiny gift for your birthday, wrapped in everything I could never say out loud. I hope it makes you smile. 🎀"
// Optional line describing a real gift/voucher waiting for her. Leave blank to hide.
export const GIFT_VOUCHER = ''

// Scratch card scene — hidden message under the scratch-off layer.
export const SCRATCH_MESSAGE = 'Surprise! Happy birthday, Vandhana. looking like the sweetest thing in the room. 🎂'
// Optional photo shown instead of/alongside the message. File must exist in /public/photos/.
export const SCRATCH_IMAGE = 'her-cake.jpg'

// Cake scene — message revealed after the candles are blown out and the cake is cut.
export const CAKE_SLICE_MESSAGE = "I hope every wish you made today finds its way to you. And if one of them is me, I won't mind at all. 🍓"

// Fireworks finale message, shown just before the grand Final scene.
export const FIREWORKS_MESSAGE = `Pirandha naal vazhthukkal, ${HER_NAME}! May this year sparkle the way you do. 🎆`

// Closing letter, revealed line-by-line inside the final envelope, right
// before the keepsake download appears.
export const CLOSING_LETTER_LINES: string[] = [
  `One last thing, ${HER_NAME}.`,
  "Will you accept my follow request in instagram?",
  "Thank you for reading every word.",
]

// A tiny heart sits quietly in the corner of every scene, the whole way
// through. Tapping it reveals a message. Tapping it again after that cycles
// through the rest of this list — a small reward for noticing it more than once.
export const SECRET_HEART_MESSAGES: string[] = [
  "Hi. I've been sitting quietly here the whole time, just keeping you company.",
  "You found me. I'm a little shy, so thank you for being gentle.",
  "One more: my heart is racing because you're reading this. I hope it made you smile, even a little.",
  "Quick one: you're really, really cute. That's all. I'll go back to hiding. Okay, no, I'll peek once more.",
  "Fun fact: I've typed your name so many times while making this, my keyboard knows it by heart.",
  "Okay, I lied. One more: I'd happily be late to everything, if it meant a few more minutes with you.",
  "Honestly? You don't have to say anything. Just stay, and read. That alone already makes me happy.",
  "If you're blushing right now, I'm calling that a win. 😌",
  "Okay, last one. Smile for me? It's my favourite thing in the world. 😊",
]

// ============================================================
// "IF I COULD GIVE YOU ONE THING" — a quiet, minimal scene late
// in the journey. Sentences reveal one at a time on a dark screen,
// then this list of wishes for her (not about the relationship —
// just things I hope for you).
// ============================================================
export const ONE_THING_INTRO_LINES: string[] = [
  'If I could give you one thing...',
  "it wouldn't fit in a box.",
  'no ribbon either.',
  "it would simply be...",
  'a thousand more reasons to smile. And maybe me, standing right beside you.',
]

export const ONE_THING_MESSAGES: string[] = [
  'I hope this year is as gentle with you as you are with everyone.',
  'I hope you laugh, properly, from the very bottom of your heart.',
  "I hope you receive the things you've been quietly wishing for.",
  'I hope you never lose your kuzhandhai manasu.',
  "I hope someone holds your hand through the hard days, and I hope, if you'll let me, it's me.",
  "And I hope that one day, when someone asks me what happiness looks like, I get to point at you.",
]

export const ONE_THING_CLOSING = "That's it. That's my one wish, with all my heart."

// A short, deliberately uneventful pause scene — no buttons, no
// interaction, just a photo and a little quiet. Set PAUSE_PHOTO to a
// filename in /public/photos/ or leave blank for a soft placeholder.
export const PAUSE_PHOTO = 'her-hand.jpg'
export const PAUSE_SECONDS = 90 // 9 pickup lines x 10s each, so every line gets shown

// ============================================================
// 🏛️ OUR LITTLE MUSEUM
// A small horizontally-browsable gallery of exhibits, each reusing
// data that already exists elsewhere in the site (photos, memories,
// the letter) rather than duplicating content.
// ============================================================
export interface MuseumExhibit {
  label: string // tiny handwritten-style tag, e.g. "this one ♡"
  title: string
  caption: string
}

export const MUSEUM_PHOTO_CAPTION = 'A photo that made my heart skip, just a little.'

export const MUSEUM_TABLE_NOTE = 'Small things, laid out with care, the way you keep what you treasure.'

// The covered frame, discovered last.
export const MUSEUM_FINAL_LINES: string[] = [
  'Every photo in this room is yours.',
  'I only placed them in frames so I could look at them a little longer, the way you look at things you love.',
  'I hope that is okay.',
]

// ============================================================
// 👀 YOU DON'T KNOW THIS ABOUT YOURSELF
// Private observations, not compliments — specific, small, noticed.
// ============================================================
export interface Observation {
  text: string
  annotation?: string // used sparingly — a tiny handwritten aside under a few of these
  photo?: string // optional filename in /public/photos/
}

export const OBSERVATIONS: Observation[] = [
  { text: "You turn small moments into something special without even trying. I don't think you realise it.", annotation: 'I noticed.', photo: 'her-tea4.jpg' },
  { text: "The blinking of eyes is an involuntary reflex action, provided they eyes are not watching your beauty.", annotation: 'blushing yet?', photo: 'her-sel-navy2.jpg' },
  { text: "To love someone means to see them as God intended them.", photo: 'her-close2.jpg' },
  { text: "I'd climb any hill, cross any road, and walk through any tea garden, just to stand where you're standing.", annotation: 'I would, you know.', photo: 'her-bangles.jpg' },
  { text: "Your smile needs a warning label: may cause sudden happiness and a very silly grin. Mine, mostly.", annotation: 'consider yourself warned.', photo: 'her-stream.jpg' },
  { text: "I think love is when someone's happiness slowly becomes your own. Somewhere along the way, yours quietly became mine.", photo: 'her-window.jpg' },
]

export const OBSERVATIONS_COVER_TITLE = 'little things I love about you'
export const OBSERVATIONS_COVER_SUBTITLE = 'no pressure, only the truth, said softly.'

export const OBSERVATIONS_CLOSING_LINES: string[] = [
  'These are only small things.',
  'But small things are how a heart decides, quietly, without asking.',
  'Will you be my world, Vandhana?',
]

// ============================================================
// 🗒️ 100 TINY THINGS
// Short, playful, specific phrases — not dramatic reasons. This
// starter list is intentionally generic as a scaffold; swap these
// for 100 real tiny details you actually notice about her.
// ============================================================
export const TINY_THINGS: string[] = [
  'your smile', 'your eyes', 'your hair when it\'s loose', 'your hair in the wind', 'the red top',
  'the green dupatta', 'the white saree', 'the maroon one', 'your jhumkas', 'your bangles',
  'the gold bracelet', 'your watch', 'a flower in your hair', 'your hands near your face',
  'looking down when you smile', 'looking away on purpose', 'your side profile',
  'the dark photos where only your smile is lit', 'the bright ones where you glow',
  'black and white you', 'that necklace', 'your bindi', 'the yellow top', 'purple on you',
  'hand under your chin', 'hand in your hair', 'tea garden you', 'red bench you', 'by-the-water you',
  'campus you', 'ID-card you', 'saree you', 'jhumka you', 'mirror selfies', 'your tiny smirk',
  'that little head tilt', 'and honestly, so much more than this list could ever hold.',
]

// Indices (0-based) into TINY_THINGS that trigger a small extra moment when found.
// Not visually marked beforehand — discovered naturally.
export const SPECIAL_TINY_THING_INDICES: number[] = [6, 14, 24, 31]
export const SPECIAL_TINY_THING_BONUS = 'found a secret one ♡'






// ============================================================
// 🎞️ THE REEL — a slow, cinematic photo montage just before the
// fireworks. One photo + one line each. Files live in /public/photos/.
// ============================================================
export interface ReelSlide {
  photo: string
  line: string
}

export const REEL_INTRO = 'a few frames my heart keeps'

export const REEL_SLIDES: ReelSlide[] = [
  { photo: 'her-campus2.jpg', line: "Vandhana, some mornings are only bright because one road happened to lead to you." },
  { photo: 'her-saree.jpg', line: "Calm, graceful, so completely you. I could look at this one all day and never tire of it." },
  { photo: 'her-poster.jpg', line: "You turn ordinary light into something a painter would stay up all night to catch." },
  { photo: 'her-jhumka.jpg', line: "That smile. If I could keep only one thing in the whole world, I'd choose that." },
  { photo: 'her-tea2.jpg', line: "Whatever you wear, wherever you are, my eyes find you first. They've always been disobedient that way." },
  { photo: 'her-balcony.jpg', line: "If I could, I'd stand right beside you and never leave. Not even for a second." },
  { photo: 'her-green3.jpg', line: "You glow, Vandhana. Not the photo, not the light. You." },
  { photo: 'her-dream.jpg', line: "Can I be with you forever? I promise to take care of that smile, and of you." },
]

export const REEL_OUTRO = 'and so many more days I want to spend making you smile.'

// ============================================================
// 🖼️ SINGLE-PHOTO SPOTS — each uses a portrait of her (files in /public/photos)
// ============================================================
export const SPLASH_PHOTO = 'her-green.jpg'
export const MUSEUM_PHOTO = 'her-bw.jpg'
export const LETTER_PHOTO = 'her-mirror.jpg'
export const GIFT_PHOTO = 'her-tea.jpg'
export const CARD_COVER_PHOTO = 'her-flower.jpg'
export const HERO_HEART_PHOTO = 'her-close.jpg'
export const CAKE_BUNTING: string[] = ['her-purple.jpg', 'her-ivy.jpg']
export const CAKE_CUT_PHOTO = 'her-crimson.jpg'

// Every portrait of her, in the order they drift across the opening wall.
export const WALL_PHOTOS: string[] = [
  'her-campus', 'her-bench2', 'her-saree', 'her-jhumka', 'her-poster', 'her-crimson', 'her-tea2', 'her-green2',
  'her-flower', 'her-glow', 'her-white', 'her-sel-navy', 'her-pillar', 'her-bw', 'her-green', 'her-saree2',
  'her-maroon', 'her-warm', 'her-hand', 'her-tea5', 'her-campus2', 'her-stripes', 'her-necklace', 'her-sel-white',
  'her-balcony', 'her-chin', 'her-dream', 'her-bench', 'her-bw2', 'her-sel-bracelet', 'her-tea4', 'her-close',
  'her-yellow', 'her-green3', 'her-mirror', 'her-moody', 'her-sel-navy2', 'her-bow', 'her-purple', 'her-tea',
  'her-bw3', 'her-close2', 'her-forest', 'her-stream', 'her-handchin', 'her-ivy', 'her-red2', 'her-window',
  'her-rocks', 'her-violet', 'her-bangles', 'her-bw4', 'her-palms', 'her-saree3', 'her-hand2', 'her-bw5',
  'her-bw6', 'her-cake',
]

// Chapter 21 — "just breathe": her photos drift in and out with each breath.
export const ONE_MINUTE_PHOTOS: string[] = ['her-chin.jpg', 'her-bw2.jpg', 'her-bw3.jpg', 'her-handchin.jpg', 'her-bow.jpg']

// Chapter 22 — one photo for each part of "if I could give you one thing".
export const ONE_THING_PHOTOS: string[] = ['her-flower.jpg', 'her-close.jpg', 'her-green.jpg']

// Chapter 21 — little lines to make her smile while she breathes.
export const PICKUP_LINES: string[] = [
  "Hi. That's my whole pickup line. I spent all my courage just getting this far. 😄",
  "If I could rearrange the alphabet, I'd put U and I together.",
  "Are you Google? Because you've got everything I've been searching for.",
  "Some people make an entrance. You made a difference.",
  "Are you made of copper and tellurium? Because you're Cu-Te.",
  "I could spend a lifetime learning the little things that make you smile.",
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "If beauty had a voice, I think it would sound like your laugh.",
  "I always have many roads to travel, but I take the one which leads to you.",
]
