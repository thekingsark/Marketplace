import { SimilaritiesRepository } from '../repositories/similarities'

class SimilaritiesController {
  public async loadSimilarities(auctionId: string, page = 0, perPage = 8) {
    return SimilaritiesRepository.loadSimilarAuctions(auctionId, page, perPage)
  }
}

const similaritiesController = new SimilaritiesController()
export { similaritiesController as SimilaritiesController }
