import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { AuctionAddCustomPriceModal } from '../modals/add-custom-price'
import { FormErrorMessage } from '../form-error-message'
import { PriceText } from '@/components/common/price-text'

interface AuctionFormPriceSectionProps {
  rootRef: React.RefObject<HTMLDivElement>
  selectedPrice: number | null
  isCustomPriceSelected?: boolean
  formIsValid: boolean
  formSubmitTries: number
  initialCurrencyId?: string
  setPrice: (price: number, isCustomPrice?: boolean) => void
}

export const AuctionFormPriceSection = (props: AuctionFormPriceSectionProps) => {
  const {
    formIsValid,
    formSubmitTries,
    rootRef,
    isCustomPriceSelected = false,
    setPrice,
    initialCurrencyId,
  } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [selectedPrice, setSelectedPrice] = useState<number | null>(props.selectedPrice)
  const [customPriceIsSelected, setCustomPriceIsSelected] = useState(isCustomPriceSelected)
  const [customPriceModalIsOpened, setCustomPriceModalIsOpened] = useState(false)
  const [initialPriceChanged, setInitialPriceChanged] = useState(false)

  const handleCustomPriceSubmit = (price: number) => {
    setCustomPriceIsSelected(true)
    setSelectedPrice(price)
    setPrice(price, true)
    setCustomPriceModalIsOpened(false)
    setInitialPriceChanged(true)
  }

  const handlePriceChange = (price: number) => {
    setCustomPriceIsSelected(false)
    setSelectedPrice(price)
    setPrice(price, false)
  }

  const renderDefaultPriceItem = (price: number, hideOnSmall = false) => {
    return (
      <li
        className={`create-auction-price-item ${selectedPrice === price && !customPriceIsSelected ? 'selected-price' : ''
          }
        ${hideOnSmall ? 'd-sm-inline-flex d-none' : ''}
        `}
        onClick={() => {
          handlePriceChange(price)
        }}
      >
        <div className="filter-list-item d-flex align-items-center">
          <label className="ml-10 mr-10 mb-0">
            <PriceText price={price} initialCurrencyIsSameAsTargetCurrency />
          </label>
        </div>
      </li>
    )
  }

  return (
    <div className="mt-40" ref={rootRef}>
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label className="mb-0 create-auction-label">{t('create_auction.starting_price')}</label>
      </div>
      <ul className="d-flex gap-2">
        {renderDefaultPriceItem(5, true)}
        {renderDefaultPriceItem(10)}
        {renderDefaultPriceItem(15)}
        <li
          className={`create-auction-price-item ${customPriceIsSelected ? 'selected-price' : ''}`}
          onClick={() => {
            setCustomPriceModalIsOpened(true)
          }}
        >
          <div className="filter-list-item d-flex align-items-center">
            <label className="ml-10 mb-0">
              {customPriceIsSelected && selectedPrice !== null ? (
                <span>
                  <PriceText
                    price={selectedPrice ?? 0}
                    {...(initialCurrencyId && !initialPriceChanged ? { initialCurrencyId } : {})}
                    initialCurrencyIsSameAsTargetCurrency={!initialCurrencyId}
                  />
                </span>
              ) : (
                t('create_auction.another_starting_price')
              )}
            </label>
          </div>
        </li>
      </ul>

      <AuctionAddCustomPriceModal
        close={() => setCustomPriceModalIsOpened(false)}
        isOpened={customPriceModalIsOpened}
        handleSubmit={handleCustomPriceSubmit}
      />

      {!formIsValid && selectedPrice === null && !!formSubmitTries && (
        <div className="mt-10">
          <FormErrorMessage
            key={formSubmitTries}
            message={t('create_auction.price_required')}
            isError
          />
        </div>
      )}
    </div>
  )
}
