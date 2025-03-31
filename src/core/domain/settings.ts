import { APP_NAME, MOBILE_APP_LINKS } from '@/constants'

export class BiddoSettings {
  auctionActiveTimeInHours: number
  maxAllowedDistanceBetweenUsersInKM: number
  maxProductPrice: number
  promotionCoinsCost: number

  defaultProductImageUrl: string
  confidentialityLink: string
  freeAuctionsCount: number
  freeBidsCount: number
  auctionsCoinsCost: number
  bidsCoinsCost: number

  appName: string
  googlePlayLink: string
  appStoreLink: string

  accountPageLayout: 'sidebar' | 'tabs' = 'tabs'
  profilePageLayout: 'sidebar' | 'tabs' = 'sidebar'

  defaultCurrencyId?: string

  allowMultipleCurrencies: boolean

  emailValidationEnabled: boolean
  allowUnvalidatedUsersToCreateAuctions: boolean
  allowUnvalidatedUsersToCreateBids: boolean
  allowAnonymousUsersToCreateAuctions: boolean
  allowAnonymousUsersToCreateBids: boolean

  constructor(params: Record<string, unknown> = {}) {
    this.defaultCurrencyId = params.defaultCurrency as string
    this.appName = (params.appName as string) ?? APP_NAME
    this.auctionActiveTimeInHours = (params.auctionActiveTimeInHours as number) ?? 96
    this.maxAllowedDistanceBetweenUsersInKM = params.maxAllowedDistanceBetweenUsersInKM as number
    this.maxProductPrice = params.maxProductPrice as number
    this.promotionCoinsCost = params.promotionCoinsCost as number
    this.allowMultipleCurrencies = (params.allowMultipleCurrencies as boolean) ?? true
    this.defaultProductImageUrl = params.defaultProductImageUrl as string
    this.confidentialityLink = params.confidentialityLink as string
    this.freeAuctionsCount = params.freeAuctionsCount as number
    this.freeBidsCount = params.freeBidsCount as number
    this.auctionsCoinsCost = params.auctionsCoinsCost as number
    this.bidsCoinsCost = params.bidsCoinsCost as number
    this.googlePlayLink = (params.googlePlayLink as string) ?? MOBILE_APP_LINKS.GOOGLE_PLAY_LINK
    this.appStoreLink = (params.appStoreLink as string) ?? MOBILE_APP_LINKS.APP_STORE_LINK
    this.accountPageLayout = (params.accountPageLayout as 'sidebar' | 'tabs') ?? 'tabs'
    this.profilePageLayout = (params.profilePageLayout as 'sidebar' | 'tabs') ?? 'tabs'
    this.emailValidationEnabled = (params.emailValidationEnabled as boolean) ?? true
    this.allowUnvalidatedUsersToCreateAuctions =
      (params.allowUnvalidatedUsersToCreateAuctions as boolean) ?? true
    this.allowUnvalidatedUsersToCreateBids =
      (params.allowUnvalidatedUsersToCreateBids as boolean) ?? true
    this.allowAnonymousUsersToCreateAuctions =
      (params.allowAnonymousUsersToCreateAuctions as boolean) ?? true
    this.allowAnonymousUsersToCreateBids =
      (params.allowAnonymousUsersToCreateBids as boolean) ?? true
  }

  static fromJSON(data: Record<string, unknown>) {
    return new BiddoSettings({
      appName: data.appName,
      defaultCurrency: data.defaultCurrency,
      auctionActiveTimeInHours: data.auctionActiveTimeInHours,
      maxAllowedDistanceBetweenUsersInKM: data.maxAllowedDistanceBetweenUsersInKM,
      maxProductPrice: data.maxProductPrice,
      promotionCoinsCost: data.promotionCoinsCost,
      defaultProductImageUrl: data.defaultProductImageUrl,
      confidentialityLink: data.confidentialityLink,
      freeAuctionsCount: data.freeAuctionsCount,
      freeBidsCount: data.freeBidsCount,
      auctionsCoinsCost: data.auctionsCoinsCost,
      bidsCoinsCost: data.bidsCoinsCost,
      allowMultipleCurrencies: data.allowMultipleCurrencies,
      googlePlayLink: data.googlePlayLink,
      appStoreLink: data.appStoreLink,
      accountPageLayout: data.accountPageLayout,
      profilePageLayout: data.profilePageLayout,
      emailValidationEnabled: data.emailValidationEnabled,
      allowUnvalidatedUsersToCreateAuctions: data.allowUnvalidatedUsersToCreateAuctions,
      allowUnvalidatedUsersToCreateBids: data.allowUnvalidatedUsersToCreateBids,
      allowAnonymousUsersToCreateAuctions: data.allowAnonymousUsersToCreateAuctions,
      allowAnonymousUsersToCreateBids: data.allowAnonymousUsersToCreateBids,
    })
  }
}
