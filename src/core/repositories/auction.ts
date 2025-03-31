import { Auction, LatLng } from '../domain/auction'
import { RequestMaker, RequestType } from '../services/request-maker'
import { Location } from '../domain/location'
import { GENERAL_ERRORS } from '../../constants/errors'

export enum AuctionsSortBy {
  newest,
  oldest,
  priceAsc,
  priceDesc,
}

export interface CountAuctionsFilterParams {
  categories?: string[]
  subCategories?: string[]
  locationIds?: string[]
  activeOnly?: boolean
  includeMyAuctions?: boolean
  minPrice?: number | string
  maxPrice?: number | string
  usedCurrencyId?: string
}

export interface FilterAuctionsParams {
  page: number
  categories?: string[]
  subCategories?: string[]
  locationIds?: string[]
  activeOnly?: boolean
  pageSize?: number
  query?: string
  sortBy?: AuctionsSortBy
  includeMyAuctions?: boolean
  minPrice?: number | string
  maxPrice?: number | string
  promotedOnly?: boolean
  usedCurrencyId?: string
  started?: boolean
}

class AuctionRepository {
  async loadSummary(auctionId: string): Promise<Auction | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/auction/summary/${auctionId}`,
      })) as Record<string, unknown>
      return Auction.fromJSON(response)
    } catch (error) {
      console.error('Error getting auction summary:', error)
      return null
    }
  }

  async loadDetails(auctionId: string): Promise<Auction | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/auction/details/${auctionId}`,
      })) as Record<string, unknown>
      return Auction.fromJSON(response)
    } catch (error) {
      console.error('Error getting auction details:', error)
      return null
    }
  }

  async storeLastSeenAuction(auctionId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/lastSeen`,
        payload: JSON.stringify({ auctionId }),
        contentType: 'application/json',
      })
      return true
    } catch (error) {
      console.error('Error storing last seen auction:', error)
      return false
    }
  }

  async translateDetails(
    auctionId: string,
    language: string
  ): Promise<{ title: string; description: string } | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/auction/translate/${auctionId}/${language}`,
      })) as Record<string, unknown>
      return response as { title: string; description: string }
    } catch (error) {
      console.error('Error translating auction details:', error)
      return null
    }
  }

  async loadAuctionLocations(): Promise<Location[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: '/location/all',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Location.fromJSON(el))
    } catch (error) {
      console.error('Error getting locations:', error)
      return []
    }
  }

  async remove(auctionId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.DELETE,
        path: `/auction/${auctionId}`,
      })
      return true
    } catch (error) {
      console.error('Error removing auction:', error)
      return false
    }
  }

  async loadRecommendations(page = 0, perPage = 10): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/auction-similarities',
        payload: JSON.stringify({ page, perPage }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return []
    }
  }

  async loadByProximity(latlng: LatLng, mainCategoryId: string, distance = 10): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/auction/byLocationProximity/${latlng.lat}/${latlng.lng}/${mainCategoryId}/${distance}`,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting auctions by proximity:', error)
      return []
    }
  }

  async promote(auctionId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.PUT,
        path: `/auction/promote/${auctionId}`,
      })
      return true
    } catch (error) {
      console.error('Error promoting auction:', error)
      return false
    }
  }

  async countForAccountByBidStatus(status: string, query = ''): Promise<number> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `/auction/byBid/${status}/count`,
        method: RequestType.POST,
        payload: JSON.stringify({ query }),
      })) as { count: number }
      return response.count
    } catch (error) {
      console.error('Error counting auctions for account:', error)
      return 0
    }
  }

  async countForAccount(status: string, query = ''): Promise<number> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `/auction/all/account/${status}/count`,
        method: RequestType.POST,
        payload: JSON.stringify({ query }),
      })) as { count: number }
      return response.count
    } catch (error) {
      console.error('Error counting auctions for account:', error)
      return 0
    }
  }

  async loadForAccountByBidStatus(
    status: string,
    page = 0,
    pageSize = 10,
    query = '',
    sortBy: AuctionsSortBy = AuctionsSortBy.oldest
  ) {
    const { orderBy, orderDirection } = this.getOrderParams(sortBy)

    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/auction/byBid/${status}`,
        payload: JSON.stringify({
          page,
          perPage: pageSize,
          query,
          orderBy,
          orderDirection,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting auctions for account:', error)
      return []
    }
  }

  async loadForAccount(
    status: string,
    page = 0,
    pageSize = 10,
    query = '',
    sortBy: AuctionsSortBy = AuctionsSortBy.oldest
  ): Promise<Auction[]> {
    const { orderBy, orderDirection } = this.getOrderParams(sortBy)

    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/auction/all/account/${status}`,
        payload: JSON.stringify({
          page,
          perPage: pageSize,
          query,
          orderBy,
          orderDirection,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting auctions for account:', error)
      return []
    }
  }

  async search(query: string, page = 0, perPage = 10): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/auction/search/${query}/${page}/${perPage}`,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error searching auctions:', error)
      return []
    }
  }

  async loadLatestAuctions(): Promise<Auction[] | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: '/auction/latest',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting latest auctions:', error)
      return null
    }
  }

  async countFilter(params: CountAuctionsFilterParams): Promise<number> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/auction/filter/count',
        payload: JSON.stringify({
          ...params,
        }),
        contentType: 'application/json',
      })) as { count: number }
      return Number(response.count)
    } catch (error) {
      console.error('Error counting filtered auctions:', error)
      return 0
    }
  }

  async countActiveForAccount(accountId: string, query = ''): Promise<number> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/auction/byAccount/active/count/${accountId}`,
        payload: JSON.stringify({ query }),
      })) as { count: number }
      return response.count
    } catch (error) {
      console.error('Error counting active auctions for account:', error)
      return 0
    }
  }

  async loadActiveForAccount(
    accountId: string,
    page = 0,
    pageSize = 10,
    query = '',
    sortBy: AuctionsSortBy = AuctionsSortBy.newest
  ): Promise<Auction[]> {
    const { orderBy, orderDirection } = this.getOrderParams(sortBy)

    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/auction/byAccount/active/${accountId}`,
        payload: JSON.stringify({
          page,
          perPage: pageSize,
          query,
          orderBy,
          orderDirection,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error getting active auctions for account:', error)
      return []
    }
  }

  async loadFilteredAuctions(params: FilterAuctionsParams): Promise<Auction[]> {
    const { sortBy = AuctionsSortBy.oldest, pageSize = 20 } = params
    const { orderBy, orderDirection } = this.getOrderParams(sortBy)

    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/auction/filter/auctions',
        payload: JSON.stringify({
          ...params,
          orderBy,
          orderDirection,
          perPage: pageSize,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error loading filtered auctions:', error)
      return []
    }
  }

  async update(params: Record<string, unknown>): Promise<Auction | null> {
    try {
      const data = await this.generateFormDataForCreateOrUpdate(params)
      const response = (await RequestMaker.makeRequest({
        method: RequestType.PUT,
        path: `/auction/${params.id}`,
        payload: data,
        contentType: 'multipart/form-data',
      })) as Record<string, unknown>
      return Auction.fromJSON(response)
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  async create(params: Record<string, unknown>): Promise<Auction | null> {
    try {
      const data = await this.generateFormDataForCreateOrUpdate(params)
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/auction',
        payload: data,
        contentType: 'multipart/form-data',
      })) as Record<string, unknown>
      return Auction.fromJSON(response)
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  private async generateFormDataForCreateOrUpdate(
    params: Record<string, unknown>
  ): Promise<FormData> {
    const form = new FormData()
    Object.keys(params).forEach((key) => {
      if (key === 'id') {
        return
      }
      if (key === 'files') {
        const files = params[key] as File[]
        files.forEach((file) => {
          form.append('files', file)
        })
      } else {
        form.set(
          key,
          typeof params[key] === 'string' ? (params[key] as string) : JSON.stringify(params[key])
        )
      }
    })

    return form
  }

  private handleError(error: Error) {
    const response = JSON.stringify(error)

    if (response.includes('TOO_MANY')) {
      return { error: true, message: GENERAL_ERRORS.TOO_MANY_ASSETS }
    }
    if (response.includes('ASSET_TOO_BIG')) {
      return { error: true, message: GENERAL_ERRORS.ASSET_TOO_BIG }
    }
    if (response.includes('ASSET_NOT_SUPPORTED')) {
      return { error: true, message: GENERAL_ERRORS.ASSET_NOT_SUPPORTED }
    }

    return { error: true, message: 'Could not create or update auction' }
  }

  private getOrderParams(sortBy: AuctionsSortBy): {
    orderBy: string
    orderDirection: string
  } {
    switch (sortBy) {
      case AuctionsSortBy.newest:
        return { orderBy: 'createdAt', orderDirection: 'desc' }
      case AuctionsSortBy.oldest:
        return { orderBy: 'createdAt', orderDirection: 'asc' }
      case AuctionsSortBy.priceDesc:
        return { orderBy: 'lastPrice', orderDirection: 'desc' }
      case AuctionsSortBy.priceAsc:
        return { orderBy: 'lastPrice', orderDirection: 'asc' }
      default:
        return { orderBy: 'createdAt', orderDirection: 'desc' }
    }
  }
}

const auctionRepositoryInstance = new AuctionRepository()
export { auctionRepositoryInstance as AuctionRepository }
