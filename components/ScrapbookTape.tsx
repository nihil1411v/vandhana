interface Props {
  top?: number
  rotate?: number
  color?: string
  side?: 'left' | 'center' | 'right'
}

/** A small strip of washi tape, positioned at the top edge of a paper card. */
export default function ScrapbookTape({ top = -9, rotate = -4, color = 'rgba(196,130,80,0.5)', side = 'center' }: Props) {
  const leftPos = side === 'left' ? '18%' : side === 'right' ? '82%' : '50%'
  return (
    <div
      className="absolute rounded-sm"
      style={{
        top,
        left: leftPos,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width: 34,
        height: 14,
        background: color,
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    />
  )
}
