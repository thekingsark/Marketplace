import { useTranslation } from '@/app/i18n/client'
import { AuctionCardStatus } from '@/components/auction-card/card-status'
import { FormattedDate } from '@/components/common/formatted-date'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { checkIfAuctionIsClosed, getAuctionClosingDate } from '@/utils'

export const AuctionDetailsStatusSection = (props: { auction: Auction }) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const auctionClosingDate = getAuctionClosingDate(auction)
  const auctionIsClosed = checkIfAuctionIsClosed(auction)
  const auctionIsStartingSoon = !!auction.startAt && !auction.startedAt

  return (
    <div className="w-100 gap-2 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between">
        <span className="auction-details-section-title">{t('info.status')}</span>
        <AuctionCardStatus auction={auction} includeStartingDate={false} />
      </div>

      {auctionClosingDate && (
        <div className="d-flex gap-2 align-items-center">
          <span>
            {t(
              auctionIsStartingSoon ? 'starting_soon_auctions.starts_at' :
                auctionIsClosed
                  ? 'auction_details_status.closed_at'
                  : 'auction_details_status.closing_at'
            )}
          </span>
          <span className="fw-light">
            <FormattedDate date={auctionIsStartingSoon ? auction.startAt! : auctionClosingDate} format='D MMM, H:mm' />
          </span>
        </div>
      )}
    </div>
  )
}
