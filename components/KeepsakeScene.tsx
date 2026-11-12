'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HER_NAME, CLOSING_LETTER_LINES } from '@/lib/config'
import { buildKeepsakeDownloadHtml, buildKeepsakePrintInnerHtml } from '@/lib/keepsakeContent'
import { playPageTurn } from '@/lib/sound'
import Flourish from '@/components/Flourish'

type Stage = 'envelope' | 'letter' | 'reveal' | 'actions'

const PREVIEW_CARDS = [
  { label: 'The Letter', rotate: -7, offset: -30 },
  { label: 'Our Story', rotate: 4, offset: 0 },
  { label: 'What You Told Me', rotate: -2, offset: 30 },
]

export default function KeepsakeScene({ onComplete }: { onComplete?: () => void }) {
  const printRootRef = useRef<HTMLDivElement | null>(null)
  const [stage, setStage] = useState<Stage>('envelope')
  const [downloaded, setDownloaded] = useState(false)
  const [printed, setPrinted] = useState(false)

  const openEnvelope = () => {
    if (stage !== 'envelope') return
    playPageTurn()
    setStage('letter')
    // Give every line time to finish revealing before moving on.
    const lineTime = 900
    setTimeout(() => {
      setStage('reveal')
    }, CLOSING_LETTER_LINES.length * lineTime + 700)
    setTimeout(() => setStage('actions'), CLOSING_LETTER_LINES.length * lineTime + 2400)
  }

  const download = () => {
    const html = buildKeepsakeDownloadHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${HER_NAME.replace(/\s+/g, '-').toLowerCase()}-keepsake.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }

  const saveAsPdf = () => {
    if (printRootRef.current) {
      printRootRef.current.innerHTML = buildKeepsakePrintInnerHtml()
    }
    setPrinted(true)
    // Small delay so the freshly-injected content is painted before print grabs it.
    setTimeout(() => window.print(), 80)
  }

  return (
    <motion.div
      className="scene flex flex-col items-center justify-center px-6 gap-8"
      style={{ background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop />
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        one last thing
      </p>
      <Flourish />

      <AnimatePresence mode="wait">
        {/* ---- Stage 1: sealed envelope ---- */}
        {stage === 'envelope' && (
          <motion.div
            key="envelope"
            className="flex flex-col items-center gap-8 cursor-pointer select-none"
            onClick={openEnvelope}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative"
              style={{ width: 180, height: 120 }}
              animate={{ rotate: [0, -1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, #2a1420 0%, #150a10 100%)',
                  border: '1px solid rgba(255,182,193,0.3)',
                }}
              />
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  height: '58%',
                  background: 'linear-gradient(180deg, #3a1a26 0%, #200f18 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderBottom: '1px solid rgba(255,182,193,0.25)',
                }}
              />
              <motion.div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  width: 42,
                  height: 42,
                  marginLeft: -21,
                  marginTop: -21,
                  background: 'radial-gradient(circle at 35% 30%, #ff8fb3 0%, #c4306b 60%, #7a1240 100%)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span style={{ color: '#2a0508', fontSize: 16 }}>♡</span>
              </motion.div>
            </motion.div>

            <motion.p
              className="font-cinzel text-[9px] tracking-[8px] uppercase"
              style={{ color: '#a8305a' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              tap to open
            </motion.p>
          </motion.div>
        )}

        {/* ---- Stage 2: letter, revealed line by line ---- */}
        {stage === 'letter' && (
          <motion.div
            key="letter"
            className="flex flex-col items-center gap-4 max-w-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {CLOSING_LETTER_LINES.map((line, i) => (
              <motion.p
                key={i}
                className="font-cormorant italic text-center"
                style={{ fontSize: 'clamp(16px, 3.4vw, 20px)', color: '#6b2c42', lineHeight: 1.8 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.9, duration: 0.8 }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* ---- Stage 3: the final surprise (postcard stack) ---- */}
        {(stage === 'reveal' || stage === 'actions') && (
          <motion.div
            key="reveal"
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-script text-center" style={{ fontSize: 'clamp(28px, 6.5vw, 42px)', color: '#8b3050' }}>
              Every page, saved for you
            </h2>

            <div className="relative flex items-center justify-center" style={{ width: 220, height: 100 }}>
              {PREVIEW_CARDS.map((c, i) => (
                <motion.div
                  key={c.label}
                  className="absolute flex items-center justify-center rounded-sm"
                  style={{
                    width: 110,
                    height: 74,
                    left: '50%',
                    marginLeft: -55 + c.offset,
                    background: 'linear-gradient(160deg, #fff8f5 0%, #ffe9ee 100%)',
                    border: '1px solid rgba(196,48,107,0.25)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                    zIndex: i,
                  }}
                  initial={{ opacity: 0, rotate: c.rotate, y: 10 }}
                  animate={{ opacity: 1, rotate: c.rotate, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <span className="font-cormorant italic text-center px-2" style={{ fontSize: 11, color: '#8b0032' }}>
                    {c.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <p
              className="font-cormorant italic font-light text-center max-w-sm"
              style={{ fontSize: 'clamp(16px, 3.2vw, 20px)', color: '#a8305a', lineHeight: 1.9 }}
            >
              Every letter, every reason, every answer you gave, folded into one little
              keepsake, so none of it fades when this page closes.
            </p>

            {/* ---- Stage 4: download actions, appearing after the reveal settles ---- */}
            <AnimatePresence>
              {stage === 'actions' && (
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <button className="btn-romantic" onClick={download}>
                      💌 save our story
                    </button>
                    <button className="btn-romantic" onClick={saveAsPdf}>
                      🖨️ save as pdf
                    </button>
                  </div>

                  {(downloaded || printed) && (
                    <motion.p
                      className="font-cinzel text-[9px] tracking-[8px] uppercase"
                      style={{ color: '#8b3050' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {downloaded && printed
                        ? 'saved both ways ♡'
                        : downloaded
                        ? 'saved to your downloads ♡'
                        : 'opening print dialog — choose "Save as PDF" ♡'}
                    </motion.p>
                  )}

                  <p className="font-cormorant italic text-xs text-center" style={{ color: '#a8305a', maxWidth: 340 }}>
                    "Save our story" downloads a keepsake page you can open anytime. "Save as PDF" opens your
                    browser's print dialog — choose "Save as PDF" as the destination there.
                  </p>

                  {onComplete && (
                    <button
                      className="font-cinzel text-[9px] tracking-[8px] uppercase mt-2"
                      style={{ color: '#a8305a' }}
                      onClick={onComplete}
                    >
                      finish
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden — only becomes visible to the browser's print engine via @media print */}
      <div id="keepsake-print-root" ref={printRootRef} />
    </motion.div>
  )
}
