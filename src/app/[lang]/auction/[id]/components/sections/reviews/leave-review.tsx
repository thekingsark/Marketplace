import { useTranslation } from '@/app/i18n/client'
import { BaseRating } from '@/components/reviews/rating'
import { ReviewsController } from '@/core/controllers/review'
import { Auction } from '@/core/domain/auction'
import { Review } from '@/core/domain/review'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { generateNameForAccount } from '@/utils'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const AuctionDetailsLeaveReview = observer((props: { auction: Auction }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auction } = props

  const auctionReviews = [...auction.reviews]
  const acceptedBid = auction.bids.find((bid) => bid.id === auction.acceptedBidId)

  const isAuctionOwner = auction.auctioneer?.id === AppStore.accountData?.id
  const leaveReviewFor = isAuctionOwner ? acceptedBid?.bidder : auction.auctioneer

  const review = auctionReviews.find((review) => review.reviewed?.id === leaveReviewFor?.id)

  const [initialReview, setInitialReview] = useState<Review | undefined>(review)
  const [reviewStars, setReviewStars] = useState(review ? review.stars : 0)
  const [reviewDescription, setReviewDescription] = useState(review ? review.description : '')
  const [canBeSaved, setCanBeSaved] = useState(false)
  const [saveInProgress, setSaveInProgress] = useState(false)

  useEffect(() => {
    if (!review) {
      return
    }

    setInitialReview(review)
    setReviewStars(review.stars)
    setReviewDescription(review.description)
  }, [review])

  useEffect(() => {
    if (!initialReview) {
      setCanBeSaved(!!reviewStars)
      return
    }

    if (reviewStars !== initialReview?.stars) {
      setCanBeSaved(true)
      return
    }

    if (reviewDescription !== initialReview?.description) {
      setCanBeSaved(true)
      return
    }

    setCanBeSaved(false)
  }, [reviewStars, initialReview, reviewDescription])

  const handleSave = async () => {
    if (saveInProgress || !reviewStars) {
      return
    }

    if (reviewStars === initialReview?.stars && reviewDescription === initialReview?.description) {
      return
    }

    setSaveInProgress(true)

    try {
      const saved = await ReviewsController.save({
        reviewId: review?.id,
        stars: reviewStars,
        description: reviewDescription,
        auctionId: auction.id,
      })

      if (!saved) {
        toast.error(
          t(
            !!review
              ? 'auction_details.reviews.could_not_update_review'
              : 'auction_details.reviews.could_not_create_review'
          )
        )
      } else {
        setInitialReview(saved)
        toast.success(
          t(
            !!review
              ? 'auction_details.reviews.review_updated'
              : 'auction_details.reviews.review_created'
          )
        )
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaveInProgress(false)
    }
  }

  if (!leaveReviewFor || !AppStore.accountData?.id) {
    return null
  }

  if (!isAuctionOwner && acceptedBid?.bidder?.id !== AppStore.accountData.id) {
    return null
  }

  return (
    <div className="w-100 p-16 app-section">
      <div className="w-100 d-flex align-items-center justify-content-between">
        <span>
          {t('auction_details.reviews.would_you_leave_review')}{' '}
          <Link href={`/account/${leaveReviewFor.id}`}>
            <strong>{generateNameForAccount(leaveReviewFor)}</strong>
          </Link>
        </span>

        <div style={{ width: 200 }}>
          <BaseRating
            onChange={setReviewStars}
            initialValue={reviewStars}
            inactiveColor="var(--font_3)"
          />
        </div>
      </div>
      <div className="mt-20">
        <textarea
          className="custom-textarea"
          style={{ height: 100 }}
          maxLength={1000}
          value={reviewDescription}
          onChange={(e) => {
            setReviewDescription(e.target.value)
          }}
          placeholder={t('auction_details.reviews.review_details')}
        />
        <div className="d-flex justify-content-end">
          <span>{reviewDescription?.length}/1000</span>
        </div>
      </div>
      <div className="d-flex justify-content-center w-100 mt-10">
        <button
          disabled={!canBeSaved}
          onClick={handleSave}
          className={`${canBeSaved ? 'fill-btn' : 'disabled-btn'} w-100`}
          aria-label={t('auction_details.reviews.save_review')}
        >
          {t('auction_details.reviews.save_review')}
        </button>
      </div>
    </div>
  )
})
