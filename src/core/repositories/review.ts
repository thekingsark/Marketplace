import { Review } from '../domain/review'
import { RequestMaker, RequestType } from '../services/request-maker'

class ReviewRepository {
  private basePath = '/review'

  public async loadForAccount(accountId: string, page: number, perPage: number): Promise<Review[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${accountId}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Review.fromJSON(el))
    } catch (error) {
      console.error('Error loading reviews for account:', error)
      return []
    }
  }

  public async loadForLoggedAccount(page: number, perPage: number): Promise<Review[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${page}/${perPage}`,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Review.fromJSON(el))
    } catch (error) {
      console.error('Error loading reviews for logged account:', error)
      return []
    }
  }

  public async saveReview(params: {
    reviewId?: string
    auctionId: string
    stars: number
    description?: string
  }): Promise<Review | null> {
    const { reviewId, auctionId, stars, description } = params
    try {
      const result = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.POST,
        payload: JSON.stringify({
          ...(reviewId ? { id: reviewId } : {}),
          stars: stars,
          description: description,
          auctionId: auctionId,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>
      return Review.fromJSON(result)
    } catch (error) {
      console.error('Error saving review:', error)
      return null
    }
  }
}

const reviewRepository = new ReviewRepository()
export { reviewRepository as ReviewRepository }
