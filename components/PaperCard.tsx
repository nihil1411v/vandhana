'use client'

import CornerHearts from '@/components/CornerHearts'
import ScrapbookTape from '@/components/ScrapbookTape'
import RomanticPaper from '@/components/RomanticPaper'

export default function PaperCard({
  children,
  motionKey,
  maxWidth = 420,
  rotate = 0,
}: {
  children: React.ReactNode
  motionKey?: string | number
  maxWidth?: number
  rotate?: number
}) {
  return (
    <RomanticPaper
      motionKey={motionKey}
      maxWidth={maxWidth}
      rotate={rotate}
      className="flex flex-col items-center gap-4 text-center px-8 py-9"
    >
      <ScrapbookTape />
      <CornerHearts />
      {children}
    </RomanticPaper>
  )
}
