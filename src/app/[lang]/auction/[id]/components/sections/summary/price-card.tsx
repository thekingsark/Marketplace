'use client'

import { useTranslation } from '@/app/i18n/client'
import { PriceText } from '@/components/common/price-text'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'

export const AuctionDetailsPrice = observer(
  (props: { auction: Auction; description?: string; fullWidth?: boolean; center?: boolean }) => {
    const { auction, description, fullWidth = false, center = false } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    return (
      <div
        className={`${fullWidth ? 'w-100 p-0 p-16-vertical' : ''} ${center ? '' : 'p-16'} auction-details-price-root`}
      >
        {fullWidth ? (
          <div className="w-100 d-flex align-items-center justify-content-between">
            <span className="secondary-color">{t('auction_details.create_bid.price_hint')}</span>
            <span className="text-2xl font-bold">
              <PriceText
                price={auction.lastPrice ?? auction.startingPrice ?? 0}
                initialCurrencyId={auction.lastPriceCurrencyId ?? auction.initialCurrencyId}
              />
            </span>
          </div>
        ) : (
          <div
            className={`d-flex flex-column ${center ? 'align-items-center' : 'align-items-start'}`}
          >
            <span className="text-2xl font-bold">
              <PriceText
                price={auction.lastPrice ?? auction.startingPrice ?? 0}
                initialCurrencyId={auction.lastPriceCurrencyId ?? auction.initialCurrencyId}
              />
            </span>
            <span className="secondary-color">{t('auction_details.create_bid.price_hint')}</span>
          </div>
        )}
        {description && (
          <div className="mt-1">
            {' '}
            <span className="secondary-color fw-light">{description}</span>{' '}
          </div>
        )}
      </div>
    )
  }
)
