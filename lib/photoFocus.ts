// Where HER FACE sits in each photo ("x% y%"), so every crop keeps her face in
// frame whatever shape the frame is. Also how far to zoom in on small faces.
const FOCUS: Record<string, string> = {
  // original portraits
  'her-campus.webp': '46% 24%',
  'her-flower.webp': '46% 24%',
  'her-saree.webp': '48% 22%',
  'her-stripes.webp': '62% 36%',
  'her-dream.webp': '50% 52%',
  'her-green.webp': '50% 34%',
  'her-maroon.webp': '43% 25%',
  'her-cake.webp': '47% 31%',
  'her-ivy.webp': '64% 38%',
  'her-tea.webp': '58% 62%',
  'her-bw.webp': '47% 23%',
  'her-mirror.webp': '52% 30%',
  // added from the other screenshots
  'her-balcony.webp': '53% 33%',
  'her-bench.webp': '47% 32%',
  'her-bench2.webp': '50% 35%',
  'her-campus2.webp': '44% 33%',
  'her-close.webp': '45% 38%',
  'her-close2.webp': '35% 33%',
  'her-crimson.webp': '49% 40%',
  'her-green2.webp': '66% 42%',
  'her-green3.webp': '37% 55%',
  'her-hand.webp': '62% 36%',
  'her-jhumka.webp': '46% 38%',
  'her-pillar.webp': '62% 20%',
  'her-poster.webp': '47% 22%',
  'her-purple.webp': '55% 42%',
  'her-saree2.webp': '28% 40%',
  'her-sel-bracelet.webp': '27% 28%',
  'her-sel-navy.webp': '60% 28%',
  'her-sel-navy2.webp': '40% 26%',
  'her-sel-white.webp': '60% 28%',
  'her-stream.webp': '82% 25%',
  'her-tea2.webp': '55% 48%',
  'her-tea4.webp': '62% 45%',
  'her-tea5.webp': '47% 25%',
  'her-white.webp': '37% 20%',
  'her-window.webp': '70% 60%',
  'her-rocks.webp': '62% 26%',
  'her-bangles.webp': '72% 35%',
  // photos found by matching her face across your screenshots
  'her-glow.webp': '57% 38%',
  'her-chin.webp': '50% 38%',
  'her-bw2.webp': '50% 38%',
  'her-moody.webp': '60% 40%',
  'her-necklace.webp': '50% 38%',
  'her-bw3.webp': '44% 37%',
  'her-handchin.webp': '50% 41%',
  'her-violet.webp': '50% 38%',
  'her-forest.webp': '54% 38%',
  'her-bw4.webp': '50% 37%',
  'her-warm.webp': '50% 38%',
  'her-bw5.webp': '50% 37%',
  'her-bw6.webp': '50% 38%',
  'her-hand2.webp': '50% 39%',
  'her-saree3.webp': '50% 38%',
  'her-red2.webp': '50% 36%',
  'her-palms.webp': '51% 39%',
  'her-bow.webp': '49% 40%',
  'her-yellow.webp': '49% 38%',
  'her-face1.webp': '49% 46%',
  'her-face2.webp': '50% 48%',
  'her-face3.webp': '50% 48%',
  'her-face4.webp': '50% 48%',
  'her-face5.webp': '50% 48%',
  'her-face6.webp': '50% 48%',
  'her-face7.webp': '50% 48%',
  'her-face8.webp': '50% 50%',
  // the watercolor portrait (the only picture with both of you)
  'us-watercolor.webp': '50% 32%',
  'wc-him.webp': '54% 40%',
  'wc-her.webp': '35% 32%',
}
export const focusOf = (file?: string) => (file && FOCUS[file]) || '50% 25%'

// Zoom for tiny round frames, where far-away photos need to be brought close.
const ZOOM: Record<string, number> = {
  'her-stripes.webp': 1.9, 'her-maroon.webp': 2.6, 'her-bw.webp': 2.4, 'her-cake.webp': 1.8, 'her-ivy.webp': 2.8,
  'her-balcony.webp': 1.9, 'her-bench.webp': 1.4, 'her-pillar.webp': 1.6, 'her-purple.webp': 3.6, 'her-stream.webp': 3.2,
  'her-tea2.webp': 1.6, 'her-tea4.webp': 2.4, 'her-tea5.webp': 1.3, 'her-moody.webp': 1.4, 'her-bw3.webp': 1.5, 'her-forest.webp': 1.5, 'her-bw6.webp': 1.3, 'her-saree3.webp': 1.5, 'her-palms.webp': 1.3, 'her-rocks.webp': 2.2, 'her-tea.webp': 1.6, 'her-green2.webp': 1.2, 'her-poster.webp': 1.2,
}
/** tight = small round frame (zoom all the way); otherwise a gentler zoom for bigger frames. */
export const zoomOf = (file?: string, tight = true) => {
  const z = (file && ZOOM[file]) || 1
  return tight ? z : 1 + (z - 1) * 0.45
}
