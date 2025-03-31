import { BiddoNotification, NotificationType } from '../domain/notification'
import { NotificationRepository } from '../repositories/notification'
import { AppStore } from '../store'
import { runInAction } from 'mobx'

export type INotification = {
  id: string
  message: string
  type: NotificationType
  onClose: () => void
}

class NotificationsController {
  private isInitialized = false

  init = async () => {
    if (this.isInitialized) {
      return
    }

    runInAction(() => {
      AppStore.loadingStates.notifications = true
    })
    const [notifications, notificationsCount] = await Promise.all([
      NotificationRepository.loadForAccount(),
      NotificationRepository.getUnreadNotificationsCount(),
    ])

    runInAction(() => {
      AppStore.notifications = notifications.reduce(
        (acc, notification) => {
          acc[notification.id] = notification
          return acc
        },
        {} as Record<string, BiddoNotification>
      )

      AppStore.userUnreadNotificationsCount = notificationsCount
      AppStore.loadingStates.notifications = false
    })
    this.isInitialized = true
  }

  async markAllAsRead() {
    try {
      await NotificationRepository.markAllAsRead()
      AppStore.markAllNotificationsAsRead()
      return true
    } catch (error) {
      console.error(`Failed to mark all notifications as read: ${error}`)
      return false
    }
  }

  async markAsRead(id: string) {
    try {
      await NotificationRepository.markAsRead(id)
      AppStore.markNotificationAsRead(id)
      return true
    } catch (error) {
      console.error(`Failed to mark notification as read: ${error}`)
      return false
    }
  }

  async loadForAccount(page = 0, perPage = 10) {
    return NotificationRepository.loadForAccount(page, perPage)
  }

  generateURLForNotification(notification: BiddoNotification) {
    switch (notification.type) {
      case 'AUCTION_ADDED_TO_FAVOURITES':
      case 'BID_WAS_SEEN':
      case 'NEW_BID_ON_AUCTION':
      case 'AUCTION_FROM_FAVOURITES_HAS_BID':
      case 'SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION':
      case 'FAVOURITE_AUCTION_PRICE_CHANGE':
      case 'BID_REMOVED_ON_AUCTION':
      case 'BID_REJECTED_ON_AUCTION':
      case 'AUCTION_UPDATED':
      case 'NEW_AUCTION_FROM_FOLLOWING':
      case 'MY_AUCTION_STARTED':
      case 'AUCTION_FROM_FAVOURITES_STARTED':
      case 'BID_ACCEPTED_ON_AUCTION':
      case 'COMMENT_ON_SAME_AUCTION':
      case 'NEW_COMMENT_ON_AUCTION':
      case 'REPLY_ON_AUCTION_COMMENT':
        return `/auction/${notification.entityId}`

      case 'NEW_MESSAGE':
        return `/profile?tab=chat`

      case 'ACCOUNT_VERIFIED':
        return `/profile?tab=settings`

      case 'NEW_FOLLOWER':
        return `/profile/?tab=followers`

      case 'REVIEW_RECEIVED':
        return `/profile/?tab=reviews`

      case 'SYSTEM':
        return `/`
      default:
        return `/`
    }
  }

  generateIconForNotification(notification: BiddoNotification) {
    switch (notification.type) {
      case NotificationType.COMMENT_ON_SAME_AUCTION:
      case NotificationType.NEW_COMMENT_ON_AUCTION:
      case NotificationType.REPLY_ON_AUCTION_COMMENT:
        return 'comment'
      case NotificationType.AUCTION_ADDED_TO_FAVOURITES:
        return 'favourite'
      case NotificationType.BID_WAS_SEEN:
        return 'binoculars'
      case NotificationType.REVIEW_RECEIVED:
        return 'feedback'
      case NotificationType.ACCOUNT_VERIFIED:
        return 'verified'
      case NotificationType.NEW_BID_ON_AUCTION:
      case NotificationType.AUCTION_FROM_FAVOURITES_HAS_BID:
      case NotificationType.MY_AUCTION_STARTED:
      case NotificationType.AUCTION_FROM_FAVOURITES_STARTED:
        return 'shuttle'
      case NotificationType.SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION:
        return 'pie-chart'
      case NotificationType.FAVOURITE_AUCTION_PRICE_CHANGE:
        return 'price-change'
      case NotificationType.BID_REMOVED_ON_AUCTION:
      case NotificationType.BID_REJECTED_ON_AUCTION:
        return 'lose-bid'
      case NotificationType.AUCTION_UPDATED:
      case NotificationType.NEW_AUCTION_FROM_FOLLOWING:
        return 'auction'
      case NotificationType.BID_ACCEPTED_ON_AUCTION:
        return 'win-bid'
      case NotificationType.NEW_MESSAGE:
        return 'message'
      case NotificationType.SYSTEM:
      case NotificationType.NEW_FOLLOWER:
        return 'follower'
    }
  }
}

const notificationsController = new NotificationsController()
export { notificationsController as NotificationsController }
