import { useEffect, useState } from 'react'
import useGlobalContext from './use-context'
import { AppStore } from '@/core/store'

export const useCurrentCurrency = () => {
  const globalContext = useGlobalContext()
  const { appCurrencies, appSettings } = globalContext
  const findCurrency = (currencyId: string) => {
    return appCurrencies.find((currency) => currency.id === currencyId)
  }

  const [currentCurrency, setCurrentCurrency] = useState(
    findCurrency(AppStore.accountData?.selectedCurrencyId ?? appSettings.defaultCurrencyId ?? '')
  )

  useEffect(() => {
    const currencyId = AppStore.accountData?.selectedCurrencyId ?? appSettings.defaultCurrencyId
    setCurrentCurrency(findCurrency(currencyId ?? ''))
  }, [AppStore.accountData?.selectedCurrencyId, appSettings.defaultCurrencyId])

  return currentCurrency
}
