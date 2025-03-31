export enum SearchHistoryItemType {
  search = 'search',
  account = 'account',
  auction = 'auction',
}

export class SearchHistoryItem {
  id: string
  accountId: string
  type: SearchHistoryItemType
  searchKey: string
  entityId?: string
  data?: string

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.accountId = params.accountId as string
    this.type = params.type as SearchHistoryItemType
    this.searchKey = params.searchKey as string
    this.entityId = params.entityId as string
    this.data = params.data as string
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
  }

  static fromJSON(json: Record<string, unknown>) {
    return new SearchHistoryItem({
      id: json.id,
      accountId: json.accountId,
      type: json.type,
      searchKey: json.searchKey,
      entityId: json.entityId,
      data: json.data,
      createdAt: json.createdAt ? new Date(json.createdAt.toString()) : null,
      updatedAt: json.updatedAt ? new Date(json.updatedAt.toString()) : null,
    })
  }
}
