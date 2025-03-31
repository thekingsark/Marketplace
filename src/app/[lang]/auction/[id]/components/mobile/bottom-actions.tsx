import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { PriceText } from '@/components/common/price-text'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import useScrollDirection from '@/hooks/scroll-direction'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'

export const AuctionDetailsMobileBottomActions = (props: {
  auction: Auction
  canBeDisplayed?: boolean
  handlePromote: () => void
  handleCreateBid: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auction, handleCreateBid, handlePromote } = props

  const scrollDirection = useScrollDirection()
  const [firstScrollDownDone, setFirstScrollDownDone] = useState(false)
  const [canBeDisplayed, setCanBeDisplayed] = useState(props.canBeDisplayed ?? true)

  useEffect(() => {
    setCanBeDisplayed(props.canBeDisplayed ?? true)
  }, [props.canBeDisplayed])

  useEffect(() => {
    if (scrollDirection === 'down') {
      setFirstScrollDownDone(true)
    }
  }, [scrollDirection])

  const currentAccountIsAuctionOwner = AppStore.accountData?.id === auction.auctioneer?.id

  return (
    <div
      className={`auction-mobile-bottom-actions d-flex d-lg-none align-items-center justify-content-between p-16
      ${(scrollDirection === 'up' || !firstScrollDownDone) && canBeDisplayed ? 'active' : ''}`}
    >
      <div>
        <p className="m-0">{t('auction_details.create_bid.starting_price')}</p>
        <span className="auction-card-price">
          <PriceText price={auction.lastPrice ?? auction.startingPrice ?? 0} initialCurrencyId={auction.lastPriceCurrencyId ?? auction.initialCurrencyId} />
        </span>
      </div>
      <div>
        {currentAccountIsAuctionOwner ? (
          <button
            className="inverted-btn"
            onClick={handlePromote}
            aria-label={t('promote_auction.promote_auction')}
          >
            <Icon type="generic/coin" />
            <span>{t('promote_auction.promote_auction')}</span>
          </button>
        ) : (
          <button
            className="fill-btn"
            onClick={handleCreateBid}
            aria-label={t('auction_details.create_bid.title')}
          >
            <span>{t('auction_details.create_bid.title')}</span>
          </button>
        )}
      </div>
    </div>
  )
}
