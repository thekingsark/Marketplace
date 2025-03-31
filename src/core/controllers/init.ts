import { LastSeenAuctionsRepository } from '../repositories/last-seen-auctions'
import { RequestMaker } from '../services/request-maker'
import { AppStore } from '../store'
import { AccountController } from './account'
import { AuctionsController } from './auctions'
import { AuthController } from './auth'
import { ChatController } from './chat'
import { FavouritesController } from './favourites'
import { NotificationsController } from './notifications'
import { SearchController } from './search'
import { runInAction } from 'mobx'

class InitController {
  public async init(withRedirectOnError = true) {
    const authToken = await AuthController.loadAuthToken()
    if (!authToken) {
      runInAction(() => {
        AppStore.loadingStates.currentAccount = false
      })
      return false
    }

    const user = await AuthController.getAuthUser()
    if (!user) {
      runInAction(() => {
        AppStore.loadingStates.currentAccount = false
      })
      return false
    }

    runInAction(() => {
      AppStore.loadingStates.currentAccount = true
    })
    RequestMaker.setAuthToken(authToken)

    try {
      await AuthController.loadUserData()
      await this.loadRequiredData()
    } catch (error) {
      console.error(`Could not load initial data: ${error}`)
      if (withRedirectOnError) {
        window.location.href = '/auth/login'
      }
    } finally {
      runInAction(() => {
        AppStore.loadingStates.currentAccount = false
      })
    }
  }

  private async loadRequiredData() {
    AccountController.loadAccountStats()

    await FavouritesController.load()
    const [lastSeen, notifications, searchHistory, auctionsCount] = await Promise.all([
      LastSeenAuctionsRepository.load(),
      NotificationsController.loadForAccount(),
      SearchController.loadSearchHistoryItems(),
      AuctionsController.countAllActive(),
    ])

    runInAction(() => {
      AppStore.activeAuctionsCount = auctionsCount
      AppStore.lastSeenAuctions = lastSeen

      notifications.forEach((notification) => {
        AppStore.notifications[notification.id] = notification
      })

      AppStore.searchHistoryItems = []
      AppStore.searchHistoryItems.push(...searchHistory)
    })

    ChatController.init()
    NotificationsController.init()
  }
}

const initController = new InitController()
export { initController as InitController }
