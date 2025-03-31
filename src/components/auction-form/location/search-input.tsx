import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { LocationsController } from '@/core/controllers/locations'
import { GooglePlaceDetails, GooglePlacesPrediction } from '@/core/domain/location'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LocationsSearchInputMenu } from './search-item'

interface LocationsSearchInputProps {
  searchInProgress?: boolean
  selectedLocation: GooglePlaceDetails | null
  secondaryColor?: boolean
  customStyle?: React.CSSProperties
  onLocationPicked: (location: GooglePlacesPrediction | null) => void
}

export const LocationsSearchInput = (props: LocationsSearchInputProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [menuOpened, setMenuOpened] = useState(false)
  const [searchValue, setSearchValue] = useState('' as string)
  const [searchInProgress, setSearchInProgress] = useState(props.searchInProgress ?? false)
  const [searchResult, setSearchResult] = useState([] as GooglePlacesPrediction[])

  const searchMenuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchInProgress(props.searchInProgress ?? false)
  }, [props.searchInProgress])

  useEffect(() => {
    if (!props.selectedLocation) {
      return
    }

    const country = props.selectedLocation.address_components?.find((c) =>
      c.types.includes('country')
    )
    const localty = props.selectedLocation.address_components?.find(
      (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_1')
    )

    if (!country || !localty) {
      return
    }

    setSearchValue(`${localty.long_name}, ${country.long_name}`)
  }, [props.selectedLocation])

  useClickOutside(
    searchMenuRef,
    () => {
      if (menuOpened) {
        setMenuOpened(false)
      }
    },
    [menuOpened],
    [buttonRef]
  )

  const handleSearch = async (keyword: string) => {
    if (keyword.length < 2) {
      return
    }
    setSearchInProgress(true)
    setSearchResult([] as GooglePlacesPrediction[])
    const result = await LocationsController.searchGooglePlaces(keyword)
    setSearchInProgress(false)
    setSearchResult(result)
  }

  const debouncedSearch = useRef(debounce(handleSearch, 500))

  const handleValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    debouncedSearch.current(newValue)
  }, [])

  const handleLocationPick = (location: GooglePlacesPrediction | null) => {
    props.onLocationPicked(location)
    setSearchValue(location ? location.description : '')
    setMenuOpened(false)
  }

  return (
    <div className={`pos-rel w-100 ${menuOpened ? 'show-element' : ''}`}>
      <div className="search-icon-root">
        <Icon type="generic/location" />
      </div>

      <input
        className={`m-0 create-auction-input ${props.secondaryColor ? 'secondary-background-color' : ''}`}
        type="text"
        value={searchValue}
        onChange={handleValueChange}
        placeholder={t('location.search_by_city')}
        ref={buttonRef}
        onFocus={() => setMenuOpened(true)}
        style={props.customStyle}
      />

      {searchInProgress && (
        <div className="right-icon-root">
          <Icon type="loading" size={24} />
        </div>
      )}
      {!searchInProgress && searchValue.length > 0 && (
        <div
          className="right-icon-root"
          onClick={() => {
            handleLocationPick(null)
          }}
        >
          <Icon type="generic/close-filled" size={24} />
        </div>
      )}

      <div className="global-search-menu" ref={searchMenuRef}>
        <LocationsSearchInputMenu
          predictions={searchResult}
          queryLength={searchValue.length}
          isLoading={searchInProgress}
          handleLocationPick={handleLocationPick}
        />
      </div>
    </div>
  )
}
