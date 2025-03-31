import { Category } from '@/core/domain/category'
import { FilterItem } from '@/core/domain/filter'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { AllAuctionsFilter } from './root'
import { Location } from '@/core/domain/location'
import { AuctionsSortBy } from '@/core/repositories/auction'

export const findCategoriesIdsFromNames = (allCategories: Category[], names: string[]) => {
  return allCategories
    .filter((category) =>
      Object.keys(category.name).some((lang) => names.includes(category.name[lang]))
    )
    .map((category) => category.id)
}

export const findSubCategoriesIdsFromNames = (
  allCategories: Category[],
  names: string[],
  currentLanguage: string
) => {
  return allCategories
    .filter((category) =>
      category.subcategories?.some((subCategory) =>
        names.includes(subCategory.name[currentLanguage])
      )
    )
    .map((category) =>
      category.subcategories
        ?.filter((subCategory) => names.includes(subCategory.name[currentLanguage]))
        .map((subCategory) => subCategory.id)
    )
    .flat() as string[]
}

export const findLocationsIdsFromNames = (allLocations: Location[], names: string[]) => {
  return allLocations
    .filter((location) => names.includes(location.name))
    .map((location) => location.id)
}

export const generateSearchParamsFromFilter = (filter: FilterItem, currentLanguage: string) => {
  const { selectedCategories, selectedSubCategories, selectedLocations, maxPrice, minPrice } =
    filter.data

  let minPriceNo: number | undefined
  try {
    minPriceNo = parseInt(minPrice ?? '')
  } catch (error) {
    console.error(`Failed to parse min price: ${error}`)
  }

  let maxPriceNo: number | undefined
  try {
    maxPriceNo = parseInt(maxPrice ?? '')
  } catch (error) {
    console.error(`Failed to parse max price: ${error}`)
  }

  const filters = {
    selectedCategory: selectedCategories?.map((el) => el.name[currentLanguage])?.[0] ?? '',
    selectedSubCategories: selectedSubCategories?.map((el) => el.name[currentLanguage]) ?? [],
    selectedLocations: selectedLocations?.map((el) => el.name) ?? [],
    maxPrice: maxPriceNo ?? undefined,
    minPrice: minPriceNo ?? undefined,
    includeMyAuctions: filter.data.includeMyAuctions ?? true,
  }

  const searchParams = new URLSearchParams()
  if (selectedCategories?.length) {
    searchParams.set('cat', selectedCategories.map((el) => el.name[currentLanguage]).join('_'))
  }

  if (selectedSubCategories?.length) {
    searchParams.set('sub', selectedSubCategories.map((el) => el.name[currentLanguage]).join('_'))
  }

  if (selectedLocations?.length) {
    searchParams.set('loc', selectedLocations.map((el) => encodeURIComponent(el.name)).join('_'))
  }

  if (maxPrice) {
    searchParams.set('max', maxPrice)
  }

  if (minPrice) {
    searchParams.set('min', minPrice)
  }

  return { searchParams, filters }
}

export const updateSearchParams = (
  params: Record<
    string,
    // If deleteValue is true, the value will always be deleted from the URL
    { value: string; replace?: boolean; deleteValue?: boolean }
  >
) => {
  const currentUrlSearchParams = new URLSearchParams(window.location.search)
  currentUrlSearchParams.set('page', '1')

  Object.keys(params).forEach((key) => {
    const { value, replace, deleteValue } = params[key]
    const filter = currentUrlSearchParams.get(key)

    if (deleteValue) {
      currentUrlSearchParams.delete(key)
      return
    }

    if (!filter) {
      currentUrlSearchParams.set(key, value)
      return
    }

    if (replace) {
      if (!value) {
        currentUrlSearchParams.delete(key)
        return
      }

      currentUrlSearchParams.set(key, value)
      return
    }

    const splittedFilter = filter.split('_')
    const filterAlreadyExists =
      splittedFilter.includes(encodeURIComponent(value)) || splittedFilter.includes(value)

    if (filterAlreadyExists) {
      const newFilter = splittedFilter.filter(
        (el) => el !== encodeURIComponent(value) && el !== value
      )
      if (newFilter.length === 0) {
        currentUrlSearchParams.delete(key)
        return
      }

      currentUrlSearchParams.set(key, newFilter.join('_'))
      return
    }

    splittedFilter.push(value)
    currentUrlSearchParams.set(key, splittedFilter.join('_'))
    return
  })

  return currentUrlSearchParams.toString()
}

export const extractFilterFromSearchParams = (
  searchParams: ReadonlyURLSearchParams,
  allCategories: Category[],
  allLocations: Location[],
  currentLanguage: string
) => {
  const result: AllAuctionsFilter = {
    selectedCategory: 'all',
    selectedSubCategories: [],
    selectedLocations: [],
    page: 1,
    sort: 0,
  }

  const selectedCategory = searchParams.get('cat')
  const selectedSubCategories = searchParams.get('sub')
  const selectedLocations = searchParams.get('loc')
  const minPrice = searchParams.get('min') ?? ''
  const maxPrice = searchParams.get('max') ?? ''
  const page = searchParams.get('page') ?? '1'
  const sort = searchParams.get('sort') ?? '0'

  if (selectedCategory) {
    result.selectedCategory = selectedCategory
  }

  if (selectedSubCategories) {
    const splittedSubCategories = selectedSubCategories
      .split('_')
      .map((el) => decodeURIComponent(el))

    const activeSubCategories = allCategories.reduce((acc, category) => {
      const subCategories = category.subcategories ?? []
      const subCategoriesInSplittedCategories = subCategories.filter((subCategory) =>
        splittedSubCategories.includes(subCategory.name[currentLanguage])
      )

      acc.push(...subCategoriesInSplittedCategories)
      return acc
    }, [] as Category[])

    result.selectedSubCategories = activeSubCategories.map(
      (subCategory) => subCategory.name[currentLanguage]
    )
  }

  if (selectedLocations) {
    const splittedLocations = selectedLocations.split('_').map((el) => decodeURIComponent(el))

    const activeLocations = allLocations.filter((location) =>
      splittedLocations.includes(location.name)
    )
    result.selectedLocations = activeLocations.map((location) => location.name)
  }

  if (minPrice) {
    try {
      result.minPrice = parseInt(minPrice)
    } catch (error) {
      console.error(`Failed to parse min price: ${error}`)
    }
  }

  if (maxPrice) {
    try {
      result.maxPrice = parseInt(maxPrice)
    } catch (error) {
      console.error(`Failed to parse max price: ${error}`)
    }
  }

  try {
    result.sort = parseInt(sort)
  } catch (error) {
    console.error(`Failed to parse sort: ${error}`)
    result.sort = AuctionsSortBy.newest
  }

  try {
    result.page = parseInt(page)
  } catch (error) {
    console.error(`Failed to parse current page: ${error}`)
    result.page = 1
  }

  return result
}
