// Where HER FACE sits in each photo ("x% y%"), so every crop keeps her face in
// frame whatever shape the frame is. Also how far to zoom in on small faces.
const FOCUS: Record<string, string> = {
  // original portraits
  'her-campus.jpg': '46% 24%',
  'her-flower.jpg': '46% 24%',
  'her-saree.jpg': '48% 22%',
  'her-stripes.jpg': '62% 36%',
  'her-dream.jpg': '50% 52%',
  'her-green.jpg': '50% 34%',
  'her-maroon.jpg': '43% 25%',
  'her-cake.jpg': '47% 31%',
  'her-ivy.jpg': '64% 38%',
  'her-tea.jpg': '58% 62%',
  'her-bw.jpg': '47% 23%',
  'her-mirror.jpg': '52% 30%',
  // added from the other screenshots
  'her-balcony.jpg': '53% 33%',
  'her-bench.jpg': '47% 32%',
  'her-bench2.jpg': '50% 35%',
  'her-campus2.jpg': '44% 33%',
  'her-close.jpg': '45% 38%',
  'her-close2.jpg': '35% 33%',
  'her-crimson.jpg': '49% 40%',
  'her-green2.jpg': '66% 42%',
  'her-green3.jpg': '37% 55%',
  'her-hand.jpg': '62% 36%',
  'her-jhumka.jpg': '46% 38%',
  'her-pillar.jpg': '62% 20%',
  'her-poster.jpg': '47% 22%',
  'her-purple.jpg': '55% 42%',
  'her-saree2.jpg': '28% 40%',
  'her-sel-bracelet.jpg': '27% 28%',
  'her-sel-navy.jpg': '60% 28%',
  'her-sel-navy2.jpg': '40% 26%',
  'her-sel-white.jpg': '60% 28%',
  'her-stream.jpg': '82% 25%',
  'her-tea2.jpg': '55% 48%',
  'her-tea4.jpg': '62% 45%',
  'her-tea5.jpg': '47% 25%',
  'her-white.jpg': '37% 20%',
  'her-window.jpg': '70% 60%',
  'her-rocks.jpg': '62% 26%',
  'her-bangles.jpg': '72% 35%',
  // photos found by matching her face across your screenshots
  'her-glow.jpg': '57% 38%',
  'her-chin.jpg': '50% 38%',
  'her-bw2.jpg': '50% 38%',
  'her-moody.jpg': '60% 40%',
  'her-necklace.jpg': '50% 38%',
  'her-bw3.jpg': '44% 37%',
  'her-handchin.jpg': '50% 41%',
  'her-violet.jpg': '50% 38%',
  'her-forest.jpg': '54% 38%',
  'her-bw4.jpg': '50% 37%',
  'her-warm.jpg': '50% 38%',
  'her-bw5.jpg': '50% 37%',
  'her-bw6.jpg': '50% 38%',
  'her-hand2.jpg': '50% 39%',
  'her-saree3.jpg': '50% 38%',
  'her-red2.jpg': '50% 36%',
  'her-palms.jpg': '51% 39%',
  'her-bow.jpg': '49% 40%',
  'her-yellow.jpg': '49% 38%',
  'her-face1.jpg': '49% 46%',
  'her-face2.jpg': '50% 48%',
  'her-face3.jpg': '50% 48%',
  'her-face4.jpg': '50% 48%',
  'her-face5.jpg': '50% 48%',
  'her-face6.jpg': '50% 48%',
  'her-face7.jpg': '50% 48%',
  'her-face8.jpg': '50% 50%',
  // the watercolor portrait (the only picture with both of you)
  'us-watercolor.jpg': '50% 32%',
  'wc-him.jpg': '54% 40%',
  'wc-her.jpg': '35% 32%',
}
export const focusOf = (file?: string) => (file && FOCUS[file]) || '50% 25%'

// Zoom for tiny round frames, where far-away photos need to be brought close.
const ZOOM: Record<string, number> = {
  'her-stripes.jpg': 1.9, 'her-maroon.jpg': 2.6, 'her-bw.jpg': 2.4, 'her-cake.jpg': 1.8, 'her-ivy.jpg': 2.8,
  'her-balcony.jpg': 1.9, 'her-bench.jpg': 1.4, 'her-pillar.jpg': 1.6, 'her-purple.jpg': 3.6, 'her-stream.jpg': 3.2,
  'her-tea2.jpg': 1.6, 'her-tea4.jpg': 2.4, 'her-tea5.jpg': 1.3, 'her-moody.jpg': 1.4, 'her-bw3.jpg': 1.5, 'her-forest.jpg': 1.5, 'her-bw6.jpg': 1.3, 'her-saree3.jpg': 1.5, 'her-palms.jpg': 1.3, 'her-rocks.jpg': 2.2, 'her-tea.jpg': 1.6, 'her-green2.jpg': 1.2, 'her-poster.jpg': 1.2,
}
/** tight = small round frame (zoom all the way); otherwise a gentler zoom for bigger frames. */
export const zoomOf = (file?: string, tight = true) => {
  const z = (file && ZOOM[file]) || 1
  return tight ? z : 1 + (z - 1) * 0.45
}
