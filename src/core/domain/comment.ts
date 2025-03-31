import { Account } from './account'

export class Comment {
  id: string
  accountId: string
  content: string
  auctionId: string | null
  account: Account | null
  replies: Comment[] | null
  parentCommentId: string | null
  createdAt: Date | null
  updatedAt: Date | null

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.accountId = params.accountId as string
    this.content = params.content as string
    this.auctionId = params.auctionId as string
    this.account = params.account as Account
    this.replies = params.replies as Comment[]
    this.parentCommentId = params.parentCommentId as string
    this.createdAt = params.createdAt ? new Date(params.createdAt as Date) : null
    this.updatedAt = params.updatedAt ? new Date(params.updatedAt as Date) : null
  }

  static fromJSON(data: Record<string, unknown> = {}): Comment {
    const account = data.account ? Account.fromJSON(data.account as Record<string, unknown>) : null
    const replies = data.replies
      ? (data.replies as Record<string, unknown>[]).map((el) =>
          Comment.fromJSON(el as Record<string, unknown>)
        )
      : null

    return new Comment({
      id: data.id,
      accountId: data.accountId,
      content: data.content,
      auctionId: data.auctionId,
      account,
      replies,
      parentCommentId: data.parentCommentId,
      createdAt: data.createdAt ? new Date(data.createdAt as Date) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt as Date) : null,
    })
  }
}
