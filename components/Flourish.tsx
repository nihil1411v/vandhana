export default function Flourish({ symbol = '❦' }: { symbol?: string }) {
  return <div className="flourish font-cormorant text-sm">{symbol}</div>
}
