import { useRef, useState } from 'react'
import { CustomInput } from '../../common/custom-input'
import { Icon } from '../../common/icon'
import { Location } from '@/core/domain/location'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from 'react-i18next'

export const GlobalSearchLocationsInput = (props: { locations: Location[] }) => {
  const { locations } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [searchedLocations, setSearchedLocations] = useState<Location[]>(props.locations)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationsMenuOpened, setLocationsMenuOpened] = useState(false)
  const locationsMenuRef = useRef<HTMLDivElement>(null)
  const locationsInputRef = useRef<HTMLInputElement>(null)

  useClickOutside(
    locationsMenuRef,
    () => {
      if (locationsMenuOpened) {
        setLocationsMenuOpened(false)
      }
    },
    [locationsMenuOpened],
    [locationsInputRef]
  )

  const handleLocationSearch = (searchKey: string) => {
    if (!locationsMenuOpened) {
      setLocationsMenuOpened(true)
    }
    const searchResult = locations.filter((location) => {
      return location.name.toLowerCase().includes(searchKey.toLowerCase())
    })

    setSearchedLocations(searchResult)
  }

  const renderLocationItem = (location: Location) => {
    return (
      <div className="location-item">
        {location.name}
        <style jsx>{`
          .location-item {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
          }
          .location-item:hover {
            background: var(--background_2);
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`pos-rel w-100 ${locationsMenuOpened ? 'show-element' : ''}`}>
      <CustomInput
        type="text"
        prefixIcon={<Icon type="generic/location" size={24} />}
        placeholder={t('header.all_around_the_world')}
        value={selectedLocation?.name ?? ''}
        onChange={handleLocationSearch}
        listenForValueChange={true}
        inputAttrs={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          ref: locationsInputRef,
          onFocus: () => {
            setLocationsMenuOpened(!locationsMenuOpened)
          },
        }}
        style={{
          zIndex: 9999,
          height: 60,
          borderRadius: '0 8px 8px 0',
        }}
      />
      <div className="global-search-menu" ref={locationsMenuRef}>
        <div className="position-relative" style={{ zIndex: 9999 }}>
          {searchedLocations.length === 0 && (
            <div className="no-results p-4">{t('home.filter.no_locations_for_criteria')}</div>
          )}
          {searchedLocations.map((location, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  locationsInputRef.current!.value = location.name
                  setSelectedLocation(location)
                  setLocationsMenuOpened(!locationsMenuOpened)
                }}
              >
                {renderLocationItem(location)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
