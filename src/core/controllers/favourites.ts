import { checkIfAuctionIsClosed } from '@/utils'
import { Auction } from '../domain/auction'
import { FavouriteRepository } from '../repositories/favourites'
import { AppStore } from '../store'
import { AuctionsController } from './auctions'
import { runInAction } from 'mobx'

class FavouritesController {
  load = async () => {
    runInAction(() => {
      AppStore.loadingStates.favourites = true
    })

    const favourites = await FavouriteRepository.loadAll()
    AppStore.setFavourites(favourites)

    runInAction(() => {
      AppStore.loadingStates.favourites = false
    })
  }

  addAuctionToFavourites = async (auction: Auction) => {
    AppStore.addFavourite(auction)

    try {
      await FavouriteRepository.add(auction.id)
      AuctionsController.refreshRecommendations()
      return true
    } catch (error) {
      console.error(`Could not add auction to favourites: ${error}`)
      return false
    }
  }

  removeAuctionFromFavourites = async (auction: Auction) => {
    AppStore.removeFavourite(auction)

    try {
      await FavouriteRepository.remove(auction.id)
      AuctionsController.refreshRecommendations()
      return true
    } catch (error) {
      console.error(`Could not remove auction from favourites: ${error}`)
      return false
    }
  }

  getAuctions(active = true, activeTimeInHours = 96) {
    const allFavourites = AppStore.favouriteAuctions

    return allFavourites.filter((element) => {
      const isActive = checkIfAuctionIsClosed(element, activeTimeInHours)
      if (!active) {
        return isActive
      }
      return !isActive
    })
  }
}

const favouritesController = new FavouritesController()
export { favouritesController as FavouritesController }
