import { memo } from 'react'

export const AuctionsCountSuffix = memo((props: { count: number }) => {
  return (
    <div className="auctions-filter-count">
      <span className="secondary-color ">{props.count}</span>
    </div>
  )
})

AuctionsCountSuffix.displayName = 'AuctionsCountSuffix'
