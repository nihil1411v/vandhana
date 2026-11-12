'use client'

import { WALL_PHOTOS } from '@/lib/config'
import { ZoomImg } from '@/components/PhotoFrame'

const TILT = [-2.6, 1.9, -1.3, 2.7, -2.1, 1.4, -0.8, 2.2]
const DUR = [96, 118, 88, 108, 92, 124]

/**
 * A slow, drifting wall of her photos, tinted to sit quietly behind a page.
 * It lives behind the content (z-index -1), so it works inside any scene.
 */
export default function PhotoBackdrop({ tone = 'light', strength }: { tone?: 'light' | 'dark'; strength?: number }) {
  const light = tone === 'light'
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 flex" style={{ opacity: strength ?? (light ? 0.55 : 0.4), padding: '0 2px' }}>
        {Array.from({ length: 6 }).map((_, k) => {
          const tiles = WALL_PHOTOS.filter((_, i) => i % 6 === k)
          const list = [...tiles, ...tiles]
          return (
            <div key={k} className="wall-col" style={{ flex: 1, minWidth: 0, padding: '0 5px' }}>
              <div style={{ animation: `${k % 2 ? 'wall-down' : 'wall-up'} ${DUR[k]}s linear infinite`, willChange: 'transform' }}>
                {list.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fffaf7',
                      padding: '5px 5px 15px',
                      marginBottom: 14,
                      borderRadius: 2,
                      boxShadow: light ? '0 8px 20px rgba(139,48,88,0.25)' : '0 8px 22px rgba(0,0,0,0.5)',
                      transform: `rotate(${TILT[(i + k) % 8]}deg)`,
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden' }}>
                      <ZoomImg file={`${f}.jpg`} dir="photos/t" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: light
            ? 'radial-gradient(ellipse at center, rgba(255,246,248,0.94) 0%, rgba(255,238,243,0.8) 50%, rgba(249,215,224,0.55) 100%)'
            : 'radial-gradient(ellipse at center, rgba(8,3,12,0.72) 0%, rgba(8,3,12,0.45) 65%, rgba(8,3,12,0.25) 100%)',
        }}
      />
    </div>
  )
}
