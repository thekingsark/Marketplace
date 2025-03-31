import { FilterItem } from '../domain/filter'
import { RequestMaker, RequestType } from '../services/request-maker'

class FiltersRepository {
  private basePath = '/filters'

  public async create(item: FilterItem): Promise<FilterItem | null> {
    try {
      const result = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.POST,
        payload: JSON.stringify(item),
        contentType: 'application/json',
      })) as { filterItem: Record<string, unknown> }
      return FilterItem.fromJSON(result.filterItem)
    } catch (error) {
      console.error('Error creating filter:', error)
      return null
    }
  }

  public async delete(filterId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/${filterId}`,
        method: RequestType.DELETE,
      })
      return true
    } catch (error) {
      console.error('Error deleting filter:', error)
      return false
    }
  }
}

const FiltersRepositoryInstance = new FiltersRepository()
export { FiltersRepositoryInstance as FiltersRepository }
