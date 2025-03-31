import { Auction } from '@/core/domain/auction'
import { AuctionDetailsConditionCard } from '../sections/summary/condition-card'
import { AuctionDetailsViewsCard } from '../sections/summary/views-card'
import { AuctionDetailsPlayVideoButton } from '../sections/summary/video-player'

export const AuctionDetailsMobileSummary = (props: { auction: Auction }) => {
  const { auction } = props
  return (
    <div className="d-flex align-items-end justify-content-between w-100 p-16">
      <div className="auction-details-mobile-card d-block d-lg-none">
        <AuctionDetailsConditionCard simple auction={props.auction} />
      </div>
      <div className="d-none d-lg-block"></div>
      <div className="d-flex gap-2 flex-column">
        <div className="auction-details-mobile-card" style={{ alignSelf: 'flex-end' }}>
          <AuctionDetailsViewsCard auction={auction} fullWidth />
        </div>

        {auction.youtubeLink &&
          <div className="auction-details-mobile-card">
            <AuctionDetailsPlayVideoButton auction={auction} />
          </div>}
      </div>
    </div>
  )
}
