import { makeAutoObservable } from 'mobx'
import { Account } from './account'
import { Auction } from './auction'

export class ChatGroup {
  id: string
  firstAccountId: string
  secondAccountId: string

  unreadMessages?: number

  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date

  firstAccount?: Account
  secondAccount?: Account

  chatGroupAuctions?: Auction[]

  constructor(params: Record<string, unknown>) {
    this.id = params.id as string
    this.firstAccountId = params.firstAccountId as string
    this.secondAccountId = params.secondAccountId as string
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
    this.firstAccount = params.firstAccount as Account
    this.secondAccount = params.secondAccount as Account
    this.lastMessageAt = params.lastMessageAt as Date
    this.unreadMessages = params.unreadMessages as number
    this.chatGroupAuctions = params.chatGroupAuctions as Auction[]

    makeAutoObservable(this)
  }

  static fromJSON(data: Record<string, unknown>): ChatGroup {
    const firstAccount = data.firstAccount
      ? Account.fromJSON(data.firstAccount as Record<string, unknown>)
      : undefined
    const secondAccount = data.secondAccount
      ? Account.fromJSON(data.secondAccount as Record<string, unknown>)
      : undefined
    const lastMessageAt = data.lastMessageAt ? new Date(data.lastMessageAt.toString()) : undefined

    const chatGroupAuctions = data.chatGroupAuctions
      ? (data.chatGroupAuctions as Record<string, unknown>[]).map((auction) =>
          Auction.fromJSON(auction)
        )
      : undefined

    return new ChatGroup({
      id: data.id,
      firstAccountId: data.firstAccountId,
      secondAccountId: data.secondAccountId,
      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt.toString()) : new Date(),
      firstAccount,
      secondAccount,
      lastMessageAt,
      chatGroupAuctions,
      unreadMessages: data.unreadMessages,
    })
  }
}
