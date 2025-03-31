import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { memo, useEffect, useRef, useState } from 'react'

export const AuctionsListPriceFilter = memo(
  (props: {
    initialMinPrice?: number
    initialMaxPrice?: number
    handleMinChange: (minPrice?: number) => void
    handleMaxChange: (maxPrice?: number) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const [minPrice, setMinPrice] = useState<number | undefined>(props.initialMinPrice)
    const [maxPrice, setMaxPrice] = useState<number | undefined>(props.initialMaxPrice)

    const minPriceRef = useRef<HTMLInputElement>(null)
    const maxPriceRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (!props.initialMinPrice && minPriceRef.current) {
        minPriceRef.current.value = ''
      }
      setMinPrice(props.initialMinPrice)
    }, [props.initialMinPrice])

    useEffect(() => {
      if (!props.initialMaxPrice && maxPriceRef.current) {
        maxPriceRef.current.value = ''
      }
      setMaxPrice(props.initialMaxPrice)
    }, [props.initialMaxPrice])

    const handleMinPriceBlur = () => {
      props.handleMinChange(minPrice)
    }

    const handleMaxPriceBlur = () => {
      props.handleMaxChange(maxPrice)
    }

    // On enter key press, call the blur function
    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.currentTarget.blur()
      }
    }

    return (
      <div>
        <span className="secondary-color">{t('home.filter.price')}</span>
        <div className="d-flex gap-2 mt-1">
          <input
            ref={minPriceRef}
            className="w-100 custom-input"
            type="number"
            placeholder={t('home.filter.min_price')}
            value={minPrice}
            onKeyDown={handleEnterKeyPress}
            onBlur={handleMinPriceBlur}
            onChange={(e) => {
              setMinPrice(parseInt(e.target.value))
            }}
          />
          <input
            ref={maxPriceRef}
            className="w-100 custom-input"
            type="number"
            placeholder={t('home.filter.max_price')}
            value={maxPrice}
            onKeyDown={handleEnterKeyPress}
            onBlur={handleMaxPriceBlur}
            onChange={(e) => {
              setMaxPrice(parseInt(e.target.value))
            }}
          />
        </div>
      </div>
    )
  }
)

AuctionsListPriceFilter.displayName = 'AuctionsListPriceFilter'
