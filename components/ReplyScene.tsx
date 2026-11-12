'use client'

import PhotoBackdrop from '@/components/PhotoBackdrop'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { YOUR_WHATSAPP_NUMBER } from '@/lib/config'
import { setReply } from '@/lib/db'
import { notifyBackend } from '@/lib/notify'
import Flourish from '@/components/Flourish'

export default function ReplyScene() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    const existing = localStorage.getItem('love_her_reply')
    if (existing) {
      setText(existing)
      setSaved(true)
    }
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const save = () => {
    if (!text.trim()) return
    localStorage.setItem('love_her_reply', text)
    setReply(text)
    notifyBackend('saved a reply', { her_reply: text })
    setSaved(true)
  }

  const shareNative = async () => {
    if (!text.trim()) return
    setReply(text)
    notifyBackend('sent reply via share sheet', { her_reply: text })
    try {
      await navigator.share({ text })
    } catch {
      // user cancelled — do nothing
    }
  }

  const shareWhatsapp = () => {
    if (!text.trim()) return
    setReply(text)
    notifyBackend('sent reply via whatsapp', { her_reply: text })
    const url = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const copyText = async () => {
    if (!text.trim()) return
    setReply(text)
    notifyBackend('copied reply to send', { her_reply: text })
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <motion.div
      className="px-6"
      style={{
        width: '100vw',
        height: '100dvh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 10,
        WebkitOverflowScrolling: 'touch',
        background: 'radial-gradient(ellipse at top, #fff6f0 0%, #ffe9ee 45%, #f9d7e0 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <PhotoBackdrop />
      <div
        className="flex flex-col items-center justify-center gap-6"
        style={{ minHeight: '100%', paddingTop: 40, paddingBottom: 130 }}
      >
      <p className="font-cinzel text-[9px] tracking-[12px] uppercase" style={{ color: '#8b3050' }}>
        your turn, if you'd like
      </p>
      <Flourish />

      <p
        className="font-cormorant italic font-light text-center max-w-md"
        style={{ fontSize: 'clamp(18px, 3.5vw, 24px)', color: '#6b2c42', lineHeight: 1.9 }}
      >
        Say something back, if you want.
      </p>

      <textarea
        onFocus={() => window.dispatchEvent(new Event('love-story-music-cue'))}
        className="input-romantic w-full max-w-md"
        style={{ minHeight: 120, resize: 'none', paddingTop: 14, paddingBottom: 14 }}
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false) }}
        placeholder="write here…"
      />

      <div className="flex gap-4 flex-wrap justify-center">
        <button className="btn-romantic" onClick={save}>
          {saved ? 'saved ♡' : 'save'}
        </button>

        {YOUR_WHATSAPP_NUMBER && (
          <button className="btn-romantic" onClick={shareWhatsapp}>
            send on whatsapp
          </button>
        )}

        {!YOUR_WHATSAPP_NUMBER && canNativeShare && (
          <button className="btn-romantic" onClick={shareNative}>
            send it to him
          </button>
        )}

        {!YOUR_WHATSAPP_NUMBER && !canNativeShare && (
          <button className="btn-romantic" onClick={copyText}>
            {copied ? 'copied ♡' : 'copy to send'}
          </button>
        )}
      </div>

      <p className="font-cormorant italic text-xs" style={{ color: '#a8305a', maxWidth: 360, textAlign: 'center' }}>
        "Save" keeps it only on this device. The other button actually sends it — either through WhatsApp,
        her phone's share sheet, or a copy she can paste into a message to you.
      </p>
      </div>
    </motion.div>
  )
}
