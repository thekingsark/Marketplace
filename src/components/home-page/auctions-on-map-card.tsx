'use client'
import MapBackground from '@/../public/assets/img/map.webp'
import { Icon } from '../common/icon'
import Link from 'next/link'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'

export const AuctionsOnMapCard = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="max-width mb-50 ">
      <div
        className="card-with-image-background"
        style={{
          backgroundImage: `url(${MapBackground.src})`,
        }}
      >
        <div className="card-with-image-background-overlay pl-20 pr-20">
          <Icon type="generic/map" size={48} />

          <div className="w-100 p-16 d-flex align-items-start flex-column">
            <span className="fw-bold text-center m-0">{t('auctions_map.title')}</span>
            <p className="m-0">{t('auctions_map.description')}</p>
          </div>
          <div className="p-16">
            <Link href={'/auctions/map'}>
              <button className="border-btn">{t('auctions_map.see_auctions')}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
