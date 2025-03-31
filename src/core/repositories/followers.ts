import { Account } from '../domain/account'
import { RequestMaker, RequestType } from '../services/request-maker'

class FollowersRepository {
  private basePath = '/follow'

  public async followAccount(accountId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/follow/${accountId}`,
        method: RequestType.PUT,
      })
      return true
    } catch (error) {
      console.error('Error following account:', error)
      return false
    }
  }

  public async unfollowAccount(accountId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/unfollow/${accountId}`,
        method: RequestType.PUT,
      })
      return true
    } catch (error) {
      console.error('Error unfollowing account:', error)
      return false
    }
  }

  public async getFollowers(accountId: string, page: number, perPage: number): Promise<Account[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/followers/${accountId}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as { follower: Record<string, unknown> }[]
      return response.map((el: Record<string, unknown>) =>
        Account.fromJSON(el.follower as Record<string, unknown>)
      )
    } catch (error) {
      console.error('Error loading account followers:', error)
      return []
    }
  }

  public async getFollowing(accountId: string, page: number, perPage: number): Promise<Account[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/following/${accountId}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as { following: Record<string, unknown> }[]
      return response.map((el: Record<string, unknown>) =>
        Account.fromJSON(el.following as Record<string, unknown>)
      )
    } catch (error) {
      console.error('Error loading account following:', error)
      return []
    }
  }
}

const FollowersRepositoryInstance = new FollowersRepository()
export { FollowersRepositoryInstance as FollowersRepository }
