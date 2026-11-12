export default function CornerHearts() {
  const corner = (style: React.CSSProperties) => (
    <span
      className="absolute"
      style={{ fontSize: 12, color: 'rgba(196,48,107,0.4)', ...style }}
    >
      ❦
    </span>
  )
  return (
    <>
      {corner({ top: 8, left: 10 })}
      {corner({ top: 8, right: 10, transform: 'scaleX(-1)' })}
      {corner({ bottom: 8, left: 10, transform: 'scaleY(-1)' })}
      {corner({ bottom: 8, right: 10, transform: 'scale(-1,-1)' })}
    </>
  )
}
