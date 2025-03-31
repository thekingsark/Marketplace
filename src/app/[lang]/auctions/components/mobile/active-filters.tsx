import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AllAuctionsFilter } from '../../root'
import { ActiveFilterItem } from './active-filter-item'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { CategoryIcon } from '@/components/common/category-icon'
import { updateSearchParams } from '../../utils'
import { useRouter } from 'next/navigation'

export const AuctionsActiveFilterCards = (props: {
  activeFilters: AllAuctionsFilter
  setActiveFilters: Dispatch<SetStateAction<AllAuctionsFilter>>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    forceUpdate((old) => old + 1)
  }, [props.activeFilters])

  const router = useRouter()
  const { activeFilters, setActiveFilters } = props

  const getCategoryByName = (name: string) => {
    const categories = Object.values(globalContext.appCategories)
    return categories.find((category) => category.name[currentLanguage] === name)
  }

  const deleteMainCategoryFilter = () => {
    setActiveFilters((old) => ({
      ...old,
      selectedCategory: 'all',
      selectedSubCategories: [],
      page: 1,
    }))

    updateURLSearchParams({
      sub: { value: '', deleteValue: true },
      page: { value: '1', replace: true },
      cat: {
        value: '',
        deleteValue: true,
      },
    })
  }

  const deleteSubCategoryFilter = (subCategory: string) => {
    const newSelectedSubCategories = activeFilters.selectedSubCategories.filter(
      (el) => el !== subCategory
    )

    setActiveFilters((old) => ({
      ...old,
      selectedSubCategories: newSelectedSubCategories,
      page: 1,
    }))

    updateURLSearchParams({
      sub: {
        value: newSelectedSubCategories.join(','),
        replace: true,
      },
      page: { value: '1', replace: true },
    })
  }

  const deleteLocationFilter = (location: string) => {
    const newSelectedLocations = activeFilters.selectedLocations.filter((el) => el !== location)

    setActiveFilters((old) => ({
      ...old,
      selectedLocations: newSelectedLocations,
      page: 1,
    }))

    updateURLSearchParams({
      loc: {
        value: newSelectedLocations.join(','),
        replace: true,
      },
      page: { value: '1', replace: true },
    })
  }

  const deleteMinPriceFilter = () => {
    setActiveFilters((old) => ({
      ...old,
      minPrice: undefined,
      page: 1,
    }))

    updateURLSearchParams({
      min: { value: '', deleteValue: true },
      page: { value: '1', replace: true },
    })
  }

  const deleteMaxPriceFilter = () => {
    setActiveFilters((old) => ({
      ...old,
      maxPrice: undefined,
      page: 1,
    }))

    updateURLSearchParams({
      max: { value: '', deleteValue: true },
      page: { value: '1', replace: true },
    })
  }

  const updateURLSearchParams = (
    params: Record<string, { value: string; replace?: boolean; deleteValue?: boolean }>
  ) => {
    const newSearchParams = updateSearchParams(params)
    router.push(`/auctions?${newSearchParams}`, { scroll: false })
  }

  const isValidNumber = (value: string) => {
    let isValid = true
    try {
      const number = Number(value)
      if (isNaN(number)) {
        isValid = false
      }
    } catch (error) {
      console.error(`Could not parse number: ${error}`)
      isValid = false
    }
    return isValid
  }

  return (
    <div className="d-flex d-lg-none align-items-center justify-content-start flex-wrap gap-2">
      {activeFilters.selectedCategory && activeFilters.selectedCategory !== 'all' && (
        <ActiveFilterItem
          onDelete={deleteMainCategoryFilter}
          title={activeFilters.selectedCategory}
          icon={<CategoryIcon category={getCategoryByName(activeFilters.selectedCategory)} />}
        />
      )}
      {activeFilters.selectedSubCategories.map((subCategory) => {
        return (
          <ActiveFilterItem
            key={subCategory}
            onDelete={() => {
              deleteSubCategoryFilter(subCategory)
            }}
            title={subCategory}
          />
        )
      })}
      {activeFilters.selectedLocations.map((location) => {
        return (
          <ActiveFilterItem
            key={location}
            onDelete={() => {
              deleteLocationFilter(location)
            }}
            title={location}
          />
        )
      })}
      {!!activeFilters.minPrice && isValidNumber(activeFilters.minPrice.toString()) && (
        <ActiveFilterItem
          onDelete={deleteMinPriceFilter}
          title={`${t('home.filter.min_price_value', {
            no: activeFilters.minPrice,
          })}`}
        />
      )}
      {!!activeFilters.maxPrice && isValidNumber(activeFilters.maxPrice.toString()) && (
        <ActiveFilterItem
          onDelete={deleteMaxPriceFilter}
          title={`${t('home.filter.max_price_value', {
            no: activeFilters.maxPrice,
          })}`}
        />
      )}
    </div>
  )
}
