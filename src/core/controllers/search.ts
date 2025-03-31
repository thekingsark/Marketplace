import { Account } from '../domain/account'
import { Auction } from '../domain/auction'
import { SearchHistoryItem, SearchHistoryItemType } from '../domain/search-history-item'
import { AccountsRepository } from '../repositories/account'
import { SearchHistoryRepository } from '../repositories/search-history'
import { AppStore } from '../store'
import { AuctionsController } from './auctions'
import { runInAction } from 'mobx'

class SearchController {
  async triggerGlobalSearch(keyword: string) {
    AppStore.updateLoadingState('globalSearch', true)

    const promises = [AccountsRepository.search(keyword), AuctionsController.search(keyword)]

    const results = await Promise.all(promises)
    return {
      accounts: results[0] as Account[],
      auctions: results[1] as Auction[],
    }
  }

  async loadSearchHistoryItems(keyword?: string, page = 0, perPage = 15) {
    return SearchHistoryRepository.loadForAccount(keyword, page, perPage)
  }

  async addSearchHistoryItem(
    type: SearchHistoryItemType,
    searchKey: string,
    data?: string,
    entityId?: string
  ) {
    const searchItem = new SearchHistoryItem({
      type,
      searchKey,
      data,
      entityId,
      createdAt: new Date(),
    })

    // We need to remove the item if it already exists inside the list
    const existingItemIndex = AppStore.searchHistoryItems.findIndex(
      (item) => item.type === type && item.entityId === entityId
    )
    runInAction(() => {
      if (existingItemIndex !== -1) {
        AppStore.searchHistoryItems.splice(existingItemIndex, 1)
      }

      AppStore.searchHistoryItems.unshift(searchItem)
    })

    return SearchHistoryRepository.addSearchHistoryItem(type, searchKey, data, entityId)
  }
}

const searchController = new SearchController()
export { searchController as SearchController }
