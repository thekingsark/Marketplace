import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'

export const AuctionPromotedLabel = (props: { auction: Auction }) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    auction.promotedAt && (
      <div className="mt-2">
        <div className="promoted-auction-label">{t('promote_auction.promoted')}</div>
      </div>
    )
  )
}
