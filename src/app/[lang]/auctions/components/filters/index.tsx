import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AuctionsListCategoriesFilter } from './categories'
import { AuctionsListLocations } from './locations'
import { AuctionsListPriceFilter } from './price'
import { AuctionsListSubCategories } from './sub-categories'
import { AllAuctionsFilter } from '../../root'
import { useRouter } from 'next/navigation'
import useGlobalContext from '@/hooks/use-context'
import { updateSearchParams } from '../../utils'
import { Location } from '@/core/domain/location'
import { Category } from '@/core/domain/category'

export const AuctionFilters = (props: {
  locations: Location[]
  allAuctionsCount: number
  activeFilters: AllAuctionsFilter
  setActiveFilters: Dispatch<SetStateAction<AllAuctionsFilter>>
}) => {
  const { locations, activeFilters, setActiveFilters } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    forceUpdate((old) => old + 1)
  }, [props.activeFilters])

  const router = useRouter()

  const handleSelectCategory = (category?: Category) => {
    setActiveFilters((old) => ({
      ...old,
      selectedCategory: category ? category.name[currentLanguage] : '',
      selectedSubCategories: [],
      page: 1,
    }))

    updateURLSearchParams({
      sub: { value: '', deleteValue: true },
      page: { value: '1', replace: true },
      cat: {
        value: category ? category.name[currentLanguage] : '',
        replace: true,
      },
    })
  }

  const handleSelectSubCategory = (subCategory?: Category) => {
    const alreadyExists = activeFilters.selectedSubCategories.includes(
      subCategory?.name[currentLanguage] ?? ''
    )

    const newSelectedSubCategories = !subCategory
      ? []
      : alreadyExists
        ? activeFilters.selectedSubCategories.filter(
            (el) => el !== subCategory?.name[currentLanguage]
          )
        : [...activeFilters.selectedSubCategories, subCategory?.name[currentLanguage]]

    setActiveFilters((old) => ({
      ...old,
      selectedSubCategories: newSelectedSubCategories,
      page: 1,
    }))

    if (!subCategory) {
      updateURLSearchParams({
        sub: { value: '', deleteValue: true },
        page: { value: '1', replace: true },
      })
      return
    }

    updateURLSearchParams({
      sub: { value: subCategory ? subCategory.name[currentLanguage] : '' },
      page: { value: '1', replace: true },
    })
  }

  const handleMinPriceChange = (minPrice?: number) => {
    setActiveFilters((old) => ({
      ...old,
      minPrice,
      page: 1,
    }))
    updateURLSearchParams({
      min: {
        value: minPrice ? minPrice.toString() : '',
        ...(!minPrice ? { deleteValue: true } : { replace: true }),
      },
      page: { value: '1', replace: true },
    })
  }

  const handleMaxPriceChange = (maxPrice?: number) => {
    setActiveFilters((old) => ({
      ...old,
      maxPrice,
      page: 1,
    }))
    updateURLSearchParams({
      max: {
        value: maxPrice ? maxPrice.toString() : '',
        ...(!maxPrice ? { deleteValue: true } : { replace: true }),
      },
      page: { value: '1', replace: true },
    })
  }

  const handleSelectLocation = (location?: Location) => {
    const alreadyExists = activeFilters.selectedLocations.includes(location?.name ?? '')

    const newSelectedLocations = !location
      ? []
      : alreadyExists
        ? activeFilters.selectedLocations.filter((el) => el !== location?.name)
        : [...activeFilters.selectedLocations, location?.name]

    setActiveFilters((old) => ({
      ...old,
      selectedLocations: newSelectedLocations,
      page: 1,
    }))

    if (!location) {
      updateURLSearchParams({
        loc: { value: '', deleteValue: true },
        page: { value: '1', replace: true },
      })
      return
    }

    updateURLSearchParams({
      loc: { value: location ? location.name : '' },
      page: { value: '1', replace: true },
    })
  }

  // Whenever a filter is changed, this function will update the URLSearchParams
  // and push the new URL to the router.
  // This way, the user can share the URL with the filters applied.
  const updateURLSearchParams = (
    params: Record<string, { value: string; replace?: boolean; deleteValue?: boolean }>
  ) => {
    const newSearchParams = updateSearchParams(params)
    router.push(`/auctions?${newSearchParams}`, { scroll: false })
  }

  const getCategoryByName = (name: string) => {
    const categories = Object.values(globalContext.appCategories)
    return categories.find((category) => category.name[currentLanguage] === name)
  }

  return (
    <div className="p-1 d-flex w-100 gap-2 align-items-center justify-content-center auction-filters-root">
      <div className="auctions-filter-item">
        <AuctionsListCategoriesFilter
          allAuctionsCount={props.allAuctionsCount}
          defaultSelected={getCategoryByName(activeFilters.selectedCategory)}
          handleChange={handleSelectCategory}
        />
      </div>
      <div className="auctions-filter-item">
        <AuctionsListSubCategories
          selectedCategory={activeFilters.selectedCategory}
          selectedSubCategories={activeFilters.selectedSubCategories}
          handleChange={handleSelectSubCategory}
        />
      </div>
      <div className="auctions-filter-item">
        <AuctionsListLocations
          selectedLocations={activeFilters.selectedLocations}
          handleChange={handleSelectLocation}
          locations={locations}
        />
      </div>
      <div className="auctions-filter-item">
        <AuctionsListPriceFilter
          initialMinPrice={activeFilters.minPrice}
          initialMaxPrice={activeFilters.maxPrice}
          handleMinChange={handleMinPriceChange}
          handleMaxChange={handleMaxPriceChange}
        />
      </div>
    </div>
  )
}
