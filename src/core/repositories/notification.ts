import { BiddoNotification } from '../domain/notification'
import { RequestMaker, RequestType } from '../services/request-maker'

class NotificationRepository {
  private basePath = '/notification'

  public async getUnreadNotificationsCount(): Promise<number> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/unread`,
        method: RequestType.GET,
      })) as { unreadNotificationsCount: number }
      return response.unreadNotificationsCount
    } catch (error) {
      console.error('Could not get unread notifications count:', error)
      return 0
    }
  }

  public async loadForAccount(page = 0, perPage = 20): Promise<BiddoNotification[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => BiddoNotification.fromJSON(el))
    } catch (error) {
      console.error('Could not load notifications:', error)
      return []
    }
  }

  public async markAsRead(id: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/${id}`,
        method: RequestType.PUT,
      })
      return true
    } catch (error) {
      console.error('Could not mark notification as read:', error)
      return false
    }
  }

  public async markAllAsRead(): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.PUT,
      })
      return true
    } catch (error) {
      console.error('Could not mark all notifications as read:', error)
      return false
    }
  }
}

const NotificationRepositoryInstance = new NotificationRepository()
export { NotificationRepositoryInstance as NotificationRepository }
