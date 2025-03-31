import { ReviewRepository } from '../repositories/review'

class ReviewsController {
  public async save(params: {
    reviewId?: string
    auctionId: string
    stars: number
    description?: string
  }) {
    try {
      return await ReviewRepository.saveReview(params)
    } catch (error) {
      console.error(`Could not save review: ${error}`)
      return null
    }
  }

  public async getForAccount(accountId: string, page: number, perPage: number) {
    try {
      return await ReviewRepository.loadForAccount(accountId, page, perPage)
    } catch (error) {
      console.error(`Could not load reviews for account: ${error}`)
      return []
    }
  }

  public async getForLoggedAccount(page: number, perPage: number) {
    try {
      return await ReviewRepository.loadForLoggedAccount(page, perPage)
    } catch (error) {
      console.error(`Could not load reviews for logged account: ${error}`)
      return []
    }
  }
}

const revewsController = new ReviewsController()
export { revewsController as ReviewsController }
