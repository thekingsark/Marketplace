import { makeAutoObservable } from 'mobx'
import { Account } from '../domain/account'
import { Category } from '../domain/category'
import { Auction } from '../domain/auction'
import { SearchHistoryItem } from '../domain/search-history-item'
import { ChatGroup } from '../domain/chat-group'
import { ChatMessage } from '../domain/chat-message'
import { BiddoNotification } from '../domain/notification'
import { runInAction } from 'mobx'

class AppStore {
  accountData = null as Account | null
  preferences = {
    preferredCategories: [] as Category[],
  }

  loggedInAccounts = [] as string[]

  allAuctionsOfAccount = [] as Auction[]
  searchHistoryItems = [] as SearchHistoryItem[]
  favouriteAuctions = [] as Auction[]

  activeAuctionsCount = 0

  notifications: Record<string, BiddoNotification> = {}
  userUnreadNotificationsCount = 0

  recommendedAuctions = [] as Auction[]

  lastSeenAuctions = [] as Auction[]

  accountStats = {
    acceptedBids: 0,
    rejectedBids: 0,
    allBidsCount: 0,
    allAuctionsCount: 0,
    activeAuctions: 0,
    closedAuctions: 0,
  }

  loadingStates = {
    currentAccount: true,
    notifications: false,
    favourites: false,
    searchHistoryItems: false,
  }

  chatGroups: ChatGroup[] = []
  chatMessages = {} as Record<string, ChatMessage[]>
  openedChatGroups: ChatGroup[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setAccountDetails(account: Account) {
    runInAction(() => {
      this.accountData = { ...(account ?? {}) }
    })
  }

  acceptTerms(value = true) {
    if (this.accountData) {
      runInAction(() => {
        this.accountData!.acceptedTermsAndCondition = value
      })
    }
  }

  setFavourites(favourites: Auction[]) {
    runInAction(() => {
      this.favouriteAuctions = favourites
    })
  }

  addFavourite(auction: Auction) {
    runInAction(() => {
      this.favouriteAuctions.push(auction)
    })
  }

  removeFavourite(auction: Auction) {
    runInAction(() => {
      this.favouriteAuctions = this.favouriteAuctions.filter(
        (favourite) => favourite.id !== auction.id
      )
    })
  }

  markAllNotificationsAsRead() {
    runInAction(() => {
      this.userUnreadNotificationsCount = 0
      Object.values(this.notifications).forEach((notification) => {
        notification.read = true
      })
    })
  }

  markNotificationAsRead(id: string) {
    runInAction(() => {
      const notification = this.notifications[id]
      if (notification) {
        notification.read = true
        this.userUnreadNotificationsCount -= 1
        if (this.userUnreadNotificationsCount < 0) {
          this.userUnreadNotificationsCount = 0
        }
      }
    })
  }

  updateLoadingState(key: string, value: boolean) {
    runInAction(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.loadingStates[key] = value
    })
  }

  cleanupAllData() {
    runInAction(() => {
      this.accountData = null
      this.preferences = {
        preferredCategories: [],
      }
      this.lastSeenAuctions = []
      this.allAuctionsOfAccount = []
      this.userUnreadNotificationsCount = 0
      this.searchHistoryItems = []
      this.favouriteAuctions = []
      this.notifications = {}
      this.accountStats = {
        acceptedBids: 0,
        rejectedBids: 0,
        allBidsCount: 0,
        allAuctionsCount: 0,
        activeAuctions: 0,
        closedAuctions: 0,
      }

      this.chatGroups = []
      this.chatMessages = {}
      this.openedChatGroups = []
    })
  }
}

const appStore = new AppStore()
export { appStore as AppStore }
