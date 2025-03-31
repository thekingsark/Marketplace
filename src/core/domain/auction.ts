import { makeAutoObservable } from 'mobx'
import { Account } from './account'
import { Asset } from './asset'
import { Bid } from './bid'
import { Review } from './review'

export enum AuctionProductCondition {
  newProduct,
  used,
}

export class Auction {
  id: string
  title: string
  description: string
  condition: AuctionProductCondition
  auctioneer?: Account
  youtubeLink?: string

  location: LatLng
  locationPretty: string
  assets?: Asset[]
  bids: Bid[]
  reviews: Review[]
  views?: number

  mainCategoryId: string
  subCategoryId: string

  acceptedBidAt?: Date
  acceptedBidId?: string
  bidsCount?: number

  hasCustomStartingPrice?: boolean
  startingPrice?: number
  lastPrice?: number
  likesCount?: number

  lastPriceCurrencyId?: string
  initialCurrencyId?: string

  whoPaysForShipment?: string

  startAt?: Date
  startedAt?: Date

  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  promotedAt?: Date
  isActive: boolean

  historyEvents?: AuctionHistoryEvent[]

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.title = params.title as string
    this.description = params.description as string
    this.location = params.location as LatLng
    this.locationPretty = params.locationPretty as string
    this.auctioneer = params.auctioneer as Account
    this.assets = params.assets as Asset[]
    this.bids = params.bids as Bid[]
    this.condition = params.condition as AuctionProductCondition
    this.reviews = params.reviews as Review[]
    this.views = params.views as number
    this.isActive = (params.isActive as boolean) ?? true
    this.acceptedBidAt = params.acceptedBidAt as Date
    this.acceptedBidId = params.acceptedBidId as string
    this.bidsCount = params.bidsCount as number
    this.hasCustomStartingPrice = params.hasCustomStartingPrice as boolean
    this.startingPrice = params.startingPrice as number
    this.youtubeLink = params.youtubeLink as string
    this.lastPrice = params.lastPrice as number
    this.mainCategoryId = params.mainCategoryId as string
    this.subCategoryId = params.subCategoryId as string
    this.whoPaysForShipment = params.whoPaysForShipment as string
    this.expiresAt = params.expiresAt as Date
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
    this.promotedAt = params.promotedAt as Date
    this.startAt = params.startAt as Date
    this.startedAt = params.startedAt as Date
    this.historyEvents = params.historyEvents as AuctionHistoryEvent[]
    this.lastPriceCurrencyId = params.lastPriceCurrencyId as string
    this.initialCurrencyId = params.initialCurrencyId as string

    makeAutoObservable(this)
  }

  static fromJSON(data: Record<string, unknown> = {}) {
    const locationLat = data.locationLat as number
    const locationLong = data.locationLong as number

    const locationLatLng =
      locationLat != null && locationLong != null
        ? new LatLng({ lat: locationLat, lng: locationLong })
        : null
    const auctioneer = data.account
      ? Account.fromJSON(data.account as Record<string, unknown>)
      : null

    const reviews = data.reviews ? (data.reviews as Partial<Review>[]).map(Review.fromJSON) : []
    const bids = data.bids ? (data.bids as Partial<Bid>[]).map(Bid.fromJSON) : []

    let assets = data.auctionAssets
      ? (data.auctionAssets as Partial<Asset>[]).map(Asset.fromJSON)
      : []

    if (!assets?.length && Array.isArray(data.assets) && data.assets?.length) {
      assets = (data.assets as Partial<Asset>[]).map(Asset.fromJSON)
    }

    let locationPretty = data.locationPretty ?? ''
    if (!locationPretty || locationPretty === 'undefined') {
      locationPretty = ''
    }

    const historyEvents = data.auctionHistoryEvents
      ? (data.auctionHistoryEvents as Partial<AuctionHistoryEvent>[]).map(
          AuctionHistoryEvent.fromJSON
        )
      : []

    return new Auction({
      id: data.id,
      title: data.title,
      condition: data.isNewItem ? AuctionProductCondition.newProduct : AuctionProductCondition.used,
      description: data.description,
      youtubeLink: data.youtubeLink,
      location: locationLatLng,
      lastPriceCurrencyId: data.lastPriceCurrencyId,
      initialCurrencyId: data.initialCurrencyId,
      mainCategoryId: data.mainCategoryId,
      subCategoryId: data.subCategoryId,
      locationPretty,
      auctioneer,
      assets,
      bids,
      reviews,
      historyEvents,
      views: data.views,
      countdownPreference: data.countdownPreference,
      countdownStarted: data.countdownStarted,
      isActive: data.isActive,
      acceptedBidAt: data.acceptedBidAt ? new Date(data.acceptedBidAt.toString()) : null,
      acceptedBidId: data.acceptedBidId,
      bidsCount: data.bidsCount,
      reactivatedAt: data.reactivatedAt ? new Date(data.reactivatedAt.toString()) : null,
      reactivationCount: data.reactivationCount ?? 0,
      hasCustomStartingPrice: data.hasCustomStartingPrice,
      startingPrice: data.startingPrice ? parseFloat(data.startingPrice.toString()) : 0,
      lastPrice: data.lastPrice ? parseFloat(data.lastPrice.toString()) : 0,
      whoPaysForShipment: data.whoPaysForShipment,
      expiresAt: data.expiresAt ? new Date(data.expiresAt.toString()) : null,
      startAt: data.startAt ? new Date(data.startAt.toString()) : null,
      startedAt: data.startedAt ? new Date(data.startedAt.toString()) : null,

      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt.toString()) : null,
      promotedAt: data.promotedAt ? new Date(data.promotedAt.toString()) : null,
    })
  }
}

export class LatLng {
  lat: number
  lng: number

  constructor(params: Record<string, number> = {}) {
    this.lat = params.lat
    this.lng = params.lng
  }
}

export class AuctionHistoryEvent {
  id: string
  type: string
  details: Record<string, string>
  createdAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.type = params.type as string
    this.details = params.details as Record<string, string>
    this.createdAt = params.createdAt as Date
  }

  static fromJSON(data: Record<string, unknown> = {}) {
    return new AuctionHistoryEvent({
      id: data.id,
      type: data.type,
      details: data.details,
      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : null,
    })
  }
}
