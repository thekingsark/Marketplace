'use client'
import { Auction } from '@/core/domain/auction'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import LoveButton from '../common/love-button'
import { AuctionCardStatus } from './card-status'
import { AuctionBidsCountLabel } from './bids-count-label'
import { AuctionCardAssetsCarousel } from './assets-carousel'
import Link from 'next/link'
import { AppStore } from '@/core/store'
import { useEffect, useState } from 'react'
import { FavouritesController } from '@/core/controllers/favourites'
import { AuctionPromotedLabel } from './promoted-label'
import { YouNeedToLoginModal } from '../modals/you-need-to-login-modal'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { v4 as uuidV4 } from 'uuid'
import { dir } from 'i18next'
import { AuctionPlayVideoButton } from './play-video-button'
import { PriceText } from '../common/price-text'

export const AuctionCard = observer((props: { auction: Auction; fullWidth?: boolean }) => {
  const { auction, fullWidth = false } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const direction = dir(currentLanguage)

  const isInFavourites = AppStore.favouriteAuctions.some((item) => item.id === auction.id)

  const [isLiked, setIsLiked] = useState(isInFavourites)
  const [needToLoginModalOpen, setNeedToLoginModalOpen] = useState(false)
  const screenIsBig = useScreenIsBig()

  useEffect(() => {
    if (isInFavourites !== isLiked) {
      setIsLiked(isInFavourites)
    }
  }, [isInFavourites])

  const toggleNeedToLoginModal = () => {
    setNeedToLoginModalOpen(!needToLoginModalOpen)
  }

  const handleLoveTap = (isLiked: boolean) => {
    if (!AppStore.accountData?.id) {
      toggleNeedToLoginModal()
      return
    }
    setIsLiked(isLiked)

    if (isLiked) {
      FavouritesController.addAuctionToFavourites(auction)
    } else {
      FavouritesController.removeAuctionFromFavourites(auction)
    }
  }

  const renderAuctionAssets = () => {
    const assets = auction.assets
    const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

    if (!assets?.length) {
      const { defaultProductImageUrl } = globalContext.appSettings

      return (
        <Image
          alt="auction asset"
          fill
          src={defaultProductImageUrl?.length ? defaultProductImageUrl : DefaultAssetImage.src}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    }

    if (assets.length === 1) {
      return (
        <Image
          alt="auction asset"
          fill
          src={`${serverBaseURL}/assets/${assets[0].path}`}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    }

    return (
      <AuctionCardAssetsCarousel
        assets={assets}
        uniqueKey={uuidV4()}
        auctionId={`assets-${auction.id.replaceAll('-', '')}`}
      />
    )
  }

  const renderAuctionDetails = () => {
    return (
      <div className={`d-flex flex-column justify-content-between`}>
        <div>
          <div className="auction-card-title secondary-color">{auction.title}</div>
          <div className="auction-card-price">
            <PriceText
              price={auction.lastPrice ?? auction.startingPrice ?? 0}
              initialCurrencyId={auction.lastPriceCurrencyId ?? auction.initialCurrencyId}
            />
          </div>
        </div>
        <div className={`d-flex justify-content-between ${screenIsBig ? 'mt-3' : 'mt-1'}`}>
          <div className="text-sm">
            <p className="m-0 auction-card-location">{auction.locationPretty} </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${fullWidth ? 'w-100' : 'container col-md-3 col-sm-4 col-6 p-1'} m-0`}>
      <Link href={`/auction/${auction.id}`}>
        <div className="d-flex flex-column auction-card-root p-1 pos-rel">
          <div className="pos-rel" style={{ height: screenIsBig ? 240 : 140 }}>
            {renderAuctionAssets()}
            <div style={{ position: 'absolute', zIndex: 99, bottom: 12, ...(direction === 'rtl' ? { right: 12 } : { left: 12 }) }}>
              <AuctionPromotedLabel auction={auction} />
            </div>

            <div style={{ position: 'absolute', zIndex: 99, bottom: 12, ...(direction === 'rtl' ? { left: 12 } : { right: 12 }) }}>
              <AuctionPlayVideoButton auction={auction} />
            </div>
          </div>
          <div className="p-2">
            {renderAuctionDetails()}
            <div style={{ position: 'absolute', top: 12, ...(direction === 'rtl' ? { right: 12 } : { left: 12 }) }}>
              <AuctionBidsCountLabel count={auction.bidsCount ?? auction.bids?.length} />
            </div>

            <AuctionCardStatus auction={auction} />
          </div>
          <div>
            <LoveButton
              key={auction.id}
              liked={isLiked}
              size={screenIsBig ? 32 : 24}
              onTap={handleLoveTap}
              isAbsolute
            />
          </div>
        </div>
      </Link>
      <YouNeedToLoginModal
        isOpened={needToLoginModalOpen}
        close={toggleNeedToLoginModal}
        title={t('anonymous.login_for_favourites')}
      />
    </div>
  )
})
