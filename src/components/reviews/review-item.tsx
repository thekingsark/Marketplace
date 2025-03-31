import { Review } from '@/core/domain/review'
import Link from 'next/link'
import { memo } from 'react'
import Image from 'next/image'
import { generateNameForAccount } from '@/utils'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { BaseRating } from './rating'
import ShowMoreText from 'react-show-more-text'

export const ReviewItem = memo(
  (props: { review: Review; withBorder?: boolean; viewAuction?: boolean }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { review, viewAuction = true, withBorder = false } = props

    if (!review.reviewer) {
      return null
    }

    return (
      <div
        className="app-section"
        style={{
          ...(withBorder ? { border: '1px solid var(--separator)', boxShadow: 'none' } : {}),
        }}
      >
        <div className="justify-content-between review-item">
          <div className="d-flex align-items-center gap-2">
            <Link href={`/account/${review.reviewer.id}`}>
              <Image
                height={40}
                width={40}
                src={review.reviewer.picture}
                alt="User picture"
                style={{ borderRadius: '50%' }}
              />
            </Link>

            <div>
              <Link href={`/account/${review.reviewer.id}`}>
                <strong>{generateNameForAccount(review.reviewer)} </strong>
              </Link>
              <span>{t('auction_details.reviews.added_a_review')}</span>
            </div>
          </div>

          <div className="mt-10 text-center" style={{ width: 200 }}>
            <BaseRating initialValue={review.stars} inactiveColor="var(--font_3)" readonly />
          </div>
        </div>

        <div className="mt-10 w-100">
          {!!review.description ? (
            <ShowMoreText
              lines={2}
              more={t('generic.see_more')}
              less={t('generic.see_less')}
              anchorClass="blue-text"
              expanded={false}
            >
              {review.description}
            </ShowMoreText>
          ) : (
            t('auction_details.no_description_provided')
          )}
        </div>
        {viewAuction && (
          <div className="d-flex align-items-center justify-content-center mt-10">
            <Link href={`/auction/${review.auctionId}`}>
              <span className="blue-text">{t('profile.see_review_auction')}</span>
            </Link>
          </div>
        )}
      </div>
    )
  }
)

ReviewItem.displayName = 'ReviewItem'
