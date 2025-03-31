import { SearchHistoryItem, SearchHistoryItemType } from '../domain/search-history-item'
import { RequestMaker, RequestType } from '../services/request-maker'

class SearchHistoryRepository {
  private basePath = '/searchHistory'

  public async loadForAccount(keyword = '', page = 0, perPage = 5): Promise<SearchHistoryItem[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/search`,
        method: RequestType.POST,
        payload: JSON.stringify({
          query: keyword,
          page: page,
          perPage: perPage,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]

      const searchItems = response.map((el: Record<string, unknown>) =>
        SearchHistoryItem.fromJSON(el)
      )
      const sortedByCreatedAt = searchItems.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
      return sortedByCreatedAt
    } catch (error) {
      console.error('Error loading search history items:', error)
      return []
    }
  }

  public async addSearchHistoryItem(
    type: SearchHistoryItemType,
    searchKey: string,
    data?: string,
    entityId?: string
  ): Promise<SearchHistoryItem | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.POST,
        payload: JSON.stringify({
          type,
          searchKey: searchKey,
          data: data,
          entityId: entityId,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>
      return SearchHistoryItem.fromJSON(response)
    } catch (error) {
      console.error('Error adding search history item:', error)
      return null
    }
  }
}

const searchHistoryRepository = new SearchHistoryRepository()
export { searchHistoryRepository as SearchHistoryRepository }
