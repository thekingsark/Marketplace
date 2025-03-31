import { RequestMaker, RequestType } from '../services/request-maker'
import { Comment } from '../domain/comment'

class CommentRepositroy {
  private basePath = '/comment'

  public async create(content: string, auctionId: string, parentCommentId?: string) {
    try {
      const result = await RequestMaker.makeRequest({
        path: `${this.basePath}`,
        method: RequestType.POST,
        payload: JSON.stringify({
          content,
          auctionId,
          parentCommentId,
        }),
      })
      return Comment.fromJSON(result as Record<string, unknown>)
    } catch (error) {
      console.error('Error creating comment:', error)
      return null
    }
  }

  public async getComments(auctionId: string) {
    try {
      const response = await RequestMaker.makeRequest({
        path: `${this.basePath}/auction/${auctionId}`,
        method: RequestType.GET,
      })
      return (response as Record<string, unknown>[]).map((el) => Comment.fromJSON(el))
    } catch (error) {
      console.error('Error getting comments:', error)
      return []
    }
  }

  public async countForAuction(auctionId: string) {
    try {
      const response = await RequestMaker.makeRequest({
        path: `${this.basePath}/count/${auctionId}`,
        method: RequestType.GET,
      })
      return response as number
    } catch (error) {
      console.error('Error counting comments:', error)
      return 0
    }
  }

  public async translate(commentId: string, lang: string) {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/translate/${commentId}/${lang}`,
        method: RequestType.GET,
      })) as { content: string }

      return response.content as string
    } catch (error) {
      console.error('Error translating comment:', error)
      return null
    }
  }
}

const repository = new CommentRepositroy()
export { repository as CommentRepositroy }
