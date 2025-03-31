import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { NoBidsInAuction } from './no-bids'
import { AuctionDetailsPrice } from '../summary/price-card'
import { AuctionDetailBidItem } from './item'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { checkIfAuctionIsClosed } from '@/utils'
import { FormattedDate } from '@/components/common/formatted-date'

export const AuctionDetailsBidsSection = observer(
  (props: {
    auction: Auction
    openCreateBidModal: () => void
    handleAcceptBid: (bidId: string) => Promise<boolean>
    handleRemoveBid: (bidId: string) => Promise<boolean>
    handleRejectBid: (bidId: string, reason?: string) => Promise<boolean>
    convertPrice: (price: number, fromCurrencyId?: string) => number
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { auction, openCreateBidModal, convertPrice } = props

    const currentAccountLoading = AppStore.loadingStates.currentAccount
    const isAuctionOfCurrentAccount = AppStore.accountData?.id === auction.auctioneer?.id
    const startingSoon = !!auction.startAt && !auction.startedAt

    const isClosed = checkIfAuctionIsClosed(
      auction,
      globalContext.appSettings?.auctionActiveTimeInHours
    )

    const allBids = auction.bids.slice().sort((a, b) => {
      // Placing the accepted bids first
      if (a.isAccepted === true && b.isAccepted !== true) return -1
      if (a.isAccepted !== true && b.isAccepted === true) return 1

      // Placing the rejected bids last
      if (a.isRejected && !b.isRejected) return 1
      if (!a.isRejected && b.isRejected) return -1

      // Sorting by price
      return (
        (convertPrice(b.price ?? 0, b.initialCurrencyId) ?? 0) -
        (convertPrice(a.price ?? 0, a.initialCurrencyId) ?? 0)
      )
    })

    return (
      <div className="w-100 d-flex flex-column position-relative">
        <div className="d-flex align-items-center justify-content-between">
          <span className="auction-details-section-title">
            {t('auction_details.bids_count', { no: auction.bids.length })}
          </span>
        </div>
        <div className="mt-10">
          {allBids.length === 0 ? (
            <NoBidsInAuction />
          ) : (
            <div
              className="d-flex flex-column gap-2 auction-details-bids-list"
              style={{
                ...(allBids.length > 3 ? { maxHeight: 545, overflow: 'auto' } : {}),
              }}
            >
              {allBids.map((bid, index) => {
                return (
                  <AuctionDetailBidItem
                    bid={bid}
                    key={index}
                    auction={auction}
                    handleRemoveBid={() => props.handleRemoveBid(bid.id)}
                    handleAcceptBid={() => props.handleAcceptBid(bid.id)}
                    handleRejectBid={(reason?: string) => props.handleRejectBid(bid.id, reason)}
                  />
                )
              })}
            </div>
          )}
        </div>
        {currentAccountLoading && !isClosed ? (
          <div className="top-border mt-20">
            <SkeletonTheme baseColor="var(--background_4)" highlightColor="var(--background_1)">
              <Skeleton height={86} className="w-100"></Skeleton>
            </SkeletonTheme>
          </div>
        ) : (
          <div className="top-border mt-20 d-flex align-items-center justify-content-between">
            <AuctionDetailsPrice
              auction={auction}
              fullWidth={isAuctionOfCurrentAccount || isClosed}
              description={
                isAuctionOfCurrentAccount
                  ? t('auction_details.create_bid.cannot_create_on_your_auction')
                  : isClosed
                    ? t('auction_details.create_bid.cannot_create_on_expired')
                    : undefined
              }
            />
            {isAuctionOfCurrentAccount || isClosed || startingSoon ? null : (
              <button
                className="fill-btn"
                onClick={openCreateBidModal}
                aria-label={t('auction_details.create_bid.title')}
              >
                {t('auction_details.create_bid.title')}
              </button>
            )}
          </div>
        )}
        {startingSoon && (
          <div className="d-flex flex-column align-items-center justify-content-center starting-soon-bids-overlay p-16">
            <div className="d-flex align-items-center justify-content-between w-100">
              <span className="fw-bold"> {t('starting_soon_auctions.starting_soon')} </span>
              <span className="fw-bold">
                <FormattedDate date={auction.startAt!} format="D MMM" />
              </span>
            </div>
            <p className="secondary-color">{t('starting_soon_auctions.add_to_fav')}</p>
          </div>
        )}
      </div>
    )
  }
)
