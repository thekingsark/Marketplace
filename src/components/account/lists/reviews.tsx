import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { NoResultsAvailable } from '../../common/no-results'
import { useEffect, useRef, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { ReviewItem } from '@/components/reviews/review-item'
import { ReviewsController } from '@/core/controllers/review'
import { Review } from '@/core/domain/review'
import { ReviewCardSkeleton } from '../../skeletons/review'

const ITEMS_PER_PAGE = 10

export const AccountReviewsSection = (props: { account: Account }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { account } = props

  const [currentPage, setCurrentPage] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviews, setReviews] = useState<Record<string, Review[]>>({})
  const initDoneRef = useRef(false)

  const reviewsRootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchFollowers = async () => {
      setReviewsLoading(true)

      const reviewsData = await ReviewsController.getForAccount(account.id, 0, ITEMS_PER_PAGE)
      setReviews({ 0: reviewsData })
      setCurrentPage(0)
      setReviewsLoading(false)
      initDoneRef.current = true
    }

    fetchFollowers()
  }, [account])

  const handlePageChange = async (page: number) => {
    if (reviews[page]) {
      setCurrentPage(page)
      return
    }

    setReviewsLoading(true)
    setCurrentPage(page)

    const newAuctions = await ReviewsController.getForAccount(account.id, page, ITEMS_PER_PAGE)

    setReviews((prev) => ({ ...prev, [page]: newAuctions }))
    setReviewsLoading(false)

    setTimeout(() => {
      if (reviewsRootRef.current) {
        reviewsRootRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }, 0)
  }

  if (!account.reviewsCount) {
    return <NoResultsAvailable title={t('profile.reviews.no_reviews')} />
  }

  const maxPages = Math.ceil(account.reviewsCount / ITEMS_PER_PAGE)
  const minBetweenPerPageAndExisting = Math.min(ITEMS_PER_PAGE, account.reviewsCount)
  const arrayOfFollowing = Array.from({ length: minBetweenPerPageAndExisting }, (_, index) => index)

  return (
    <div ref={reviewsRootRef}>
      <div className="mb-10">
        <span>{t('info.you_see_page', { page: currentPage + 1, total: maxPages })}</span>
      </div>

      <div className="d-flex gap-2 flex-column">
        {(!initDoneRef.current || reviewsLoading || !reviews[currentPage]) &&
          arrayOfFollowing.map((index) => {
            return <ReviewCardSkeleton key={index} />
          })}
        {initDoneRef.current &&
          !reviewsLoading &&
          reviews[currentPage]?.map((review, index) => {
            return <ReviewItem key={index} withBorder review={review} />
          })}
      </div>

      <div className="d-flex justify-content-center mt-20 mb-10">
        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={(page) => {
            handlePageChange(page.selected)
          }}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={maxPages}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
}
