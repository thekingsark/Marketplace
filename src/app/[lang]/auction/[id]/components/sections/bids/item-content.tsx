import { generateNameForAccount } from '@/utils'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import ShowMoreText from 'react-show-more-text'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { Bid } from '@/core/domain/bid'
import { IconButton } from '@/components/common/icon-button'
import { useClickOutside } from '@/hooks/click-outside'
import { Auction } from '@/core/domain/auction'
import { AuctionBidMenu } from './bid-menu'
import { FormattedDate } from '@/components/common/formatted-date'
import { PriceText } from '@/components/common/price-text'

export const AuctionDetailsBidItemContent = (props: {
  bid: Bid
  auction: Auction
  handleRemove: () => Promise<boolean>
}) => {
  const { bid, auction, handleRemove } = props
  const bidder = bid.bidder!

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [menuOpened, setMenuOpened] = useState(false)
  const menuButtonRef = useRef<HTMLDivElement>(null)
  const bidMenuRef = useRef<HTMLDivElement>(null)

  useClickOutside(
    bidMenuRef,
    () => {
      if (menuOpened) {
        setMenuOpened(false)
      }
    },
    [menuOpened],
    [menuButtonRef]
  )

  return (
    <div className="bid-item-content-details-simple-root">
      <div className="d-flex align-items-center justify-content-between">
        <Link href={`/account/${bidder.id}`} className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Image
              src={bidder!.picture}
              alt="account image"
              height={50}
              width={50}
              style={{ borderRadius: '50%' }}
            />
            <div className="d-flex flex-column">
              <span className="bid-item-content-account-name">
                {generateNameForAccount(bidder)}
              </span>
              <span className="secondary-color">{bid.locationPretty}</span>
            </div>
          </div>
        </Link>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center">
            {!!bid.price && bid.price > 0 && (
              <div className="d-flex align-items-center">
                <span className="bid-item-content-price-amount">
                  <PriceText price={bid.price} initialCurrencyId={bid.initialCurrencyId} />
                </span>
              </div>
            )}
          </div>
          <div
            className={`pos-rel auction-details-menu-button ${menuOpened ? 'show-element' : ''}`}
          >
            <IconButton
              transparent
              icon="generic/more"
              noMargin
              onClick={(ev) => {
                ev?.stopPropagation()
                ev?.preventDefault()
                setMenuOpened(!menuOpened)
              }}
            />
            <div className="bid-item-content-card-menu" ref={bidMenuRef}>
              <AuctionBidMenu
                bid={bid}
                auction={auction}
                handleClose={() => setMenuOpened(false)}
                handleRemove={handleRemove}
              />
            </div>
          </div>
        </div>
      </div>

      {bid.description && (
        <div className="mt-10 mb-10">
          <ShowMoreText
            lines={2}
            more={t('generic.see_more')}
            less={t('generic.see_less')}
            anchorClass="blue-text"
            expanded={false}
          >
            {bid.description}
          </ShowMoreText>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between secondary-text-color">
        <span>{t('auction_details.details.created_at')}</span>
        <span>
          <FormattedDate date={bid.createdAt!} format='D MMM, H:mm' />
        </span>
      </div>
    </div>
  )
}
