import { useTranslation } from '@/app/i18n/client'
import { AccountInfo } from '@/components/account/info'
import { AuctionCardStatus } from '@/components/auction-card/card-status'
import { PriceText } from '@/components/common/price-text'
import { AuctionsController } from '@/core/controllers/auctions'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import ShowMoreText from 'react-show-more-text'

export const AuctionMarkerDetails = (props: { auctionId: string }) => {
  const { auctionId } = props

  const [auctionLoading, setAuctionLoading] = useState(false)
  const [auction, setAuction] = useState<Auction | null>(null)

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const auctionLoadedRef = useRef(false)

  useEffect(() => {
    if (auctionLoading || auctionLoadedRef.current) {
      return
    }

    const handleLoad = async () => {
      setAuctionLoading(true)
      try {
        const summary = await AuctionsController.loadSummary(auctionId)
        setAuction(summary)
        auctionLoadedRef.current = true
      } catch (error) {
        console.error(`error loading auction summary: ${error}`)
      } finally {
        setAuctionLoading(false)
      }
    }

    handleLoad()
  }, [])

  if (!auction) {
    return null
  }

  return (
    <div className="details-container">
      <div className="auction-details d-flex justify-content-between">
        <div>
          <h2>{auction.title}</h2>
          <div className="details">
            <div className="detail_item">
              {!!auction.description?.length && (
                <ShowMoreText
                  lines={2}
                  more={t('generic.see_more')}
                  less={t('generic.see_less')}
                  anchorClass="blue-text"
                  expanded={false}
                >
                  {auction.description}
                </ShowMoreText>
              )}
            </div>
          </div>
          {auction.auctioneer?.id && (
            <>
              <div className="mt-10 account-info">
                <AccountInfo pictureSize={40} account={auction.auctioneer!} />
              </div>

              <div className="d-flex align-items-center justify-content-between mt-10">
                <div className="mt-10 mb-10">
                  <AuctionCardStatus auction={auction} />
                </div>
                <p className="price">
                  <PriceText
                    price={auction.lastPrice ?? auction.startingPrice ?? 0}
                    initialCurrencyId={auction.lastPriceCurrencyId ?? auction.initialCurrencyId}
                  />
                </p>
              </div>
            </>
          )}
        </div>
        {auction.auctioneer?.id ? (
          <Link className="border-btn" href={`/auction/${auction.id}`}>
            <span className="fw-normal">{t('auctions_map.see_auction_details')}</span>
          </Link>
        ) : (
          <strong>{t('auction_details.dialogs.auction_removed')}</strong>
        )}
      </div>
    </div>
  )
}
