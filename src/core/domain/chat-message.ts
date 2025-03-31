import { makeAutoObservable } from 'mobx'

export enum ChatMessageStatus {
  pending,
  sent,
  error,
}

export class ChatMessage {
  id: string
  chatGroupId: string
  fromAccountId: string
  message: string
  type: string
  assetPaths?: string[]
  fileList?: FileList
  status?: ChatMessageStatus

  latitude?: number
  longitude?: number

  seenAt?: Date
  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown>) {
    this.id = params.id as string
    this.chatGroupId = params.chatGroupId as string
    this.fromAccountId = params.fromAccountId as string
    this.message = params.message as string
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
    this.fileList = params.fileList as FileList
    this.status = (params.status as ChatMessageStatus) ?? ChatMessageStatus.sent
    this.type = (params.type as string) ?? 'text'
    this.assetPaths = (params.assetPaths as string[]) ?? []
    this.latitude = params.latitude as number
    this.longitude = params.longitude as number
    this.seenAt = params.seenAt as Date

    makeAutoObservable(this)
  }

  static fromJSON(json: Record<string, unknown>): ChatMessage {
    return new ChatMessage({
      id: json.id,
      chatGroupId: json.chatGroupId,
      fromAccountId: json.fromAccountId,
      message: json.message,
      type: json.type,
      latitude: json.latitude as number,
      longitude: json.longitude as number,
      assetPaths: json.assetPaths as string[],
      seenAt: json.seenAt ? new Date(json.seenAt.toString()) : undefined,
      createdAt: json.createdAt ? new Date(json.createdAt.toString()) : new Date(),
      updatedAt: json.updatedAt ? new Date(json.updatedAt.toString()) : new Date(),
    })
  }
}
