import { Asset } from './asset'
import { Auction } from './auction'
import { Category } from './category'
import { FilterItem } from './filter'
import { Review } from './review'

export class Account {
  id: string
  name: string
  email: string
  picture: string
  isAnonymous: boolean
  activeAuctionsCount?: number
  acceptedTermsAndCondition: boolean

  auctions?: Auction[]
  reviews?: Review[]
  blockedAccounts?: string[]
  reviewsCount?: number
  reviewsAverage?: number
  phone?: string

  introDone: boolean
  introSkipped: boolean
  coins: number

  categoriesSetupDone: boolean
  preferredCategoriesIds: string[]
  preferredGenres?: Category[]

  locationLatLng?: { lat: number; lng: number }
  locationPretty?: string

  followingAccountsIds?: string[]
  followedByAccountsIds?: string[]
  followingCount?: number
  followersCount?: number
  filters?: FilterItem[]

  verified?: boolean
  verifiedAt?: Date
  verificationRequestedAt?: Date

  meta?: AccountMetadata
  allowedNotifications?: AccountNotifications

  selectedCurrencyId?: string

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.name = params.name as string
    this.email = params.email as string
    this.picture = params.picture as string
    this.coins = params.coins as number
    this.phone = params.phone as string
    this.isAnonymous = (params.isAnonymous as boolean) ?? false
    this.filters = (params.filters as FilterItem[]) ?? []
    this.reviews = (params.reviews as Review[]) ?? []
    this.locationLatLng = params.locationLatLng as { lat: number; lng: number }
    this.locationPretty = params.locationPretty as string
    this.reviewsAverage = params.reviewsAverage as number
    this.allowedNotifications = params.allowedNotifications as AccountNotifications
    this.acceptedTermsAndCondition = (params.acceptedTermsAndCondition as boolean) ?? false
    this.categoriesSetupDone = (params.categoriesSetupDone as boolean) ?? false
    this.introDone = (params.introDone as boolean) ?? false
    this.introSkipped = (params.introSkipped as boolean) ?? false
    this.reviewsCount = params.reviewsCount as number
    this.meta = params.meta as AccountMetadata
    this.followingCount = (params.followingCount as number) ?? 0
    this.followersCount = (params.followersCount as number) ?? 0
    this.followingAccountsIds = (params.followingAccountsIds as string[]) ?? []
    this.followedByAccountsIds = (params.followedByAccountsIds as string[]) ?? []
    this.blockedAccounts = (params.blockedAccounts as string[]) ?? []
    this.preferredCategoriesIds = (params.preferredCategoriesIds as string[]) ?? []
    this.activeAuctionsCount = (params.activeAuctionsCount as number) ?? 0
    this.auctions = (params.auctions as Auction[]) ?? []
    this.verified = params.verified as boolean
    this.verifiedAt = params.verifiedAt as Date
    this.verificationRequestedAt = params.verificationRequestedAt as Date
    this.createdAt = (params.createdAt as Date) ?? new Date()
    this.updatedAt = (params.updatedAt as Date) ?? new Date()
    this.selectedCurrencyId = params.selectedCurrencyId as string
  }

  static fromJSON(data: Record<string, unknown> = {}): Account {
    const asset = data.asset ? Asset.fromJSON(data.asset as Record<string, unknown>) : null

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL
    let assetUrl = null
    if (asset) {
      assetUrl = asset.path ? `${serverURL}/assets/${asset.path}` : asset.path
    }
    const { locationLat, locationLong } = data ?? {}

    return new Account({
      id: data.id,
      name: data.name,
      email: data.rawEmail ?? data.email,
      about: data.about ?? '',
      coins: data.coins ?? 0,
      isAnonymous: data.isAnonymous ?? false,
      picture: assetUrl ?? data.picture,
      triviaMaxScore: data.triviaMaxScore,
      points: data.points,
      phone: data.phone,
      categoriesSetupDone: data.categoriesSetupDone ?? false,
      meta: data.meta ? AccountMetadata.fromJSON(data.meta as Record<string, unknown>) : undefined,
      acceptedTermsAndCondition: data.acceptedTermsAndCondition ?? false,
      introDone: data.introDone ?? false,
      introSkipped: data.introSkipped ?? false,
      filters: data.filters
        ? (data.filters as Record<string, unknown>[]).map(FilterItem.fromJSON)
        : [],
      followingCount: data.followingCount ?? 0,
      followersCount: data.followersCount ?? 0,
      followingAccountsIds: data.followingAccountsIds ?? [],
      followedByAccountsIds: data.followedByAccountsIds ?? [],
      auctions: data.auctions
        ? (data.auctions as Record<string, unknown>[]).map(Auction.fromJSON)
        : [],
      activeAuctionsCount: data.activeAuctionsCount
        ? parseInt(data.activeAuctionsCount.toString())
        : 0,
      preferredCategoriesIds: data.preferredCategoriesIds ? data.preferredCategoriesIds : [],
      blockedAccounts: data.blockedAccounts ?? [],
      reviews: data.receivedReviews
        ? (data.receivedReviews as Record<string, unknown>[]).map(Review.fromJSON)
        : [],
      allowedNotifications: data.allowedNotifications
        ? AccountNotifications.fromJSON(data.allowedNotifications as Record<string, boolean>)
        : new AccountNotifications({}),
      reviewsAverage: data.reviewsAverage ? parseFloat(data.reviewsAverage.toString()) : undefined,
      reviewsCount: data.reviewsCount ? parseInt(data.reviewsCount.toString()) : undefined,
      locationPretty: data.locationPretty,
      verified: data.verified,
      verifiedAt: data.verifiedAt ? new Date(data.verifiedAt.toString()) : undefined,
      verificationRequestedAt: data.verificationRequestedAt
        ? new Date(data.verificationRequestedAt.toString())
        : undefined,
      selectedCurrencyId: data.selectedCurrencyId,
      locationLatLng:
        locationLat && locationLong ? { lat: locationLat, lng: locationLong } : undefined,
    })
  }
}

export class AccountMetadata {
  lastSignInTime: Date
  appLanguage?: string

  constructor(params: Record<string, unknown> = {}) {
    this.lastSignInTime = params.lastSignInTime as Date
    this.appLanguage = params.appLanguage as string
  }

  static fromJSON(data: Record<string, unknown>) {
    return new AccountMetadata({
      lastSignInTime: data['lastSignInTime'] ? new Date(data['lastSignInTime'].toString()) : null,
      appLanguage: data['appLanguage'],
    })
  }

  asObject() {
    return {
      lastSignInTime: this.lastSignInTime,
      appLanguage: `${this.appLanguage}`,
    }
  }
}

export class AccountNotifications {
  NEW_BID_ON_AUCTION: boolean
  AUCTION_UPDATED: boolean
  BID_REMOVED_ON_AUCTION: boolean
  BID_ACCEPTED_ON_AUCTION: boolean
  BID_REJECTED_ON_AUCTION: boolean
  REVIEW_RECEIVED: boolean
  NEW_MESSAGE: boolean
  SYSTEM: boolean
  SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION: boolean
  BID_WAS_SEEN: boolean
  NEW_FOLLOWER: boolean
  AUCTION_FROM_FAVOURITES_HAS_BID: boolean
  NEW_AUCTION_FROM_FOLLOWING: boolean
  AUCTION_ADDED_TO_FAVOURITES: boolean
  FAVOURITE_AUCTION_PRICE_CHANGE: boolean
  MY_AUCTION_STARTED: boolean
  AUCTION_FROM_FAVOURITES_STARTED: boolean
  NEW_COMMENT_ON_AUCTION: boolean
  REPLY_ON_AUCTION_COMMENT: boolean
  COMMENT_ON_SAME_AUCTION: boolean

  constructor(params: Record<string, boolean>) {
    this.AUCTION_ADDED_TO_FAVOURITES = params.AUCTION_ADDED_TO_FAVOURITES
    this.AUCTION_UPDATED = params.AUCTION_UPDATED
    this.BID_ACCEPTED_ON_AUCTION = params.BID_ACCEPTED_ON_AUCTION
    this.BID_REJECTED_ON_AUCTION = params.BID_REJECTED_ON_AUCTION
    this.BID_REMOVED_ON_AUCTION = params.BID_REMOVED_ON_AUCTION
    this.NEW_BID_ON_AUCTION = params.NEW_BID_ON_AUCTION
    this.NEW_MESSAGE = params.NEW_MESSAGE
    this.REVIEW_RECEIVED = params.REVIEW_RECEIVED
    this.SYSTEM = params.SYSTEM
    this.SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION = params.SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION
    this.BID_WAS_SEEN = params.BID_WAS_SEEN
    this.NEW_FOLLOWER = params.NEW_FOLLOWER
    this.AUCTION_FROM_FAVOURITES_HAS_BID = params.AUCTION_FROM_FAVOURITES_HAS_BID
    this.NEW_AUCTION_FROM_FOLLOWING = params.NEW_AUCTION_FROM_FOLLOWING
    this.FAVOURITE_AUCTION_PRICE_CHANGE = params.FAVOURITE_AUCTION_PRICE_CHANGE
    this.MY_AUCTION_STARTED = params.MY_AUCTION_STARTED
    this.AUCTION_FROM_FAVOURITES_STARTED = params.AUCTION_FROM_FAVOURITES_STARTED
    this.NEW_COMMENT_ON_AUCTION = params.NEW_COMMENT_ON_AUCTION
    this.REPLY_ON_AUCTION_COMMENT = params.REPLY_ON_AUCTION_COMMENT
    this.COMMENT_ON_SAME_AUCTION = params.COMMENT_ON_SAME_AUCTION
  }

  static fromJSON(data: Record<string, boolean>) {
    return new AccountNotifications({
      AUCTION_ADDED_TO_FAVOURITES: data.AUCTION_ADDED_TO_FAVOURITES ?? true,
      AUCTION_UPDATED: data.AUCTION_UPDATED ?? true,
      BID_ACCEPTED_ON_AUCTION: data.BID_ACCEPTED_ON_AUCTION ?? true,
      BID_REJECTED_ON_AUCTION: data.BID_REJECTED_ON_AUCTION ?? true,
      BID_REMOVED_ON_AUCTION: data.BID_REMOVED_ON_AUCTION ?? true,
      NEW_BID_ON_AUCTION: data.NEW_BID_ON_AUCTION ?? true,
      REVIEW_RECEIVED: data.REVIEW_RECEIVED ?? true,
      NEW_MESSAGE: data.NEW_MESSAGE ?? true,
      SYSTEM: data.SYSTEM ?? true,
      SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION: data.SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION ?? true,
      BID_WAS_SEEN: data.BID_WAS_SEEN ?? true,
      NEW_FOLLOWER: data.NEW_FOLLOWER ?? true,
      AUCTION_FROM_FAVOURITES_HAS_BID: data.AUCTION_FROM_FAVOURITES_HAS_BID ?? true,
      NEW_AUCTION_FROM_FOLLOWING: data.NEW_AUCTION_FROM_FOLLOWING ?? true,
      FAVOURITE_AUCTION_PRICE_CHANGE: data.FAVOURITE_AUCTION_PRICE_CHANGE ?? true,
      MY_AUCTION_STARTED: data.MY_AUCTION_STARTED ?? true,
      AUCTION_FROM_FAVOURITES_STARTED: data.AUCTION_FROM_FAVOURITES_STARTED ?? true,
      NEW_COMMENT_ON_AUCTION: data.NEW_COMMENT_ON_AUCTION ?? true,
      REPLY_ON_AUCTION_COMMENT: data.REPLY_ON_AUCTION_COMMENT ?? true,
      COMMENT_ON_SAME_AUCTION: data.COMMENT_ON_SAME_AUCTION ?? true,
    })
  }

  asObject() {
    return {
      NEW_BID_ON_AUCTION: this.NEW_BID_ON_AUCTION,
      AUCTION_UPDATED: this.NEW_BID_ON_AUCTION,
      BID_REMOVED_ON_AUCTION: this.NEW_BID_ON_AUCTION,
      BID_ACCEPTED_ON_AUCTION: this.NEW_BID_ON_AUCTION,
      BID_REJECTED_ON_AUCTION: this.NEW_BID_ON_AUCTION,
      REVIEW_RECEIVED: this.NEW_BID_ON_AUCTION,
      NEW_MESSAGE: this.NEW_BID_ON_AUCTION,
      SYSTEM: this.NEW_BID_ON_AUCTION,
      SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION: this.NEW_BID_ON_AUCTION,
      BID_WAS_SEEN: this.NEW_BID_ON_AUCTION,
      NEW_FOLLOWER: this.NEW_BID_ON_AUCTION,
      AUCTION_FROM_FAVOURITES_HAS_BID: this.NEW_BID_ON_AUCTION,
      NEW_AUCTION_FROM_FOLLOWING: this.NEW_BID_ON_AUCTION,
      AUCTION_ADDED_TO_FAVOURITES: this.NEW_BID_ON_AUCTION,
      FAVOURITE_AUCTION_PRICE_CHANGE: this.NEW_BID_ON_AUCTION,
      MY_AUCTION_STARTED: this.NEW_BID_ON_AUCTION,
      AUCTION_FROM_FAVOURITES_STARTED: this.NEW_BID_ON_AUCTION,
      NEW_COMMENT_ON_AUCTION: this.NEW_BID_ON_AUCTION,
      REPLY_ON_AUCTION_COMMENT: this.REPLY_ON_AUCTION_COMMENT,
      COMMENT_ON_SAME_AUCTION: this.COMMENT_ON_SAME_AUCTION,
    }
  }
}
