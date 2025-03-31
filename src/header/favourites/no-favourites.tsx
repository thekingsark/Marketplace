import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from 'react-i18next'

export const NoFavouriteAuctions = (props: { isActive?: boolean; isAll?: boolean }) => {
  const { isActive = true, isAll } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="mt-20">
        <Icon type={'generic/favourite'} size={100} />
      </div>
      <div className="mt-20 mb-20">
        <p className="mb-0 no-favs-msg text-center">
          {t(
            isAll
              ? 'favourites.no_favourites'
              : isActive
                ? 'favourites.app_bar.no_active_auctions'
                : 'favourites.app_bar.no_closed_auctions'
          )}
        </p>
      </div>

      <div className="pl-20 pr-20 mb-20 text-center d-flex flex-wrap justify-content-center align-items-center">
        <div className="no-fav-descr d-inline-block">
          <span>{t('favourites.app_bar.tap_on_the')}</span>
        </div>
        <div className="ml-10 mr-10 d-flex heart-icon-wrapper">
          <Icon type={'generic/heart'} />
        </div>
        <div className="no-fav-descr d-inline-block">
          <span>{t('favourites.app_bar.available_icon')}</span>
        </div>
      </div>
      <style jsx>{`
        .no-favs-msg {
          color: var(--font_1);
        }
        .no-fav-descr {
          line-height: 1.4;
          color: var(--font_3);
        }
        .heart-icon-wrapper {
          margin-bottom: 3px;
        }
      `}</style>
    </div>
  )
}
