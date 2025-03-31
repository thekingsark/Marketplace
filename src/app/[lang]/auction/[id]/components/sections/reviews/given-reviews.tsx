import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { ReviewItem } from '@/components/reviews/review-item'

export const AuctionDetailsGivenReviews = observer((props: { auction: Auction }) => {
  const { auction } = props

  return (
    <div className="mb-20 d-flex flex-column gap-4">
      {auction.reviews.map((review, index) => {
        if (!review.reviewer || review.reviewer?.id === AppStore.accountData?.id) {
          return null
        }
        return <ReviewItem key={index} review={review} viewAuction={false} />
      })}
    </div>
  )
})
