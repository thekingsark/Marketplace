'use client'
import { AuctionCard } from '@/components/auction-card'
import { AuctionsController } from '@/core/controllers/auctions'
import { Auction } from '@/core/domain/auction'
import { useEffect, useRef, useState } from 'react'
import { AuctionsSortBy } from '@/core/repositories/auction'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'
import { Location } from '@/core/domain/location'
import {
  extractFilterFromSearchParams,
  findCategoriesIdsFromNames,
  findLocationsIdsFromNames,
  findSubCategoriesIdsFromNames,
  updateSearchParams,
} from './utils'
import { AuctionsSortByDropdown } from '../../../components/common/auctions-sort-by-dropdown'
import { CustomInput } from '@/components/common/custom-input'
import { NoResultsAvailable } from '@/components/common/no-results'
import ReactPaginate from 'react-paginate'
import { debounce } from 'lodash'
import { Icon } from '@/components/common/icon'
import { MobileAuctionsFilter } from './components/mobile/filter'
import { AuctionFilters } from './components/filters'
import { AuctionCardSkeleton } from '@/components/skeletons/auction-card'
import { AuctionsActiveFilterCards } from './components/mobile/active-filters'
import { useCurrentCurrency } from '@/hooks/current-currency'

export interface AllAuctionsFilter {
  selectedCategory: string
  selectedSubCategories: string[]
  selectedLocations: string[]
  minPrice?: number
  maxPrice?: number
  page: number
  query?: string
  sort?: AuctionsSortBy
}

const AUCTIONS_PER_PAGE = 16

// Save filter functionality is not enabled.
// If you want to enable it, you will find some code commented in this file. Just uncomment it and
// import the necessary components and files

export const AllAuctionsListRoot = (props: {
  locations: Location[]
  activeAuctionsCount: number
}) => {
  const { locations } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()
  const searchParams = useSearchParams()

  const extractFilterFromParams = (searchParams: ReadonlyURLSearchParams) => {
    const categories = Object.values(globalContext.appCategories)

    return extractFilterFromSearchParams(searchParams, categories, locations, currentLanguage)
  }

  const [mobileAuctionsFilterOpened, setMobileAuctionsFilterOpened] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [auctions, setAuctions] = useState<Record<number, Auction[]>>({})
  const [auctionsCount, setAuctionsCount] = useState(0)
  const [activeFilters, setActiveFilters] = useState<AllAuctionsFilter>(
    extractFilterFromParams(searchParams)
  )

  const currentCurrency = useCurrentCurrency()

  const auctionsLoadingRef = useRef(true)
  const initialAuctionsLoadedRef = useRef(false)
  const isMountingRef = useRef(true)
  const auctionsTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    isMountingRef.current = false
  }, [])

  useEffect(() => {
    if (isMountingRef.current) {
      return
    }

    const fetchData = async (page: number) => {
      auctionsLoadingRef.current = true
      const [auctions, count] = await Promise.all([fetchAuctions(page), fetchAuctionsCount()])

      setAuctionsCount(count)
      setAuctions((old) => ({ ...old, [page]: auctions }))
      auctionsLoadingRef.current = false
      initialAuctionsLoadedRef.current = true
    }
    fetchData(activeFilters.page - 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters])

  const toggleMobileAuctionsFilter = () => {
    if (!mobileAuctionsFilterOpened) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    setMobileAuctionsFilterOpened((old) => !old)
  }

  const fetchAuctionsCount = async () => {
    try {
      const params = extractFilterRequiredForFetch()
      const count = await AuctionsController.countFilter({
        activeOnly: true,
        ...params,
        usedCurrencyId: currentCurrency?.id
      })

      return count
    } catch (error) {
      console.error(`Could not load auctions count: ${error}`)
      return 0
    } finally {
    }
  }

  const fetchAuctions = async (page: number) => {
    try {
      const params = extractFilterRequiredForFetch()
      const auctions = await AuctionsController.load({
        activeOnly: true,
        ...params,
        page,
        pageSize: AUCTIONS_PER_PAGE,
        usedCurrencyId: currentCurrency?.id
      })
      return auctions
    } catch (error) {
      console.error(`Could not load auctions: ${error}`)
      return []
    } finally {
    }
  }

  const extractFilterRequiredForFetch = () => {
    const categories = findCategoriesIdsFromNames(globalContext.appCategories, [
      activeFilters.selectedCategory,
    ])
    const subCategories = findSubCategoriesIdsFromNames(
      globalContext.appCategories,
      activeFilters.selectedSubCategories,
      currentLanguage
    )
    const locationIds = findLocationsIdsFromNames(locations, activeFilters.selectedLocations)

    return {
      minPrice: activeFilters.minPrice,
      maxPrice: activeFilters.maxPrice,
      sortBy: activeFilters.sort,
      categories,
      subCategories,
      locationIds,
      query: activeFilters.query,
    }
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

  const handleSearchKeywordChange = (keyword: string) => {
    setSearchKeyword(keyword)
    setActiveFilters((old) => ({ ...old, query: keyword, page: 1 }))
    updateURLSearchParams({
      query: {
        value: keyword,
        replace: true,
      },
      page: { value: '1', replace: true },
    })
  }

  const debounceHandleSearchKeywordSearch = debounce(handleSearchKeywordChange, 700)

  const handleChangeSort = (option: AuctionsSortBy) => {
    setActiveFilters((old) => ({ ...old, sort: option }))

    updateURLSearchParams({
      sort: { value: option.toString(), replace: true },
      page: { value: '1', replace: true },
    })
  }

  const handlePageChange = (page: number) => {
    auctionsLoadingRef.current = true
    setActiveFilters((old) => ({ ...old, page: page + 1 }))
    updateURLSearchParams({
      page: { value: (page + 1).toString(), replace: true },
    })

    setTimeout(() => {
      if (auctionsTitleRef.current) {
        auctionsTitleRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }, 0)
  }

  const filterIsActive = () => {
    if (!activeFilters) {
      return false
    }

    return !!(
      (activeFilters.selectedCategory && activeFilters.selectedCategory !== 'all') ||
      activeFilters.selectedSubCategories?.length > 0 ||
      activeFilters.selectedLocations?.length > 0 ||
      activeFilters.minPrice ||
      activeFilters.maxPrice ||
      activeFilters.sort !== 0 ||
      activeFilters.query?.length
    )
  }

  const handleClearAllFilters = () => {
    if (!filterIsActive()) {
      return
    }

    setSearchKeyword('')

    setActiveFilters({
      selectedCategory: '',
      selectedSubCategories: [],
      selectedLocations: [],
      minPrice: undefined,
      maxPrice: undefined,
      query: '',
      sort: 0,
      page: 1,
    })

    updateURLSearchParams({
      cat: { value: 'all', replace: true },
      sub: { value: '', deleteValue: true },
      loc: { value: '', deleteValue: true },
      min: { value: '', deleteValue: true },
      max: { value: '', deleteValue: true },
      query: { value: '', deleteValue: true },
      page: { value: '1', replace: true },
      sort: { value: '0', replace: true },
    })
  }

  const arrayOfElementsPerPage = Array.from({ length: AUCTIONS_PER_PAGE }, (_, i) => i + 1)
  const maxPages = Math.ceil(auctionsCount / AUCTIONS_PER_PAGE)

  return (
    <>
      <div className="max-width mt-30 mt-sm-5 pb-50 pb-sm-5 d-flex justify-content-center">
        <div className="main-container d-flex flex-column gap-4 w-100">
          {/* <div className="p-1">
            <AuctionsListSavedFilters
              locations={locations}
              checkIfFilterIsApplied={filterIsActive}
              handleFilterClick={handleFilterClick}
            />
          </div> */}
          <div className="p-1 d-flex align-items-center justify-content-between">
            <h1 className="m-0">{t('home.filter.filter')}</h1>
            <div className="d-flex align-items-center gap-2">
              <button
                className={`border-btn ${filterIsActive() ? '' : 'inactive-button'}`}
                onClick={handleClearAllFilters}
              >
                {t('home.filter.clear_all')}
              </button>
            </div>
          </div>

          <div className="p-1 d-flex align-items-center gap-2">
            <div className="w-100">
              <span className="secondary-color d-none d-lg-block">{t('info.search_auctions')}</span>
              <CustomInput
                secondary
                listenForValueChange
                isLoading={auctionsLoadingRef.current}
                placeholder={t('home.search.search')}
                style={{ width: '100%' }}
                value={searchKeyword}
                onChange={(value) => debounceHandleSearchKeywordSearch(value)}
              />
            </div>
            <AuctionsSortByDropdown
              hideOnSmallerScreens
              selected={activeFilters.sort}
              handleSelect={(option) => {
                handleChangeSort(option as AuctionsSortBy)
              }}
            />
            <div className="d-block d-lg-none">
              <button
                className="secondary-border-btn"
                onClick={toggleMobileAuctionsFilter}
                style={{ width: 45 }}
              >
                <Icon type="generic/filter" />
              </button>
            </div>
          </div>
          <div className="d-none d-lg-block">
            <AuctionFilters
              locations={locations}
              activeFilters={activeFilters}
              allAuctionsCount={props.activeAuctionsCount}
              setActiveFilters={setActiveFilters}
            />
            {/* <SaveFilterButton
              locations={locations}
              filterIsActive={filterIsActive()}
              getFilterData={extractFilterRequiredForFetch}
            /> */}
          </div>
          <AuctionsActiveFilterCards
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />

          <div
            className="p-1 d-flex align-items-center justify-content-between"
            ref={auctionsTitleRef}
          >
            <h1 className="m-0">{t('home.auctions.auctions')}</h1>
            <span>
              {!!maxPages &&
                t('info.you_see_page', {
                  page: activeFilters.page,
                  total: maxPages,
                })}
            </span>
          </div>
          <div className="auctions-list-root d-flex justify-center row w-100 no-bs-gutter">
            {(initialAuctionsLoadedRef.current === false || auctionsLoadingRef.current) &&
              arrayOfElementsPerPage.map((_, index) => {
                return (
                  <div key={index} className="container col-md-3 col-sm-4 col-6 p-1">
                    <AuctionCardSkeleton />
                  </div>
                )
              })}
            {auctions[activeFilters.page - 1]?.map((auction: Auction, index: number) => {
              return <AuctionCard auction={auction} key={index} />
            })}
            {!auctions[activeFilters.page - 1]?.length &&
              !auctionsLoadingRef.current && (
                <NoResultsAvailable
                  height={100}
                  title={t('home.auctions.no_auctions_to_display')}
                />
              )}
          </div>

          <div className="d-flex justify-content-center mt-20 mb-10">
            <ReactPaginate
              nextLabel=">"
              previousLabel="<"
              onPageChange={(page) => {
                handlePageChange(page.selected)
              }}
              forcePage={activeFilters.page - 1}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={maxPages}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>

      <MobileAuctionsFilter
        opened={mobileAuctionsFilterOpened}
        allAuctionsCount={props.activeAuctionsCount}
        locations={locations}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        handleClose={toggleMobileAuctionsFilter}
      />
    </>
  )
}
