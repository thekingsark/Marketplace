import { BiddoSettings } from '../domain/settings'
import { RequestMaker, RequestType } from '../services/request-maker'

class SettingsRepository {
  private basePath = '/settings'

  public async getSettings(): Promise<BiddoSettings> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.GET,
      })) as Record<string, unknown>
      return BiddoSettings.fromJSON(response)
    } catch (error) {
      console.error('Error loading settings:', error)
      return new BiddoSettings()
    }
  }
}

const settingsRepository = new SettingsRepository()
export { settingsRepository as SettingsRepository }
