import { Auction } from '../domain/auction'
import { RequestMaker, RequestType } from '../services/request-maker'

class LastSeenAuctionsRepository {
  private basePath = '/lastSeen'

  public async load(page = 0, perPage = 10): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((auction: Record<string, unknown>) => Auction.fromJSON(auction))
    } catch (error) {
      console.error('Error loading last seen auctions:', error)
      return []
    }
  }

  public async store(auctionId: string): Promise<void> {
    try {
      await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.POST,
        payload: JSON.stringify({ auctionId }),
        contentType: 'application/json',
      })
    } catch (error) {
      console.error('Error storing last seen auction:', error)
    }
  }
}

const LastSeenAuctionsRepositoryInstance = new LastSeenAuctionsRepository()
export { LastSeenAuctionsRepositoryInstance as LastSeenAuctionsRepository }
