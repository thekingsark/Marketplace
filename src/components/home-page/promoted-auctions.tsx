'use client'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import { observer } from 'mobx-react-lite'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { NoDataCard } from '../common/no-data-card'
import { Auction } from '@/core/domain/auction'
import { HomeAuctionsSwiper } from './auctions-swiper'

export const PromotedAuctionsSection = observer(
  (props: { auctions: Record<string, unknown>[] }) => {
    const promotedAuctions = props.auctions.map((auction) => Auction.fromJSON(auction))

    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const screenIsBig = useScreenIsBig()

    return (
      <div
        className="home-auctions-root max-width d-flex flex-col align-items-center w-100 mt-50 mb-50 gap-4"
        style={{ flexDirection: 'column' }}
      >
        <div className="d-flex align-items-center section-header justify-content-between w-100">
          <h1 className="text-4xl font-bold text-center m-0">{t('generic.promoted_auctions')}</h1>
          <Link href="/auctions/promoted">
            <button className={`${!screenIsBig ? 'border-btn' : 'hidden-border-btn'} mr-5`}>
              <span>{t('generic.see_all')}</span>
            </button>
          </Link>
        </div>
        {!promotedAuctions?.length && (
          <NoDataCard title={t('home.auctions.no_auctions_to_display')} description={''} />
        )}
        {!!promotedAuctions.length && <HomeAuctionsSwiper auctions={promotedAuctions} />}
      </div>
    )
  }
)
