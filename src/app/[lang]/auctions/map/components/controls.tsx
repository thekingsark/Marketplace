import { LocationsSearchInput } from '@/components/auction-form/location/search-input'
import { AuctionsListCategoriesFilter } from '../../components/filters/categories'
import { GooglePlaceDetails, GooglePlacesPrediction } from '@/core/domain/location'
import { useEffect, useRef, useState } from 'react'
import { LocationsController } from '@/core/controllers/locations'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { Category } from '@/core/domain/category'
import { Icon } from '@/components/common/icon'
import { AuctionDetailsMapMobileFilter } from './mobile-filter'

export const AuctionsMapControls = (props: {
  selectedCategory?: Category
  useDeviceLocation?: boolean
  handleLocationPick: (placeId: string) => void
  handleCategoryPick: (category?: Category) => void
}) => {
  const { useDeviceLocation = true } = props
  const initializedRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const [selectedLocation, setSelectedLocation] = useState<GooglePlaceDetails | null>(null)
  const [deviceLocationLoading, setDeviceLocationLoading] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  const [mobileFilterOpened, setMobileFilterOpened] = useState(false)

  const previousStickyValue = useRef(false)

  const isBigScreen = useScreenIsBig()

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    if (!useDeviceLocation) {
      return
    }

    getDeviceLocation()
    initializedRef.current = true
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        if (rootRef.current) {
          const offsetTop = rootRef.current.offsetTop
          const scrollTop = window.scrollY
          const previousValue = previousStickyValue.current
          const newValue = scrollTop >= offsetTop

          if (previousValue !== newValue) {
            previousStickyValue.current = newValue
            setIsSticky(newValue)
          }
        }
      }, 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  const toggleMobileAuctionsFilter = () => {
    if (!mobileFilterOpened) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    setMobileFilterOpened((old) => !old)
  }

  const getDeviceLocation = async () => {
    if (deviceLocationLoading) {
      return
    }

    setDeviceLocationLoading(true)

    try {
      const location = await LocationsController.getLocationFromCurrentDevice()
      if (location) {
        setSelectedLocation(location)
        props.handleLocationPick(location.place_id)
      }
    } catch (error) {
      console.error(`Failed to get device location: ${error}`)
    } finally {
      setDeviceLocationLoading(false)
    }
  }

  const handleLocationPick = async (location: GooglePlacesPrediction | null) => {
    if (!location) {
      return
    }
    props.handleLocationPick(location.reference)
  }

  return (
    <div
      className="w-100"
      style={{
        position: isSticky && isBigScreen ? 'fixed' : 'absolute',
        top: isSticky ? 100 : 16,
      }}
      ref={rootRef}
    >
      <div className="max-width d-flex row no-bs-gutter" style={{ maxWidth: 900 }}>
        <div className="auctions-map-controls-location">
          <LocationsSearchInput
            searchInProgress={deviceLocationLoading}
            selectedLocation={selectedLocation}
            onLocationPicked={handleLocationPick}
            customStyle={{ height: 45 }}
          />
        </div>
        <div className="d-none d-lg-flex auctions-map-controls-category">
          <AuctionsListCategoriesFilter
            defaultSelected={props.selectedCategory}
            withLabel={false}
            allAuctionsCount={100}
            handleChange={props.handleCategoryPick}
          />
        </div>
        <div className="d-inline-flex d-lg-none auction-map-control-mobile-btn" style={{ width: 45, marginLeft: '0.5rem' }}>
          <button className="secondary-border-btn" onClick={toggleMobileAuctionsFilter}>
            <Icon type="generic/filter" />
          </button>
        </div>
      </div>

      <AuctionDetailsMapMobileFilter
        opened={mobileFilterOpened}
        handleClose={toggleMobileAuctionsFilter}
        selectedCategory={props.selectedCategory}
        handleSelectCategory={props.handleCategoryPick}
      />
    </div>
  )
}
