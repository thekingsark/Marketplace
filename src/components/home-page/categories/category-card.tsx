import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { CategoryIcon } from '@/components/common/category-icon'

export const CategoryCard = (props: { category: Category; maxCategoryHeight?: number }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { category } = props
  return (
    <div
      className="home-page-category-card d-flex align-items-center flex-col justify-content-center col-md-3 col-sm-4 col-4 mb-2 p-0"
      style={{ ...(props.maxCategoryHeight ? { height: props.maxCategoryHeight } : {}) }}
    >
      <div className="category-card-wrapper w-100 mr-2 ml-2 h-100">
        <Link
          href={`/auctions?cat=${encodeURIComponent(
            category.name[currentLanguage] === 'All' ? 'all' : category.name[currentLanguage]
          )}&sort=0&page=1`}
          className="h-100"
        >
          <div className="category-card-root w-100 m-10 d-flex text-center align-items-center justify-content-between h-100">
            <div>
              <span className="mb-0 m-0 category-card-title">{category.name[currentLanguage]}</span>
            </div>
            <CategoryIcon category={category} size={48} />
            <p className="m-0 categories-card-auctions-count">
              {category.auctionsCount?.toString() === '1'
                ? t('generic.auction_count_singular')
                : t('generic.auction_count_plural', {
                    no: category.auctionsCount,
                  })}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
