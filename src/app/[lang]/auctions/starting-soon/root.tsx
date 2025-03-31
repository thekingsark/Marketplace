'use client'
import { useTranslation } from '@/app/i18n/client'
import { AuctionCard } from '@/components/auction-card'
import { Icon } from '@/components/common/icon'
import { NoDataCard } from '@/components/common/no-data-card'
import { AuctionsController } from '@/core/controllers/auctions'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'react-toastify'

export const StartingSoonAuctionsRoot = (props: { auctions: Record<string, unknown>[] }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const initialAuctions = props.auctions?.map((auctions) => Auction.fromJSON(auctions)) ?? []

  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions)

  const [isLoading, setIsLoading] = useState(false)
  const loaderRef = useRef(null)

  const reachedEndRef = useRef(false)
  const pageRef = useRef(0)

  const fetchData = async () => {
    if (isLoading || reachedEndRef.current) {
      return
    }

    setIsLoading(true)
    const newPage = pageRef.current + 1
    pageRef.current = newPage

    try {
      const newAuctions = await AuctionsController.load({
        page: newPage,
        pageSize: 16,
        started: false,
      })
      if (newAuctions.length === 0) {
        reachedEndRef.current = true
      }

      setAuctions((prev) => [...prev, ...newAuctions])
    } catch (error) {
      console.error(`Could not load starting soon auctions: ${error}`)
      toast.error(t('generic.something_went_wrong'), { delay: 5000 })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting) {
        fetchData()
      }
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [])

  return (
    <div
      className="max-width d-flex flex-col align-items-center w-100 mt-30 mt-sm-5 mb-50 gap-4"
      style={{ flexDirection: 'column' }}
    >
      <div className="d-flex align-items-start justify-content-start section-header">
        <h1 className="m-0">{t('starting_soon_auctions.starting_soon_plural')}</h1>
      </div>
      <div id="promoted-list-root" className="d-flex justify-center row w-100 no-bs-gutter">
        {!auctions.length && !isLoading && (
          <NoDataCard title={t('home.auctions.no_auctions_to_display')} description={''} />
        )}
        <InfiniteScroll
          dataLength={auctions.length}
          next={fetchData}
          hasMore={!reachedEndRef.current}
          loader={
            !auctions.length ? null : (
              <div className="loader-wrapper d-flex align-items-center justify-content-center mb-20">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            )
          }
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
          scrollableTarget="promoted-list-root"
        >
          {auctions.map((auction, index) => {
            return <AuctionCard key={index} auction={auction} />
          })}
        </InfiniteScroll>
        <div ref={loaderRef} />
      </div>
    </div>
  )
}
