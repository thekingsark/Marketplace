import { Auction } from '../domain/auction'
import { RequestMaker, RequestType } from '../services/request-maker'

class SimilaritiesRepository {
  private basePath = '/auction-similarities'

  public async loadSimilarAuctions(auctionId: string, page = 0, perPage = 8): Promise<Auction[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/similar`,
        method: RequestType.POST,
        payload: JSON.stringify({ auctionId, page, perPage }),
      })) as Record<string, unknown>[]
      return response.map((el) => Auction.fromJSON(el))
    } catch (error) {
      console.error(`Failed to fetch recommendations: ${error}`)
      return []
    }
  }
}

const similaritiesRepository = new SimilaritiesRepository()
export { similaritiesRepository as SimilaritiesRepository }
