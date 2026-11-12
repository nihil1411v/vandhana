'use client'

import { focusOf, zoomOf } from '@/lib/photoFocus'

/** The photo itself — fills its parent (which must have overflow:hidden) and zooms toward her face. */
export function ZoomImg({ file, tight = false, dir = 'photos' }: { file: string; tight?: boolean; dir?: string }) {
  const pos = focusOf(file)
  const z = zoomOf(file, tight)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/${dir}/${file}`}
      alt=""
      draggable={false}
      decoding="async"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: pos,
        transform: z > 1 ? `scale(${z})` : undefined,
        transformOrigin: pos,
      }}
    />
  )
}

/** A white-bordered print (or round portrait) with the face always in view. */
export default function PhotoFrame({
  file, width, height, rotate = 0, border = 6, round = false,
}: {
  file: string; width: number; height: number; rotate?: number; border?: number; round?: boolean
}) {
  return (
    <div
      style={{
        width,
        height,
        flexShrink: 0,
        overflow: 'hidden',
        boxSizing: 'content-box',
        border: `${border}px solid #fffaf7`,
        borderRadius: round ? '50%' : 0,
        boxShadow: round
          ? '0 0 0 1.5px rgba(212,149,107,0.55), 0 10px 24px rgba(139,58,30,0.25)'
          : '0 10px 24px rgba(139,58,30,0.25)',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <ZoomImg file={file} tight={round} />
    </div>
  )
}
