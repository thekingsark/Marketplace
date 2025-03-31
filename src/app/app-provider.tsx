'use client'

import { Category } from '@/core/domain/category'
import { Currency } from '@/core/domain/currency'
import { ExchangeRate } from '@/core/domain/exchange_rate'
import { PaymentProduct } from '@/core/domain/payment-product'
import { BiddoSettings } from '@/core/domain/settings'
import React, { createContext, useState } from 'react'

export interface AppContextType {
  navPathName: string
  setNavPathName: (name: string) => void
  currentLanguage: string
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>
  scrollDirection: string
  setScrollDirection: React.Dispatch<React.SetStateAction<string>> | undefined
  appSettings: BiddoSettings
  appCategories: Category[]
  appCurrencies: Currency[]
  appExchangeRate: ExchangeRate
  paymentProducts: PaymentProduct[]
  availablePayments: string[]
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider = ({
  children,
  lang,
  settings,
  categories,
  currencies,
  exchangeRate,
  paymentProducts,
  availablePayments
}: {
  children: React.ReactNode
  lang: string
  settings: Record<string, unknown>
  categories: Record<string, unknown>[]
  currencies: Record<string, unknown>[]
  exchangeRate: Record<string, unknown>
  paymentProducts: Record<string, unknown>[]
  availablePayments: string[]
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(lang)
  const [navPathName, setNavMapName] = useState<string>('/')
  const [scrollDirection, setScrollDirection] = useState<string>('')

  const appSettings = BiddoSettings.fromJSON(settings)
  const appCategories = categories.map((category) => Category.fromJSON(category))
  const appCurrencies = currencies.map((currency) => Currency.fromJSON(currency))
  const appExchangeRate = ExchangeRate.fromJSON(exchangeRate)
  const appPaymentProducts = paymentProducts?.map((paymentProduct) => PaymentProduct.fromJSON(paymentProduct))

  const contextValue: AppContextType = {
    navPathName,
    setNavPathName: setNavMapName,
    currentLanguage,
    setCurrentLanguage,
    scrollDirection,
    setScrollDirection,
    appSettings,
    appCategories,
    appCurrencies,
    appExchangeRate,
    paymentProducts: appPaymentProducts,
    availablePayments: availablePayments?.map((payment) => payment.toLowerCase()) ?? []
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export default AppProvider
