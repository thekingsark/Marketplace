import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'

export const NoBidsInAuction = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="secondary-color">{t('auction_details.no_active_bids')}</span>
    </div>
  )
}
