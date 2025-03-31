import { ReportsRepository } from '../repositories/report'

class ReportsController {
  public async create(entity: string, entityId: string, reason: string, description?: string) {
    try {
      await ReportsRepository.create(entity, entityId, reason, description)
      return true
    } catch (error) {
      console.error(`Could not create report: ${error}`)
      return false
    }
  }
}

const reportsController = new ReportsController()
export { reportsController as ReportsController }
