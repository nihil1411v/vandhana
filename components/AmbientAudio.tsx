'use client'

import { useEffect, useState } from 'react'
import {
  beginMusic,
  triggerSceneMusicCue,
  getMusicSnapshot,
  getUserVolume,
  playChapterMusic,
  primeAudio,
  retryIfBlocked,
  setUserVolume,
  toggleMuted,
  subscribe,
  togglePlaying,
} from '@/lib/music'

interface Props {
  scene?: string
}

const MOOD_COLORS: Record<string, { wash: string; glow: string; ink: string }> = {
  dream: { wash: 'rgba(174, 125, 218, 0.13)', glow: 'rgba(255, 205, 235, 0.16)', ink: '#fff0f8' },
  anticipation: { wash: 'rgba(104, 169, 191, 0.10)', glow: 'rgba(229, 242, 255, 0.14)', ink: '#eef8ff' },
  conversation: { wash: 'rgba(235, 151, 190, 0.10)', glow: 'rgba(255, 228, 238, 0.15)', ink: '#fff0f6' },
  courtship: { wash: 'rgba(242, 129, 154, 0.12)', glow: 'rgba(255, 218, 192, 0.15)', ink: '#fff0e9' },
  joy: { wash: 'rgba(137, 174, 116, 0.10)', glow: 'rgba(231, 244, 206, 0.13)', ink: '#f5fff0' },
  tender: { wash: 'rgba(208, 119, 158, 0.11)', glow: 'rgba(255, 206, 227, 0.15)', ink: '#fff1f7' },
  nostalgic: { wash: 'rgba(168, 128, 105, 0.10)', glow: 'rgba(245, 216, 186, 0.12)', ink: '#fff3e7' },
  night: { wash: 'rgba(91, 85, 164, 0.13)', glow: 'rgba(170, 182, 255, 0.12)', ink: '#f1f2ff' },
  confession: { wash: 'rgba(125, 66, 100, 0.12)', glow: 'rgba(244, 180, 207, 0.12)', ink: '#fff0f5' },
  admiration: { wash: 'rgba(207, 147, 115, 0.10)', glow: 'rgba(255, 223, 184, 0.13)', ink: '#fff7ef' },
  peaceful: { wash: 'rgba(107, 147, 155, 0.08)', glow: 'rgba(209, 236, 229, 0.12)', ink: '#effaf7' },
  wish: { wash: 'rgba(130, 130, 193, 0.11)', glow: 'rgba(213, 216, 255, 0.13)', ink: '#f3f3ff' },
  commitment: { wash: 'rgba(138, 71, 89, 0.11)', glow: 'rgba(255, 198, 177, 0.12)', ink: '#fff1ea' },
  celebration: { wash: 'rgba(235, 155, 95, 0.10)', glow: 'rgba(255, 228, 177, 0.15)', ink: '#fff4e9' },
  silence: { wash: 'rgba(255, 255, 255, 0.015)', glow: 'rgba(255, 255, 255, 0.02)', ink: '#f8ecf1' },
}

export default function AmbientAudio({ scene }: Props) {
  const [snapshot, setSnapshot] = useState(() => getMusicSnapshot())
  const [started, setStarted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const mood = MOOD_COLORS[snapshot.mood] ?? MOOD_COLORS.dream

  useEffect(() => subscribe(() => setSnapshot(getMusicSnapshot())), [])

  useEffect(() => {
    if (window.sessionStorage.getItem('love-story-audio-started') === '1') {
      beginMusic()
      setStarted(true)
    }

    const handleBegin = () => {
      window.sessionStorage.setItem('love-story-audio-started', '1')
      beginMusic()
      // Unlock the audio on this tap, but stay silent: the chapter 1 song starts
      // when the "Happy Birthday" screen actually appears (the [started, scene] effect below).
      primeAudio()
      setStarted(true)
    }
    window.addEventListener('love-story-begin', handleBegin)
    return () => window.removeEventListener('love-story-begin', handleBegin)
  }, [])

  // If the browser blocked autoplay, the very next tap / key press starts the music.
  useEffect(() => {
    // The opening gate has no scene — taps there must never start music.
    if (!scene) return
    const nudge = () => retryIfBlocked()
    window.addEventListener('pointerdown', nudge, { passive: true })
    window.addEventListener('keydown', nudge)
    window.addEventListener('touchstart', nudge, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', nudge)
      window.removeEventListener('keydown', nudge)
      window.removeEventListener('touchstart', nudge)
    }
  }, [scene])

  useEffect(() => {
    const handleCue = () => triggerSceneMusicCue()
    window.addEventListener('love-story-music-cue', handleCue)
    return () => window.removeEventListener('love-story-music-cue', handleCue)
  }, [])

  useEffect(() => {
    if (started && scene) {
      playChapterMusic(scene)
    }
  }, [started, scene])

  useEffect(() => {
    if (snapshot.mood) document.documentElement.dataset.storyMood = snapshot.mood
  }, [snapshot.mood])

  if (!started) return null

  return (
    <>
      <div
        className="story-mood-veil"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 50% 15%, ${mood.glow} 0%, transparent 40%), linear-gradient(135deg, transparent 32%, ${mood.wash} 100%)`,
        }}
      />

      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-2 select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <div className="music-control-panel">
            <div className="music-control-copy">
              <span className="music-control-kicker">our little soundtrack</span>
              <span className="music-control-track">{snapshot.track ? snapshot.title : 'quiet for this chapter'}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={getUserVolume()}
              onChange={e => setUserVolume(parseFloat(e.target.value))}
              className="music-volume"
              aria-label="Music volume"
            />
            <button
              className="music-mini-action"
              onClick={toggleMuted}
              aria-label={snapshot.muted ? 'Unmute music' : 'Mute music'}
            >
              {snapshot.muted ? 'mute' : 'sound'}
            </button>
          </div>
        )}

        <button
          onClick={togglePlaying}
          aria-label={snapshot.playing ? 'Pause music' : 'Play music'}
          className="music-orb"
          data-playing={snapshot.playing && !snapshot.muted}
        >
          <span className="music-orb-heart">♡</span>
          <span className="music-orb-note">♪</span>
        </button>
      </div>
    </>
  )
}
