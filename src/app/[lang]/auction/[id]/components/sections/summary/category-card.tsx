'use client'
import { CategoryIcon } from '@/components/common/category-icon'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'

export const AuctionDetailsCategoryCard = observer((props: { auction: Auction }) => {
  const { auction } = props

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const categories = globalContext.appCategories

  if (!categories?.length) {
    return <div className="auction-details-category-card-root" style={{ height: 88 }}></div>
  }

  const auctionCategory = categories.find((category) => category.id === auction.mainCategoryId)
  const auctionSubCategory = auctionCategory!.subcategories!.find(
    (category) => category.id === auction.subCategoryId
  )

  return (
    <div className="auction-details-category-card-root gap-2">
      <CategoryIcon category={auctionCategory!} size={48} />
      <div className="d-flex flex-column">
        <span>{auctionCategory?.name[currentLanguage]}</span>
        <span className="secondary-color fw-light">
          {auctionSubCategory?.name[currentLanguage]}
        </span>
      </div>
    </div>
  )
})
