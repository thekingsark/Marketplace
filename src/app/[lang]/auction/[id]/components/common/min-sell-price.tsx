import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { dir } from 'i18next'
import { PriceText } from '@/components/common/price-text'

export const AuctionMinSellPrice = observer(
  (props: {
    auction: Auction
    convertPrice: (price: number, fromCurrencyId?: string) => number
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const direction = dir(currentLanguage)

    const { auction, convertPrice } = props

    const computeMinPrice = () => {
      let minPrice = 1

      if (auction.bids.length) {
        const bidWithHighestPrice = auction.bids.reduce((prev, current) =>
          (convertPrice(prev.price ?? 0, prev.initialCurrencyId) ?? 0) >
            (convertPrice(current.price ?? 0, current.initialCurrencyId) ?? 0)
            ? prev
            : current
        )
        minPrice = convertPrice(bidWithHighestPrice.price ?? 0, bidWithHighestPrice.initialCurrencyId) ?? 0
      } else {
        minPrice = convertPrice(auction.startingPrice ?? 1, auction.initialCurrencyId) ?? 0
      }
      return minPrice
    }

    return (
      <div className="min-sell-price-root">
        <div className="d-flex align-items-center justify-content-between w-100">
          <Icon type="generic/payment" size={48} />

          <div className="d-flex flex-column justify-content-center align-items-center price-root">
            <span className="starting-price">
              {t(
                auction.bids.length
                  ? 'auction_details.create_bid.highest_bid'
                  : 'auction_details.create_bid.starting_price'
              )}
            </span>
            <div className="d-flex align-items-center">
              <span className="ml-10 price">
                <PriceText price={computeMinPrice()} />
              </span>
            </div>
          </div>
          <div></div>
        </div>

        <style jsx>{`
          .min-sell-price-root {
            display: flex;
            align-items: center;
            background: var(--clr-blue);
            border-radius: 6px;
            padding: 16px 32px;
            width: 100%;
          }
          .price-root {
            ${direction === 'rtl' ? ' margin-left: 48px;' : ' margin-right: 48px;'}
            color: var(--separator);
          }
          .starting-price {
            color: #fff;
          }
          .price {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
          }
        `}</style>
      </div>
    )
  }
)
