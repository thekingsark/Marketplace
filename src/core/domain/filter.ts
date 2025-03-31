import { Category } from './category'
import { Location } from './location'

export class FilterItem {
  id: string
  data: FilterItemData
  name: string
  type: string

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.data = new FilterItemData(params.data as Record<string, unknown>)
    this.name = params.name as string
    this.type = (params.type as string) ?? 'generic'
    this.createdAt = params.createdAt ? new Date(params.createdAt.toString()) : new Date()
    this.updatedAt = params.updatedAt ? new Date(params.updatedAt.toString()) : new Date()
  }

  static fromJSON(json: Record<string, unknown>) {
    return new FilterItem(json)
  }
}

export class FilterItemData {
  selectedCategories?: Category[]
  selectedSubCategories?: Category[]
  selectedLocations?: Location[]

  includeMyAuctions?: boolean
  minPrice?: string
  maxPrice?: string

  constructor(params: Record<string, unknown> = {}) {
    this.selectedCategories = params.selectedCategories as Category[]
    this.selectedSubCategories = params.selectedSubCategories as Category[]
    this.selectedLocations = params.selectedLocations as Location[]
    this.includeMyAuctions = params.includeMyAuctions as boolean
    this.minPrice = params.minPrice as string
    this.maxPrice = params.maxPrice as string
  }
}
