import { useTranslation } from '@/app/i18n/client'
import { AuctionCard } from '@/components/auction-card'
import { NoDataCard } from '@/components/common/no-data-card'
import { AuctionCardSkeleton } from '@/components/skeletons/auction-card'
import { SimilaritiesController } from '@/core/controllers/similarities'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export const SimilarAuctionsSection = (props: { auction: Auction }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [dataLoading, setDataLoading] = useState(true)
  const [auctions, setAuctions] = useState<Auction[]>([])

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true)
      const auctions = await SimilaritiesController.loadSimilarities(props.auction.id)
      setAuctions(auctions)
      setDataLoading(false)
    }

    loadData()
  }, [])

  const arrayOfFourElements = new Array(4).fill(null)

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between gap-2">
        <h1>{t('similar.similar_auctions')}</h1>
      </div>

      <div className="pos-rel mt-20">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          style={{ padding: '4px 4px' }}
          loop={false}
          pagination={{
            clickable: true,
          }}
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
          {dataLoading &&
            arrayOfFourElements.map((_, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="w-100">
                    <AuctionCardSkeleton />
                  </div>
                </SwiperSlide>
              )
            })}

          {!dataLoading && !auctions.length && <NoDataCard title={t('profile.no_auctions')} />}
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
