'use client'

import { focusOf, zoomOf } from '@/lib/photoFocus'

/** A round portrait that zooms in on the face, even for full-length photos. */
export default function FaceCircle({ file, size = 104 }: { file: string; size?: number }) {
  const pos = focusOf(file)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: '4px solid #fffaf7',
        boxShadow: '0 0 0 1.5px rgba(212,149,107,0.55), 0 10px 24px rgba(139,58,30,0.25)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/photos/${file}`}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoomOf(file)})`, transformOrigin: pos }}
      />
    </div>
  )
}
