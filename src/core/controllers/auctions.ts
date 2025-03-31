import { compressFile } from '@/utils/compressor'
import { Auction, AuctionProductCondition } from '../domain/auction'
import {
  AuctionRepository,
  AuctionsSortBy,
  CountAuctionsFilterParams,
  FilterAuctionsParams,
} from '../repositories/auction'
import { AppStore } from '../store'
import { runInAction } from 'mobx'
import { LastSeenAuctionsRepository } from '../repositories/last-seen-auctions'
import { AccountController } from './account'
import { Filter } from 'bad-words'

export interface CreateUpdateAuctionParams {
  latLng: { lat: number; lng: number }
  initialCurrencyId?: string
  location?: string
  description?: string
  title?: string
  youtubeLink?: string
  mainCategoryId?: string
  subCategoryId?: string
  hasCustomStartingPrice?: boolean
  startingPrice?: number
  assets?: File[]
  condition?: AuctionProductCondition
  startAt?: Date
  expiresAt?: Date
}

class AuctionsController {
  async update(auctionId: string, params: CreateUpdateAuctionParams & { assetsToKeep: string[] }) {
    try {
      const { assets = [] } = params
      const compressedAssets = await Promise.all(
        assets.map(async (asset) => {
          return compressFile(asset)
        })
      )

      delete params.assets
      const badWordsFilter = new Filter()

      await AuctionRepository.update({
        id: auctionId,
        location: params.location,
        files: compressedAssets,
        assetsToKeep: params.assetsToKeep ?? [],
        latLng: JSON.stringify([params.latLng.lat, params.latLng.lng]),
        description: badWordsFilter.clean(params.description ?? ''),
        youtubeLink: params.youtubeLink ?? '',
        condition:
          params.condition === undefined || params.condition === null
            ? 'used'
            : params.condition === AuctionProductCondition.newProduct
              ? 'new'
              : 'used',
        title: badWordsFilter.clean(params.title ?? ''),
        mainCategoryId: params.mainCategoryId ?? '',
        initialCurrencyId: params.initialCurrencyId ?? '',
        subCategoryId: params.subCategoryId ?? '',
        hasCustomStartingPrice: params.hasCustomStartingPrice ?? false,
        price: params.startingPrice ?? 0,
        ...(params.startAt ? { startAt: params.startAt } : {}),
        ...(params.expiresAt ? { expiresAt: params.expiresAt } : {}),
      })

      try {
        await AccountController.saveLocationToAccount(
          params.latLng.lat,
          params.latLng.lng,
          params.location ?? ''
        )
      } catch (error) {
        console.error(`Could not save location to account: ${error}`)
      }

      return true
    } catch (error) {
      console.error(`Could not update auction: ${error}`)
      return false
    }
  }

  async storeSeenAuction(auction: Auction) {
    runInAction(() => {
      const newAuctions = AppStore.lastSeenAuctions.filter((a) => a.id !== auction.id)
      newAuctions.unshift(auction)
      AppStore.lastSeenAuctions = newAuctions
    })

    AuctionRepository.storeLastSeenAuction(auction.id)
  }

  async loadLastSeen(page = 0, perPage = 10) {
    return LastSeenAuctionsRepository.load(page, perPage)
  }

  async loadRecommendations(page = 0, perPage = 8) {
    try {
      return await AuctionRepository.loadRecommendations(page, perPage)
    } catch (error) {
      console.error(`Could not load recommendations: ${error}`)
      return []
    }
  }

  async refreshRecommendations() {
    try {
      const recommendations = await AuctionRepository.loadRecommendations(0, 8)
      runInAction(() => {
        AppStore.recommendedAuctions = recommendations
      })
    } catch (error) {
      console.error(`Could not refresh recommendations: ${error}`)
    }
  }

  async countAllActive() {
    try {
      return await AuctionRepository.countFilter({
        activeOnly: true,
      })
    } catch (error) {
      console.error(`Could not load auctions: ${error}`)
      return 0
    }
  }

  async search(keyword: string, page = 0, perPage = 5) {
    try {
      return await AuctionRepository.search(keyword, page, perPage)
    } catch (error) {
      console.error(`Could not search auctions: ${error}`)
      return []
    }
  }

  async loadSummary(auctionId: string) {
    return await AuctionRepository.loadSummary(auctionId)
  }

  async create(params: CreateUpdateAuctionParams) {
    try {
      const { assets = [] } = params
      const compressedAssets = await Promise.all(
        assets.map(async (asset) => {
          return compressFile(asset)
        })
      )

      delete params.assets
      const badWordsFilter = new Filter()

      const auction = await AuctionRepository.create({
        location: params.location,
        files: compressedAssets,
        latLng: JSON.stringify([params.latLng.lat, params.latLng.lng]),
        description: badWordsFilter.clean(params.description ?? ''),
        hasCustomStartingPrice: params.hasCustomStartingPrice ?? false,
        price: params.startingPrice ?? 0,
        youtubeLink: params.youtubeLink ?? '',
        initialCurrencyId: params.initialCurrencyId ?? '',
        condition:
          params.condition === undefined || params.condition === null
            ? 'used'
            : params.condition === AuctionProductCondition.newProduct
              ? 'new'
              : 'used',
        title: badWordsFilter.clean(params.title ?? ''),
        mainCategoryId: params.mainCategoryId ?? '',
        subCategoryId: params.subCategoryId ?? '',
        ...(params.startAt ? { startAt: params.startAt } : {}),
        ...(params.expiresAt ? { expiresAt: params.expiresAt } : {}),
      })

      if (!auction) {
        return auction
      }

      try {
        await AccountController.saveLocationToAccount(
          params.latLng.lat,
          params.latLng.lng,
          params.location ?? ''
        )
      } catch (error) {
        console.error(`Could not save location to account: ${error}`)
      }

      runInAction(() => {
        AppStore.accountStats.activeAuctions += 1
        AppStore.accountStats.allAuctionsCount += 1
        AppStore.activeAuctionsCount += 1
      })

      return auction
    } catch (error) {
      console.error(`Could not create auction: ${error}`)
      return null
    }
  }

  async countFilter(params: CountAuctionsFilterParams) {
    try {
      return await AuctionRepository.countFilter(params)
    } catch (error) {
      console.error(`Could not count auctions: ${error}`)
      return 0
    }
  }

  async load(params: FilterAuctionsParams) {
    try {
      return await AuctionRepository.loadFilteredAuctions(params)
    } catch (error) {
      console.error(`Could not load auctions: ${error}`)
      return []
    }
  }

  async translateDetails(auctionId: string, language: string) {
    try {
      return await AuctionRepository.translateDetails(auctionId, language)
    } catch (error) {
      console.error(`Could not translate auction details: ${error}`)
      return null
    }
  }

  async promote(auctionId: string, coinsCost: number) {
    try {
      if (!AppStore.accountData) {
        return false
      }

      const promoted = await AuctionRepository.promote(auctionId)
      if (!promoted) {
        return false
      }

      runInAction(() => {
        if (!AppStore.accountData?.coins) {
          AppStore.accountData!.coins = 0
        } else {
          AppStore.accountData.coins -= coinsCost
        }

        if (AppStore.accountData!.coins < 0) {
          AppStore.accountData!.coins = 0
        }
      })

      return true
    } catch (error) {
      console.error(`Could not promote auction: ${error}`)
      return false
    }
  }

  async countForAccountByBidStatus(status: string, query?: string) {
    return await AuctionRepository.countForAccountByBidStatus(status, query)
  }

  async loadForAccountByBidStatus(
    status: string,
    page = 0,
    perPage = 20,
    query?: string,
    sortBy?: AuctionsSortBy
  ) {
    try {
      return await AuctionRepository.loadForAccountByBidStatus(status, page, perPage, query, sortBy)
    } catch (error) {
      console.error(`Could not load auctions: ${error}`)
      return []
    }
  }

  async countForCurrentAccountByStatus(status: string, query?: string) {
    return await AuctionRepository.countForAccount(status, query)
  }

  async loadForCurrentAccountByStatus(
    status: string,
    page = 0,
    perPage = 20,
    query?: string,
    sortBy?: AuctionsSortBy
  ) {
    try {
      return await AuctionRepository.loadForAccount(status, page, perPage, query, sortBy)
    } catch (error) {
      console.error(`Could not load auctions for current account by status: ${error}`)
      return []
    }
  }

  async countActiveByAccountId(accountId: string, query?: string) {
    try {
      return await AuctionRepository.countActiveForAccount(accountId, query)
    } catch (error) {
      console.error(`Could not count auctions: ${error}`)
      return 0
    }
  }

  async loadActiveByAccountId(
    accountId: string,
    page = 0,
    perPage = 20,
    query?: string,
    sortBy?: AuctionsSortBy
  ) {
    try {
      return await AuctionRepository.loadActiveForAccount(accountId, page, perPage, query, sortBy)
    } catch (error) {
      console.error(`Could not load auctions: ${error}`)
      return []
    }
  }

  async remove(auctionId: string) {
    try {
      const removed = await AuctionRepository.remove(auctionId)
      if (!removed) {
        return false
      }

      runInAction(() => {
        AppStore.activeAuctionsCount -= 1
        if (AppStore.activeAuctionsCount < 0) {
          AppStore.activeAuctionsCount = 0
        }

        AppStore.accountStats.activeAuctions -= 1
        if (AppStore.accountStats.activeAuctions < 0) {
          AppStore.accountStats.activeAuctions = 0
        }

        AppStore.accountStats.allAuctionsCount -= 1
        if (AppStore.accountStats.allAuctionsCount < 0) {
          AppStore.accountStats.allAuctionsCount = 0
        }
      })

      return true
    } catch (error) {
      console.error(`Could not delete auction: ${error}`)
      return false
    }
  }
}

const auctionController = new AuctionsController()
export { auctionController as AuctionsController }
