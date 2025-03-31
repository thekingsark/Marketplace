import { Account } from './account'

export class Review {
  id: string
  stars: number

  description?: string
  auctionId?: string

  reviewer?: Account
  reviewed?: Account

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.stars = params.stars as number
    this.description = params.description as string
    this.auctionId = params.auctionId as string
    this.reviewer = params.reviewer as Account
    this.reviewed = params.reviewed as Account
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
  }

  static fromJSON(data: Record<string, unknown>) {
    return new Review({
      id: data.id,
      stars: data.stars,
      description: data.description,
      auctionId: data.auctionId,
      reviewer:
        data.reviewer !== null ? Account.fromJSON(data.reviewer as Record<string, unknown>) : null,
      reviewed:
        data.reviewed !== null ? Account.fromJSON(data.reviewed as Record<string, unknown>) : null,
      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt.toString()) : null,
    })
  }
}
