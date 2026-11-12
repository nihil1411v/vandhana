'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import SplashScene from '@/components/SplashScene'
import HeroScene from '@/components/HeroScene'
import HeartScene from '@/components/HeartScene'
import RevealScene from '@/components/RevealScene'
import SwipeScene from '@/components/SwipeScene'
import GiftBoxScene from '@/components/GiftBoxScene'
import ScratchCardScene from '@/components/ScratchCardScene'
import TimelineScene from '@/components/TimelineScene'
import ConstellationScene from '@/components/ConstellationScene'
import PhotoStackScene from '@/components/PhotoStackScene'
import AgeMilestoneScene from '@/components/AgeMilestoneScene'
import BirthdayCardScene from '@/components/BirthdayCardScene'
import LetterScene from '@/components/LetterScene'
import BalloonPopScene from '@/components/BalloonPopScene'
import CakeScene from '@/components/CakeScene'
import ReasonsScene from '@/components/ReasonsScene'
import MemoryMuseumScene from '@/components/MemoryMuseumScene'
import ObservationsScene from '@/components/ObservationsScene'
import TinyThingsScene from '@/components/TinyThingsScene'
import QuestionsScene from '@/components/QuestionsScene'
import OneMinuteScene from '@/components/OneMinuteScene'
import OneThingScene from '@/components/OneThingScene'
import FireworksScene from '@/components/FireworksScene'
import MemoryReelScene from '@/components/MemoryReelScene'
import FinalScene from '@/components/FinalScene'
import KeepsakeScene from '@/components/KeepsakeScene'
import ReturnLoopScene from '@/components/ReturnLoopScene'
import DateLockGate from '@/components/DateLockGate'
import AmbientAudio from '@/components/AmbientAudio'
import SecretHeart from '@/components/SecretHeart'
import FloatingHearts from '@/components/FloatingHearts'
import GlowBlobs from '@/components/GlowBlobs'
import CursorHearts from '@/components/CursorHearts'
import TapToBeginGate from '@/components/TapToBeginGate'
import SceneTransition from '@/components/SceneTransition'
import ChapterIndicator from '@/components/ChapterIndicator'
import { startPreload } from '@/lib/preload'
import { getStoryTrackSrcs } from '@/lib/music'
import { WALL_THUMBS, ROOT_IMAGES, PHOTOS, MUSIC_FILES } from '@/lib/assetManifest'

export type Scene =
  | 'splash'
  | 'hero'
  | 'heart'
  | 'reveal'
  | 'swipe'
  | 'giftbox'
  | 'scratchcard'
  | 'timeline'
  | 'constellation'
  | 'photostack'
  | 'agemilestone'
  | 'birthdaycard'
  | 'letter'
  | 'balloonpop'
  | 'cake'
  | 'questions'
  | 'reasons'
  | 'museum'
  | 'observations'
  | 'tinythings'
  | 'oneminute'
  | 'onething'
  | 'reel'
  | 'fireworks'
  | 'proposal'
  | 'final'
  | 'keepsake'
  | 'returnloop'

export default function Home() {
  const [scene, setScene] = useState<Scene>('splash')
  const [scrollLocked, setScrollLocked] = useState(true)
  const [began, setBegan] = useState(false)

  const goTo = useCallback((next: Scene) => {
    setScene(next)
  }, [])

  const unlockScroll = useCallback(() => {
    setScrollLocked(false)
  }, [])

  // Start downloading every photo + song the moment the site opens, while the
  // opening screen plays, so no scene has to wait on the network later.
  useEffect(() => {
    const story = getStoryTrackSrcs()
    startPreload({
      criticalImages: [...WALL_THUMBS, ...ROOT_IMAGES, '/photos/us-watercolor.webp'],
      otherImages: PHOTOS,
      criticalAudio: story.slice(0, 3), // splash, hero, heart
      otherAudio: [...story, ...MUSIC_FILES.filter(f => !story.includes(f))],
    })
  }, [])

  useEffect(() => {
    // Lock scroll during key scenes
    const locked = ['hero', 'heart', 'reveal'].includes(scene)
    setScrollLocked(locked)
  }, [scene])

  if (!began) {
    return (
      <>
        <AmbientAudio />
        <TapToBeginGate onBegin={() => setBegan(true)} />
      </>
    )
  }

  const renderScene = () => {
    switch (scene) {
      case 'splash':
        return <SplashScene onComplete={() => goTo('hero')} />
      case 'hero':
        return <HeroScene onComplete={() => goTo('heart')} />
      case 'heart':
        return <HeartScene onComplete={() => goTo('reveal')} />
      case 'reveal':
        return <RevealScene onComplete={() => goTo('giftbox')} />
        //return <RevealScene onComplete={() => goTo('swipe')} />
      case 'swipe':
        return <SwipeScene onComplete={() => goTo('giftbox')} />
      case 'giftbox':
        return <GiftBoxScene onComplete={() => goTo('scratchcard')} />
      case 'scratchcard':
        return <ScratchCardScene onComplete={() => goTo('timeline')} />
      case 'timeline':
        return <TimelineScene onComplete={() => goTo('constellation')} />
      case 'constellation':
        return <ConstellationScene onComplete={() => goTo('photostack')} />
      case 'photostack':
        return <PhotoStackScene onComplete={() => goTo('agemilestone')} />
      case 'agemilestone':
        return <AgeMilestoneScene onComplete={() => goTo('birthdaycard')} />
      case 'birthdaycard':
        return <BirthdayCardScene onComplete={() => goTo('letter')} />
      case 'letter':
        return <LetterScene onComplete={() => goTo('balloonpop')} />
      case 'balloonpop':
        return <BalloonPopScene onComplete={() => goTo('cake')} />
      case 'cake':
        return <CakeScene onComplete={() => goTo('questions')} />
      case 'questions':
        return <QuestionsScene onComplete={() => goTo('reasons')} />
      case 'reasons':
        return <ReasonsScene onComplete={() => goTo('museum')} />
      case 'museum':
        return <MemoryMuseumScene onComplete={() => goTo('observations')} />
      case 'observations':
        return <ObservationsScene onComplete={() => goTo('tinythings')} />
      case 'tinythings':
        return <TinyThingsScene onComplete={() => goTo('oneminute')} />
      case 'oneminute':
        return <OneMinuteScene onComplete={() => goTo('onething')} />
      case 'onething':
        return <OneThingScene onComplete={() => goTo('reel')} />
      case 'reel':
        return <MemoryReelScene onComplete={() => goTo('fireworks')} />
      case 'fireworks':
        return <FireworksScene onComplete={() => goTo('proposal')} />
      case 'proposal':
        return <QuestionsScene mode="proposal" onComplete={() => goTo('final')} />
      case 'final':
        return <FinalSceneWrapper onNext={() => goTo('keepsake')} />
      case 'keepsake':
        return <KeepsakeScene onComplete={() => goTo('returnloop')} />
      case 'returnloop':
        return <ReturnLoopScene onRestart={() => goTo('splash')} />
      default:
        return null
    }
  }

  return (
    <DateLockGate>
      <main className="relative w-screen h-dvh overflow-hidden bg-black">
        {/* Ambient floating hearts — behind every scene */}
        <GlowBlobs />
        <FloatingHearts />
        <CursorHearts />
        {/* Cinematic vignette — hidden on light-background scenes */}
        {scene !== 'heart' && <div className="vignette" />}
        {/* Film grain */}
        <div className="grain" />

        <AmbientAudio scene={scene} />
        <SecretHeart />
        <ChapterIndicator scene={scene} />

        {/* Scene Router — each scene gets a coordinated fade/blur transition
            in and out instead of an instant swap, so moving between scenes
            feels like turning a page rather than a page reload. */}
        <AnimatePresence>
          <SceneTransition key={scene}>{renderScene()}</SceneTransition>
        </AnimatePresence>
      </main>
    </DateLockGate>
  )
}

function FinalSceneWrapper({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-full h-full">
      <FinalScene />
      <button
        onClick={onNext}
        className="btn-keep fixed bottom-6 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap"
      >
        keep this moment →
      </button>
    </div>
  )
}
