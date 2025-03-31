import { Filter } from 'bad-words'
import { CommentRepositroy } from '../repositories/comment'

class CommentsController {
  public async create(content: string, auctionId: string, parentCommentId?: string) {
    const filter = new Filter()
    const cleanContent = filter.clean(content)
    return CommentRepositroy.create(cleanContent, auctionId, parentCommentId)
  }

  public async getComments(auctionId: string) {
    return CommentRepositroy.getComments(auctionId)
  }

  public async countForAuction(auctionId: string) {
    return CommentRepositroy.countForAuction(auctionId)
  }

  public async translate(commentId: string, lang: string) {
    return CommentRepositroy.translate(commentId, lang)
  }
}

const controller = new CommentsController()
export { controller as CommentsController }
