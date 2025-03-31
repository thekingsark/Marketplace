import { useTranslation } from '@/app/i18n/client'
import { AuctionCard } from '@/components/auction-card'
import { NoDataCard } from '@/components/common/no-data-card'
import { AuctionCardSkeleton } from '@/components/skeletons/auction-card'
import { AuctionsController } from '@/core/controllers/auctions'
import { Account } from '@/core/domain/account'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { generateNameForAccount } from '@/utils'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export const AuctionsBySameAuctioneer = memo((props: { auctioneer: Account }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auctioneer } = props

  const [dataLoading, setDataLoading] = useState(true)
  const [auctionsCount, setAuctionsCount] = useState(0)
  const [auctions, setAuctions] = useState<Auction[]>([])

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true)
      const [count, auctions] = await Promise.all([
        AuctionsController.countActiveByAccountId(auctioneer.id),
        AuctionsController.loadActiveByAccountId(auctioneer.id),
      ])
      setAuctionsCount(count)
      setAuctions(auctions)
      setDataLoading(false)
    }

    loadData()
  }, [auctioneer.id])

  const arrayOfFourElements = new Array(4).fill(null)

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between gap-2">
        <h1>
          {t('profile.all_auctions_for', {
            name: generateNameForAccount(auctioneer),
            no: auctionsCount,
          })}
        </h1>
        <Link href={`/account/${auctioneer.id}?tab=auctions`}>
          <button
            className="border-btn"
            style={{ minWidth: 120 }}
            aria-label={t('generic.see_all')}
          >
            {t('generic.see_all')}
          </button>
        </Link>
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

          {!dataLoading && !auctionsCount && <NoDataCard title={t('profile.no_auctions')} />}
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
})

AuctionsBySameAuctioneer.displayName = 'AuctionsBySameAuctioneer'
