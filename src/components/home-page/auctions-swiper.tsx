import { AuctionCard } from '@/components/auction-card'
import { Auction } from '@/core/domain/auction'
import { useRef } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Icon } from '../common/icon'
import { getRandomString } from '@/utils'

export const HomeAuctionsSwiper = (props: { auctions: Auction[] }) => {
  const { auctions } = props

  const uniqueKeyRef = useRef(getRandomString())

  const renderPackLeftArrow = () => {
    if (auctions.length <= 3) {
      return null
    }
    return (
      <div
        className={`${uniqueKeyRef.current}-swiper-left auction-details-assets-left-arrow`}
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
    if (auctions.length <= 3) {
      return null
    }
    return (
      <div
        className={`${uniqueKeyRef.current}-swiper-right swiper-right-arrow`}
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

  return (
    <div className="w-100">
      <div className="pos-rel">
        {renderPackLeftArrow()}
        {renderPackRightArrow()}
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation={{
            nextEl: `.${uniqueKeyRef.current}-swiper-right`,
            prevEl: `.${uniqueKeyRef.current}-swiper-left`,
          }}
          style={{ padding: '4px 4px' }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            500: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 4,
            },
            1450: {
              slidesPerView: 4,
            },
          }}
        >
          {auctions.map((file, index) => {
            return (
              <SwiperSlide key={index}>
                <AuctionCard auction={file} fullWidth />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}
