import { useTranslation } from '@/app/i18n/client'
import { CategoryIcon } from '@/components/common/category-icon'
import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import { Icon } from '@/components/common/icon'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'
import { AuctionsCountSuffix } from '../common/auctions-count-suffix'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

export const AuctionsListCategoriesFilter = observer(
  (props: {
    defaultSelected?: Category
    allAuctionsCount: number
    withLabel?: boolean
    customStyle?: React.CSSProperties
    handleChange: (category?: Category) => void
  }) => {
    const { withLabel = true } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const options: CustomSelectOption[] = globalContext.appCategories.map((category) => ({
      id: category.id,
      option: category.name[currentLanguage],
      icon: <CategoryIcon category={category} />,
      sufix: <AuctionsCountSuffix count={category.auctionsCount ?? 0} />,
    }))

    options.unshift({
      id: 'all',
      option: t('home.categories.all'),
      icon: <Icon type="logo" />,
      sufix: <AuctionsCountSuffix count={AppStore.activeAuctionsCount || props.allAuctionsCount} />,
    })

    const handleChange = (item: CustomSelectOption) => {
      const category = globalContext.appCategories.find((el) => el.id === item.id)
      props.handleChange(category)
    }

    const indexOfDefault = options.findIndex((option) => option.id === props.defaultSelected?.id)

    return (
      <div className="w-100">
        {withLabel && <span className="secondary-color">{t('info.main_category')}</span>}
        <CustomSelect
          withSearch
          options={options}
          defaultCurrent={indexOfDefault !== -1 ? indexOfDefault : 0}
          onChange={handleChange}
          name="main-category-filter"
          className={`w-100  ${withLabel ? 'mt-1' : ''}`}
          customStyle={props.customStyle}
        />
      </div>
    )
  }
)
