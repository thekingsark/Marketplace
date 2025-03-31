import { FilterItem } from '../domain/filter'
import { FiltersRepository } from '../repositories/filter'
import { AppStore } from '../store'
import { runInAction } from 'mobx'

class FilterController {
  async create(filter: FilterItem) {
    const createdFilter = await FiltersRepository.create(filter)
    if (!createdFilter) {
      return false
    }

    runInAction(() => {
      AppStore.accountData?.filters?.push(createdFilter)
    })
    return true
  }

  async delete(filterId: string) {
    const removed = await FiltersRepository.delete(filterId)
    if (!removed) {
      return false
    }

    const account = AppStore.accountData
    if (!account) {
      return removed
    }

    runInAction(() => {
      account.filters = account.filters?.filter((filter) => filter.id !== filterId)
    })
    return removed
  }
}

const filterController = new FilterController()
export { filterController as FilterController }
