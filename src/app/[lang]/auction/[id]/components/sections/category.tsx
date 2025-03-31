import { Auction } from '@/core/domain/auction'
import Link from 'next/link'
import { AuctionDetailsCategoryCard } from './summary/category-card'
import { AuctionDetailsConditionCard } from './summary/condition-card'
import { AuctionDetailsPrice } from './summary/price-card'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'

export const AuctionDetailsCategorySection = (props: { auction: Auction }) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const getCategoryById = (categoryId: string) => {
    return globalContext.appCategories.find((category) => category.id === categoryId)
  }

  return (
    <div className="row w-100 p-16 mt-20 mb-20 app-section no-bs-gutter">
      <div className="col-6 col-sm-6 col-md-4">
        <AuctionDetailsCategoryCard auction={auction} />
      </div>
      <div className="col-md-4 d-none d-md-block">
        <AuctionDetailsPrice auction={auction} center />
      </div>
      <div className="col-md-4 d-none d-md-block">
        <AuctionDetailsConditionCard auction={auction} />
      </div>
      <div className="d-flex justify-content-end col-6 d-block d-md-none">
        <Link
          className="d-flex align-items-center"
          href={`/auctions?cat=${encodeURIComponent(
            getCategoryById(auction.mainCategoryId)?.name[currentLanguage] ?? ''
          )}&sort=0&page=1`}
        >
          <button className="border-btn" aria-label={t('generic.see_all')}>
            {t('generic.see_all')}
          </button>
        </Link>
      </div>
    </div>
  )
}
