import { useTranslation } from '@/app/i18n/client'
import { CategoryIcon } from '@/components/common/category-icon'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'

export const AuctionDetailsBreadcrumbs = (props: { auction: Auction }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auction } = props

  const categories = globalContext.appCategories
  const auctionCategory = categories.find((category) => category.id === auction.mainCategoryId)
  const auctionSubCategory = auctionCategory!.subcategories!.find(
    (category) => category.id === auction.subCategoryId
  )

  const getCategoryUrl = () => {
    return `/auctions?cat=${encodeURIComponent(
      auctionCategory?.name[currentLanguage] ?? 'all'
    )}&sort=0&page=1`
  }

  const subCategoryUrl = () => {
    return `/auctions?cat=${encodeURIComponent(
      auctionCategory?.name[currentLanguage] ?? 'all'
    )}&sub=${encodeURIComponent(auctionSubCategory?.name[currentLanguage] ?? 'all')}&sort=0&page=1`
  }

  return (
    <section className="d-none d-lg-flex align-items-center auction-details-breadcrumbs">
      <div className="d-flex justify-content-between align-items-center">
        <nav>
          <ul className="custom-breadcrumb-items">
            <li className="custom-breadcrumb-item">
              <Link href="/auctions">{t('home.auctions.auctions')}</Link>
            </li>
            <li className="custom-breadcrumb-item">
              <Link href={getCategoryUrl()}>
                <CategoryIcon category={auctionCategory!} size={24} />
                <span> {auctionCategory?.name[currentLanguage]}</span>
              </Link>
            </li>

            {auctionSubCategory && (
              <li className="custom-breadcrumb-item">
                <Link href={subCategoryUrl()}>
                  <span>{auctionSubCategory?.name[currentLanguage]}</span>
                </Link>
              </li>
            )}

            <li className="custom-breadcrumb-item">
              <span>{auction.title}</span>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  )
}
