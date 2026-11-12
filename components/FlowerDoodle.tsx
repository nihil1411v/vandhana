interface Props {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

/** A tiny pressed-flower-feeling doodle — five soft petals, hand-drawn in spirit. */
export default function FlowerDoodle({ size = 20, color = '#d4956b', className = '', style }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={style}>
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse
          key={i}
          cx={20}
          cy={10}
          rx={4.5}
          ry={9}
          fill={color}
          opacity={0.7}
          transform={`rotate(${i * 72} 20 20)`}
        />
      ))}
      <circle cx={20} cy={20} r={4} fill="#c4306b" opacity={0.75} />
    </svg>
  )
}
