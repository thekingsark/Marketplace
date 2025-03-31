import { useTranslation } from '@/app/i18n/client'
import { CategoryIcon } from '@/components/common/category-icon'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'

export const PreferencesCategoryItem = (props: {
  category: Category
  selected?: boolean
  onClick: () => void
}) => {
  const { category, selected = false, onClick } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className={`h-100 category-card-top-wrapper p-1 m-0`} onClick={onClick}>
      <div
        className={`category-card-root gap-0 w-100 p-8 m-10 d-flex text-center align-items-center justify-content-between h-100 ${selected ? 'selected' : ''
          }`}
      >
        <span
          className="mb-0 m-0 d-flex align-items-center justify-content-center"
          style={{
            fontSize: 16,
            height: 56,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {category.name[currentLanguage]}
        </span>
        <CategoryIcon category={category} size={48} />
        <p className="m-0">
          {category.auctionsCount?.toString() === '1'
            ? t('generic.auction_count_singular')
            : t('generic.auction_count_plural', {
              no: category.auctionsCount,
            })}
        </p>
      </div>
      <style jsx>{`
        .selected {
          border: 1px solid var(--call_to_action);
          background: var(--transparent_call_to_action);
        }
      `}</style>
    </div>
  )
}
