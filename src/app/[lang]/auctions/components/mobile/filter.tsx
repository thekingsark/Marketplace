import { useTranslation } from '@/app/i18n/client'
import { AppLogo } from '@/components/common/app-logo'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { AuctionFilters } from '../filters'
import { Dispatch, SetStateAction, useRef } from 'react'
import { AllAuctionsFilter } from '../../root'
import { Location } from '@/core/domain/location'
import { useClickOutside } from '@/hooks/click-outside'

export const MobileAuctionsFilter = (props: {
  opened: boolean
  allAuctionsCount: number
  locations: Location[]
  activeFilters: AllAuctionsFilter
  handleClose: () => void
  setActiveFilters: Dispatch<SetStateAction<AllAuctionsFilter>>
}) => {
  const { opened, handleClose, locations, activeFilters, setActiveFilters } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const mobileFilterRef = useRef<HTMLDivElement>(null)
  useClickOutside(mobileFilterRef, () => {
    if (opened) {
      handleClose()
    }
  })

  return (
    <>
      <div className={opened ? 'side-info info-open' : 'side-info'} ref={mobileFilterRef}>
        <div className="side-info-content">
          <div className="mb-40">
            <div className="row align-items-center">
              <div className="col-9">
                <AppLogo />
              </div>
              <div className="col-3 text-end">
                <button className="side-info-close" aria-label="close" onClick={handleClose}>
                  <Icon type="generic/close-filled" />
                </button>
              </div>
            </div>

            <div className="mt-30">
              <div className="mb-20">
                <h1 className="m-0">{t('home.filter.filter')}</h1>
              </div>
              <AuctionFilters
                allAuctionsCount={props.allAuctionsCount}
                locations={locations}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </div>

            <div className="mt-30 w-100">
              <button
                className="fill-btn w-100"
                onClick={handleClose}
                aria-label={t('home.filter.apply_filter')}
              >
                {t('home.filter.apply_filter')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
