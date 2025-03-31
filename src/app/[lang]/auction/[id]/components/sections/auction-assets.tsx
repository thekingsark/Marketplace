'use client'
import { Icon } from '@/components/common/icon'
import { Asset } from '@/core/domain/asset'
import { Auction } from '@/core/domain/auction'
import Image from 'next/image'
import { useState } from 'react'
import { Navigation, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import useGlobalContext from '@/hooks/use-context'

export const AuctionDetailsAssets = (props: {
  auction: Auction
  handleOpenGallery?: () => void
}) => {
  const globalContext = useGlobalContext()
  const { auction, handleOpenGallery } = props
  const assets = auction.assets ?? []

  const [swiper, setSwiper] = useState<SwiperClass>()
  const [currentActiveSlide, setCurrentActiveSlide] = useState(0)

  const renderOneAsset = (asset: Asset) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const url = `${serverUrl}/assets/${asset.path}`

    return (
      <div className="auction-details-image" onClick={handleOpenGallery}>
        <Image
          src={url}
          alt="Auction asset"
          style={{ objectFit: 'cover' }}
          fill
          loading="eager"
          className="auction-uploaded-asset"
        />
      </div>
    )
  }

  const renderPackLeftArrow = () => {
    if (assets.length === 1) {
      return null
    }
    return (
      <div
        className={`auction-details-swiper-left auction-details-assets-left-arrow`}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation()
        }}
      >
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-left-filled" />
        </div>
      </div>
    )
  }

  const renderPackRightArrow = () => {
    if (assets.length === 1) {
      return null
    }
    return (
      <div
        className={`auction-details-swiper-right swiper-right-arrow`}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation()
        }}
      >
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-right-filled" />
        </div>
      </div>
    )
  }

  if (!assets.length) {
    const { defaultProductImageUrl } = globalContext.appSettings
    return (
      <Image
        alt="auction asset"
        fill
        src={defaultProductImageUrl.length ? defaultProductImageUrl : DefaultAssetImage.src}
        style={{ objectFit: 'cover', borderRadius: 4 }}
      />
    )
  }

  return (
    <div className="position-relative h-100 d-flex flex-column align-items-center justify-content-center">
      {renderPackLeftArrow()}
      {renderPackRightArrow()}
      <Swiper
        onSwiper={(swiper: SwiperClass) => {
          setSwiper(swiper)
        }}
        style={{ width: '100%' }}
        modules={[Navigation, Scrollbar]}
        spaceBetween={30}
        slidesPerView={1}
        loop={false}
        autoplay={false}
        onSlideChange={(swiper: SwiperClass) => {
          setCurrentActiveSlide(swiper.activeIndex)
        }}
        navigation={{
          nextEl: `.auction-details-swiper-right`,
          prevEl: `.auction-details-swiper-left`,
        }}
      >
        {assets.map((item, index) => (
          <SwiperSlide key={index}>{renderOneAsset(item)}</SwiperSlide>
        ))}
      </Swiper>

      {assets.length > 1 && (
        <div className="mt-10 mb-10 d-flex align-items-center justify-content-center">
          {assets.map((_, index) => (
            <div
              key={index}
              className="auction-details-assets-slide-indicator"
              style={{
                background: currentActiveSlide === index ? 'var(--font_1)' : 'var(--separator)',
              }}
              onClick={() => {
                if (!swiper) {
                  return
                }
                swiper.slideTo(index)
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}
