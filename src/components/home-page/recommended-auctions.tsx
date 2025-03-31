'use client'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { NoDataCard } from '../common/no-data-card'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import { Auction } from '@/core/domain/auction'
import { HomeAuctionsSwiper } from './auctions-swiper'
import Link from 'next/link'
import { Icon } from '@/components/common/icon'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'

export const RecommendationsSection = observer(
  (props: { recommendations: Record<string, unknown>[] }) => {
    const currentAccount = AppStore.accountData
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const storeRecommendations = AppStore.recommendedAuctions
    const recommendations = props.recommendations.map((recommendation) =>
      Auction.fromJSON(recommendation)
    )

    const recommendationsToDisplay = storeRecommendations.length
      ? storeRecommendations
      : recommendations

    const screenIsBig = useScreenIsBig()

    // We do not want to show recommendations if the user is not logged in
    if (!currentAccount?.id && !AppStore.loadingStates.currentAccount) {
      return (
        <div
          className="home-recommendations-root max-width d-flex flex-col align-items-center w-100 mt-50 mb-50 gap-4"
          style={{ flexDirection: 'column' }}
        >
          <div className="d-flex align-items-center justify-content-between section-header">
            <h1 className="text-4xl font-bold text-center m-0">
              {t('recommendations.you_might_like')}
            </h1>
          </div>
          <div className="need-to-login-root w-100 p-16 d-flex align-items-center justify-content-between flex-column flex-sm-row">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <Icon type="generic/login" size={48} />
              </div>
              <span> {t('info.sign_in_for_recommendations')}</span>
            </div>
            <Link href="/auth/login" className={`${screenIsBig ? '' : 'w-100 mt-10'}`}>
              <button
                className={`border-btn mt-10 mt-sm-0 ${screenIsBig ? '' : 'w-100'}`}
                aria-label={t('auth.sign_in.sign_in')}
              >
                {t('auth.sign_in.sign_in')}
              </button>
            </Link>
          </div>
          <style jsx>{`
            .need-to-login-root {
              background: var(--background_4);
              border-radius: 6px;
            }
          `}</style>
        </div>
      )
    }

    return (
      <div
        className="home-recommendations-root max-width d-flex flex-col align-items-center w-100 mt-50 mb-50 gap-4"
        style={{ flexDirection: 'column' }}
      >
        <div className="d-flex align-items-center justify-content-between section-header">
          <h1 className="text-4xl font-bold text-center m-0">
            {t('recommendations.you_might_like')}
          </h1>
          {!!recommendationsToDisplay.length && (
            <Link href="/auctions/recommendations">
              <button
                className={`${!screenIsBig ? 'border-btn' : 'hidden-border-btn'} mr-5`}
                aria-label={t('generic.see_all')}
              >
                <span>{t('generic.see_all')}</span>
              </button>
            </Link>
          )}
        </div>
        {!recommendationsToDisplay?.length && (
          <NoDataCard
            title={t('recommendations.no_recommendations_for_you')}
            description={t('recommendations.no_recommendation_details')}
          />
        )}
        {!!recommendationsToDisplay.length && (
          <HomeAuctionsSwiper auctions={recommendationsToDisplay} />
        )}
      </div>
    )
  }
)
