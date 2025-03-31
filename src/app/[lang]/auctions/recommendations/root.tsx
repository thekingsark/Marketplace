'use client'
import { useTranslation } from '@/app/i18n/client'
import { AuctionCard } from '@/components/auction-card'
import { Icon } from '@/components/common/icon'
import { AuctionsController } from '@/core/controllers/auctions'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'react-toastify'

export const RecommendationsRoot = (props: { recommendations: Record<string, unknown>[] }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const initialRecommendations =
    props.recommendations?.map((recommendation) => Auction.fromJSON(recommendation)) ?? []

  const [recommendations, setRecommendations] = useState<Auction[]>(initialRecommendations)

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
      const newRecommendations = await AuctionsController.loadRecommendations(newPage, 16)
      if (newRecommendations.length === 0) {
        reachedEndRef.current = true
      }

      setRecommendations((prev) => [...prev, ...newRecommendations])
    } catch (error) {
      console.error(`Could not load recommendations: ${error}`)
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
        <h1 className="m-0">{t('recommendations.you_might_like')}</h1>
      </div>
      <div id="recommendations-list-root" className="d-flex justify-center row w-100 no-bs-gutter">
        <InfiniteScroll
          dataLength={recommendations.length}
          next={fetchData}
          hasMore={!reachedEndRef.current}
          loader={
            !recommendations.length ? null : (
              <div className="loader-wrapper d-flex align-items-center justify-content-center mb-20">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            )
          }
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
          scrollableTarget="recommendations-list-root"
        >
          {recommendations.map((auction, index) => {
            return <AuctionCard key={index} auction={auction} />
          })}
        </InfiniteScroll>
        <div ref={loaderRef} />
      </div>
    </div>
  )
}
