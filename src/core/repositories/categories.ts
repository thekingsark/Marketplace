import { Category } from '../domain/category'
import { RequestMaker, RequestType } from '../services/request-maker'

class CategoriesRepository {
  private basePath = '/category'

  public async loadAll(): Promise<Category[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((category: Record<string, unknown>) => Category.fromJSON(category))
    } catch (error) {
      console.error('Error loading categories:', error)
      return []
    }
  }
}

const CategoriesRepositoryInstance = new CategoriesRepository()
export { CategoriesRepositoryInstance as CategoriesRepository }
