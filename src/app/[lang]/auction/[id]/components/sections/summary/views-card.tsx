'use client'
import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'

export const AuctionDetailsViewsCard = (props: { auction: Auction; fullWidth?: boolean }) => {
  const { auction, fullWidth = false } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className={`auction-details-summary-item gap-2 ${fullWidth ? 'w-100' : ''}`}>
      <div className="d-flex align-items-center gap-2 secondary-color">
        {t('auction_details.details.views')} {auction.views}
      </div>
    </div>
  )
}
