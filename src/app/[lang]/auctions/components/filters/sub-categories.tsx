import { useTranslation } from '@/app/i18n/client'
import CustomMultiSelect, { CustomMultiSelectOption } from '@/components/common/custom-multi-select'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'
import { AuctionsCountSuffix } from '../common/auctions-count-suffix'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

export const AuctionsListSubCategories = observer(
  (props: {
    selectedCategory?: string
    selectedSubCategories?: string[]
    handleChange: (subCategory?: Category) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { selectedSubCategories } = props

    const [, updateState] = useState(0)

    useEffect(() => {
      updateState((old) => old + 1)
    }, [props.selectedSubCategories])

    const computeSelectedCategory = () => {
      const category = globalContext.appCategories.find(
        (el) => el.name[currentLanguage]?.toLowerCase() === props.selectedCategory?.toLowerCase()
      )
      return category ?? null
    }

    const [options, setOptions] = useState<CustomMultiSelectOption[]>([])

    const computeOptions = () => {
      const selectedCategory = computeSelectedCategory()
      const options =
        selectedCategory?.subcategories?.map((subCategory) => ({
          id: subCategory.id,
          option: subCategory.name[currentLanguage],
          sufix: <AuctionsCountSuffix count={subCategory.auctionsCount ?? 0} />,
        })) ?? []
      setOptions(options)
    }

    useEffect(() => {
      computeOptions()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedCategory])

    const handleChange = (item: CustomMultiSelectOption) => {
      const selectedCategory = computeSelectedCategory()
      const subCategory = selectedCategory?.subcategories?.find((el) => el.id === item.id)
      props.handleChange(subCategory)
    }

    const selectedCategory = computeSelectedCategory()

    return (
      <div className="">
        <span className="secondary-color">{t('info.sub_category')}</span>
        <CustomMultiSelect
          key={props.selectedCategory}
          withSearch
          options={options}
          allowAll
          allOptionSufix={
            <AuctionsCountSuffix
              count={selectedCategory?.auctionsCount ?? AppStore.activeAuctionsCount ?? 0}
            />
          }
          allSelectedByDefault={!selectedSubCategories?.length}
          initialSelected={selectedSubCategories ?? []}
          onChange={handleChange}
          name="sub-categories-filter"
          className="w-100 mt-1"
        />
      </div>
    )
  }
)
