export enum NotificationType {
  NEW_BID_ON_AUCTION = 'NEW_BID_ON_AUCTION',
  AUCTION_UPDATED = 'AUCTION_UPDATED',
  BID_REMOVED_ON_AUCTION = 'BID_REMOVED_ON_AUCTION',
  BID_ACCEPTED_ON_AUCTION = 'BID_ACCEPTED_ON_AUCTION',
  BID_REJECTED_ON_AUCTION = 'BID_REJECTED_ON_AUCTION',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  SYSTEM = 'SYSTEM',
  SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION = 'SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION',
  BID_WAS_SEEN = 'BID_WAS_SEEN',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_AUCTION_FROM_FOLLOWING = 'NEW_AUCTION_FROM_FOLLOWING',
  AUCTION_FROM_FAVOURITES_HAS_BID = 'AUCTION_FROM_FAVOURITES_HAS_BID',
  AUCTION_ADDED_TO_FAVOURITES = 'AUCTION_ADDED_TO_FAVOURITES',
  FAVOURITE_AUCTION_PRICE_CHANGE = 'FAVOURITE_AUCTION_PRICE_CHANGE',
  MY_AUCTION_STARTED = 'MY_AUCTION_STARTED',
  AUCTION_FROM_FAVOURITES_STARTED = 'AUCTION_FROM_FAVOURITES_STARTED',
  ACCOUNT_VERIFIED = 'ACCOUNT_VERIFIED',
  NEW_COMMENT_ON_AUCTION = 'NEW_COMMENT_ON_AUCTION',
  COMMENT_ON_SAME_AUCTION = 'COMMENT_ON_SAME_AUCTION',
  REPLY_ON_AUCTION_COMMENT = 'REPLY_ON_AUCTION_COMMENT',
}

export class BiddoNotification {
  id: string
  description: Record<string, string>
  title: Record<string, string>
  entityId: string
  read: boolean
  type: string

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.description = params.description as Record<string, string>
    this.title = params.title as Record<string, string>
    this.entityId = params.entityId as string
    this.read = params.read as boolean
    this.type = params.type as string
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
  }

  static fromJSON(json: Record<string, unknown>): BiddoNotification {
    return new BiddoNotification({
      id: json.id,
      description: json.description,
      title: json.title,
      entityId: json.entityId,
      read: json.read,
      type: json.type,
      createdAt: json.createdAt ? new Date(json.createdAt.toString()) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt.toString()) : new Date(),
    })
  }
}
