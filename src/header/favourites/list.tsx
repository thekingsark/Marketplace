import React from 'react'
import Link from 'next/link'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { NoFavouriteAuctions } from './no-favourites'
import { AuctionCardSkeleton } from '@/components/skeletons/auction-card'
import { AuctionCard } from '@/components/auction-card'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

export const FavouritesMenuList = observer(() => {
  const globalContext = useGlobalContext()

  const favouriteLoading = AppStore.loadingStates.favourites
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const arrayWithTwoItems = Array.from(Array(2).keys())

  const favouriteAuctions = AppStore.favouriteAuctions
  const sortedByCreatedAt = favouriteAuctions
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const firstTwoFavourites = sortedByCreatedAt.slice(0, 2)

  return (
    <>
      <div className="d-flex flex-column justify-content-between mb-20 mt-20 pl-20 pr-20 pt-10">
        <div className="d-flex align-items-center justify-content-between mb-20">
          <h3 className="mt-0 mb-0">
            {t('bottom_nav.favourites')} ({AppStore.favouriteAuctions.length}){' '}
          </h3>
          {!!AppStore.favouriteAuctions.length && (
            <Link href={`/profile?tab=favourites`}>
              <button className="border-btn" aria-label={t('generic.see_all')}>
                {t('generic.see_all')}
              </button>
            </Link>
          )}
        </div>

        <div className="">
          {!favouriteLoading && !firstTwoFavourites.length ? <NoFavouriteAuctions /> : null}

          <div className="row wow fadeInUp">
            {favouriteLoading
              ? arrayWithTwoItems.map((i) => (
                <div className="auction-list-item" key={i}>
                  <AuctionCardSkeleton />
                </div>
              ))
              : firstTwoFavourites.map((item, index) => (
                <div key={item.id} className="auction-list-item ">
                  <AuctionCard key={index} auction={item} fullWidth />
                </div>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .auction-list-item {
          width: 50%;
          padding: 0 4px;
        }
      `}</style>
    </>
  )
})
