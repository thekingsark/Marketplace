import { Asset } from './asset'

export class Category {
  id: string
  name: Record<string, string>
  icon: string
  remoteIconUrl?: string
  assetId?: string
  asset?: Asset

  parentCategoryId?: string
  auctionsCount?: number
  subcategories?: Category[]

  createdAt?: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.name = params.name as Record<string, string>
    this.icon = params.icon as string
    this.remoteIconUrl = params.remoteIconUrl as string
    this.assetId = params.assetId as string
    this.asset = params.asset as Asset
    this.subcategories = params.subcategories as Category[]
    this.parentCategoryId = params.parentCategoryId as string
    this.createdAt = params.createdAt as Date
    this.auctionsCount = params.auctionsCount ? parseInt(params.auctionsCount.toString()) : 0
  }

  static fromJSON(params: Record<string, unknown> = {}) {
    const subcategories: Category[] = params.subcategories
      ? (params.subcategories as Record<string, unknown>[]).map((subcategory) =>
          Category.fromJSON(subcategory)
        )
      : []

    return new Category({
      subcategories,
      id: params.id,
      name: params.name,
      icon: params.icon,
      remoteIconUrl: params.remoteIconUrl,
      assetId: params.assetId,
      parentCategoryId: params.parentCategoryId,
      asset: params.asset ? Asset.fromJSON(params.asset as Record<string, unknown>) : undefined,
      createdAt: params.createdAt ? new Date(params.createdAt.toString()) : undefined,
      auctionsCount: params.auctionsCount ? parseInt(params.auctionsCount.toString()) : 0,
      unclassifiedGenre: params.unclassifiedGenre,
    })
  }
}
