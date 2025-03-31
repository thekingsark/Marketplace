import { RequestMaker, RequestType } from '../services/request-maker'

class ReportsRepository {
  private basePath = '/report'

  public async create(
    entity: string,
    entityId: string,
    reason: string,
    description = ''
  ): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.POST,
        payload: JSON.stringify({
          entityName: entity,
          entityId: entityId,
          reason: reason,
          description: description,
        }),
        contentType: 'application/json',
      })
      return true
    } catch (error) {
      console.error('Error creating report:', error)
      return false
    }
  }
}

const ReportsRepositoryInstance = new ReportsRepository()
export { ReportsRepositoryInstance as ReportsRepository }
