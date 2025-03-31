import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { GooglePlacesPrediction } from '@/core/domain/location'
import useGlobalContext from '@/hooks/use-context'

export const LocationsSearchInputMenu = (props: {
  handleLocationPick: (location: GooglePlacesPrediction) => void
  predictions: GooglePlacesPrediction[]
  queryLength: number
  isLoading: boolean
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { predictions, queryLength, isLoading, handleLocationPick } = props

  return (
    <div className="locations-search-menu-root">
      {isLoading && (
        <div className="loader-wrapper d-flex justify-content-center">
          <Icon type="loading" size={40} />
        </div>
      )}

      {!isLoading && queryLength < 2 && !predictions.length && (
        <div className="pl-20 pr-20">{t('info.add_more_to_search')}</div>
      )}

      {!isLoading && queryLength >= 3 && !predictions.length ? (
        <div className="pl-20 pr-20">{t('info.no_locations_found')}</div>
      ) : (
        predictions.map((prediction, index) => {
          return (
            <div
              key={index}
              className="location-search-item"
              onClick={() => handleLocationPick(prediction)}
            >
              <span className="ml-10"> {prediction.description}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
