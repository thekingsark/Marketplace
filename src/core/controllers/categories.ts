import { Category } from '../domain/category'
import { AppStore } from '../store'

class CategoriesController {
  getPersonalizedCategoriesForHome = (categories: Category[], categoriesToGet = 5) => {
    if (!categories.length) {
      return []
    }

    const account = AppStore.accountData
    if (!account?.preferredCategoriesIds.length) {
      return this.getRandomCategories(categoriesToGet, categories)
    }

    if (account?.preferredCategoriesIds.length > categoriesToGet) {
      return this.getPreferredCategoriesWithCount(categories, categoriesToGet)
    }

    const neededCount = categoriesToGet - (account?.preferredCategoriesIds?.length ?? 0)
    const newCategories = this.getNextCategories(
      neededCount,
      categories,
      account.preferredCategoriesIds
    )
    return [...newCategories, ...this.getPreferredCategoriesWithCount(categories)]
  }

  private getRandomCategories = (
    n: number,
    categories: Category[],
    fromAllCategories?: boolean
  ) => {
    if (fromAllCategories == true) {
      return this.getRandomFromList(n, categories)
    }

    const categoriesWithAuctions = categories.filter((element) => element.auctionsCount || 0 > 0)

    if (!categoriesWithAuctions.length) {
      return this.getRandomFromList(n, categories)
    }

    if (categoriesWithAuctions.length == n) {
      return categoriesWithAuctions
    }

    if (categoriesWithAuctions.length > n) {
      return this.getRandomFromList(n, categoriesWithAuctions)
    }

    const restOfCategories = this.getRandomFromList(
      n - categoriesWithAuctions.length,
      categories,
      categoriesWithAuctions
    )

    return [...categoriesWithAuctions, ...restOfCategories]
  }

  private getPreferredCategoriesWithCount = (categories: Category[], limit?: number) => {
    if (!AppStore.accountData?.id) {
      return []
    }

    const preferredCategories = AppStore.accountData.preferredCategoriesIds
    const categoriesWithAuctionCount = categories.filter((category) =>
      preferredCategories.some((element) => element == category.id)
    )

    if (!limit) {
      return categoriesWithAuctionCount
    }

    categoriesWithAuctionCount.sort((a, b) => {
      if ((a.auctionsCount ?? 0) > (b.auctionsCount ?? 0)) {
        return -1
      }

      if ((a.auctionsCount ?? 0) < (b.auctionsCount ?? 0)) {
        return 1
      }
      return 0
    })

    return categoriesWithAuctionCount.slice(0, limit)
  }

  private getRandomFromList = (n: number, categoriesList: Category[], except?: Category[]) => {
    const result = [] as Category[]

    for (let i = 0; i < n; i++) {
      const random = Math.floor(Math.random() * categoriesList.length)
      const randomCategory = categoriesList[random]

      const exists = result.some((element) => element.id == randomCategory.id)
      const existsInExcept = except?.some((element) => element.id == randomCategory.id)

      if (!exists && !existsInExcept) {
        result.push(randomCategory)
      } else {
        i -= 1
      }
    }
    return result
  }

  private getNextCategories = (n: number, categories: Category[], except: string[]) => {
    if (n > categories.length - except.length) {
      throw new Error('given param is too big')
    }

    const result = [] as Category[]
    let foundCategoriesCount = 0

    while (foundCategoriesCount < n) {
      const randomCategory = this.getRandomCategories(1, categories, true)[0]
      const existsInExcept = except.some((element) => element == randomCategory.id)
      const existsInResult = result.some((element) => element.id == randomCategory.id)

      if (existsInExcept || existsInResult) {
        continue
      }

      result.push(randomCategory)
      foundCategoriesCount += 1
    }

    return result
  }
}

const categoriesController = new CategoriesController()
export { categoriesController as CategoriesController }
