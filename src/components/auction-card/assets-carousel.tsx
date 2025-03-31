import { Asset } from '@/core/domain/asset'
import { memo, useState } from 'react'
import { Navigation, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Icon } from '../common/icon'

export const AuctionCardAssetsCarousel = memo(
  (props: { assets: Asset[]; uniqueKey: string; auctionId: string }) => {
    const { assets, uniqueKey, auctionId } = props
    const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

    const [swiper, setSwiper] = useState<SwiperClass | null>(null)
    const [currentActiveSlide, setCurrentActiveSlide] = useState(0)

    const renderPackLeftArrow = () => {
      return (
        <div
          className={`${auctionId}-${uniqueKey}-left auction-card-left-arrow-root`}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation()
          }}
        >
          <div className=" d-flex align-items-center justify-content-center">
            <Icon type="arrows/arrow-left-filled" color={'white'} />
          </div>
        </div>
      )
    }

    const renderPackRightArrow = () => {
      return (
        <div
          className={`${auctionId}-${uniqueKey}-right auction-card-right-arrow`}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation()
          }}
        >
          <div className=" d-flex align-items-center justify-content-center">
            <Icon type="arrows/arrow-right-filled" color={'white'} />
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="w-100 h-100 pos-rel">
          <Swiper
            onSwiper={(swiper: SwiperClass) => {
              setSwiper(swiper)
            }}
            style={{ width: '100%', height: '100%' }}
            modules={[Navigation, Scrollbar]}
            spaceBetween={30}
            slidesPerView={1}
            loop={false}
            autoplay={false}
            onSlideChange={(swiper: SwiperClass) => {
              setCurrentActiveSlide(swiper.activeIndex)
            }}
            navigation={{
              nextEl: `.${auctionId}-${uniqueKey}-right`,
              prevEl: `.${auctionId}-${uniqueKey}-left`,
            }}
          >
            {(assets || []).map((item, index) => (
              <SwiperSlide key={index}>
                <Image
                  alt="auction asset"
                  fill
                  src={`${serverBaseURL}/assets/${assets[index].path}`}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-2 auction-assets-indicators-container mb-10">
            {(assets || []).map((_, index) => (
              <div
                key={index}
                className="auction-assets-slide-indicator"
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
          {renderPackLeftArrow()}
          {renderPackRightArrow()}
        </div>
      </>
    )
  }
)

AuctionCardAssetsCarousel.displayName = 'AuctionCardAssetsCarousel'
