import { useTranslation } from '@/app/i18n/client'
import CustomMultiSelect, { CustomMultiSelectOption } from '@/components/common/custom-multi-select'
import { Location } from '@/core/domain/location'
import useGlobalContext from '@/hooks/use-context'
import { memo } from 'react'

export const AuctionsListLocations = memo(
  (props: {
    selectedLocations?: string[]
    locations: Location[]
    handleChange: (location?: Location) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { locations, selectedLocations } = props

    const options =
      locations.map((location) => ({
        id: location.id,
        option: location.name,
      })) ?? []

    const handleChange = (item: CustomMultiSelectOption) => {
      const location = locations?.find((el) => el.id === item.id)
      props.handleChange(location)
    }

    return (
      <div>
        <span className="secondary-color">{t('home.filter.locations')}</span>
        <CustomMultiSelect
          withSearch
          options={options}
          allowAll
          allSelectedByDefault={!selectedLocations?.length}
          initialSelected={selectedLocations ?? []}
          onChange={handleChange}
          name="locations-filter"
          className="w-100 mt-1"
        />
      </div>
    )
  }
)

AuctionsListLocations.displayName = 'AuctionsListLocations'
