import { Account } from '../domain/account'
import { Auction } from '../domain/auction'
import { RequestMaker, RequestType } from '../services/request-maker'

class FavouriteRepository {
  private basePath = '/favourites'

  public async loadAll(): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Auction.fromJSON(el))
    } catch (error) {
      console.error('Error loading favourite auctions:', error)
      return []
    }
  }

  public async add(auctionId: string): Promise<void> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/add/${auctionId}`,
        method: RequestType.PUT,
      })
    } catch (error) {
      console.error('Error adding auction to favourites:', error)
    }
  }

  public async remove(auctionId: string): Promise<void> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/remove/${auctionId}`,
        method: RequestType.PUT,
      })
    } catch (error) {
      console.error('Error removing auction from favourites:', error)
    }
  }

  public async loadAccountsThatHaveAuctionInFavourites(
    auctionId: string,
    page = 0,
    perPage = 20
  ): Promise<Account[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/accounts/${auctionId}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Account.fromJSON(el))
    } catch (error) {
      console.error('Error getting accounts that have auction in favourites:', error)
      return []
    }
  }
}

const FavouriteRepositoryInstance = new FavouriteRepository()
export { FavouriteRepositoryInstance as FavouriteRepository }
