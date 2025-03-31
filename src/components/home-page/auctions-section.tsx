'use client'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { AuctionCard } from '../auction-card'
import { NoDataCard } from '../common/no-data-card'
import Link from 'next/link'
import { AppStore } from '@/core/store'
import { Auction } from '@/core/domain/auction'
import { observer } from 'mobx-react-lite'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'

export const AuctionsSection = observer(
  (props: { auctions: Record<string, unknown>[]; activeAuctionsCount: number }) => {
    const { auctions } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const screenIsBig = useScreenIsBig()

    const auctionsCount = AppStore.activeAuctionsCount || props.activeAuctionsCount

    return (
      <div
        className="home-auctions-root max-width d-flex flex-col align-items-center w-100 mt-50 mb-50 gap-4"
        style={{ flexDirection: 'column' }}
      >
        <div className="d-flex align-items-center section-header justify-content-between w-100">
          <h1 className="text-4xl font-bold text-center m-0">{t('home.auctions.auctions')}</h1>
          <Link href="/auctions?sort=0&page=1">
            <button className={`${!screenIsBig ? 'border-btn' : 'hidden-border-btn'} mr-5`}>
              <span>{t('generic.see_all')}</span>
            </button>
          </Link>
        </div>
        {!auctions?.length && (
          <NoDataCard title={t('home.auctions.no_auctions_to_display')} description={''} />
        )}
        <div className="d-flex justify-center row w-100">
          {auctions.map((auction: Record<string, unknown>, index) => {
            return <AuctionCard auction={Auction.fromJSON(auction)} key={index} />
          })}
        </div>
        {auctions.length !== 0 && (
          <Link href="/auctions?sort=0&page=1">
            <button className="fill-btn mt-10" aria-label={t('generic.see_all')}>
              <span>{t('home.auctions.see_all', { no: auctionsCount })}</span>
            </button>
          </Link>
        )}
      </div>
    )
  }
)
