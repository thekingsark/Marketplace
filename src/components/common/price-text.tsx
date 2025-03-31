import { useCurrentCurrency } from '@/hooks/current-currency'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import React from 'react'

interface PriceTextProps {
  price: number
  initialCurrencyId?: string
  style?: React.CSSProperties
  maxLines?: number
  useIntegerOnly?: boolean
  overflow?: 'clip' | 'ellipsis'
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  initialCurrencyIsSameAsTargetCurrency?: boolean
}

export const PriceText = observer((props: PriceTextProps) => {
  const { price, style, maxLines, useIntegerOnly = false, overflow, textAlign, initialCurrencyId, initialCurrencyIsSameAsTargetCurrency } = props
  const globalContext = useGlobalContext()
  const { appCurrencies, appExchangeRate } = globalContext
  const locale = navigator.language

  const currentCurrency = useCurrentCurrency()

  if (!appExchangeRate) {
    return (
      <span
        style={{
          ...style,
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow,
        }}
      >
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'USD',
        }).format(price)}
      </span>
    )
  }

  const baseCurrencyId = appExchangeRate.baseCurrencyId
  const fromCurrencyId = initialCurrencyId ?? baseCurrencyId
  const toCurrencyCode = currentCurrency?.code

  const fromCurrency = appCurrencies.find((currency) => currency.id === fromCurrencyId)

  if (!fromCurrency || !toCurrencyCode) {
    return (
      <span
        style={{
          ...style,
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow,
        }}
      >
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: price % 1 === 0 ? 0 : 2,
        }).format(price)}
      </span>
    )
  }

  const rateCode = initialCurrencyIsSameAsTargetCurrency ? toCurrencyCode : fromCurrency.code
  const fromRate = appExchangeRate.rates[rateCode] ?? 1.0
  const toRate = appExchangeRate.rates[toCurrencyCode] ?? 1.0

  let convertedPrice = (price / fromRate) * toRate
  if (useIntegerOnly) {
    convertedPrice = Math.floor(convertedPrice)
  }

  return (
    <span
      style={{
        ...style,
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow,
        textAlign,
      }}
    >
      {new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currentCurrency?.code,
        minimumFractionDigits: convertedPrice % 1 === 0 ? 0 : 2,
      }).format(convertedPrice)}
    </span>
  )
}

)