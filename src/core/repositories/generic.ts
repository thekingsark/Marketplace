import { RequestMaker, RequestType } from '../services/request-maker'

class GenericRepository {
  public async sendMessage(message: string) {
    try {
      return RequestMaker.makeRequest({
        path: `/user-message`,
        method: RequestType.POST,
        payload: JSON.stringify({ message }),
      })
    } catch (error) {
      console.error(`Could not send message: ${error}`)
      return false
    }
  }
}

const genericRepositoryInstance = new GenericRepository()
export { genericRepositoryInstance as GenericRepository }
