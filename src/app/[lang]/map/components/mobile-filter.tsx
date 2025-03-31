import { useTranslation } from '@/app/i18n/client'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'
import { useRef } from 'react'
import { useClickOutside } from '@/hooks/click-outside'
import { AppLogo } from '@/components/common/app-logo'
import { Icon } from '@/components/common/icon'
import { AuctionsListCategoriesFilter } from '../../components/filters/categories'

export const AuctionDetailsMapMobileFilter = (props: {
  opened: boolean
  selectedCategory?: Category
  handleClose: () => void
  handleSelectCategory: (category?: Category) => void
}) => {
  const { opened, handleClose, selectedCategory, handleSelectCategory } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useClickOutside(mobileMenuRef, () => {
    if (opened) {
      handleClose()
    }
  })

  return (
    <>
      <div className={opened ? 'side-info info-open h-100' : 'side-info'} ref={mobileMenuRef}>
        <div className="side-info-content h-100">
          <div className="mb-40 h-100">
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

            <div className="mt-30 mb-30">
              <div className="mb-20">
                <h1 className="m-0">{t('home.filter.filter')}</h1>
              </div>

              <AuctionsListCategoriesFilter
                defaultSelected={selectedCategory}
                withLabel={false}
                allAuctionsCount={100}
                handleChange={handleSelectCategory}
              />
            </div>
            <div className="w-100">
              <button
                className="fill-btn w-100 mt-30"
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
